import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimesCircle, FaCamera, FaUser, FaMapMarkerAlt, FaLeaf, FaBox, FaInfo } from "react-icons/fa";
import { assets } from "../../assets/assets";

function EditProfile({ onProfileUpdated }) {
  const [profileData, setProfileData] = useState({
    nama: "",
    lokasi: "",
    metode_pertanian: "",
    produk_ditawarkan: "",
    bio: "",
    imageUrl: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token is missing.");
          return;
        }

        const response = await fetch("/api/profil", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        setProfileData({
          ...data.data,
          imageUrl: data.data.imageUrl || "",
        });
      } catch (error) {
        setError(error.message || "An unexpected error occurred.");
      }
    };

    fetchProfileData();
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData(prev => ({
        ...prev,
        image: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setProfileData(prev => ({
      ...prev,
      image: null,
    }));
    setPreviewImage(null);
    document.getElementById("gambar").value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return alert("Please login first");
    }

    const formData = new FormData();
    Object.keys(profileData).forEach(key => {
      if (key === 'image' && profileData[key]) {
        formData.append("gambar", profileData[key]);
      } else if (key !== 'image' && key !== 'imageUrl') {
        formData.append(key, profileData[key]);
      }
    });

    try {
      const response = await fetch("/api/profil", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Profile updated successfully");
        if (onProfileUpdated) onProfileUpdated();
        navigate("/profil");
      } else {
        const result = await response.json();
        setError(result.message || "Failed to update profile");
      }
    } catch (error) {
      setError("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-green-600 to-green-400">
            <h1 className="absolute bottom-6 left-8 text-2xl font-bold text-white">
              Edit Profile
            </h1>
          </div>

          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Image Upload Section */}
              <div className="flex-shrink-0 w-full lg:w-auto">
                <div className="relative group">
                  <div className="relative w-48 h-48 mx-auto">
                    <img
                      src={previewImage || `http://localhost:4000${profileData?.gambar || assets.upload_area}`}
                      alt="Profile Preview"
                      className="w-full h-full rounded-2xl object-cover shadow-lg"
                      onError={(e) => { e.target.src = assets.upload_area; }}
                    />
                    <label
                      htmlFor="gambar"
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl cursor-pointer"
                    >
                      <FaCamera className="text-white text-3xl" />
                    </label>
                  </div>

                  {previewImage && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="mt-4 w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 transition-colors duration-300"
                    >
                      <FaTimesCircle />
                      <span>Remove Image</span>
                    </button>
                  )}

                  <input
                    type="file"
                    id="gambar"
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>

              {/* Form Section */}
              <form onSubmit={handleSubmit} className="flex-1 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="nama"
                      value={profileData.nama || ""}
                      onChange={handleInputChange}
                      placeholder="Nama Lengkap"
                      className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="lokasi"
                      value={profileData.lokasi || ""}
                      onChange={handleInputChange}
                      placeholder="Lokasi"
                      className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLeaf className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="metode_pertanian"
                      value={profileData.metode_pertanian || ""}
                      onChange={handleInputChange}
                      placeholder="Metode Pertanian"
                      className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBox className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="produk_ditawarkan"
                      value={profileData.produk_ditawarkan || ""}
                      onChange={handleInputChange}
                      placeholder="Produk Ditawarkan"
                      className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <FaInfo className="text-gray-400" />
                    </div>
                    <textarea
                      name="bio"
                      value={profileData.bio || ""}
                      onChange={handleInputChange}
                      placeholder="Bio"
                      rows="4"
                      className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/profil")}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;