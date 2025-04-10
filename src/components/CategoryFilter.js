import React from 'react';
import { useGallery } from '../context/GalleryContext';
import './CategoryFilter.css';

const CategoryFilter = () => {
  const { categories, category, changeCategory } = useGallery();

  return (
    <div className="category-filter">
      <h3>Categories</h3>
      <div className="category-buttons">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-btn ${category === cat.id ? 'active' : ''}`}
            onClick={() => changeCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter; 