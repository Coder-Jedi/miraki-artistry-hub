
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Explore from './pages/Explore';
import ArtworkDetails from './pages/ArtworkDetails';
import Artists from './pages/Artists';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './components/ThemeToggle';
import { Toaster } from './components/ui/toaster';
import { initializeAppData } from './utils/initializeData';

// Initialize application data
initializeAppData();

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="miraki-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/artwork/:id" element={<ArtworkDetails />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
