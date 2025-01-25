import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPen, FaPlus, FaThumbsUp, FaComment, FaMapMarkerAlt, FaBox, FaTag } from "react-icons/fa";
import KomentarModal from "../../Modal/KomentarModal";

function Pasar() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [sarans, setSarans] = useState([]);
  const [profil, setProfil] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [commentsCount, setCommentsCount] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [likeCounts, setLikeCounts] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = "http://localhost:4000";
  const API_ENDPOINTS = {
    produk: `${API_BASE_URL}/api/produk`,
    saran: `${API_BASE_URL}/api/pengguna/petani/saran`,
    profil: `${API_BASE_URL}/api/profil`,
    suka: `${API_BASE_URL}/api/suka`,
    komentar: (id) => `${API_BASE_URL}/api/produk-komentar/${id}/count`,
    count: (id) => `${API_BASE_URL}/api/suka/count/${id}`,
  };

  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token tidak ditemukan");
    }

    const finalOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, finalOptions);
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Gagal mengambil data (HTTP ${response.status})`);
    }
    return await response.json();
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate('/login');
          return;
        }

        const profilResponse = await fetchWithAuth(API_ENDPOINTS.profil);
        setProfil(profilResponse.data);

        const [postsData, saransData] = await Promise.all([
          fetchWithAuth(API_ENDPOINTS.produk),
          fetchWithAuth(API_ENDPOINTS.saran),
        ]);

        setPosts(postsData);
        setSarans(saransData);

        await fetchLikeData(postsData);
        await fetchCommentsCounts(postsData); // Pastikan ini dipanggil setelah postsData di-set
      } catch (error) {
        console.error("Error fetching initial data:", error);
        alert(`Terjadi kesalahan: ${error.message}. Silakan refresh halaman atau login kembali.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [navigate]);

  useEffect(() => {
    if (posts.length > 0) {
      fetchCommentsCounts(posts);
      fetchLikeData(posts);
    }
  }, [posts, profil]);

  const fetchCommentsCounts = async (postsData) => {
    const counts = {};
    await Promise.all(
      postsData.map(async (post) => {
        try {
          const response = await fetch(API_ENDPOINTS.komentar(post.id), {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch comments count for post ${post.id}`);
          }

          const data = await response.json();
          console.log(`Comments count for post ${post.id}:`, data); // Log data dari API
          counts[post.id] = data.total_comments || 0; // Ambil total_comments dari respons
        } catch (error) {
          console.error(`Error fetching comments count for post ${post.id}:`, error);
          counts[post.id] = 0; // Jika ada error, set ke 0
        }
      })
    );
    setCommentsCount(counts);
  };

  const handleCommentClick = (postId) => {
    console.log(`Opening comments modal for post ID: ${postId}`);
    console.log(`Current comment count: ${commentsCount[postId]}`);
    setCurrentPostId(postId);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (profil) {
      fetchLikeData(posts);
    }
  }, [profil, posts]); // Tambahkan profil sebagai dependensi// Menambahkan posts sebagai dependensi

  const fetchLikeData = async (postsData) => {
    const token = localStorage.getItem("token");
    if (!token || !profil?.pengguna_id) return;

    try {
      const likeCheckResponse = await fetch(`${API_ENDPOINTS.suka}/${profil.pengguna_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const likedData = await likeCheckResponse.json();
      const likedMapping = {};
      likedData.data.forEach(like => {
        likedMapping[like.produk_id] = true;
      });
      setLikedPosts(likedMapping);

      const likeCountsData = await Promise.all(
        postsData.map(post => fetchWithAuth(API_ENDPOINTS.count(post.id)))
      );

      const newLikeCounts = {};
      likeCountsData.forEach((data, index) => {
        newLikeCounts[postsData[index].id] = data.total || 0;
      });
      setLikeCounts(newLikeCounts);

    } catch (error) {
      console.error("Error fetching like data:", error);
    }
  };

  const handleLikeClick = async (postId) => {
    if (!profil || !profil.pengguna_id) {
      alert('Data profil tidak tersedia. Silakan login kembali.');
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert('Silakan login terlebih dahulu');
      return;
    }

    try {
      const likeCheckResponse = await fetch(`${API_ENDPOINTS.suka}/${profil.pengguna_id}/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const likeCheckData = await likeCheckResponse.json();
      const isCurrentlyLiked = likeCheckData.data.length > 0;

      const method = isCurrentlyLiked ? 'DELETE' : 'POST';

      await fetch(API_ENDPOINTS.suka, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          penggunaId: profil.pengguna_id,
          produkId: postId
        }),
      });

      setLikedPosts(prev => ({
        ...prev,
        [postId]: !isCurrentlyLiked,
      }));

      const likeCountResponse = await fetch(API_ENDPOINTS.count(postId), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const likeCountData = await likeCountResponse.json();
      setLikeCounts(prev => ({
        ...prev,
        [postId]: likeCountData.total || 0,
      }));

    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Gagal memperbarui suka: ' + error.message);
    }
  };

  const PostImage = ({ images, nama }) => {
    if (Array.isArray(images)) {
      return (
        <div className="grid grid-cols-2 gap-3 mt-3">
          {images.map((image, idx) => (
            <img key={idx} src={image} alt={`Image ${idx + 1}`} className="w-full rounded-lg" />
          ))}
        </div>
      );
    }

    if (images) {
      return (
        <img
          src={`${API_BASE_URL}${images}`}
          alt={nama}
          className="w-full rounded-lg mt-3"
        />
      );
    }

    return null;
  };

  const UserAvatar = ({ image, name, onClick }) => (
    <img
      src={image ? `${API_BASE_URL}${image}` : "/assets/banner.png"}
      alt={name || "Anonymous"}
      className="w-10 h-10 rounded-full mr-3 cursor-pointer"
      onClick={onClick}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <main className="flex-1">
            {/* Create Post Button */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={profil?.gambar ? `${API_BASE_URL}${profil.gambar}` : "/assets/banner.png"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-green-100"
                />
                <button
                  onClick={() => navigate("/tambah-produk")}
                  className="bg-green-100 hover:bg-green-200 text-green-600 px-4 py-2 rounded-full flex-1 text-left transition duration-200"
                >
                  Apa yang ingin Anda jual hari ini?
                </button>
              </div>
              <button
                onClick={() => navigate("/tambah-produk")}
                className="ml-4 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition duration-200"
              >
                <FaPlus className="w-5 h-5" />
              </button>
            </div>

            {/* Posts Feed */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : Array.isArray(posts) && posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Post Header */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center">
                        <img
                          src={post.pengguna_gambar ? `${API_BASE_URL}${post.pengguna_gambar}` : "/assets/banner.png"}
                          alt={post.pengguna_nama}
                          className="w-12 h-12 rounded-full border-2 border-gray-100 cursor-pointer hover:border-green-500 transition duration-200"
                          onClick={() => navigate(`/detail-pasar/${post.pengguna_id}`)}
                        />
                        <div className="ml-3">
                          <h3
                            className="font-semibold text-gray-900 hover:text-green-600 cursor-pointer transition duration-200"
                            onClick={() => navigate(`/detail-pasar/${post.pengguna_id}`)}
                          >
                            {post.pengguna_nama || "Pengguna"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(post.dibuat_pada).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="p-4">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.nama}</h2>
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <FaTag className="mr-2 text-blue-500" />
                          <span className="font-medium">
                            Rp {parseInt(post.harga).toLocaleString('id-ID')}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaMapMarkerAlt className="mr-2 text-blue-500" />
                          <span>{post.lokasi || "Tidak diketahui"}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaBox className="mr-2 text-blue-500" />
                          <span>Stok: {post.stok || "Habis"}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <span className="px-2 py-1 bg-green-100 rounded-full text-xs">
                            {post.kategori_nama || "Uncategorized"}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">
                        {expandedPosts[post.id]
                          ? post.deskripsi
                          : `${post.deskripsi?.slice(0, 150)}${post.deskripsi?.length > 150 ? '...' : ''}`
                        }
                        {post.deskripsi?.length > 150 && (
                          <button
                            onClick={() => setExpandedPosts(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                            className="text-green-600 hover:text-green-700 ml-2 font-medium transition duration-200"
                          >
                            {expandedPosts[post.id] ? "Baca Lebih Sedikit" : "Baca Selengkapnya"}
                          </button>
                        )}
                      </p>

                      {/* Post Image */}
                      {post.gambar && (
                        <img
                          src={post.gambar ? `${API_BASE_URL}${post.gambar}` : "/assets/banner.png"}
                          alt={post.nama}
                          className="w-full h-[400px] object-cover rounded-lg"
                        />
                      )}
                    </div>

                    {/* Post Actions */}
                    <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                      <button
                        onClick={() => handleLikeClick(post.id)}
                        className={`flex items-center px-4 py-2 rounded-full transition duration-200 ${likedPosts[post.id]
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        <FaThumbsUp className={`mr-2 ${likedPosts[post.id] ? 'text-blue-600' : 'text-gray-500'}`} />
                        <span className="font-medium">{likeCounts[post.id] || 0}</span>
                      </button>

                      <button
                        onClick={() => handleCommentClick(post.id)}
                        className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full transition duration-200"
                      >
                        <FaComment className="mr-2 text-green-500" />
                        <span className="font-medium">{commentsCount[post.id] || 0}</span>
                      </button>
                    </div>

                    {isModalOpen && currentPostId === post.id && (
                      <KomentarModal
                        postId={post.id}
                        onClose={() => {
                          setIsModalOpen(false);
                          setCurrentPostId(null);
                        }}
                      />
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">Tidak ada produk tersedia</p>
              </div>
            )}
          </main>

          {/* Sidebar already styled in previous response */}
          <aside className="w-96 bg-white rounded-lg shadow-sm lg:block hidden sticky top-6 h-fit">
            <div className="p-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-xl font-semibold text-gray-900">Saran Pengguna</h2>
              </div>

              <div className="space-y-4 mt-6">
                {Array.isArray(sarans) && sarans.length > 0 ? (
                  sarans.map((saran) => (
                    <div
                      key={saran.pengguna_id}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 cursor-pointer"
                      onClick={() => navigate(`/detail-pasar/${saran.pengguna_id}`)}
                    >
                      <img
                        src={saran.profil_gambar ? `${API_BASE_URL}${saran.profil_gambar}` : "/assets/banner.png"}
                        alt={saran.pengguna_nama}
                        className="w-10 h-10 rounded-full border-2 border-gray-100"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900 hover:text-green-600 transition duration-200">
                          {saran.pengguna_nama || "Pengguna"}
                        </h3>
                        {saran.profil_nama && (
                          <p className="text-sm text-gray-500">{saran.profil_nama}</p>
                        )}
                      </div>  
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">Tidak ada saran yang tersedia</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Pasar; 