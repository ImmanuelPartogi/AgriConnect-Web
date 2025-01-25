import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Users from './pages/user/Users';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Berita from './pages/berita/Berita';
import Edukasi from './pages/edukasi/Edukasi';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Authentikasi/Login/Login';
import Register from './pages/Authentikasi/Register/Register';
import TambahUser from './pages/user/TambahUser';
import DetailUser from './pages/user/DetailUser';
import EditUser from './pages/user/EditUser';
import TambahBerita from './pages/berita/TambahBerita';
import DetailBerita from './pages/berita/DetailBerita';
import EditBerita from './pages/berita/EditBerita';
import TambahEdukasi from './pages/edukasi/TambahEdukasi';
import DetailEdukasi from './pages/edukasi/DetailEdukasi';
import EditEdukasi from './pages/edukasi/EditEdukasi';
import PrivateRoute from './components/PrivateRoute';
import Profile from './pages/profil/Profile';
import Settings from './pages/pengaturan/Settings';
import EditProfile from './pages/profil/EditProfile';
import EditSetting from './pages/pengaturan/EditSetting';
import Produk from './pages/produk/Produk';
import DetailProduk from './pages/produk/DetailProduk';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [refreshProfileKey, setRefreshProfileKey] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    // Check if the token exists and has not expired
    if (token && tokenExpiry && new Date().getTime() < tokenExpiry) {
      setIsAuthenticated(true);
      setRole(localStorage.getItem('role'));
    } else {
      // If token is expired or not valid, redirect to login
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('tokenExpiry');
    }
  }, []);

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setRole(role);
    const token = 'your-token-here';
    const tokenExpiry = new Date().getTime() + (60 * 60 * 1000); // Token expires in 1 hour
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('tokenExpiry', tokenExpiry.toString());

    if (role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole('');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('tokenExpiry');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleProfileUpdated = () => {
    setRefreshProfileKey((prev) => prev + 1);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="flex flex-col h-screen">
        {isAuthenticated && role === 'admin' && (
          <Navbar
            setIsAuthenticated={setIsAuthenticated}
            toggleSidebar={toggleSidebar}
            handleLogout={handleLogout}
            refreshProfile={refreshProfileKey}
          />
        )}
        <div className="flex flex-1 relative">
          {isAuthenticated && role === 'admin' && (
            <Sidebar
              isOpen={isSidebarOpen}
              setIsAuthenticated={setIsAuthenticated}
              toggleSidebar={toggleSidebar}
              handleLogout={handleLogout}
            />
          )}
          <div className="flex-1 z-0">
            <Routes>
              <Route
                path="/login"
                element={<Login
                  setIsAuthenticated={setIsAuthenticated}
                  setRole={setRole}
                  onLogin={handleLogin} />} />
              <Route path="/register" element={<Register/>} />
              <Route
                path="/"
                element={<PrivateRoute
                  element={<Dashboard />}
                  isAuthenticated={isAuthenticated}
                  role={role} requiredRole="admin" />} />
              <Route
                path="/admin-dashboard"
                element={<PrivateRoute
                  element={<Dashboard />}
                  isAuthenticated={isAuthenticated}
                  role={role} requiredRole="admin" />} />
              <Route
                path="/users"
                element={<PrivateRoute
                  element={<Users />}
                  isAuthenticated={isAuthenticated}
                  role={role} requiredRole="admin" />} />
              <Route
                path="/users/tambah"
                element={<PrivateRoute
                  element={<TambahUser />}
                  isAuthenticated={isAuthenticated}
                  role={role} requiredRole="admin" />} />
              <Route
                path="/users/detail/:id"
                element={<PrivateRoute
                  element={<DetailUser />}
                  isAuthenticated={isAuthenticated}
                  role={role} requiredRole="admin" />} />
              <Route
                path="/users/edit/:id"
                element={<PrivateRoute
                  element={<EditUser />}
                  isAuthenticated={isAuthenticated}
                  role={role} requiredRole="admin" />} />
              <Route
                path="/berita"
                element={<PrivateRoute
                  element={<Berita />}
                  isAuthenticated={isAuthenticated}
                  role={role} requiredRole="admin" />} />
              <Route
                path="/berita/tambah"
                element={<PrivateRoute
                  element={<TambahBerita />}
                  isAuthenticated={isAuthenticated}
                  role={role} requiredRole="admin" />} />
              <Route
                path="/berita/detail/:id"
                element={<PrivateRoute
                  element={<DetailBerita />}
                  isAuthenticated={isAuthenticated}
                  role={role} requiredRole="admin" />} />
              <Route
                path="/berita/edit/:id"
                element={<PrivateRoute
                  element={<EditBerita />}
                  isAuthenticated={isAuthenticated}
                  role={role} requiredRole="admin" />} />
              <Route
                path="/edukasi"
                element={<PrivateRoute
                  element={<Edukasi />}
                  isAuthenticated={isAuthenticated}
                  role={role} requiredRole="admin" />} />
              <Route
                path="/edukasi/tambah"
                element={<PrivateRoute
                  element={<TambahEdukasi />}
                  isAuthenticated={isAuthenticated}
                  role={role} requiredRole="admin" />} />
              <Route
                path="/edukasi/detail/:id"
                element={<PrivateRoute
                  element={<DetailEdukasi />}
                  isAuthenticated={isAuthenticated}
                  role={role} requiredRole="admin" />} />
              <Route
                path="/edukasi/edit/:id"
                element={<PrivateRoute
                  element={<EditEdukasi />}
                  isAuthenticated={isAuthenticated}
                  role={role} requiredRole="admin" />} />
              <Route
                path="/produk"
                element={<PrivateRoute
                  element={<Produk />}
                  isAuthenticated={isAuthenticated}
                  role={role} requiredRole="admin" />} />
              <Route
                path="/produk/detail/:id"
                element={<PrivateRoute
                  element={<DetailProduk />}
                  isAuthenticated={isAuthenticated}
                  role={role} requiredRole="admin" />} />
              <Route
                path="/profil"
                element={
                  <PrivateRoute
                    element={<Profile />}
                    isAuthenticated={isAuthenticated}
                    role={role}
                    requiredRole="admin" />} />
              <Route
                path="/edit-profile"
                element={
                  <PrivateRoute
                    element={<EditProfile onProfileUpdated={handleProfileUpdated} />}
                    isAuthenticated={isAuthenticated}
                    role={role}
                    requiredRole="admin"
                  />
                }
              />
              <Route
                path="/pengaturan"
                element={<PrivateRoute
                  element={<Settings />}
                  isAuthenticated={isAuthenticated}
                  role={role} requiredRole="admin" />} />
              <Route path="/edit-pengaturan"
                element={<PrivateRoute
                  element={<EditSetting />}
                  isAuthenticated={isAuthenticated}
                  role={role} requiredRole="admin" />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
