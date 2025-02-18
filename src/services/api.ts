const BASE_URL = 'https://movie-database-alternative.p.rapidapi.com';

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
    'X-RapidAPI-Host': import.meta.env.VITE_RAPID_API_HOST
  }
};
const getRandomGenre = () => {
  const genres = [
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Horror',
    'Romance',
    'Sci-Fi',
    'Thriller',
    'Fantasy',
    'Mystery',
    'Crime',
    'Animation',
    'Documentary',
    'Musical',
    'Biography',
    'Family',
    'History',
    'War',
    'Western'
  ];

  const randomIndex = Math.floor(Math.random() * genres.length);
  return genres[randomIndex];
};
export const fetchMovies = async (val:string) => {
  try {
    const url = `${BASE_URL}?r=json&page=1&s=${val ? val : getRandomGenre()}`;

    const response = await fetch(url, options);
    console.log(response,url)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

export const fetchMovieDetails = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/?r=json&i=${id}`, options);
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

export const searchMovies = async (query: string) => {
  try {
    const response = await fetch(`${BASE_URL}/?s=${query}&r=json`, options);
    const data = await response.json();
    return data.Search || [];
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
}; 