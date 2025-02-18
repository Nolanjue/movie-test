import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetailsPage from './pages/MovieDetailsPage';
import SearchBar from './components/SearchBar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 w-full">
        <nav className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-sm">
          <div className="w-full px-4 py-4 flex justify-between items-center">
            <Link to='/' className="text-2xl font-bold text-white">MovieApp</Link>
            <SearchBar />
          </div>
        </nav>
        <main className="pt-16 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;