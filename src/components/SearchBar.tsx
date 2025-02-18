import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { searchMovies } from '../services/api';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      const searchResults = await searchMovies(value);
      setResults(searchResults);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleMovieClick = (id: string) => {
    navigate(`/movie/${id}`);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center bg-gray-800 rounded-full px-4 py-2">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search movies..."
          className="bg-transparent border-none outline-none text-white px-3 w-64"
        />
        {query && (
          <X
            className="w-5 h-5 text-gray-400 cursor-pointer"
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
          />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
          {results.map((movie: any) => (
            <div
              key={movie.imdbID}
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center space-x-3"
              onClick={() => handleMovieClick(movie.imdbID)}
            >
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="w-10 h-14 object-cover rounded"
              />
              <div>
                <h4 className="text-white font-medium">{movie.Title}</h4>
                <p className="text-gray-400 text-sm">{movie.Year}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 