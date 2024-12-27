const Category = require('./model');
const Tag = require('../tag/model');

const index = async (req, res, next) => {
    try {
        // pemanggilannya dengan cara http://localhost:3000/api/products?limit=10&skip=0
        //pagination
        const category = await Category.find().populate('tags')
        return res.json(category);
    } catch (err) {
        next(err);
    }
}

const show = async (req, res, next) => {
    const { name } = req.params;
    try {
        const category = await Category.findOne({ name: name }).populate('tags');
        return res.json(category);
    } catch (err) {
        next(err);
    }
}

// untuk menyimpan data produk baru dengan menggunakan multer untuk file upload dan menyimpan file ke direktori public/images/products
const store = async (req, res, next) => {
    const { name, tags } = req.body;
    console.log(name);
    try {
        const category = new Category({ name: name });
        const tag = await Tag.find({ name: { $in: tags } });
        tag.map(t => category.tags.push(t._id));
        await category.save();
        return res.json(category);
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
}

const update = async (req, res, next) => {
    try {
        const payload = req.body;
        const { id } = req.params;
        const category = await Category.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
        return res.json(category);
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
}

const destroy = async (req, res, next) => {
    const { id } = req.params;
    try {
        const category = await Category.findByIdAndDelete(id);
        return res.json({ message: 'Category deleted', category });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    store,
    index,
    show,
    update,
    destroy
}