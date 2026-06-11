import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import AppLayout from './components/Layout/AppLayout';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/*"
        element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;
