import { Routes, Route, useNavigate, useLocation } from "react-router-dom"; // import useLocation
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import PrivateRoute from "./components/PrivateRoute";
import Beranda from "./Pages/Beranda/Beranda";
import Login from "./Pages/Authentikasi/Login/Login";
import Register from "./Pages/Authentikasi/Register/Register";
import Berita from "./Pages/Berita/Berita";
import Pasar from "./Pages/Pasar/Pasar";
import Blog from "./Pages/Blog/Blog";
import Profile from "./Pages/Profile/Profile";
import EditProfile from "./Pages/Profile/EditProfile";
import Settings from "./Pages/pengaturan/Settings";
import EditSetting from "./Pages/pengaturan/EditSetting";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import TambahProduk from "./Pages/Profile/TambahProduk";
import DetailProduk from "./Pages/Profile/DetailProduk";
import EditProduk from "./Pages/Profile/EditProduk";
import DetailBlog from "./Pages/Blog/DetailBlog";
import DetailBerita from "./Pages/Berita/DetailBerita";
import Edukasi from "./Pages/Edukasi/Edukasi";
import DetailEdukasi from "./Pages/Edukasi/DetailEdukasi";
import Chat from "./Pages/Chat/Chat";
import DetailPasar from "./Pages/Pasar/DetailPasar";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [refreshProfileKey, setRefreshProfileKey] = useState(0);

  const location = useLocation(); // Get current location

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("/api/validate-token", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            localStorage.removeItem("token"); // Hapus token jika tidak valid
            window.location.reload(); // Arahkan kembali ke halaman login
          }
        } catch (err) {
          console.error("Token validation failed", err);
        }
      }
    };
    validateToken();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Validasi token ke backend jika diperlukan
      setIsAuthenticated(true);
      setRole(localStorage.getItem('role'));
    }
  }, []);


  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setRole(role);
    localStorage.setItem("token", "your-token-here");
    localStorage.setItem("role", role);

    navigate(role === "petani" ? "/pasar" : "/");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole("");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleProfileUpdated = () => {
    setRefreshProfileKey((prev) => prev + 1);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <div className="flex flex-col h-screen">
        <Navbar
          isAuthenticated={isAuthenticated}
          role={role}
          toggleSidebar={toggleSidebar}
          handleLogout={handleLogout}
        />
        <div className="flex flex-1 pt-16">
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            handleLogout={handleLogout}
          />
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route
                path="/"
                element={isAuthenticated ? <Pasar /> : <Beranda />}
              />
              <Route
                path="/login"
                element={
                  <Login
                    setIsAuthenticated={setIsAuthenticated}
                    setRole={setRole}
                    onLogin={handleLogin}
                  />
                }
              />
              <Route path="/register" element={<Register />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<DetailBlog />} />
              <Route
                path="/pasar"
                element={
                  <PrivateRoute
                    isAuthenticated={isAuthenticated}
                    role={role}
                    requiredRole="petani"
                  >
                    <Pasar />
                  </PrivateRoute>
                }
              />
              <Route
                path="/detail-pasar/:userId"
                element={
                  <PrivateRoute
                    isAuthenticated={isAuthenticated}
                    role={role}
                    requiredRole="petani"
                  >
                    <DetailPasar />
                  </PrivateRoute>
                }
              />
              <Route path="/berita" element={<Berita />} />
              <Route path="/berita/:id" element={<DetailBerita />} />
              <Route path="/edukasi" element={<Edukasi />} />
              <Route path="/edukasi/:id" element={<DetailEdukasi />} />
              <Route
                path="/chat"
                element={
                  <PrivateRoute
                    isAuthenticated={isAuthenticated}
                    role={role}
                    requiredRole="petani"
                  >
                    <Chat />
                  </PrivateRoute>
                }
              />
              <Route
                path="/chat/:userId"
                element={
                  <PrivateRoute
                    isAuthenticated={isAuthenticated}
                    role={role}
                    requiredRole="petani"
                  >
                    <Chat />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profil"
                element={
                  <PrivateRoute
                    isAuthenticated={isAuthenticated}
                    role={role}
                    requiredRole="petani"
                  >
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/edit-profile"
                element={
                  <PrivateRoute
                    isAuthenticated={isAuthenticated}
                    role={role}
                    requiredRole="petani"
                  >
                    <EditProfile onProfileUpdated={handleProfileUpdated} />
                  </PrivateRoute>
                }
              />
              <Route path="/profil/:id" element={<Profile />} />
              <Route
                path="/tambah-produk"
                element={
                  <PrivateRoute
                    isAuthenticated={isAuthenticated}
                    role={role}
                    requiredRole="petani"
                  >
                    <TambahProduk />
                  </PrivateRoute>
                }
              />
              <Route
                path="/detail-produk/:id"
                element={
                  <PrivateRoute
                    isAuthenticated={isAuthenticated}
                    role={role}
                    requiredRole="petani"
                  >
                    <DetailProduk />
                  </PrivateRoute>
                }
              />
              <Route
                path="/edit-produk/:id"
                element={
                  <PrivateRoute
                    isAuthenticated={isAuthenticated}
                    role={role}
                    requiredRole="petani"
                  >
                    <EditProduk />
                  </PrivateRoute>
                }
              />
              <Route
                path="/pengaturan"
                element={
                  <PrivateRoute
                    isAuthenticated={isAuthenticated}
                    role={role}
                    requiredRole="petani"
                  >
                    <Settings />
                  </PrivateRoute>
                }
              />
              <Route
                path="/edit-pengaturan"
                element={
                  <PrivateRoute
                    isAuthenticated={isAuthenticated}
                    role={role}
                    requiredRole="petani"
                  >
                    <EditSetting />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </div>
        {/* Sembunyikan Footer jika berada di /login atau /register */}
        {location.pathname !== "/login" &&
          location.pathname !== "/register" &&
          !isAuthenticated && ( // Add this condition to hide the footer when logged in
            <Footer
              isAuthenticated={isAuthenticated}
              role={role}
              toggleSidebar={toggleSidebar}
              handleLogout={handleLogout}
            />
          )}
      </div>
    </>
  );
}

export default App;
