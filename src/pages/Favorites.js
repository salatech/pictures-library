import React from 'react';
import { useGallery } from '../context/GalleryContext';
import Gallery from '../components/Gallery';
import './Favorites.css';

const Favorites = () => {
  const { favorites } = useGallery();
  
  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1>My Favorites</h1>
        <p>{favorites.length} {favorites.length === 1 ? 'artwork' : 'artworks'} saved</p>
      </div>
      
      {favorites.length > 0 ? (
        <div className="favorites-grid">
          {favorites.map((photo) => (
            <div key={photo.id} className="favorite-item">
              <img src={photo.urls.regular} alt={photo.alt_description || 'Favorite artwork'} />
              <div className="favorite-info">
                <h3>{photo.alt_description || 'Untitled'}</h3>
                <p>by {photo.user.name}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-favorites">
          <h2>No favorites yet</h2>
          <p>Start exploring the gallery and save your favorite artworks here.</p>
        </div>
      )}
    </div>
  );
};

export default Favorites; 