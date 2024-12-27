import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: 0,
    image: null
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchTags();
  }, []);

  const isValidUrl = urlString => {
    try {
      return Boolean(new URL(urlString));
    }
    catch (e) {
      return false;
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/products?limit=100');
      setProducts(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setCategories([]);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tags');
      setTags(response.data);
    } catch (err) {
      console.error('Failed to fetch tags:', err);
      setTags([]);
    }
  };

  const filteredProducts = products.filter(product =>
    selectedCategory === 'all' || product.category?._id === selectedCategory
  );

  const handleInputChange = (e) => {
    const value = e.target.type === 'number' ?
      e.target.value === '' ? '' : Number(e.target.value) :
      e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setFormData(prev => ({
          ...prev,
          image: file
        }));

        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Please select an image file');
      }
    }
  };

  const handleTagChange = (tagId) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      }
      return [...prev, tagId];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', parseInt(formData.price));
      formDataToSend.append('category', formData.category);
      formDataToSend.append('stock', parseInt(formData.stock));
      selectedTags.forEach(tagId => {
        formDataToSend.append('tags[]', tagId);
      });

      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };
     
      if (editingProduct) {
        await axios.put(
          `http://localhost:8000/api/products/${editingProduct._id}`,
          formDataToSend,
          config
        );
      } else {
        await axios.post(
          'http://localhost:8000/api/products',
          formDataToSend,
          config
        );
      }

      await fetchProducts(); // Refresh the product list
      resetForm();
      setError('');
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category?._id || '',
      stock: product.stock?product.stock:0
    });
    setSelectedTags(product.tags?.map(tag => tag._id) || []);
    setImagePreview(product.image_url);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };
      await axios.delete(`http://localhost:8000/api/products/${productId}`, config);
      await fetchProducts(); // Refresh the product list
      setError('');
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: 0,
      image: null
    });
    setSelectedTags([]);
    setImagePreview(null);
    setShowForm(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  return (
    <div className="product-management">
      <div className="management-header">
        <h2>Product Management</h2>
        <button
          className="add-product-btn"
          onClick={() => setShowForm(true)}
        >
          <i className="fas fa-plus"></i> Add New Product
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="category-filter">
        <button
          className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category._id}
            className={`filter-btn ${selectedCategory === category._id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category._id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          filteredProducts.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image-container">
                {isValidUrl(product.image_url) ?
                  <img
                    src={product.image_url || '/placeholder.png'}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder.png';
                    }}
                  /> : <img
                    src={'http://localhost:8000/uploads/' + product.image_url}
                    alt={product.name}
                    className="product-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder.png';
                  }}
                  />
                }

              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <p className="description">{product.description}</p>
                <p className="price">IDR {formatPrice(product.price)}</p>
                <p className="stock">Stock: {product.stock?product.stock:0}</p>
                <div className="product-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(product)}
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(product._id)}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="modal-overlay">
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button type="button" className="close-btn" onClick={resetForm}>×</button>
            </div>

            <div className="form-content">
              <div className="form-section">
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter product name"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter product description"
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (IDR)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      placeholder="Enter price"
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock?formData.stock:0}
                      onChange={handleInputChange}
                      required
                      min="0"
                      placeholder="Enter stock quantity"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Product Image</label>
                  <div className="image-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                    />
                    <div className="image-upload-content">
                      <div className="image-upload-icon">📸</div>
                      <div className="image-upload-text">
                        Click or drag image here to upload
                      </div>
                    </div>
                  </div>
                  {imagePreview && (
                    <div className="image-preview">
                      {isValidUrl(imagePreview) ?
                        <img
                          src={imagePreview || '/placeholder.png'}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder.png';
                          }}
                        /> : <img
                          src={'http://localhost:8000/uploads/' + imagePreview}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder.png';
                        }}
                        />
                      }
                      {/* <img src={imagePreview} alt="Preview" /> */}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Tags</label>
                  <div className="tags-container">
                    {tags.map(tag => (
                      <label key={tag._id} className="tag-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag._id)}
                          onChange={() => handleTagChange(tag._id)}
                        />
                        <span>{tag.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Processing...' : (editingProduct ? 'Update Product' : 'Add Product')}
              </button>
              <button type="button" onClick={resetForm} className="cancel-button">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
