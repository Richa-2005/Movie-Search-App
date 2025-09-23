import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../design/SuggestionPage.css'; 

// Base URL for the backend API
const API_BASE_URL = `http://localhost:3500/movies`;

// A reusable component to display the suggested movie
const MovieSuggestionCard = ({ movie }) => {
    const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://placehold.co/400x600/5D688A/FFDBB6?text=No+Poster+Available';
    return (
        <Link to={`/movie/${movie.imdbID}`} className="suggestion-card">
            <img src={posterUrl} alt={`${movie.Title} Poster`} />
            <div className="suggestion-card-info">
                <h3>{movie.Title}</h3>
                <p>{movie.Year}</p>
                <p className="plot">{movie.Plot}</p>
            </div>
        </Link>
    );
};


const SuggestionPage = () => {
    const [mood, setMood] = useState('');
    const [decade, setDecade] = useState('');
    const [person, setPerson] = useState('');
    const [suggestion, setSuggestion] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGetSuggestion = async (e) => {
        e.preventDefault(); // Prevent form from submitting traditionally
        setIsLoading(true);
        setSuggestion(null);
        setError('');

        try {
            // This is a hypothetical endpoint. You would need to build this on your backend.
            // It would take the query params and find a random, relevant movie.
            const response = await axios.get(`${API_BASE_URL}/suggest`, {
                params: {
                    genre: mood,
                    decade: decade,
                    person: person
                }
            });
            setSuggestion(response.data);
        } catch (err) {
            setError('Could not find a suggestion. Please try a different combination!');
            console.error('Error fetching suggestion:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="suggestion-container">
            <Link to="/" className="back-button">← Back to Search</Link>
            
            <header className="suggestion-header">
                <h1>Let's Decide Together</h1>
                <p>Tell us what you're looking for, and we'll find the perfect movie.</p>
            </header>

            <form className="suggestion-form" onSubmit={handleGetSuggestion}>
                <div className="form-group">
                    <label htmlFor="mood-select">What's your current mood?</label>
                    <select id="mood-select" value={mood} onChange={(e) => setMood(e.target.value)}>
                        <option value="">Any Mood/Genre</option>
                        <option value="Action">Feeling Adventurous?</option>
                        <option value="Comedy">Need a Laugh?</option>
                        <option value="Drama">Something Serious?</option>
                        <option value="Horror">Want a Scare?</option>
                        <option value="Sci-Fi">A Journey to the Stars?</option>
                        <option value="Romance">Lost in Love?</option>
                        <option value="Fantasy">A Touch of Magic?</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="decade-select">Pick a time period:</label>
                    <select id="decade-select" value={decade} onChange={(e) => setDecade(e.target.value)}>
                        <option value="">Any Decade</option>
                        <option value="2020">The 2020s</option>
                        <option value="2010">The 2010s</option>
                        <option value="2000">The 2000s</option>
                        <option value="1990">The 1990s</option>
                        <option value="1980">The 1980s</option>
                        <option value="1970">The 1970s</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="person-input">A favorite actor or director?</label>
                    <input 
                        id="person-input"
                        type="text" 
                        placeholder="e.g., Tom Hanks or Stanley Kubrick" 
                        value={person}
                        onChange={(e) => setPerson(e.target.value)}
                    />
                </div>

                <button type="submit" className="suggestion-button" disabled={isLoading}>
                    {isLoading ? 'Thinking...' : 'Find My Movie!'}
                </button>
            </form>

            <div className="suggestion-result">
                {isLoading && <div className="loading-message">Finding the perfect movie for you...</div>}
                {error && <div className="error-message">{error}</div>}
                {suggestion && <MovieSuggestionCard movie={suggestion} />}
            </div>
        </div>
    );
};

export default SuggestionPage;
