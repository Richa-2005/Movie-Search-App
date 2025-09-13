import React, { useState, useEffect } from 'react';
import '../design/HomePage.css'
import axios from 'axios'
export default function App (){

 //States : User input -> searchQuery, Response from API -> searchResults, 
 // Loading -> isLoading , Message if no result -> message
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [message, setMessage] = useState('Type a movie title and hit search!');
  const [totalResults, setTotalResults] = useState(0);
  
  // This effect will automatically scroll the user to the bottom when new movies are added.
  useEffect(() => {
    if (searchResults.length > 0 && !isLoading && !isMoreLoading) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [searchResults, isLoading, isMoreLoading]);

  // Function to handle the search.
  const handleSearch = async (pageToFetch=1) => {
    const query = searchQuery.trim();
    if (!query) {
      setMessage('Please enter a movie title to search.');
      setSearchResults([]);
      return;
    }
    
    if (pageToFetch === 1) {
      setIsLoading(true);
      setSearchResults([]); // Clear previous results for a new search
      setTotalResults(0);
    } else {
      setIsMoreLoading(true);
    }
    setMessage('');
    
    try {
      const response = await axios.get(`http://localhost:3500/movies/${query}/${pageToFetch}`);
     
      const { Search, totalResults } = response.data;
      
      if (Search) {
        // Append new movies to the existing list
        setSearchResults((prevResults) => [...prevResults, ...Search]);
        setTotalResults(Number(totalResults));
        setMessage('');
        setPage(pageToFetch);
      } else {
        setMessage('No movies found. Please try a different title.');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(error.response.data.error);
      } else {
        console.error('Error fetching movies:', error);
        setMessage('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setIsMoreLoading(false);
    }
  };

  const handlePage = ()=> {
    handleSearch(page + 1);
  }

  const MovieCard = ({ movie }) => {
    const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://placehold.co/400x600/F7A5A5/5D688A?text=No+Image';
    return (
      <div className="movie-div">
        <img src={posterUrl} alt={`${movie.Title} Poster`}  />
        <h3 >{movie.Title}</h3>
        <p >{movie.Year}</p>
      </div>
    );
  };

  // Only show the "Show More" button if there are more results to load
  const showLoadMore = searchResults.length > 0 && searchResults.length < totalResults;


  return (
    <div className="body-container">
      <header className="header-section">
        <h1>CineVerse</h1>
        <p>What's on your mind today?</p>
      </header>

 
      <main className="main-section">
        <div className="user-div">
          <input
            type="text"
            id="movie-search"
            placeholder="Search for a movie by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(1);
              }
            }}
            className="movie-entry"
          />
          <button
            id="search-button"
            onClick={() => handleSearch(1)}
            className="movie-button"
          >
            Search
          </button>
        </div>
      </main>
      
      {!isLoading && message && (
        <div id="message" className="message">
          {message}
        </div>
      )}
   
      <div id="results-container" className="results-container">
        {isLoading ? (
          <div className="loading-outer">
            <div className="message">Loading...</div>
          </div>
        ) : (
          searchResults.map((movie) => <MovieCard key={movie.imdbID} movie={movie} />)
        )}
      </div>

      {showLoadMore && (
        <button
            id="pages-button"
            onClick={handlePage}
            className="movie-button"
          >
            {isMoreLoading ? "Loading..." : "Show More"}
          </button>
      )}
    </div>
  );
};
