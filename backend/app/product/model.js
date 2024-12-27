const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    minlength: [3, 'Product name must be at least 3 characters long'],
    maxlength: [255, 'Product name cannot exceed 255 characters'],
    required: [true, 'Product name is required']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  stock:{
    type: Number,
    required: [true, 'Product stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
    default: 0
  },
  image_url: {
    type: String
  },
  category: {
    type: String,
    ref: 'Category'
  },
  tags: [{
    type: String,
    ref: 'Tag'
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add pre-find middleware to populate references
productSchema.pre('find', function(next) {
  this.populate('category').populate('tags');
  next();
});

productSchema.pre('findOne', function(next) {
  this.populate('tags');
  next();
});

module.exports = model('Product', productSchema, 'products');