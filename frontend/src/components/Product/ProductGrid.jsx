import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import Product from './Product';
import './ProductGrid.css';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories
        const categoriesResponse = await axios.get('http://localhost:8000/api/categories');
        setCategories(categoriesResponse.data);

        // Fetch tags
        const tagsResponse = await axios.get('http://localhost:8000/api/tags');
        setTags(tagsResponse.data);

        // Fetch products with filters
        let url = 'http://localhost:8000/api/products';
        const params = new URLSearchParams();
        
        if (selectedCategory) {
          params.append('category', selectedCategory);
        }
        
        if (selectedTags.length > 0) {
          selectedTags.forEach(tag => params.append('tags', tag));
        }

        const productsResponse = await axios.get(`${url}?${params.toString()}`);
        setProducts(productsResponse.data);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, selectedTags]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
  };

  const handleTagClick = (tagId) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      }
      return [...prev, tagId];
    });
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      console.log('Product added to cart:', product.name);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="product-grid-container">
      <div className="filters">
        <div className="filter-section">
          <h3>Categories</h3>
          <div className="filter-buttons">
            {categories.map(category => (
              <button
                key={category._id}
                className={`filter-btn ${selectedCategory === category._id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category._id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="filter-section">
          <h3>Tags</h3>
          <div className="filter-buttons">
            {tags.map(tag => (
              <button
                key={tag._id}
                className={`filter-btn ${selectedTags.includes(tag._id) ? 'active' : ''}`}
                onClick={() => handleTagClick(tag._id)}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="products-grid">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          products.map(product => (
            <div key={product._id} className="product-item">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Price: {product.price}</p>
              <p>Category: {product.category.name}</p>
              <p>Tags: {product.tags.map(tag => tag.name).join(', ')}</p>
              <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
