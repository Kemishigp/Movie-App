// Imports
import { use, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Search from './components/Search';
// API Configuration
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};
// Main App Component
const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 

  const fetchMovies = async () => {
    try { 
      const endpoint ='${API_BASE_URL}/discover/movie?sort_by=popularity.desc';
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
        const data = await response.json();

        console.log(data);
    }

      catch(error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    }
  }
  
  useEffect(() => {

  }, []);
  

  return(
    <main>
      <div className='pattern'/>
      
      <div className='wrapper'>
        <header>
          <img src = './hero.png' alt='Hero Banner'/>
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy 
          Without the Hassle</h1>
        </header>
        <Search searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} />
      </div>

    </main>
  );
}

export default App
