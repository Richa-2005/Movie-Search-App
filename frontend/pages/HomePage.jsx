import React from 'react';
import { Link } from 'react-router-dom';
// Corrected the import path for the CSS file
import '../design/HomePage.css'; 
// Corrected the import path for the App context hook
import { useSearch } from '../src/App.jsx'; 

export default function HomePage() {
  // Get all state and functions from the central context
  const {
    page,
    searchQuery, setSearchQuery,
    year, setYear,
    searchResults,
    isLoading,
    isMoreLoading,
    message,
    totalResults,
    rangeYear, setRangeYear,
    handleSearch
  } = useSearch();

  const handlePage = () => {
    handleSearch(page + 1);
  };

  const MovieCard = ({ movie }) => {
    const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://placehold.co/400x600/5D688A/FFDBB6?text=No+Poster+Available';
    return (
      <Link to={`/movie/${movie.imdbID}`} className="movie-div">
        <img
          src={posterUrl}
          alt={`${movie.Title} Poster`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/400x600/5D688A/FFDBB6?text=No+Poster+Available';
          }}
        />
        <h3>{movie.Title}</h3>
        <p>{movie.Year}</p>
      </Link>
    );
  };

  const showLoadMore = searchResults.length > 0 && searchResults.length < totalResults;

  return (
    <div className="body-container">
      <Link to="/suggest" 
        className="movie-button" 
        style={{textDecoration:"none", position:"relative", left:"40%"}}
      >
      Let's Decide Together!
      </Link>
      <header className="header-section">
        <h1>CineVerse</h1>
        <p>What's on your mind today?</p>
        
      </header>

      <main className="main-section">
        <div className="user-div">
          <input
            type="text"
            placeholder="Search for a movie by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(1, e.target.value) }}
            className="movie-entry-title"
          />
          <div style={{ display: "flex", flexDirection: "column", minWidth: "320px", justifyContent: "center", alignItems: 'center' }}>
            <div style={{ display: "flex" }}>
              <div className="year-select">
                <label>
                  <input type="radio" name="choice" value="true" onClick={() => setRangeYear("true")} defaultChecked />
                  Select by Decade
                </label>
              </div>
              <div className="year-select">
                <label>
                  <input type="radio" name="choice" value="false" onClick={() => setRangeYear("false")} />
                  Select by Year
                </label>
              </div>
            </div>
            {rangeYear === "false" && <input
              type="text"
              placeholder="Enter year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(1) }}
              className="movie-entry-year"
            />}
            {rangeYear === "true" && <select className="movie-entry-year" value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">Select Decade</option>
              <option value='2020'>2020-2029</option>
              <option value='2010'>2010-2019</option>
              <option value='2000'>2000-2009</option>
              <option value='1990'>1990-1999</option>
              <option value='1980'>1980-1989</option>
            </select>}
          </div>
          <button onClick={() => handleSearch(1)} className="movie-button">
            Search
          </button>
        </div>
      </main>
      
      {!isLoading && message && (
        <div id="message" className="message">{message}</div>
      )}
   
      <div id="results-container" className="results-container">
        {isLoading ? (
          <div className="loading-outer"><div className="message">Loading...</div></div>
        ) : (
          searchResults.map((movie, index) => <MovieCard key={`${movie.imdbID}-${index}`} movie={movie} />)
        )}
      </div>

      {showLoadMore && (
        <button id="pages-button" onClick={handlePage} className="movie-button">
          {isMoreLoading ? "Loading..." : "Show More"}
        </button>
      )}
    </div>
  );
};

