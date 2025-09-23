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

  // A small component to render the different ratings
  const Ratings = ({ ratings }) => {
    if (!ratings || ratings.length === 0) {
      return null;
    }
    return (
      <div className="ratings-container">
        <h2>Critical Ratings</h2>
        <div className="ratings-list">
          {ratings.map((rating, index) => (
            <div key={index} className="rating-item">
              <span className="rating-value">{rating.Value + "  :   "}</span>
              <span className="rating-source">{rating.Source}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
          <Ratings ratings={movieDetails?.Ratings} />
        </div>
        <div className="detail-info">
          <h2>{movieDetails?.Title} ({movieDetails?.Year})</h2>
          <p><strong>Rated:</strong> {movieDetails?.Rated} | <strong>Runtime:</strong> {movieDetails?.Runtime}</p>
          <p><strong>Genre:</strong> {movieDetails?.Genre}</p>
          <p><strong>Plot:</strong> {movieDetails?.Plot}</p>
          <p><strong>Director:</strong> {movieDetails?.Director}</p>
          <p><strong>Writer:</strong> {movieDetails?.Writer}</p>
          <p><strong>Actors:</strong> {movieDetails?.Actors}</p>
          <p><strong>Language:</strong> {movieDetails?.Language}</p>
          <p><strong>Country:</strong> {movieDetails?.Country}</p>
          <p><strong>Awards:</strong> {movieDetails?.Awards}</p>
          <p><strong>Box Office:</strong> {movieDetails?.BoxOffice}</p>
          <p><strong>IMDB Rating:</strong> {movieDetails?.imdbRating}/10 ({movieDetails?.imdbVotes} votes)</p>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;

