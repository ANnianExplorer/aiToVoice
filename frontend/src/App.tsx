import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import AppLayout from './components/Layout/AppLayout';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import HomePage from './pages/Home/HomePage';
import SearchPage from './pages/Search/SearchPage';
import LibraryPage from './pages/Library/LibraryPage';
import RankingsPage from './pages/Rankings/RankingsPage';
import SocialPage from './pages/Social/SocialPage';
import AITeacherPage from './pages/AITeacher/AITeacherPage';
import StudioPage from './pages/Studio/StudioPage';
import SettingsPage from './pages/Settings/SettingsPage';
import ProfilePage from './pages/Profile/ProfilePage';
import SongDetailPage from './pages/Song/SongDetailPage';
import PlaylistDetailPage from './pages/Playlist/PlaylistDetailPage';
import UserHomePage from './pages/Social/UserHomePage';
import MessagePage from './pages/Social/MessagePage';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/*"
        element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="rankings" element={<RankingsPage />} />
        <Route path="social" element={<SocialPage />} />
        <Route path="ai-teacher" element={<AITeacherPage />} />
        <Route path="studio" element={<StudioPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="song/:id" element={<SongDetailPage />} />
        <Route path="playlist/:id" element={<PlaylistDetailPage />} />
        <Route path="user/:id" element={<UserHomePage />} />
        <Route path="messages/:id" element={<MessagePage />} />
      </Route>
    </Routes>
  );
}

export default App;
