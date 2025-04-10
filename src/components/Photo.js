import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShare, FaDownload, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useGallery } from '../context/GalleryContext';
import './Photo.css';

const Photo = ({
  id,
  urls: { regular, small },
  alt_description,
  likes,
  user: {
    name,
    portfolio_url,
    profile_image: { medium },
  },
  width,
  height,
}) => {
  const [showActions, setShowActions] = useState(false);
  const { toggleFavorite, favorites, collections, addToCollection } = useGallery();
  
  const isFavorite = favorites.some(fav => fav.id === id);
  
  const handleFavorite = (e) => {
    e.preventDefault();
    toggleFavorite({ id, urls: { regular }, alt_description, likes, user: { name, portfolio_url, profile_image: { medium } } });
  };
  
  const handleAddToCollection = (e, collectionId) => {
    e.preventDefault();
    addToCollection(collectionId, { id, urls: { regular }, alt_description, likes, user: { name, portfolio_url, profile_image: { medium } } });
  };
  
  const handleDownload = (e) => {
    e.preventDefault();
    window.open(regular, '_blank');
  };
  
  const handleShare = (e) => {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({
        title: alt_description || 'Artwork',
        url: regular,
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(alt_description || 'Check out this artwork!')}&url=${encodeURIComponent(regular)}`, '_blank');
    }
  };

  return (
    <motion.div 
      className="photo-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Link to={`/photo/${id}`} className="photo-link">
        <div className="photo-wrapper" style={{ aspectRatio: `${width}/${height}` }}>
          <img 
            src={regular} 
            alt={alt_description || 'Artwork'} 
            className="photo-image"
            loading="lazy"
          />
          
          {showActions && (
            <div className="photo-actions">
              <button 
                className={`action-btn ${isFavorite ? 'favorite' : ''}`} 
                onClick={handleFavorite}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <FaHeart />
              </button>
              <button 
                className="action-btn" 
                onClick={handleShare}
                aria-label="Share"
              >
                <FaShare />
              </button>
              <button 
                className="action-btn" 
                onClick={handleDownload}
                aria-label="Download"
              >
                <FaDownload />
              </button>
              {collections.length > 0 && (
                <div className="collection-dropdown">
                  <button className="action-btn" aria-label="Add to collection">
                    <FaPlus />
                  </button>
                  <div className="collection-options">
                    {collections.map(collection => (
                      <button 
                        key={collection.id}
                        onClick={(e) => handleAddToCollection(e, collection.id)}
                        className="collection-option"
                      >
                        {collection.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="photo-info">
            <div className="photo-user">
              <a 
                href={portfolio_url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={medium} alt={name} className="user-img" />
              </a>
              <div className="user-details">
                <h4>{name}</h4>
                <p>{likes} likes</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default Photo; 