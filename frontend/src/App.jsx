import React, { useState, createContext, useContext } from 'react';
import {  Routes, Route } from 'react-router-dom';
import axios from 'axios';
import HomePage from '../pages/HomePage.jsx';
import MoviePage from '../pages/MoviePage.jsx';
import SuggestionPage from '../pages/SuggestionPage.jsx'
import '../design/HomePage.css';

const SearchContext = createContext();

// Custom hook to make it easier to use the context
export const useSearch = () => useContext(SearchContext);

// --- 2. Create the Provider Component ---
// This component will now hold all the state and logic for searching
const SearchProvider = ({ children }) => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [year, setYear] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [message, setMessage] = useState('Type a movie title and hit search!');
  const [totalResults, setTotalResults] = useState(0);
  const [rangeYear, setRangeYear] = useState("true");
  const API_BASE_URL = `http://localhost:3500/movies`;

  const handleSearch = async (pageToFetch = 1, query = searchQuery) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setMessage('Please enter a movie title to search.');
      setSearchResults([]);
      return;
    }

    if (pageToFetch === 1) {
      setIsLoading(true);
      setSearchResults([]);
    } else {
      setIsMoreLoading(true);
    }
    setMessage('');

    try {
      let response;
      if (rangeYear === 'true' && year) {
        response = await axios.get(`${API_BASE_URL}/${trimmedQuery}/${pageToFetch}/decade/${year}`);
        const newMovies = response.data;
        if (newMovies && newMovies.length > 0) {
          setSearchResults((prev) => pageToFetch === 1 ? newMovies : [...prev, ...newMovies]);
          setTotalResults(searchResults.length + newMovies.length + 1);
        } else if (pageToFetch === 1) {
          setMessage('No movies found for this decade.');
        }
      } else {
        let url = `${API_BASE_URL}/${trimmedQuery}/${pageToFetch}`;
        if (year && rangeYear === 'false') {
            url += `/${year.trim()}`;
        }
        response = await axios.get(url);
        const { Search, totalResults } = response.data;
        if (Search && Search.length > 0) {
          setSearchResults((prev) => pageToFetch === 1 ? Search : [...prev, ...Search]);
          setTotalResults(Number(totalResults));
        } else if (pageToFetch === 1) {
          setMessage('No movies found.');
        }
      }
      setPage(pageToFetch);
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred.');
      if (pageToFetch === 1) setSearchResults([]);
    } finally {
      setIsLoading(false);
      setIsMoreLoading(false);
    }
  };

  const value = {
    page, setPage,
    searchQuery, setSearchQuery,
    year, setYear,
    searchResults, setSearchResults,
    isLoading, setIsLoading,
    isMoreLoading, setIsMoreLoading,
    message, setMessage,
    totalResults, setTotalResults,
    rangeYear, setRangeYear,
    handleSearch
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

// --- 3. Main App Component ---
export default function App() {
  return (
      <SearchProvider> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:imdbId" element={<MoviePage />} />
          <Route path="/suggest" element={<SuggestionPage />} />
        </Routes>
      </SearchProvider>
 
  );
}

