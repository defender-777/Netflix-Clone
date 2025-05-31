import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import {
  NetflixHeader,
  HeroSection,
  ContentRow,
  MovieModal
} from './components';

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

function App() {
  const [featuredContent, setFeaturedContent] = useState(null);
  const [contentRows, setContentRows] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeNetflix();
  }, []);

  const initializeNetflix = async () => {
    try {
      await Promise.all([
        loadFeaturedContent(),
        loadContentRows()
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error initializing Netflix:', error);
      setLoading(false);
    }
  };

  const fetchTMDBData = async (endpoint) => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}${endpoint}&api_key=${getApiKey()}`);
      return response.data;
    } catch (error) {
      console.error('TMDB API Error:', error);
      rotateApiKey();
      // Fallback to mock data if API fails
      return mockFallbackData(endpoint);
    }
  };

  const mockFallbackData = (endpoint) => {
    // Mock data fallback in case of API failure
    const mockMovies = [
      {
        id: 1,
        title: "Stranger Things",
        name: "Stranger Things",
        overview: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
        poster_path: "/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
        backdrop_path: "/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
        vote_average: 8.7,
        release_date: "2016-07-15",
        media_type: "tv"
      },
      {
        id: 2,
        title: "The Witcher",
        name: "The Witcher",
        overview: "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.",
        poster_path: "/7vjaCdMw15FEbXyLQTVa04URsPm.jpg",
        backdrop_path: "/7vjaCdMw15FEbXyLQTVa04URsPm.jpg",
        vote_average: 8.2,
        release_date: "2019-12-20",
        media_type: "tv"
      }
    ];
    
    return { results: mockMovies };
  };

  const loadFeaturedContent = async () => {
    const data = await fetchTMDBData('/trending/all/day?');
    if (data.results && data.results.length > 0) {
      setFeaturedContent(data.results[0]);
    }
  };

  const loadContentRows = async () => {
    const categories = [
      { title: 'Trending Now', endpoint: '/trending/all/day?' },
      { title: 'Popular Movies', endpoint: '/movie/popular?' },
      { title: 'Top Rated Movies', endpoint: '/movie/top_rated?' },
      { title: 'Popular TV Shows', endpoint: '/tv/popular?' },
      { title: 'Action Movies', endpoint: '/discover/movie?with_genres=28&' },
      { title: 'Comedy Movies', endpoint: '/discover/movie?with_genres=35&' },
      { title: 'Horror Movies', endpoint: '/discover/movie?with_genres=27&' },
      { title: 'Romance Movies', endpoint: '/discover/movie?with_genres=10749&' },
      { title: 'Documentaries', endpoint: '/discover/movie?with_genres=99&' }
    ];

    const rows = [];
    for (const category of categories) {
      const data = await fetchTMDBData(category.endpoint);
      if (data.results && data.results.length > 0) {
        rows.push({
          title: category.title,
          movies: data.results
        });
      }
    }
    setContentRows(rows);
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const data = await fetchTMDBData(`/search/multi?query=${encodeURIComponent(query)}&`);
    setSearchResults(data.results || []);
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleProfileClick = () => {
    // Profile menu functionality can be added here
    console.log('Profile clicked');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto mb-4"></div>
          <h2 className="text-white text-xl">Loading Netflix...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <NetflixHeader 
        onSearch={handleSearch}
        onProfileClick={handleProfileClick}
      />

      {/* Main Content */}
      <main className="pt-16">
        {isSearching && searchResults.length > 0 ? (
          // Search Results
          <div className="pt-8">
            <ContentRow
              title="Search Results"
              movies={searchResults}
              onMovieClick={handleMovieClick}
            />
          </div>
        ) : (
          <>
            {/* Hero Section */}
            {featuredContent && (
              <HeroSection featuredContent={featuredContent} />
            )}

            {/* Content Rows */}
            <div className="relative z-20 -mt-32">
              {contentRows.map((row, index) => (
                <ContentRow
                  key={index}
                  title={row.title}
                  movies={row.movies}
                  onMovieClick={handleMovieClick}
                />
              ))}
            </div>
          </>
        )}

        {/* Continue Watching Section (Mock Data) */}
        {!isSearching && (
          <div className="pb-16">
            <ContentRow
              title="Continue Watching for John"
              movies={[
                {
                  id: 'continue-1',
                  title: 'Breaking Bad',
                  poster_path: '/rweIrveL43TaxUN0akQEaAXL6x0.jpg',
                  vote_average: 9.5,
                  release_date: '2008-01-20'
                },
                {
                  id: 'continue-2',
                  title: 'The Office',
                  poster_path: '/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg',
                  vote_average: 8.8,
                  release_date: '2005-03-24'
                }
              ]}
              onMovieClick={handleMovieClick}
            />
          </div>
        )}
      </main>

      {/* Movie Modal */}
      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Footer */}
      <footer className="bg-black text-gray-400 px-4 md:px-16 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Audio Description</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gift Cards</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Media Center</a></li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Investor Relations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Jobs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Cookie Preferences</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Corporate Information</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Speed Test</a></li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Account</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Redeem Gift Cards</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Legal Notices</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Only on Netflix</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-sm">© 2024 Netflix Clone. This is a demo project for educational purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;