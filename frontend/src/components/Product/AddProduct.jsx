import React, { useState, useEffect } from 'react';
import { createProduct, fetchCategories, fetchTags } from '../../services/api';
import './AddProduct.css';

const AddProduct = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    tags: [],
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategoriesAndTags();
  }, []);

  const loadCategoriesAndTags = async () => {
    try {
      const [categoriesData, tagsData] = await Promise.all([
        fetchCategories(),
        fetchTags()
      ]);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      setError('Error loading form data');
      console.error('Error loading categories and tags:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagChange = (tagId) => {
    setFormData(prev => {
      const currentTags = prev.tags || [];
      if (currentTags.includes(tagId)) {
        return {
          ...prev,
          tags: currentTags.filter(id => id !== tagId)
        };
      } else {
        return {
          ...prev,
          tags: [...currentTags, tagId]
        };
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitFormData = new FormData();
      submitFormData.append('name', formData.name);
      submitFormData.append('description', formData.description);
      submitFormData.append('price', formData.price);
      submitFormData.append('category', formData.category);
      formData.tags.forEach(tag => {
        submitFormData.append('tags[]', tag);
      });
      if (imageFile) {
        submitFormData.append('image', imageFile);
      }

      const response = await createProduct(submitFormData);
      console.log('Product created:', response);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        tags: [],
      });
      setImageFile(null);
      setImagePreview(null);

      // Notify parent component
      if (onProductAdded) {
        onProductAdded(response);
      }
    } catch (error) {
      setError('Error creating product');
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-group">
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Tags:</label>
          <div className="tags-container">
            {tags.map(tag => (
              <label key={tag._id} className="tag-checkbox">
                <input
                  type="checkbox"
                  checked={formData.tags.includes(tag._id)}
                  onChange={() => handleTagChange(tag._id)}
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="image">Product Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
