import React, { useState } from 'react';
import '../design/HomePage.css'
import axios from 'axios'
export default function App (){

 //States : User input -> searchQuery, Response from API -> searchResults, 
 // Loading -> isLoading , Message if no result -> message

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Type a movie title and hit search!');

  // Function to handle the search.
  const handleSearch = async () => {
    const query = searchQuery.trim();
    if (!query) {
      setMessage('Please enter a movie title to search.');
      setSearchResults([]);
      return;
    }
    //Handling of response 

    setIsLoading(true);
    setMessage('');
    setSearchResults([]);

    try {
     
      const response = await axios.get(`http://localhost:3500/movies/${encodeURIComponent(query)}`);
     
      const movies = response.data;
      
      if (Array.isArray(movies) && movies.length > 0) {
        setSearchResults(movies);
        setMessage('');
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
    }
  };

  // Component to render a single movie card.
  const MovieCard = ({ movie }) => {
    const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://placehold.co/400x600/F7A5A5/5D688A?text=No+Image';
    return (
      <div className="bg-[#F7A5A5] p-4 rounded-lg shadow-xl text-center cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl">
        <img src={posterUrl} alt={`${movie.Title} Poster`} className="rounded-lg w-full h-auto mb-4 object-cover shadow-md" />
        <h3 className="text-xl font-semibold mb-1 truncate text-[#5D688A]">{movie.Title}</h3>
        <p className="text-[#FFF2EF] text-sm">{movie.Year}</p>
      </div>
    );
  };

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
                handleSearch();
              }
            }}
            className="movie-entry"
          />
          <button
            id="search-button"
            onClick={handleSearch}
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
  
      
    </div>
  );
};


