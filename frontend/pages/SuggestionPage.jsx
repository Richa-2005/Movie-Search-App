import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../design/SuggestionPage.css';

// Base URL for the backend API
const API_BASE_URL = `http://localhost:3500/movies`;

const SuggestionPage = () => {
  const [mood, setMood] = useState('');
  const [decade, setDecade] = useState('');
  const [time, setTime] = useState('');
  const [actorOrDirector, setActorOrDirector] = useState('');
  const [keyword, setKeyword] = useState(''); // New state for keywords

  const [suggestedMovies, setSuggestedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSuggestion = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuggestedMovies([]);

    try {
      const params = {};
      if (mood) params.mood = mood;
      if (decade) params.decade = decade;
      if (time) params.time = time;
      if (actorOrDirector) params.actorOrDirector = actorOrDirector;
      if (keyword) params.keyword = keyword; // Add keyword to params

      const response = await axios.get(`${API_BASE_URL}/suggest`, { params });
      setSuggestedMovies(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not find a suggestion. Please try different criteria!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="suggestion-container">
      <div className="suggestion-header">
        <h1>Let's Decide Together</h1>
        <p>Tell us what you're looking for, and we'll find the perfect movies for you.</p>
      </div>
      <div className="suggestion-body">
        <form className="suggestion-form" onSubmit={handleSuggestion}>
          {/* Mood Dropdown */}
          <div className="form-group">
            <label htmlFor="mood">What's your current mood?</label>
            <select id="mood" value={mood} onChange={(e) => setMood(e.target.value)}>
              <option value="">Any Mood</option>
              <option value="Action">Action-Packed</option>
              <option value="Comedy">Funny & Lighthearted</option>
              <option value="Drama">Serious & Thought-Provoking</option>
              <option value="Horror">Scary & Intense</option>
              <option value="Romance">Romantic</option>
              <option value="Sci-Fi">Sci-Fi & Fantasy</option>
              <option value="Thriller">Thrilling & Suspenseful</option>
            </select>
          </div>

          {/* Decade Dropdown */}
          <div className="form-group">
            <label htmlFor="decade">Which decade?</label>
            <select id="decade" value={decade} onChange={(e) => setDecade(e.target.value)}>
                <option value="">Any Decade</option>
                <option value="2020">2020s</option>
                <option value="2010">2010s</option>
                <option value="2000">2000s</option>
                <option value="1990">1990s</option>
                <option value="1980">1980s</option>
            </select>
          </div>

          {/* Time Dropdown */}
          <div className="form-group">
            <label htmlFor="time">How much time do you have?</label>
            <select id="time" value={time} onChange={(e) => setTime(e.target.value)}>
                <option value="">Any Length</option>
                <option value="lt90">Under 90 minutes</option>
                <option value="90-120">90 - 120 minutes</option>
                <option value="gt120">Over 2 hours</option>
            </select>
          </div>

          {/* Actor/Director Input */}
          <div className="form-group">
            <label htmlFor="actor-director">Favorite Actor or Director (Optional)</label>
            <input
              type="text"
              id="actor-director"
              placeholder="e.g., Tom Hanks or Christopher Nolan"
              value={actorOrDirector}
              onChange={(e) => setActorOrDirector(e.target.value)}
            />
          </div>

          {/* --- NEW KEYWORD INPUT --- */}
          <div className="form-group">
            <label htmlFor="keyword">Themes or Keywords (Optional)</label>
            <input
              type="text"
              id="keyword"
              placeholder="e.g., time travel, based on a true story"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          {/* --- END OF NEW FEATURE --- */}

          <button type="submit" className="suggestion-button" disabled={isLoading}>
            {isLoading ? 'Thinking...' : 'Find Movies'}
          </button>
        </form>

        <div className="suggestion-result">
          {isLoading && <p className="loading-message">Finding the perfect matches...</p>}
          {error && <p className="error-message">{error}</p>}
          {suggestedMovies.length > 0 && (
            <div className="suggestion-list">
              {suggestedMovies.map(movie => (
                <Link to={`/movie/${movie.imdbID}`} key={movie.imdbID} className="suggestion-card">
                  <img src={movie.Poster} alt={`${movie.Title} Poster`} />
                  <div className="suggestion-card-info">
                    <h3>{movie.Title}</h3>
                    <p>{movie.Year} · {movie.Runtime}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuggestionPage;




