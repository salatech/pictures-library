import React from 'react';
import { useGallery } from '../context/GalleryContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
  const { photos, loading, error } = useGallery();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading gallery...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <div className="empty-container">
        <h2>No Photos Found</h2>
        <p>We couldn't find any photos at the moment. Please try again later.</p>
        <button onClick={() => window.location.reload()}>Refresh</button>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <p>Discover beautiful artworks from talented artists around the world</p>
      </div>

      <div className="gallery-grid">
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            className="gallery-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to={`/photo/${photo.id}`} className="gallery-image">
              <img 
                src={photo.urls.small} 
                alt={photo.alt_description || 'Artwork'} 
              />
            </Link>
            <div className="gallery-info">
              <div>
                <h3>{photo.user.name || 'Untitled Artwork'}</h3>
                <p>{photo.likes} likes</p>
              </div>
              <div className="user-avatar">
              <a href={photo.user.portfolio_url}>
                <img src={photo.user.profile_image.small} alt={photo.user.name} />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home; 