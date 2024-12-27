// src/components/Tag/Tag.jsx

import React from "react";
import "./Tag.css";
import { FaTag } from 'react-icons/fa';

const Tag = ({ tag, isSelected, onClick }) => {
  // Fungsi untuk menentukan warna tag
  const getTagColor = (tagName) => {
    const tagColors = {
      'Pedas': '#ff4d4d',
      'Populer': '#ffd700',
      'Dingin': '#00bfff',
      'Vegetarian': '#32cd32',
      'Halal': '#4caf50',
      'Goreng': '#ff8c00',
      'Berkuah': '#4169e1',
      'Bakar': '#ff6b6b',
      'Seafood': '#00ced1'
    };
    return tagColors[tagName] || '#808080';
  };

  const tagStyle = {
    backgroundColor: isSelected ? getTagColor(tag.name) : 'transparent',
    color: isSelected ? 'white' : getTagColor(tag.name),
    border: `2px solid ${getTagColor(tag.name)}`
  };

  return (
    <div 
      className={`tag ${isSelected ? 'selected' : ''}`}
      style={tagStyle}
      onClick={() => onClick(tag._id)}
    >
      <FaTag className="tag-icon" />
      <span className="tag-text">{tag.name}</span>
    </div>
  );
};

export default Tag;