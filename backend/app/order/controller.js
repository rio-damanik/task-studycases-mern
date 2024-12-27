const Order = require('./model');
const OrderItem = require('../orderItem/model');
const CartItem = require('../cartItem/model');
const DeliveryAddress = require('../deliveryAddress/model');
const Product = require('../product/model');
const Invoice = require('../invoice/model');

const store = async (req, res, next) => {
    try {
        let { delivery_address, metode_payment, delivery_fee = 0, customer_name, cart_items } = req.body;

        if (typeof cart_items === 'string') {
            cart_items = JSON.parse(cart_items);
        }
        
        if (!metode_payment) {
            return res.json({
                error: 1,
                message: 'Payment method is required'
            });
        }

        if (!cart_items || cart_items.length === 0) {
            return res.json({
                error: 1,
                message: 'Cart is empty'
            });
        }

        // Get products for cart items
        const productIds = cart_items.map(item => item.product);
        const products = await Product.find({ _id: { $in: productIds } });

        if (products.length !== cart_items.length) {
            return res.json({
                error: 1,
                message: 'Some products not found'
            });
        }

        // Calculate subtotal
        let sub_total = 0;
        const orderItemsData = cart_items.map(item => {
            const product = products.find(p => p._id.toString() === item.product.toString());
            if (!product) {
                throw new Error(`Product not found: ${item.product}`);
            }
            const qty = parseInt(item.qty);
            const price = parseFloat(product.price);
            sub_total += qty * price;
            
            return {
                qty,
                price,
                name: product.name,
                product: product._id,
                user: req.user._id
            };
        });

        // Get delivery address if provided
        let deliveryAddressData = null;
        if (delivery_address) {
            const address = await DeliveryAddress.findById(delivery_address);
           
            
            if (!address) {
                return res.json({
                    error: 1,
                    message: 'Delivery address not found'
                });
            }
            deliveryAddressData = {
                kelurahan: address.kelurahan,
                kecamatan: address.kecamatan,
                kabupaten: address.kabupaten,
                provinsi: address.provinsi,
                detail: address.detail
            };
        }

        // Create order
        const order = await Order.create({
            delivery_fee: parseFloat(delivery_fee),
            delivery_address,
            metode_payment,
            customer_name: customer_name || 'Guest Customer',
            user: req.user._id,
            status: 'waiting payment'
        });

        // Add order ID to order items
        const orderItems = await OrderItem.create(
            orderItemsData.map(item => ({
                ...item,
                order: order._id
            }))
        );

        // Update order with order items
        order.orderItems = Array.isArray(orderItems) ? orderItems.map(item => item._id) : [orderItems._id];
        await order.save();

        // Create invoice
        const total = sub_total + parseFloat(delivery_fee);
        const invoice = await Invoice.create({
            sub_total,
            delivery_fee: parseFloat(delivery_fee),
            total,
            delivery_address: deliveryAddressData,
            user: req.user._id,
            order: order._id,
            metode_payment,
            payment_status: 'waiting'
        });

        // Clear cart
        await CartItem.findOneAndUpdate(
            { user: req.user._id },
            { $set: { items: [] } },
            { new: true }
        );

        // Fetch the complete order with populated fields
        const populatedOrder = await Order.findById(order._id)
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product',
                    select: 'name price'
                }
            })
            .populate('delivery_address')
            .populate('user', 'full_name');

        return res.json({
            error: 0,
            message: 'Order created successfully',
            data: populatedOrder
        });

    } catch (err) {
        console.error('Order creation error:', err);
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        return res.json({
            error: 1,
            message: err.message || 'Failed to create order'
        });
    }
};

const index = async (req, res, next) => {
    try {
        const { skip = 0, limit = 10 } = req.query;
        const orders = await Order.find({ user: req.user._id })
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .populate('orderItems')
            .populate('delivery_address')
            .sort('-createdAt');

        const count = await Order.find({ user: req.user._id }).countDocuments();

        return res.json({
            error: 0,
            message: 'Success',
            data: { orders, count }
        });
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
};

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findOneAndUpdate(
            { _id: id },
            { status },
            { new: true }
        )
        .populate('orderItems')
        .populate('delivery_address')
        .populate('user', 'full_name');

        if (!order) {
            return res.json({
                error: 1,
                message: 'Order not found'
            });
        }

        return res.json({
            error: 0,
            message: 'Order updated successfully',
            data: order
        });
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
};

const show = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({ _id: id })
            .populate('orderItems')
            .populate('user', 'full_name')
            .populate('delivery_address');

        if (!order) {
            return res.json({
                error: 1,
                message: 'Order not found'
            });
        }

        return res.json({
            error: 0,
            message: 'Success',
            data: order
        });
    } catch (error) {
        if (error && error.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: error.message,
                fields: error.errors
            });
        }
        next(error);
    }
};

module.exports = {
    store,
    index,
    update,
    show
}