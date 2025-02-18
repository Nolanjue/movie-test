import { Star, Plus, Check } from 'lucide-react';
import { isBookmarked } from '../utils/bookmarks';

interface MovieCardProps {
  movie: any;
  onMovieClick: (id: number) => void;
  onBookmarkClick: (movie: any) => void;
}

const MovieCard = ({ movie, onMovieClick, onBookmarkClick }: MovieCardProps) => {
  const bookmarked = isBookmarked(movie.id);

  return (
    <div className="relative group">
      <img 
        src={movie.poster_path}
        alt={movie.title}
        className="w-full h-[300px] object-cover rounded-lg transition-all duration-300 group-hover:opacity-75"
        onClick={() => onMovieClick(movie.id)}
      />
      <button
        onClick={() => onBookmarkClick(movie)}
        className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/75 transition-colors"
      >
        {bookmarked ? (
          <Check className="w-5 h-5 text-white" />
        ) : (
          <Plus className="w-5 h-5 text-white" />
        )}
      </button>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
        <h3 className="text-white font-semibold">{movie.title}</h3>
        <div className="flex items-center text-yellow-400">
          <Star className="w-4 h-4 mr-1" />
          <span className="text-sm">{movie.vote_average}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard; 