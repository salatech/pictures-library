import React, { useRef, useEffect } from 'react';
import { useGallery } from '../context/GalleryContext';
import Photo from './Photo';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import './Gallery.css';

const Gallery = () => {
  const { 
    photos, 
    loading, 
    viewMode, 
    loadMore 
  } = useGallery();
  
  const { ref, isFetching } = useInfiniteScroll(loadMore, {
    threshold: 0.5,
  });
  
  const galleryRef = useRef(null);
  
  // Apply masonry layout if needed
  useEffect(() => {
    if (viewMode === 'masonry' && galleryRef.current) {
      const resizeAllMasonryItems = () => {
        const items = galleryRef.current.querySelectorAll('.photo-container');
        items.forEach(item => {
          resizeMasonryItem(item);
        });
      };
      
      const resizeMasonryItem = (item) => {
        const grid = galleryRef.current;
        const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
        const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
        
        const rowSpan = Math.ceil((item.querySelector('.photo-wrapper').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
        item.style.gridRowEnd = `span ${rowSpan}`;
      };
      
      resizeAllMasonryItems();
      window.addEventListener('resize', resizeAllMasonryItems);
      
      return () => {
        window.removeEventListener('resize', resizeAllMasonryItems);
      };
    }
  }, [viewMode, photos]);

  return (
    <div className="gallery-container">
      <div 
        ref={galleryRef} 
        className={`gallery ${viewMode === 'masonry' ? 'masonry' : 'grid'}`}
      >
        {photos.map((photo) => (
          <Photo key={photo.id} {...photo} />
        ))}
      </div>
      
      <div ref={ref} className="loading-container">
        {loading || isFetching ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading more artworks...</p>
          </div>
        ) : (
          <div className="load-more-trigger"></div>
        )}
      </div>
    </div>
  );
};

export default Gallery; 