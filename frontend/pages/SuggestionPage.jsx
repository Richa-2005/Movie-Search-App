import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../design/SuggestionPage.css';
import { useAppState } from '../src/App.jsx'; 
// Base URL for the backend API
const API_BASE_URL = `http://localhost:3500/movies`;

const SuggestionPage = () => {
  // Local state for the form inputs ONLY
  const [mood, setMood] = useState('')
  const [decade, setDecade] = useState('')
  const [time, setTime] = useState('')
  const [actorOrDirector, setActorOrDirector] = useState('')
  const [keyword, setKeyword] = useState('')

  // Get global state and functions from the context
  const {
    suggestedMovies,
    suggestionLoading,
    suggestionError,
    handleSuggestion,
  } = useAppState()

  const handleSubmit = e => {
    e.preventDefault()
    const criteria = { mood, decade, time, actorOrDirector, keyword }
    handleSuggestion(criteria)
  }

  return (
    <div className='suggestion-container'>
      <div className='suggestion-header'>
      <Link to='/' className='back-button'>
          ← Back to Home
        </Link>
        <h1>Let's Decide Together</h1>
        <p>
          Tell us what you're looking for, and we'll find the perfect movies for
          you.
        </p>
        
      </div>
      <div className='suggestion-body'>
        <form className='suggestion-form' onSubmit={handleSubmit}>
          {/* Form remains the same */}
          <div className='form-group'>
            <label htmlFor='mood'>What's your current mood?</label>
            <select
              id='mood'
              value={mood}
              onChange={e => setMood(e.target.value)}
            >
              <option value=''>Any Mood</option>
              <option value='Action'>Action-Packed</option>
              <option value='Comedy'>Funny & Lighthearted</option>
              <option value='Drama'>Serious & Thought-Provoking</option>
              <option value='Horror'>Scary & Intense</option>
              <option value='Romance'>Romantic</option>
              <option value='Sci-Fi'>Sci-Fi & Fantasy</option>
              <option value='Thriller'>Thrilling & Suspenseful</option>
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='decade'>Which decade?</label>
            <select
              id='decade'
              value={decade}
              onChange={e => setDecade(e.target.value)}
            >
              <option value=''>Any Decade</option>
              <option value='2020'>2020s</option>
              <option value='2010'>2010s</option>
              <option value='2000'>2000s</option>
              <option value='1990'>1990s</option>
              <option value='1980'>1980s</option>
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='time'>How much time do you have?</label>
            <select
              id='time'
              value={time}
              onChange={e => setTime(e.target.value)}
            >
              <option value=''>Any Length</option>
              <option value='lt90'>Under 90 minutes</option>
              <option value='90-120'>90 - 120 minutes</option>
              <option value='gt120'>Over 2 hours</option>
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='actor-director'>
              Favorite Actor or Director (Optional)
            </label>
            <input
              type='text'
              id='actor-director'
              placeholder='e.g., Tom Hanks or Christopher Nolan'
              value={actorOrDirector}
              onChange={e => setActorOrDirector(e.target.value)}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='keyword'>Themes or Keywords (Optional)</label>
            <input
              type='text'
              id='keyword'
              placeholder='e.g., time travel, based on a true story'
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
          </div>
          <button
            type='submit'
            className='suggestion-button'
            disabled={suggestionLoading}
          >
            {suggestionLoading ? 'Thinking...' : 'Find Movies'}
          </button>
        </form>

        <div className='suggestion-result'>
          {suggestionLoading && (
            <p className='loading-message'>Finding the perfect matches...</p>
          )}
          {suggestionError && (
            <p className='error-message'>{suggestionError}</p>
          )}
          {suggestedMovies.length > 0 && (
            <div className="suggestion-list">
              {suggestedMovies.map(movie => (
                <Link 
                  to={`/movie/${movie.imdbID}`} 
                  key={movie.imdbID} 
                  state={{ from: '/suggest' }} 
                  className="suggestion-card"
                >
                  <img src={movie.Poster} alt={`${movie.Title} Poster`} />
                  <div className="suggestion-card-info">
                    
                    <h1>{movie.Title}</h1>
                      <p>
                      {movie.Year} · {movie.Runtime}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SuggestionPage
