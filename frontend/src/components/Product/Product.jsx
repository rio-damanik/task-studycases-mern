import React, { useCallback, useEffect, useState } from "react";
import { FaFire, FaSnowflake, FaLeaf, FaHamburger, FaWater, FaTag, FaShoppingCart } from 'react-icons/fa';
import { GiChickenOven, GiCook } from 'react-icons/gi';
import { MdLocalDining, MdCategory } from 'react-icons/md';
import "./Product.css";
import { useCart } from '../../context/CartContext';

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(number);
};

const Product = () => {
  const [productList, setProductList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const { addToCart: addToCartContext } = useCart();

  const getTagIcon = useCallback((tag) => {
    switch (tag.toLowerCase()) {
      case 'pedas':
        return <FaFire />;
      case 'dingin':
        return <FaSnowflake />;
      case 'vegetarian':
        return <FaLeaf />;
      case 'halal':
        return <GiCook />;
      case 'goreng':
        return <FaHamburger />;
      case 'berkuah':
        return <FaWater />;
      case 'bakar':
        return <GiChickenOven />;
      case 'populer':
        return <MdLocalDining />;
      default:
        return <FaTag />;
    }
  }, []); // Empty dependency array karena fungsi statis

  const getTagColor = useCallback((tagName) => {
    const tagColors = {
      'pedas': '#ff4d4d',
      'populer': '#ffd700',
      'dingin': '#00bfff',
      'vegetarian': '#32cd32',
      'halal': '#4caf50',
      'goreng': '#ff8c00',
      'berkuah': '#4169e1',
      'bakar': '#ff6b6b'
    };
    return tagColors[tagName.toLowerCase()] || '#808080';
  }, []);

  const isValidUrl = urlString => {
    try {
      return Boolean(new URL(urlString));
    }
    catch (e) {
      return false;
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsRes = await fetch('http://localhost:8000/api/products?limit=100');
        const productsData = await productsRes.json();
        setProductList(productsData.data || []);

        // Fetch categories
        const categoriesRes = await fetch('http://localhost:8000/api/categories');
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData || []);

        // Fetch tags
        const tagsRes = await fetch('http://localhost:8000/api/tags');
        const tagsData = await tagsRes.json();
        setTags(tagsData || []);

      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    addToCartContext(product);
    // alert(`${product.name} added to cart!`);
  };

  const filteredProducts = productList.filter(product => {
    const categoryMatch = selectedCategory === 'all' || 
      (product.category && product.category._id === selectedCategory);
    
    const tagMatch = selectedTag === 'all' || 
      (product.tags && product.tags.some(tag => tag._id === selectedTag));
    
    return categoryMatch && tagMatch;
  });

  return (
    <div className="pos-container">
      <div className="pos-filters">
        {/* Category Buttons */}
        <div className="filter-section">
          <h3 className="filter-title"><MdCategory /> Categories</h3>
          <div className="filter-buttons">
            <button 
              className={`filter-button ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              Semua Menu
            </button>
            {categories.map(category => (
              <button
                key={category._id}
                className={`filter-button ${selectedCategory === category._id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category._id)}
              >
                {category.name || 'Uncategorized'}
              </button>
            ))}
          </div>
        </div>

        {/* Tag Buttons */}
        <div className="filter-section">
          <h3 className="filter-title"><FaTag /> Tags</h3>
          <div className="filter-buttons">
            <button 
              className={`filter-button ${selectedTag === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedTag('all')}
            >
              Semua Tag
            </button>
            {tags.map(tag => (
              // <button 
              //   key={tag._id}
              //   className={`filter-button ${selectedTag === tag._id ? 'active' : ''}`}
              //   onClick={() => setSelectedTag(tag._id)}
              // ></button>
                <button 
                key={tag._id}
                className={`filter-button tag ${selectedTag === tag._id ? 'active' : ''}`}
                onClick={() => setSelectedTag(tag._id)}
                style={{
                  backgroundColor: selectedTag === tag._id ? getTagColor(tag.name) : 'transparent',
                  color: selectedTag === tag._id ? 'white' : getTagColor(tag.name),
                  borderColor: getTagColor(tag.name)
                }}
              >
               {getTagIcon(tag.name)} {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pos-grid">
        {filteredProducts.map(product => (
          <div key={product._id} className="pos-card">
            {isValidUrl(product.image_url) ?
            <img 
              src={product.image_url || '/placeholder.jpg'} 
              alt={product.name} 
              className="pos-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder.png';
              }}
            />:
            <img 
            src={'http://localhost:8000/uploads/' + product.image_url} 
            alt={product.name} 
            className="pos-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder.png';
            }}
          />}
            <div className="pos-info">
              <div className="pos-category">
                <MdCategory /> {product.category?.name || 'Uncategorized'}
              </div>
              <h3>{product.name}</h3>
              <p className="pos-description">{product.description}</p>
              <div className="pos-tags">
              {product.tags?.map(tag => (
                    <button
                      key={tag._id}
                      className={`pos-tag-button ${selectedTag === tag._id ? 'active' : ''}`}
                      onClick={() => setSelectedTag(tag._id)}
                      style={{
                        backgroundColor: selectedTag === tag._id ? getTagColor(tag.name) : 'transparent',
                        color: selectedTag === tag._id ? 'white' : getTagColor(tag.name),
                        borderColor: getTagColor(tag.name)
                      }}
                    >
                      {getTagIcon(tag.name)} {tag.name}
                    </button>
                  ))}
              </div>
              <div className="pos-footer">
                <span className="pos-price">{formatRupiah(product.price)}</span>
                <button 
                  className="pos-add-button"
                  onClick={() => handleAddToCart(product)}
                >
                  <FaShoppingCart /> Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
