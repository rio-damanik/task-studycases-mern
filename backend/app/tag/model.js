const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const tagSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        minlength: [3, 'Panjang nama tag minimal 3 karakter'],
        maxlength: [20, 'Panjang nama tag maksimal 20 karakter'],
        required: [true, 'Nama tag harus diisi']
    }
}, { 
    timestamps: true,
    collection: 'tags' // explicitly set collection name
});

module.exports = model('Tag', tagSchema);