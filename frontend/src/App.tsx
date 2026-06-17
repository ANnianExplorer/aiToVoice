import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
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
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppLayout />}>
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
      </Route>
    </Routes>
  );
}

export default App;
