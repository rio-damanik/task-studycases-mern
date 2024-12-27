const mongoose = require('mongoose');
const { model, Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Invoice = require('../invoice/model');

const orderSchema = Schema({
    status: {
        type: String,
        enum: ['waiting payment', 'paid', 'delivered', 'canceled'],
        default: 'waiting payment'
    },
    delivery_fee: {
        type: Number,
        default: 0
    },
    customer_name: {
        type: String,
        maxlength: [255, 'Customer name cannot exceed 255 characters']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    delivery_address: {
        type: Schema.Types.ObjectId,
        ref: 'DeliveryAddress'
    },
    metode_payment: {
        type: String,
        enum: ['transfer', 'tunai'],
        required: [true, 'Payment method is required']
    },
    orderItems: [{
        type: Schema.Types.ObjectId,
        ref: 'OrderItem'
    }]
}, { timestamps: true });

orderSchema.plugin(AutoIncrement, { inc_field: 'order_number' });

orderSchema.virtual('items_count').get(function() {
    return this.orderItems.reduce((total, item) => total + (item.qty || 0), 0);
});

orderSchema.post('save', async function() {
    const Invoice = require('../invoice/model');
    const invoice = await Invoice.findOne({ order: this._id });
    
    if (!invoice) {
        await Invoice.create({
            user: this.user,
            order: this._id,
            sub_total: this.orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0),
            delivery_fee: this.delivery_fee,
            total: this.orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0) + this.delivery_fee,
            delivery_address: this.delivery_address
        });
    }
});

module.exports = model('Order', orderSchema);