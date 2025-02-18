export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Plot?: string;
  Runtime?: string;
  imdbRating?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Genre: string;
  Released?: string;
  Ratings?: Array<{
    Source: string;
    Value: string;
  }>;
  // Keep these for compatibility with existing code
  title?: string;
  name?: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  Awards:string, 
  id?: string;
}

export interface MovieCardProps {
  bookmarked: Movie[];
  movie: Movie;
  onMovieClick: (id: string) => void;
  onBookmarkClick: (movie: Movie) => void;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  key: string;
  site: string;
  type: string;
}

export interface Company {
  id: number;
  name: string;
  logo_path?: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

export interface SimilarMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
} 