

export const addBookmark = (movie: any) => {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarked-movies') || '[]');//get book marks array
  if (movie) {
    bookmarks.push(movie);
    localStorage.setItem('bookmarked-movies', JSON.stringify(bookmarks));
    return bookmarks
  }
};

export const removeBookmark = (movieId: string) => {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarked-movies') || '[]');
  const newBookmarks = bookmarks.filter((b:any) => b.imdbID !== movieId);//keep everything except current id
  localStorage.setItem('bookmarked-movies', JSON.stringify(newBookmarks));
  return newBookmarks
};

export const isBookmarked = (movieId: string): boolean => {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarked-movies') || '[]');
 
  return bookmarks.some((b:any)=> b.imdbID === movieId);
}; 