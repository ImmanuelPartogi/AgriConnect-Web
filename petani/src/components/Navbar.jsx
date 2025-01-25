import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { FaUser, FaCog, FaSignOutAlt, FaComments } from "react-icons/fa";

const Navbar = ({ toggleSidebar, handleLogout, isAuthenticated, role }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // Track the current route

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch("/api/profil", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data.data);
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };

    if (isAuthenticated) {
      fetchProfileData();
    }
  }, [isAuthenticated]);

  // Function to toggle dropdown visibility
  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  // Helper function to check if a route is active
  const isActive = (path) => location.pathname === path;

  const handleLogoutClick = () => {
    localStorage.clear();
    handleLogout();
    setIsDropdownOpen(false);
    navigate("/");
  };


  return (
    <div className="h-16 bg-white text-black flex justify-between items-center px-4 border-b sm:px-10 fixed top-0 left-0 w-full z-50">
      <div className="flex items-center gap-4">
        {!isAuthenticated && (
          <img
            className="w-36 sm:w-40 cursor-pointer"
            src={assets.admin_logo}
            alt="Logo"
            onClick={() => navigate("/")}
          />
        )}
        {isAuthenticated && (
          <img
            className="w-36 sm:w-40 cursor-pointer"
            src={assets.admin_logo}
            alt="Logo"
            onClick={() => navigate("/pasar")}
          />
        )}
      </div>

      <div className="hidden md:flex gap-8">
        {/* BERANDA Button (Only visible when not authenticated) */}
        {!isAuthenticated && (
          <div className="flex flex-col items-center">
            <button
              className={`text-sm font-medium py-2 px-4 rounded-lg transition-all duration-300 ${isActive("/") ? "text-green-900" : "hover:bg-green-100"}`}
              onClick={() => navigate("/")}
            >
              BERANDA
            </button>
            {isActive("/") && (
              <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto" />
            )}
          </div>
        )}

        {/* PASAR Button (Only visible when authenticated) */}
        {isAuthenticated && (
          <div className="flex flex-col items-center">
            <button
              className={`text-sm font-medium py-2 px-4 rounded-lg transition-all duration-300 ${isActive("/pasar") ? "text-green-900" : "hover:bg-green-100"}`}
              onClick={() => handleNavigation("/pasar")}
            >
              PASAR
            </button>
            {isActive("/pasar") && (
              <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto" />
            )}
          </div>
        )}

        {/* BLOG Button
        <div className="flex flex-col items-center">
          <button
            className={`text-sm font-medium py-2 px-4 rounded-lg transition-all duration-300 ${isActive("/blog") ? "text-green-900" : "hover:bg-green-100"}`}
            onClick={() => handleNavigation("/blog")}
          >
            BLOG
          </button>
          {isActive("/blog") && (
            <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto" />
          )}
        </div> */}

        {/* BERITA Button */}
        <div className="flex flex-col items-center">
          <button
            className={`text-sm font-medium py-2 px-4 rounded-lg transition-all duration-300 ${isActive("/berita") ? "text-green-900" : "hover:bg-green-100"}`}
            onClick={() => handleNavigation("/berita")}
          >
            BERITA
          </button>
          {isActive("/berita") && (
            <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto" />
          )}
        </div>

        {/* EDUKASI Button */}
        <div className="flex flex-col items-center">
          <button
            className={`text-sm font-medium py-2 px-4 rounded-lg transition-all duration-300 ${isActive("/edukasi") ? "text-green-900" : "hover:bg-green-100"}`}
            onClick={() => handleNavigation("/edukasi")}
          >
            EDUKASI
          </button>
          {isActive("/edukasi") && (
            <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto" />
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="gap-10">
          {isAuthenticated && (
            <button
              className="flex items-center justify-center p-3 hover:bg-green-100 rounded-full transition duration-300"
              onClick={() => handleNavigation("/chat")}
            >
              <FaComments className="text-green-900 text-xl" />
            </button>
          )}
        </div>

        {isAuthenticated ? (
          role === "petani" && (
            <div className="flex items-center gap-4">
              <div className="relative" ref={profileRef}>
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <img
                    className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
                    src={`http://localhost:4000${profile?.gambar || assets.upload_area}`}
                    onError={(e) => {
                      e.target.src = assets.upload_area;
                    }}
                    alt="Profile"
                  />
                  <span className="hidden sm:inline-block text-sm font-medium text-black">
                    {profile?.nama?.split(" ").slice(0, 2).join(" ") || "User"}
                  </span>
                </div>

                {isDropdownOpen && (
                  <DropdownMenu
                    ref={dropdownRef}
                    handleNavigation={handleNavigation}
                    handleLogout={handleLogoutClick}
                  />
                )}
              </div>
            </div>
          )
        ) : (
          <button
            className="px-4 py-2 bg-login text-white hover:bg-green-600 rounded-full font-light"
            onClick={() => navigate("/login")}
          >
            Masuk
          </button>
        )}

        {/* Always show the sidebar toggle button */}
        <button
          className="text-2xl text-gray-600 md:hidden"
          onClick={toggleSidebar}
        >
          ☰
        </button>
      </div>
    </div>
  );
};

const DropdownMenu = React.forwardRef(
  ({ handleNavigation, handleLogout }, ref) => (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-2 bg-white border rounded-lg shadow-md w-48 z-10"
    >
      <ul className="py-1 text-sm text-gray-700">
        <li
          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => handleNavigation("/profil")}
        >
          <FaUser className="text-blue-500" />
          Profil
        </li>
        <li
          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => handleNavigation("/pengaturan")}
        >
          <FaCog className="text-green-500" />
          Pengaturan
        </li>
        <li
          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="text-red-500" />
          Logout
        </li>
      </ul>
    </div>
  )
);

export default Navbar;
