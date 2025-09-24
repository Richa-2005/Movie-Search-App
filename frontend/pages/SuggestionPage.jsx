import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../design/SuggestionPage.css';

// Base URL for the backend API
const API_BASE_URL = `http://localhost:3500/movies`;

const SuggestionPage = () => {
  const [mood, setMood] = useState('');
  const [decade, setDecade] = useState('');
  const [time, setTime] = useState(''); // New state for time slot
  const [actorOrDirector, setActorOrDirector] = useState('');
  
  const [suggestedMovie, setSuggestedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSuggestion = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuggestedMovie(null);

    try {
      // Construct parameters, only including ones with values
      const params = {};
      if (mood) params.mood = mood;
      if (decade) params.decade = decade;
      if (time) params.time = time; // Add time to params
      if (actorOrDirector) params.actorOrDirector = actorOrDirector;

      const response = await axios.get(`${API_BASE_URL}/suggest`, { params });
      setSuggestedMovie(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not find a suggestion. Please try different criteria!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="suggestion-container">
        <Link to="/" className="back-button">← Back to Search</Link>
      <div className="suggestion-header">
        <h1>Let's Decide Together</h1>
        <p>Tell us what you're looking for, and we'll find the perfect movie for you.</p>
      </div>

      <form className="suggestion-form" onSubmit={handleSuggestion}>
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
        
        
        <div className="form-group">
          <label htmlFor="time">How much time do you have?</label>
          <select id="time" value={time} onChange={(e) => setTime(e.target.value)}>
            <option value="">Any Length</option>
            <option value="lt90">Under 90 minutes</option>
            <option value="90-120">90 - 120 minutes</option>
            <option value="gt120">Over 2 hours</option>
          </select>
        </div>


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

        <button type="submit" className="suggestion-button" disabled={isLoading}>
          {isLoading ? 'Thinking...' : 'Find a Movie'}
        </button>
      </form>

      <div className="suggestion-result">
        {isLoading && <p className="loading-message">Finding the perfect match...</p>}
        {error && <p className="error-message">{error}</p>}
        {suggestedMovie && (
          <Link to={`/movie/${suggestedMovie.imdbID}`} className="suggestion-card">
            <img src={suggestedMovie.Poster} alt={`${suggestedMovie.Title} Poster`} />
            <div className="suggestion-card-info">
              <h3>{suggestedMovie.Title}</h3>
              <p>{suggestedMovie.Year} · {suggestedMovie.Runtime}</p>
              <p className="plot">{suggestedMovie.Plot}</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default SuggestionPage;

