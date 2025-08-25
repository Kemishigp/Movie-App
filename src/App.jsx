//Imports
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';
import './App.css';
import Search from './components/Search';
import reactLogo from './assets/react.svg'; // Retained for completeness, though not used in the corrected component
import viteLogo from '/vite.svg'; // Retained for completeness, though not used in the corrected component
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { updateSearchCount } from './appwrite';

// API Configuration
const API_BASE_URL = 'https://api.themoviedb.org/3'; // Define the root or base of the URL
const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // Import the API key
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}; // Define the parameters for the fetch request

// Main App Component
const App = () => {
  const [searchTerm, setSearchTerm] = useState(''); // State for the search input
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [movies, setMovies] = useState([]); // State for storing fetched movies
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useDebounce(
    () => setDebouncedSearchTerm(searchTerm),
    500,
    [searchTerm]
  );

  const fetchMovies = async (query) => {
    setIsLoading(true);
    setErrorMessage('');
    
    // Construct the endpoint dynamically based on the search query
    const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

    try {
      const response = await fetch(endpoint, API_OPTIONS); // Fetch data from the API

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      } // Check for HTTP errors

      const data = await response.json(); // Parse the JSON response

      if (data.results && data.results.length === 0) {
        setErrorMessage('No movies found for your search.');
        setMovies([]);
      } else {
        setMovies(data.results || []);
        setErrorMessage('');
      }
      updateSearchCount(); // Update search count in Appwrite
    } catch (error) {
      console.error('Error fetching movies:', error); // Log the error for debugging
      setErrorMessage('Failed to fetch movies. Please try again later.'); // Set a user-friendly error message
      setMovies([]); // Clear movies on error
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <main>
      <div className='pattern' /> 
      <div className='wrapper'>
        <header>
          <img src='./hero.png' alt='Hero Banner' />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
        </header>
        <Search
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <section className='all-movies'>
          <h2 className='mt-[40px]'>All Movies</h2>
          {isLoading ? (
            <Spinner/>  
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie}/>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;