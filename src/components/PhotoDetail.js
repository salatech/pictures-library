import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaShare, FaDownload, FaArrowLeft, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useGallery } from '../context/GalleryContext';
import './PhotoDetail.css';

const PhotoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { photos, favorites, collections, toggleFavorite, addToCollection } = useGallery();
  const [photo, setPhoto] = useState(null);
  const [relatedPhotos, setRelatedPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCollections, setShowCollections] = useState(false);
  
  const fetchPhotoDetails = useCallback(async () => {
    try {
      const clientID = `?client_id=${"XkVnwbvPiS57VJf_jho_Z16b7G-DdXCfR9ZQgxmEmAE"}`;
      const response = await fetch(`https://api.unsplash.com/photos/${id}${clientID}`);
      const data = await response.json();
      
      setPhoto(data);
      setLoading(false);
      
      // Fetch related photos
      const relatedResponse = await fetch(`https://api.unsplash.com/users/${data.user.username}/photos${clientID}&per_page=6`);
      const relatedData = await relatedResponse.json();
      setRelatedPhotos(relatedData);
    } catch (error) {
      console.error('Error fetching photo details:', error);
      setLoading(false);
    }
  }, [id]);
  
  useEffect(() => {
    // Find the photo in our existing photos
    const foundPhoto = photos.find(p => p.id === id);
    
    if (foundPhoto) {
      setPhoto(foundPhoto);
      setLoading(false);
      
      // Simulate fetching related photos (in a real app, you'd fetch from API)
      const related = photos
        .filter(p => p.id !== id && p.user.username === foundPhoto.user.username)
        .slice(0, 6);
      
      setRelatedPhotos(related);
    } else {
      // If photo not found in our state, fetch it from API
      fetchPhotoDetails();
    }
  }, [id, photos, fetchPhotoDetails]);
  
  const handleFavorite = () => {
    toggleFavorite(photo);
  };
  
  const handleAddToCollection = (collectionId) => {
    addToCollection(collectionId, photo);
    setShowCollections(false);
  };
  
  const handleDownload = () => {
    window.open(photo.urls.regular, '_blank');
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: photo.alt_description || 'Artwork',
        url: photo.urls.regular,
      });
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(photo.alt_description || 'Check out this artwork!')}&url=${encodeURIComponent(photo.urls.regular)}`, '_blank');
    }
  };
  
  const isFavorite = favorites.some(fav => fav.id === photo?.id);
  
  if (loading) {
    return (
      <div className="photo-detail-loading">
        <div className="spinner"></div>
        <p>Loading artwork details...</p>
      </div>
    );
  }
  
  if (!photo) {
    return (
      <div className="photo-detail-error">
        <h2>Artwork not found</h2>
        <button onClick={() => navigate('/')} className="back-button">
          <FaArrowLeft /> Back to Gallery
        </button>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="photo-detail-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <button onClick={() => navigate('/')} className="back-button">
        <FaArrowLeft /> Back to Gallery
      </button>
      
      <div className="photo-detail-content">
        <div className="photo-detail-image">
          <img src={photo.urls.regular} alt={photo.alt_description || 'Artwork'} />
          
          <div className="photo-detail-actions">
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
                <button 
                  className="action-btn" 
                  onClick={() => setShowCollections(!showCollections)}
                  aria-label="Add to collection"
                >
                  <FaPlus />
                </button>
                {showCollections && (
                  <div className="collection-options">
                    {collections.map(collection => (
                      <button 
                        key={collection.id}
                        onClick={() => handleAddToCollection(collection.id)}
                        className="collection-option"
                      >
                        {collection.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="photo-detail-info">
          <div className="photo-detail-header">
            <div className="photo-detail-user">
              <a 
                href={photo.user.portfolio_url} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <img src={photo.user.profile_image.medium} alt={photo.user.name} className="user-img" />
              </a>
              <div className="user-details">
                <h3>{photo.user.name}</h3>
                <p>@{photo.user.username}</p>
              </div>
            </div>
            <div className="photo-stats">
              <div className="stat">
                <span className="stat-value">{photo.likes}</span>
                <span className="stat-label">Likes</span>
              </div>
              <div className="stat">
                <span className="stat-value">{photo.views || 0}</span>
                <span className="stat-label">Views</span>
              </div>
              <div className="stat">
                <span className="stat-value">{photo.downloads || 0}</span>
                <span className="stat-label">Downloads</span>
              </div>
            </div>
          </div>
          
          <div className="photo-detail-description">
            <h4>About this artwork</h4>
            <p>{photo.alt_description || 'No description available.'}</p>
            
            {photo.description && (
              <>
                <h4>Description</h4>
                <p>{photo.description}</p>
              </>
            )}
            
            {photo.tags && photo.tags.length > 0 && (
              <>
                <h4>Tags</h4>
                <div className="photo-tags">
                  {photo.tags.map(tag => (
                    <span key={tag.title} className="tag">
                      {tag.title}
                    </span>
                  ))}
                </div>
              </>
            )}
            
            <div className="photo-meta">
              <p>Created: {new Date(photo.created_at).toLocaleDateString()}</p>
              <p>Location: {photo.location?.title || 'Unknown'}</p>
              <p>Camera: {photo.exif?.make || 'Unknown'} {photo.exif?.model || ''}</p>
            </div>
          </div>
        </div>
      </div>
      
      {relatedPhotos.length > 0 && (
        <div className="related-photos">
          <h3>More by {photo.user.name}</h3>
          <div className="related-photos-grid">
            {relatedPhotos.map(relatedPhoto => (
              <div 
                key={relatedPhoto.id} 
                className="related-photo"
                onClick={() => navigate(`/photo/${relatedPhoto.id}`)}
              >
                <img src={relatedPhoto.urls.small} alt={relatedPhoto.alt_description || 'Related artwork'} />
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PhotoDetail; 