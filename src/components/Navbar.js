import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaSearch, FaHeart } from 'react-icons/fa';
import { useGallery } from '../context/GalleryContext';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { searchImages } = useGallery();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchImages(searchQuery);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <h1>Art Gallery</h1>
        </Link>
        
        <div className="navbar-search">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search artworks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <FaSearch />
            </button>
          </form>
        </div>
        
        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
            Gallery
          </NavLink>
          <NavLink to="/favorites" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaHeart /> Favorites
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 