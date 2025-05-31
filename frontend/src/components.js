import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Netflix Clone Components

// TMDB API Configuration
const TMDB_API_KEYS = [
  'c8dea14dc917687ac631a52620e4f7ad',
  '3cb41ecea3bf606c56552db3d17adefd'
];
let currentApiKeyIndex = 0;

const getApiKey = () => TMDB_API_KEYS[currentApiKeyIndex];
const rotateApiKey = () => {
  currentApiKeyIndex = (currentApiKeyIndex + 1) % TMDB_API_KEYS.length;
};

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Netflix Header Component
export const NetflixHeader = ({ onSearch, onProfileClick }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 md:px-16 py-4">
        {/* Netflix Logo */}
        <div className="flex items-center space-x-8">
          <h1 className="text-red-600 text-2xl md:text-3xl font-bold tracking-tight">
            NETFLIX
          </h1>
          
          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Home</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">TV Shows</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Movies</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">New & Popular</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">My List</a>
          </nav>
        </div>

        {/* Right Side Menu */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            {isSearchOpen ? (
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                onBlur={() => setIsSearchOpen(false)}
                placeholder="Search..."
                className="bg-black border border-gray-600 text-white px-4 py-2 rounded w-64 focus:outline-none focus:border-white"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>

          {/* Notifications */}
          <button className="text-white hover:text-gray-300 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
            </svg>
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={onProfileClick}
              className="w-8 h-8 bg-red-600 rounded overflow-hidden"
            >
              <img 
                src="https://i.pravatar.cc/32?img=1" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Hero Section Component
export const HeroSection = ({ featuredContent }) => {
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    if (featuredContent) {
      fetchTrailer(featuredContent.id, featuredContent.media_type || 'movie');
    }
  }, [featuredContent]);

  const fetchTrailer = async (id, mediaType) => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/${mediaType}/${id}/videos?api_key=${getApiKey()}`
      );
      
      const trailer = response.data.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      );
      
      if (trailer) {
        setTrailerKey(trailer.key);
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
      rotateApiKey();
    }
  };

  if (!featuredContent) return null;

  return (
    <div className="relative h-screen">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${BACKDROP_BASE_URL}${featuredContent.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full px-4 md:px-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {featuredContent.title || featuredContent.name}
          </h1>
          <p className="text-lg md:text-xl text-white mb-8 leading-relaxed">
            {featuredContent.overview}
          </p>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button 
              className="flex items-center bg-white text-black px-8 py-3 rounded font-semibold hover:bg-gray-200 transition-colors"
              onClick={() => {
                if (trailerKey) {
                  window.open(`https://www.youtube.com/watch?v=${trailerKey}`, '_blank');
                }
              }}
            >
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Play
            </button>
            <button className="flex items-center bg-gray-500 bg-opacity-70 text-white px-8 py-3 rounded font-semibold hover:bg-opacity-50 transition-colors">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Movie Card Component
export const MovieCard = ({ movie, onCardClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative min-w-[200px] md:min-w-[300px] cursor-pointer transform transition-transform duration-300 hover:scale-110 hover:z-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onCardClick(movie)}
    >
      <img
        src={`${IMAGE_BASE_URL}${movie.poster_path}`}
        alt={movie.title || movie.name}
        className="w-full h-auto rounded-lg"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Image';
        }}
      />
      
      {/* Hover Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-80 rounded-lg p-4 flex flex-col justify-end">
          <h3 className="text-white font-bold text-lg mb-2">
            {movie.title || movie.name}
          </h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-green-500 font-semibold">
              {Math.round(movie.vote_average * 10)}% Match
            </span>
            <span className="text-gray-300 text-sm">
              {movie.release_date || movie.first_air_date ? 
                new Date(movie.release_date || movie.first_air_date).getFullYear() : 
                'N/A'
              }
            </span>
          </div>
          <div className="flex space-x-2">
            <button className="bg-white text-black rounded-full p-2 hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
            <button className="bg-gray-600 text-white rounded-full p-2 hover:bg-gray-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Content Row Component
export const ContentRow = ({ title, movies, onMovieClick }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4 px-4 md:px-16">
        {title}
      </h2>
      
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-30 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-75"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Content */}
        <div
          ref={scrollRef}
          className="flex space-x-2 overflow-x-scroll scrollbar-hide px-4 md:px-16 py-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onCardClick={onMovieClick}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-30 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-75"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Movie Modal Component
export const MovieModal = ({ movie, isOpen, onClose }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    if (movie && isOpen) {
      fetchMovieDetails(movie.id, movie.media_type || 'movie');
      fetchTrailer(movie.id, movie.media_type || 'movie');
    }
  }, [movie, isOpen]);

  const fetchMovieDetails = async (id, mediaType) => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/${mediaType}/${id}?api_key=${getApiKey()}`
      );
      setMovieDetails(response.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      rotateApiKey();
    }
  };

  const fetchTrailer = async (id, mediaType) => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/${mediaType}/${id}/videos?api_key=${getApiKey()}`
      );
      
      const trailer = response.data.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      );
      
      if (trailer) {
        setTrailerKey(trailer.key);
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
      rotateApiKey();
    }
  };

  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Trailer Section */}
        {trailerKey ? (
          <div className="relative pt-[56.25%]">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1`}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div 
            className="h-64 bg-cover bg-center"
            style={{
              backgroundImage: `url(${BACKDROP_BASE_URL}${movie.backdrop_path})`,
            }}
          >
            <div className="h-full bg-black bg-opacity-50 flex items-center justify-center">
              <p className="text-white text-lg">No trailer available</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-white text-3xl font-bold">
              {movie.title || movie.name}
            </h2>
            <div className="flex space-x-2">
              <button className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 transition-colors">
                Play
              </button>
              <button className="bg-gray-600 text-white px-6 py-2 rounded font-semibold hover:bg-gray-500 transition-colors">
                + My List
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-4 text-sm">
                <span className="text-green-500 font-semibold">
                  {Math.round(movie.vote_average * 10)}% Match
                </span>
                <span className="text-white">
                  {movie.release_date || movie.first_air_date ? 
                    new Date(movie.release_date || movie.first_air_date).getFullYear() : 
                    'N/A'
                  }
                </span>
                {movieDetails?.runtime && (
                  <span className="text-white">
                    {Math.floor(movieDetails.runtime / 60)}h {movieDetails.runtime % 60}m
                  </span>
                )}
              </div>

              <p className="text-white text-lg mb-4 leading-relaxed">
                {movie.overview}
              </p>
            </div>

            <div className="text-sm text-gray-400">
              {movieDetails?.genres && (
                <div className="mb-3">
                  <span className="text-white">Genres: </span>
                  {movieDetails.genres.map(genre => genre.name).join(', ')}
                </div>
              )}
              
              <div className="mb-3">
                <span className="text-white">Rating: </span>
                {movie.vote_average?.toFixed(1)}/10
              </div>

              {movieDetails?.production_companies && movieDetails.production_companies.length > 0 && (
                <div>
                  <span className="text-white">Studio: </span>
                  {movieDetails.production_companies[0].name}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};