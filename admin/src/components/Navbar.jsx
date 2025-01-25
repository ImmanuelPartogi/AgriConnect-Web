import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Navbar = ({ toggleSidebar, handleLogout, refreshProfile }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch('/api/profil', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data.data);
        } else {
          console.error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      }
    };

    fetchProfileData();
  }, [refreshProfile]);

  const handleLogoClick = () => {
    navigate('/admin-dashboard');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/profil');
    closeDropdown();
  };

  const handleSettingsClick = () => {
    navigate('/pengaturan');
    closeDropdown();
  };

  const handleLogoutClick = () => {
    handleLogout();
    closeDropdown();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        profileRef.current && !profileRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="h-16 bg-white text-black flex justify-between items-center p-4 border-b sm:px-10">
      <div className="flex items-center gap-2">
        <img
          className="w-36 sm:w-40 cursor-pointer"
          src={assets.admin_logo}
          alt="Admin Logo"
          onClick={handleLogoClick}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={profileRef}>
          <div
            className="flex items-center gap-2 cursor-pointer relative"
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
            <span className="hidden sm:inline-block ml-2 text-sm font-medium text-black">
              {profile?.nama?.split(' ').slice(0, 2).join(' ') || 'User'}
            </span>
          </div>

          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-full right-0 mt-2 bg-white border rounded-lg shadow-md w-48 z-10 max-h-60 overflow-auto block p-1 space-y-1.5 text-sm text-gray-700"
            >
              <ul>
                <li
                  className="py-2 px-4 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleProfileClick}
                >
                  <FaUser className="w-5 h-5 text-blue-500" />
                  Profil
                </li>
                <li
                  className="py-2 px-4 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleSettingsClick}
                >
                  <FaCog className="w-5 h-5 text-green-500" />
                  Pengaturan
                </li>
                <li
                  className="py-2 px-4 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogoutClick}
                >
                  <FaSignOutAlt className="w-5 h-5 text-red-500" />
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        <button
          className="text-xl text-gray-600 sm:hidden"
          onClick={toggleSidebar}
        >
          ☰
        </button>
      </div>
    </div>
  );
};

export default Navbar;
