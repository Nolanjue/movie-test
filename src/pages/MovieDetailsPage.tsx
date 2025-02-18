// @ts-ignore

import React, { useState, useEffect } from 'react';
import { useParams  } from 'react-router-dom';
import { Play, Plus, ThumbsUp, Star, Clock, Calendar, Heart,  User, Film, Video, Tag, Award, Calendar as CalendarIcon } from 'lucide-react';
import { Movie,  } from '../types/movie';
import { fetchMovieDetails } from '../services/api';
import { addBookmark, removeBookmark, isBookmarked } from '../utils/bookmarks';

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
 

  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);


  useEffect(() => {
    const loadMovie = async () => {
      if (!id) return;
      
      try {
        const data = await fetchMovieDetails(id);
        setMovie(data);
        setInWatchlist(isBookmarked(id));
        setLoading(false);
      } catch (error) {
        console.error('Error loading movie:', error);
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);


  const toggleWatchlist = () => {
    if (!movie || !id) return;

    if (inWatchlist) {
      removeBookmark(id);
    } else {
      addBookmark(movie);
    }
    setInWatchlist(!inWatchlist);
  };


  // Rating component that creates a better visual for the rating
  const RatingBar = ({ source, value }: { source: string, value: string }) => {
    let percentage = 0;
    
    // Convert various rating formats to percentage
    if (value.includes('/')) {
      const [num, denom] = value.split('/');
      percentage = (parseFloat(num) / parseFloat(denom)) * 100;
    } else if (value.includes('%')) {
      percentage = parseFloat(value);
    } else if (value.match(/\d+\.\d+/)) {
      // Assume out of 10 if just a number
      percentage = parseFloat(value) * 10;
    }
    
    // Get source icon
    const getSourceIcon = (source: string) => {
      switch(source) {
        case 'Internet Movie Database':
          return <Star className="text-yellow-400" size={18} />;
        case 'Rotten Tomatoes':
          return <Award className="text-red-500" size={18} />;
        case 'Metacritic':
          return <ThumbsUp className="text-blue-400" size={18} />;
        default:
          return <Star className="text-gray-400" size={18} />;
      }
    };

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {getSourceIcon(source)}
            <span className="text-gray-200 font-medium">{source}</span>
          </div>
          <span className="text-white font-bold">{value}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="h-2.5 rounded-full bg-gradient-to-r from-red-500 to-yellow-500" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  if (loading || !movie) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 w-full text-white">
      <div className="relative w-full h-[70vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.Poster})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full px-4 h-full flex items-end pb-16">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            <img 
              src={movie.Poster} 
              alt={movie.Title} 
              className="w-48 h-72 md:w-64 md:h-96 rounded-lg shadow-lg"
            />
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.Title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
                <span className="flex items-center">
                  <Calendar size={16} className="mr-1" /> {movie.Year}
                </span>
                <span className="flex items-center">
                  <Clock size={16} className="mr-1" /> {movie.Runtime}
                </span>
                <span className="flex items-center">
                  <Star size={16} className="mr-1 text-yellow-400" /> {movie.imdbRating}
                </span>
              </div>
              <p className="text-gray-300 mb-8">{movie.Plot}</p>
              <div className="flex flex-wrap gap-4">
                <button className="flex items-center px-6 py-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold">
                  <Play size={20} className="mr-2" /> Watch Trailer
                </button>
                <button 
                  onClick={toggleWatchlist}
                  className={`flex items-center px-6 py-2 ${
                    inWatchlist ? 'bg-gray-600' : 'bg-gray-700'
                  } hover:bg-gray-600 rounded-md font-semibold`}
                >
                  {inWatchlist ? (
                    <Heart className="mr-2 text-red-500" size={20} />
                  ) : (
                    <Plus size={20} className="mr-2" />
                  )}
                  {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Film className="mr-2 text-red-500" size={24} />
              <span>Movie Details</span>
            </h2>
            <div className="space-y-6 text-gray-200">
              <div className="flex items-start gap-3">
                <User className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-gray-400 text-sm mb-1">Director</p>
                  <p className="font-medium">{movie.Director}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Video className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-gray-400 text-sm mb-1">Writers</p>
                  <p className="font-medium">{movie.Writer}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Award className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-gray-400 text-sm mb-1">Stars</p>
                  <p className="font-medium">{movie.Actors}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Tag className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-gray-400 text-sm mb-1">Genre</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {movie.Genre.split(', ').map(genre => (
                      <span 
                        key={genre} 
                        className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full text-xs"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CalendarIcon className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-gray-400 text-sm mb-1">Released</p>
                  <p className="font-medium">{movie.Released}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Star className="mr-2 text-yellow-400" size={24} />
              <span>Ratings</span>
            </h2>
            {movie.Ratings?.map((rating: any) => (
              <RatingBar key={rating.Source} source={rating.Source} value={rating.Value} />
            ))}
            
            <div className="mt-8 border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-200">Awards</h3>
             <p className="text-gray-300">{movie?.Awards || "No awards information available"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;