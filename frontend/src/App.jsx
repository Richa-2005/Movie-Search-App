import React, { useState, createContext, useContext } from 'react';
import {  Routes, Route } from 'react-router-dom';
import axios from 'axios';
import HomePage from '../pages/HomePage.jsx';
import MoviePage from '../pages/MoviePage.jsx';
import SuggestionPage from '../pages/SuggestionPage.jsx'
import '../design/HomePage.css';

const AppStateContext = createContext();
export const useAppState = () => useContext(AppStateContext);

// --- Provider Component (Now Manages ALL App State) ---
const AppStateProvider = ({ children }) => {
  // State for Homepage Search
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [year, setYear] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchMoreLoading, setSearchMoreLoading] = useState(false);
  const [searchMessage, setSearchMessage] = useState('Type a movie title and hit search!');
  const [totalResults, setTotalResults] = useState(0);
  const [rangeYear, setRangeYear] = useState("true");
  
  // State for Suggestion Page
  const [suggestedMovies, setSuggestedMovies] = useState([]);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState('');

  const API_BASE_URL = `http://localhost:3500/movies`;

  // Homepage search logic
  const handleSearch = async (pageToFetch = 1, query = searchQuery) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setSearchMessage('Please enter a movie title to search.');
      setSearchResults([]);
      return;
    }

    if (pageToFetch === 1) {
      setSearchLoading(true);
      setSearchResults([]);
    } else {
      setSearchMoreLoading(true);
    }
    setSearchMessage('');

    try {
      let response;
      if (rangeYear === 'true' && year) {
        response = await axios.get(`${API_BASE_URL}/${trimmedQuery}/${pageToFetch}/decade/${year}`);
        const newMovies = response.data;
        if (newMovies && newMovies.length > 0) {
          setSearchResults((prev) => pageToFetch === 1 ? newMovies : [...prev, ...newMovies]);
          setTotalResults(searchResults.length + newMovies.length + 1);
        } else if (pageToFetch === 1) {
          setSearchMessage('No movies found for this decade.');
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
          setSearchMessage('No movies found.');
        }
      }
      setPage(pageToFetch);
    } catch (error) {
      setSearchMessage(error.response?.data?.error || 'An error occurred while searching.');
      if (pageToFetch === 1) setSearchResults([]);
    } finally {
      setSearchLoading(false);
      setSearchMoreLoading(false);
    }
  };

  // Suggestion Page Logic
  const handleSuggestion = async (criteria) => {
    setSuggestionLoading(true);
    setSuggestionError('');
    setSuggestedMovies([]);

    try {
      const response = await axios.get(`${API_BASE_URL}/suggest`, { params: criteria });
      setSuggestedMovies(response.data);
      console.log(response.data);
    } catch (err) {
      setSuggestionError(err.response?.data?.error || 'Could not find a suggestion.');
    } finally {
      setSuggestionLoading(false);
    }
  };

  // Value provided to all child components
  const value = {
    page, setPage, searchQuery, setSearchQuery, year, setYear,
    searchResults, searchLoading, searchMoreLoading, searchMessage,
    totalResults, rangeYear, setRangeYear, handleSearch,
    suggestedMovies, suggestionLoading, suggestionError, handleSuggestion
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

// --- Main App Component ---
export default function App() {
  return (

      <AppStateProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:imdbId" element={<MoviePage />} />
          <Route path="/suggest" element={<SuggestionPage />} />
        </Routes>
      </AppStateProvider>
 
  );
}