import React, { useState } from 'react';
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
  const [rangeYear, setRangeYear] = useState("true"); // Set initial state to the string value of the first option
  const API_BASE_URL = `http://localhost:3500/movies`
  const handleYearChange = (e) => {
    setYear(e.target.value);
    setPage(1); 
  };

  const handleRangeYear = (e)=>{
    setRangeYear(e.target.value);
  }
 
   // Function to handle the search.
   const handleSearch = async (pageToFetch = 1) => {
    const query = searchQuery.trim();
    if (!query) {
      setMessage('Please enter a movie title to search.');
      setSearchResults([]);
      return;
    }

    if (pageToFetch === 1) {
      setIsLoading(true);
      setSearchResults([]); // Clear previous results for a new search
    } else {
      setIsMoreLoading(true);
    }
    setMessage('');

    try {
      let response;
      // Case 1: Decade Search
      if (rangeYear === 'true' && year) {
        const yearParam = year.trim();
        // The pageToFetch is sent, but our backend will fetch a new random set each time
        response = await axios.get(`${API_BASE_URL}/${query}/${pageToFetch}/decade/${yearParam || 'all'}`);
        
        // The decade route returns a raw array of movies
        const newMovies = response.data;
        if (newMovies && newMovies.length > 0) {
          setSearchResults((prevResults) => [...prevResults, ...newMovies]);
          // For decades, we don't get a true total, so we ensure the "Show More" button is always available
          setTotalResults(searchResults.length + newMovies.length + 1); 
        } else if (pageToFetch === 1) {
          setMessage('No movies found for this decade. Please try a different title.');
        }

      // Case 2 & 3: Specific Year or No Year Search
      } else {
        const yearParam = year.trim();
        let url = `${API_BASE_URL}/${query}/${pageToFetch}`;
        if (yearParam) {
            url += `/${yearParam}`; // Append year if it exists
        }
        response = await axios.get(url);

        // These routes return the standard OMDB object { Search, totalResults }
        const { Search, totalResults } = response.data;
        if (Search && Search.length > 0) {
            setSearchResults((prevResults) => [...prevResults, ...Search]);
            setTotalResults(Number(totalResults));
        } else if (pageToFetch === 1) {
            setMessage('No movies found. Please try a different title.');
        }
      }
      setPage(pageToFetch);

    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(error.response.data.error);
      } else {
        console.error('Error fetching movies:', error);
        setMessage('An error occurred. Please try again.');
      }
      if (pageToFetch === 1) setSearchResults([]); // Clear results on error for a new search
    } finally {
      setIsLoading(false);
      setIsMoreLoading(false);
    }
  };

  const handlePage = ()=> {
    handleSearch(page + 1);
  }

  const MovieCard = ({ movie }) => {
    const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://placehold.co/400x600/5D688A/FFDBB6?text=No+Poster+Available';
    return (
      <div className="movie-div">
        <img 
          src={posterUrl} 
          alt={`${movie.Title} Poster`} 
          onError={(e) => {
            e.target.onerror = null; // Prevents infinite loop
            e.target.src = 'https://placehold.co/400x600/5D688A/FFDBB6?text=No+Poster+Available';
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
          <div style = {{display:"flex", flexDirection:"column", minWidth:"320px",justifyContent:"center",alignItems:'center'}}>
        <div style={{display:"flex"}}>
           <div className="year-select">
           <label>
              <input 
                type="radio" 
                name="choice" 
                value="true" 
                onClick={handleRangeYear} 
                defaultChecked
              />
              Select by Decade</label>
              </div>

              <div className="year-select">
              <label>
              <input 
                type="radio" 
                name="choice" 
                value="false" 
                onClick={handleRangeYear}
              />
              Select by Year</label>
            </div>
          </div>
          {rangeYear === "false" && <input
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
          />}
          {rangeYear === "true" && <select className="movie-entry-year" onChange={handleYearChange}>
            <option value="">Select Decade</option>
            <option value='2020'>2020-2025</option>
            <option value='2010'>2010-2020</option>
            <option value='2000'>2000-2010</option>
            <option value='1990'>1990-2000</option>
            <option value='1980'>1980-1990</option>
          </select>}
          </div>
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
