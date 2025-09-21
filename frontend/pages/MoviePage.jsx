import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../design/MoviePage.css';
// Base URL for the backend API
const API_BASE_URL = `http://localhost:3500/movies`;

const MoviePage = () => {
  const { imdbId } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/details/${imdbId}`);
        if (response.data.Response === "True") {
          setMovieDetails(response.data);
          setMessage('');
        } else {
          setMessage(response.data.Error || 'Could not find movie details.');
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setMessage('An error occurred while fetching movie details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovieDetails();
  }, [imdbId]);

  if (isLoading) {
    return (
      <div className="movie-detail-container">
        <div className="loading-outer">
          <div className="message">Loading movie details...</div>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="movie-detail-container">
        <div className="message">{message}</div>
      </div>
    );
  }

  // Use optional chaining (?) to safely access properties
  const posterUrl = movieDetails?.Poster !== 'N/A' ? movieDetails.Poster : 'https://placehold.co/400x600/5D688A/FFDBB6?text=No+Poster+Available';

  return (
    <div className="movie-detail-container">
      <Link to="/" className="back-button">← Back to Search</Link>
      <div className="detail-card-layout">
        <div className="detail-card">
          <img
            src={posterUrl}
            alt={`${movieDetails?.Title} Poster`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/400x600/5D688A/FFDBB6?text=No+Poster+Available';
            }}
            className="detail-poster"
          />
          <h3>{movieDetails?.Title}</h3>
          <p>{movieDetails?.Year}</p>
        </div>
        <div className="detail-info">
          <h2>{movieDetails?.Title} ({movieDetails?.Year})</h2>
          <p><strong>Genre:</strong> {movieDetails?.Genre}</p>
          <p><strong>Director:</strong> {movieDetails?.Director}</p>
          <p><strong>Actors:</strong> {movieDetails?.Actors}</p>
          <p><strong>Plot:</strong> {movieDetails?.Plot}</p>
          <p><strong>IMDB Rating:</strong> {movieDetails?.imdbRating}/10 ({movieDetails?.imdbVotes} votes)</p>
          <p><strong>Runtime:</strong> {movieDetails?.Runtime}</p>
          <p><strong>Rated:</strong> {movieDetails?.Rated}</p>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
