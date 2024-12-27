const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const categorySchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: [true, 'Nama kategori harus diisi']
    },
    tags: [{
        type: String,
        ref: 'Tag'
    }]
}, { 
    timestamps: true,
    collection: 'categories' // explicitly set collection name
});

module.exports = model('Category', categorySchema);