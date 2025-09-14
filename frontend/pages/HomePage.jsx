import React, { useState, useEffect } from 'react';
import '../design/HomePage.css'
import axios from 'axios'
export default function App (){

 //States : User input -> searchQuery, Response from API -> searchResults, 
 // Loading -> isLoading , Message if no result -> message
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [year,setYear] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [message, setMessage] = useState('Type a movie title and hit search!');
  const [totalResults, setTotalResults] = useState(0);

  // Function to handle the search.
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
      const yearParam = year.trim();
      let response;
      if (yearParam) {
        // If a year is provided, build the URL with the year parameter
        response = await axios.get(`http://localhost:3500/movies/${query}/${pageToFetch}/${yearParam}`);
      } else {
        // Otherwise, build the URL without the year
        response = await axios.get(`http://localhost:3500/movies/${query}/${pageToFetch}`);
      }
     
      const { Search, totalResults } = response.data;
      
      if (Search) {
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
    const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://placehold.co/400x600/FFF2EF/5D688A?text=No+Poster+Available';
    return (
      <div className="movie-div">
        <img 
          src={posterUrl} 
          alt={`${movie.Title} Poster`}  
          onError={(e) => {
            e.target.onerror = null; // Prevents infinite loop
            e.target.src = 'https://placehold.co/400x600/FFF2EF/5D688A?text=No+Poster+Available';
          }}
        />
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
            placeholder="Search for a movie by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(1);
              }
            }}
            className="movie-entry-title"
          />
          <input
            type="text"
            placeholder="Enter year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(1);
              }
            }}
            className="movie-entry-year"
          />
          {/* <select className="movie-entry-year" onChange={handleYearChange}>
            <option>Select Decade</option>
            <option>2020-2025</option>
            <option>2010-2020</option>
            <option>2000-2010</option>
            <option>1990-2000</option>
            <option>1980-1990</option>
            <option>{"Before 1980s"}</option>
          </select> */}
          <button
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
