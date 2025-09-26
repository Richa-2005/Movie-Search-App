import React, { useState, useEffect } from 'react';
// Make sure useLocation is imported
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
// Corrected the import path for the CSS file
import '../design/MoviePage.css';

const API_BASE_URL = `http://localhost:3500/movies`;

const MoviePage = () => {
  const { imdbId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/details/${imdbId}`);
        if (response.data.Response === "True") {
          setMovieDetails(response.data);
        } else {
          setMessage(response.data.Error || 'Could not find movie details.');
        }
      } catch (error) {
        setMessage('An error occurred while fetching movie details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovieDetails();
  }, [imdbId]);

  const Ratings = ({ ratings }) => {
    if (!ratings || ratings.length === 0) return null;
    return (
      <div className="ratings-container">
        <h4>Critical Ratings</h4>
        <div className="ratings-list">
          {ratings.map((rating, index) => (
            <div key={index} className="rating-item">
              <span className="rating-value">{rating.Value}</span>
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
        <div className="loading-outer"><div className="message">Loading...</div></div>
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
  const backPath = location.state?.from || '/';
  const backButtonStyle = {
    alignSelf: 'flex-start',
    marginBottom: '2rem',
    backgroundColor: '#5D688A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '50px',
    padding: '0.75rem 1.5rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };
  return (
    <div className="movie-detail-container">
      <button onClick={() => navigate(backPath)}  style={backButtonStyle} >
        ← Back to Previous Page
      </button>
      <div className="detail-card-layout">
        <div className="detail-card">
          <img
            src={posterUrl}
            alt={`${movieDetails?.Title} Poster`}
            onError={(e) => { e.target.src = 'https://placehold.co/400x600/5D688A/FFDBB6?text=No+Poster+Available'; }}
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
          <p><strong>Awards:</strong> {movieDetails?.Awards}</p>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;

