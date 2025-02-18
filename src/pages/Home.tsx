// @ts-ignore

import React, { useState, useEffect } from 'react';
import { Play,  Info, ChevronLeft, ChevronRight,  Bookmark, Heart, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchMovies } from '../services/api';
import { addBookmark, removeBookmark, isBookmarked } from '../utils/bookmarks';
import { Movie, MovieCardProps } from '../types/movie';

// MovieCard Component with improved visuals
const MovieCard = ({ bookmarked, movie, onMovieClick, onBookmarkClick, onSetHero, isHero }: MovieCardProps & { onSetHero?: (movie: Movie) => void, isHero?: boolean }) => {
  const isInBookmarks = bookmarked.find((mark: Movie) => mark.imdbID === movie.imdbID);
  
  return (
    <div 
      className={`relative flex-none w-36 md:w-44 lg:w-48 group cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10 ${isHero ? 'ring-2 ring-red-500 scale-105' : ''}`}
      onClick={() => onMovieClick(movie.imdbID)}
    >
      <div className="relative overflow-hidden rounded-lg shadow-lg">
        <img 
          src={movie.Poster} 
          alt={movie.Title} 
          className="w-full h-54 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Glass effect overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-sm transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 group-hover:opacity-100">
          <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{movie.Title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-300">{movie.Year}</span>
        
          </div>
        </div>
      </div>
      
      {/* Set as Hero button */}
      {onSetHero && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSetHero(movie);
          }}
          className={`absolute top-2 left-2 p-2 bg-black/60 rounded-full hover:bg-red-600/90 transition-all shadow-lg transform ${isHero ? 'opacity-100 bg-red-600' : 'opacity-0 group-hover:opacity-100'} duration-200`}
          aria-label="Set as hero movie"
          title="Set as featured movie"
        >
          <ArrowUp size={16} className="text-white" />
        </button>
      )}
      
      {/* Bookmark button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onBookmarkClick(movie);
        }}
        className="absolute top-2 right-2 p-2 bg-black/60 rounded-full hover:bg-black/80 transition-colors shadow-lg transform opacity-0 group-hover:opacity-100 duration-200"
        aria-label={isInBookmarks ? "Remove from watchlist" : "Add to watchlist"}
      >
        {isInBookmarks ? (
          <Heart size={16} className="text-red-500 fill-red-500" />
        ) : (
          <Heart size={16} className="text-white" />
        )}
      </button>
      
      {/* Quick action buttons that appear on hover */}
      <div className="absolute left-0 right-0 bottom-0 flex justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-2 transition-all duration-300 pb-4">
        <div className="flex gap-2 bg-black/70 backdrop-blur-md rounded-full p-1 shadow-lg">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              // Play functionality
            }}
            className="p-1 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
            aria-label="Play trailer"
          >
            <Play size={16} className="text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmarkClick(movie);
            }}
            className={`p-1 rounded-full transition-colors ${isInBookmarks ? 'bg-gray-700' : 'bg-gray-600 hover:bg-gray-700'}`}
            aria-label={isInBookmarks ? "Remove from watchlist" : "Add to watchlist"}
          >
            {isInBookmarks ? (
              <Heart size={16} className="text-red-500 fill-red-500" />
            ) : (
              <Heart size={16} className="text-white" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMovieClick(movie.imdbID);
            }}
            className="p-1 bg-gray-600 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="More info"
          >
            <Info size={16} className="text-white" />
          </button>
        </div>
      </div>
      
      {/* "Featured" badge if this is the hero movie */}
      {isHero && (
        <div className="absolute top-0 left-0 right-0 flex justify-center">
          <div className="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded-b-md shadow-md">
            Featured
          </div>
        </div>
      )}
    </div>
  );
};

// Home Component
const Home = () => {
  const navigate = useNavigate();
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState<Movie[]>([]);
  
  // Toast notification state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    setBookmarked(JSON.parse(localStorage.getItem('bookmarked-movies') || '[]'));
    const loadContent = async () => {
      try {
        const trending = await fetchMovies('');
        console.log(trending.Search)
        if (trending.totalResults) {
          setTrendingMovies(trending.Search);
          // Set first movie as hero if no hero is set
          if (!heroMovie && trending.Search.length > 0) {
            setHeroMovie(trending.Search[0]);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading content:', error);
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const handleMovieClick = (id: string) => {
    navigate(`/movie/${id}`);
  };

  const toggleBookmark = (movie: Movie) => {
    if (isBookmarked(movie.imdbID)) {
      const updatedBookmarks = removeBookmark(movie.imdbID);
      setBookmarked(updatedBookmarks);
      
      // Show toast notification
      setToastMessage(`Removed "${movie.Title}" from your list`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } else {
      const updatedBookmarks = addBookmark(movie);
      if (updatedBookmarks) {
        setBookmarked(updatedBookmarks);
        
        // Show toast notification
        setToastMessage(`Added "${movie.Title}" to your list`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    }
  };
  
  // Function to set a movie as hero
  const setAsHero = (movie: Movie) => {
    setHeroMovie(movie);
    
    // Show toast notification
    setToastMessage(`"${movie.Title}" is now featured`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-900 min-h-screen">
      {/* Hero Section with enhanced visuals */}
      {heroMovie && (
        <div className="relative w-full h-[70vh]">
          <div 
            className="absolute inset-0 bg-cover bg-center w-full"
            style={{ backgroundImage: `url(${heroMovie.Poster})` }}
          >
            {/* Overlay with more sophisticated gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-black/20" />
          </div>
          
          <div className="relative z-10 flex flex-col justify-end h-full w-full max-w-7xl mx-auto px-8 pb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-3 text-white drop-shadow-lg">{heroMovie.Title}</h1>
            <div className="flex items-center text-sm text-gray-300 space-x-4 mb-4">
              <span className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                <span>{heroMovie.Year}</span>
              </span>
              
            </div>
            <p className="text-gray-300 mb-6 line-clamp-3 md:line-clamp-none max-w-2xl text-shadow drop-shadow-md">{heroMovie.Plot}</p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => handleMovieClick(heroMovie.imdbID)}
                className="flex items-center px-6 py-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold transition duration-300 shadow-lg"
              >
                <Play size={20} className="mr-2" /> Play
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(heroMovie);
                }}
                className="flex items-center px-6 py-2 bg-gray-700/70 backdrop-blur-sm hover:bg-gray-600 rounded-md font-semibold transition duration-300 shadow-lg"
              >
                {isBookmarked(heroMovie.imdbID) ? (
                  <Heart size={20} className="text-red-500 fill-red-500 mr-2" />
                ) : (
                  <Heart size={20} className="text-gray-300 mr-2" />
                )}
                My List
              </button>
              <button 
                onClick={() => handleMovieClick(heroMovie.imdbID)}
                className="flex items-center px-6 py-2 bg-gray-800/70 backdrop-blur-sm hover:bg-gray-700 rounded-md font-semibold transition duration-300 shadow-lg"
              >
                <Info size={20} className="mr-2" /> More Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movie sections with improved layout */}
      <div className="w-full max-w-7xl mx-auto px-8 py-12 space-y-16">
        {/* Trending section */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Trending Now</h2>
            <div className="flex items-center space-x-4">
              <div className="text-gray-400 text-sm hidden md:block">
                <span className="mr-2">Tip:</span>
                Click <ArrowUp size={16} className="inline-block mx-1 text-red-500" /> to feature a movie
              </div>
              <div className="flex space-x-2">
                <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors shadow-md">
                  <ChevronLeft size={20} className="text-white" />
                </button>
                <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors shadow-md">
                  <ChevronRight size={20} className="text-white" />
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full">
            {trendingMovies.map((movie: Movie) => (
              <MovieCard 
                key={movie.imdbID}
                bookmarked={bookmarked}
                movie={movie}
                onMovieClick={handleMovieClick}
                onBookmarkClick={toggleBookmark}
                onSetHero={setAsHero}
                isHero={heroMovie?.imdbID === movie.imdbID}
              />
            ))}
          </div>
        </section>

        {/* My List section with conditional rendering */}
        {bookmarked.length > 0 && (
          <section className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">My List</h2>
              <div className="flex space-x-2">
                <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors shadow-md">
                  <ChevronLeft size={20} className="text-white" />
                </button>
                <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors shadow-md">
                  <ChevronRight size={20} className="text-white" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full">
              {bookmarked.map((movie: Movie) => (
                <MovieCard 
                  key={movie.imdbID}
                  bookmarked={bookmarked}
                  movie={movie}
                  onMovieClick={handleMovieClick}
                  onBookmarkClick={toggleBookmark}
                  onSetHero={setAsHero}
                  isHero={heroMovie?.imdbID === movie.imdbID}
                />
              ))}
            </div>
          </section>
        )}
        
        {/* Show empty state if no bookmarks */}
        {bookmarked.length === 0 && (
          <section className="w-full">
            <h2 className="text-3xl font-bold text-white mb-6">My List</h2>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 flex flex-col items-center justify-center">
              <Bookmark size={48} className="text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">Your list is empty</h3>
              <p className="text-gray-400 text-center max-w-md mb-6">
                Add movies and TV shows to your list to keep track of what you want to watch.
              </p>
              <button className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-md font-semibold transition duration-300">
                Browse Popular Movies
              </button>
            </div>
          </section>
        )}
      </div>
      
      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Home;