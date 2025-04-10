import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const GalleryContext = createContext();

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};

export const GalleryProvider = ({ children }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [collections, setCollections] = useState(() => {
    const savedCollections = localStorage.getItem('collections');
    return savedCollections ? JSON.parse(savedCollections) : [];
  });
  const [artists, setArtists] = useState([]);
  const [artistsLoading, setArtistsLoading] = useState(true);
  const [artistsError, setArtistsError] = useState(null);

  // Fetch photos from Unsplash API
  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const clientID = `?client_id=${"XkVnwbvPiS57VJf_jho_Z16b7G-DdXCfR9ZQgxmEmAE"}`;
      const response = await fetch(`https://api.unsplash.com/photos${clientID}&per_page=30`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the data to match our app's format
      const transformedPhotos = data.map(photo => ({
        id: photo.id,
        urls: {
          thumb: photo.urls.thumb,
          small: photo.urls.small,
          regular: photo.urls.regular,
          full: photo.urls.full
        },
        alt_description: photo.alt_description,
        description: photo.description,
        likes: photo.likes,
        views: photo.views || 0,
        downloads: photo.downloads || 0,
        created_at: photo.created_at,
        user: {
          id: photo.user.id,
          name: photo.user.name,
          username: photo.user.username,
          portfolio_url: photo.user.portfolio_url,
          profile_image: {
            small: photo.user.profile_image.small,
            medium: photo.user.profile_image.medium,
            large: photo.user.profile_image.large
          }
        },
        tags: photo.tags || [],
        location: photo.location || null,
        exif: photo.exif || null
      }));
      
      setPhotos(transformedPhotos);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError('Failed to load photos. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch artists from Unsplash API
  const fetchArtists = useCallback(async () => {
    try {
      setArtistsLoading(true);
      setArtistsError(null);
      
      const clientID = `?client_id=${"XkVnwbvPiS57VJf_jho_Z16b7G-DdXCfR9ZQgxmEmAE"}`;
      const response = await fetch(`https://api.unsplash.com/users${clientID}&per_page=12`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the data to match our app's format
      const transformedArtists = data.map(artist => ({
        id: artist.id,
        name: artist.name,
        username: artist.username,
        portfolio_url: artist.portfolio_url,
        bio: artist.bio,
        location: artist.location,
        total_photos: artist.total_photos,
        followers_count: artist.followers_count,
        following_count: artist.following_count,
        profile_image: {
          small: artist.profile_image.small,
          medium: artist.profile_image.medium,
          large: artist.profile_image.large
        },
        instagram_username: artist.instagram_username,
        twitter_username: artist.twitter_username
      }));
      
      setArtists(transformedArtists);
    } catch (error) {
      console.error('Error fetching artists:', error);
      setArtistsError('Failed to load artists. Please try again later.');
    } finally {
      setArtistsLoading(false);
    }
  }, []);

  // Fetch photos for a specific artist
  const fetchArtistPhotos = useCallback(async (artistId) => {
    try {
      const clientID = `?client_id=${"XkVnwbvPiS57VJf_jho_Z16b7G-DdXCfR9ZQgxmEmAE"}`;
      const response = await fetch(`https://api.unsplash.com/users/${artistId}/photos${clientID}&per_page=12`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the data to match our app's format
      return data.map(photo => ({
        id: photo.id,
        urls: {
          thumb: photo.urls.thumb,
          small: photo.urls.small,
          regular: photo.urls.regular,
          full: photo.urls.full
        },
        alt_description: photo.alt_description,
        description: photo.description,
        likes: photo.likes,
        views: photo.views || 0,
        downloads: photo.downloads || 0,
        created_at: photo.created_at,
        user: {
          id: photo.user.id,
          name: photo.user.name,
          username: photo.user.username,
          portfolio_url: photo.user.portfolio_url,
          profile_image: {
            small: photo.user.profile_image.small,
            medium: photo.user.profile_image.medium,
            large: photo.user.profile_image.large
          }
        },
        tags: photo.tags || [],
        location: photo.location || null,
        exif: photo.exif || null
      }));
    } catch (error) {
      console.error('Error fetching artist photos:', error);
      throw new Error('Failed to load artist photos. Please try again later.');
    }
  }, []);

  // Toggle favorite status for a photo
  const toggleFavorite = useCallback((photo) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.some(fav => fav.id === photo.id);
      
      if (isFavorite) {
        const newFavorites = prevFavorites.filter(fav => fav.id !== photo.id);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        return newFavorites;
      } else {
        const newFavorites = [...prevFavorites, photo];
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        return newFavorites;
      }
    });
  }, []);

  // Add a photo to a collection
  const addToCollection = useCallback((collectionId, photo) => {
    setCollections(prevCollections => {
      const updatedCollections = prevCollections.map(collection => {
        if (collection.id === collectionId) {
          // Check if photo is already in the collection
          const isPhotoInCollection = collection.photos.some(p => p.id === photo.id);
          
          if (!isPhotoInCollection) {
            return {
              ...collection,
              photos: [...collection.photos, photo]
            };
          }
        }
        return collection;
      });
      
      localStorage.setItem('collections', JSON.stringify(updatedCollections));
      return updatedCollections;
    });
  }, []);

  // Create a new collection
  const createCollection = useCallback((name, description = '') => {
    setCollections(prevCollections => {
      const newCollection = {
        id: Date.now().toString(),
        name,
        description,
        photos: [],
        createdAt: new Date().toISOString()
      };
      
      const updatedCollections = [...prevCollections, newCollection];
      localStorage.setItem('collections', JSON.stringify(updatedCollections));
      return updatedCollections;
    });
  }, []);

  // Remove a photo from a collection
  const removeFromCollection = useCallback((collectionId, photoId) => {
    setCollections(prevCollections => {
      const updatedCollections = prevCollections.map(collection => {
        if (collection.id === collectionId) {
          return {
            ...collection,
            photos: collection.photos.filter(photo => photo.id !== photoId)
          };
        }
        return collection;
      });
      
      localStorage.setItem('collections', JSON.stringify(updatedCollections));
      return updatedCollections;
    });
  }, []);

  // Delete a collection
  const deleteCollection = useCallback((collectionId) => {
    setCollections(prevCollections => {
      const updatedCollections = prevCollections.filter(collection => collection.id !== collectionId);
      localStorage.setItem('collections', JSON.stringify(updatedCollections));
      return updatedCollections;
    });
  }, []);

  // Add searchImages function to handle image searches
  const searchImages = useCallback(async (query) => {
    try {
      setLoading(true);
      setError(null);
      
      const clientID = `?client_id=${"XkVnwbvPiS57VJf_jho_Z16b7G-DdXCfR9ZQgxmEmAE"}`;
      const response = await fetch(`https://api.unsplash.com/search/photos${clientID}&query=${query}&per_page=30`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the data to match our app's format
      const transformedPhotos = data.results.map(photo => ({
        id: photo.id,
        urls: {
          thumb: photo.urls.thumb,
          small: photo.urls.small,
          regular: photo.urls.regular,
          full: photo.urls.full
        },
        alt_description: photo.alt_description,
        description: photo.description,
        likes: photo.likes,
        views: photo.views || 0,
        downloads: photo.downloads || 0,
        created_at: photo.created_at,
        user: {
          id: photo.user.id,
          name: photo.user.name,
          username: photo.user.username,
          portfolio_url: photo.user.portfolio_url,
          profile_image: {
            small: photo.user.profile_image.small,
            medium: photo.user.profile_image.medium,
            large: photo.user.profile_image.large
          }
        },
        tags: photo.tags || [],
        location: photo.location || null,
        exif: photo.exif || null
      }));
      
      setPhotos(transformedPhotos);
    } catch (error) {
      console.error('Error searching photos:', error);
      setError('Failed to search photos. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchPhotos();
    fetchArtists();
  }, [fetchPhotos, fetchArtists]);

  const value = {
    photos,
    loading,
    error,
    favorites,
    collections,
    artists,
    artistsLoading,
    artistsError,
    toggleFavorite,
    addToCollection,
    createCollection,
    removeFromCollection,
    deleteCollection,
    fetchPhotos,
    fetchArtists,
    fetchArtistPhotos,
    searchImages
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};

export default GalleryContext; 