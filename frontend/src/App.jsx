import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage.jsx';
import MoviePage from '../pages/MoviePage.jsx';
import '../design/HomePage.css';

export default function App() {
  return (
 
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:imdbId" element={<MoviePage />} />
      </Routes>
  
  );
}
