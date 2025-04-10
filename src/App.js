import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GalleryProvider } from './context/GalleryContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import PhotoDetail from './components/PhotoDetail';
import './App.css';

function App() {
  return (
    <GalleryProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/photo/:id" element={<PhotoDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
    </GalleryProvider>
  );
}

export default App;
