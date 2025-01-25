import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaComment, FaMapMarkerAlt, FaLeaf, FaStore } from "react-icons/fa";

function DetailPasar() {
  const { userId } = useParams();
  const [profil, setProfil] = useState(null);
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token tidak ditemukan.");

        const profileResponse = await fetch(
          `http://localhost:4000/api/profil/pasar/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!profileResponse.ok)
          throw new Error("Gagal mengambil data profil.");
        const profileData = await profileResponse.json();
        setProfil(profileData);

        const produkResponse = await fetch(
          `http://localhost:4000/api/produk/produkPetani/all/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!produkResponse.ok) throw new Error("Gagal mengambil data produk.");
        const produkData = await produkResponse.json();
        setProduk(Array.isArray(produkData) ? produkData : [produkData]);
      } catch (error) {
        setError(error.message);
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleChatClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const currentUserId = localStorage.getItem("userid");
      if (!token) throw new Error("Token tidak ditemukan.");

      const response = await fetch("http://localhost:4000/api/chat/kirim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pengirim_id: currentUserId,
          penerima_id: userId,
          pesan: "Halo, saya ingin mengobrol!",
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengirim pesan.");
      }

      navigate(`/chat/${userId}`);
    } catch (error) {
      console.error("Error sending message:", error);
      setError(error.message);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="container mx-auto p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {profil ? (
          <>
            <div className="relative">
              <div className="h-48 bg-gradient-to-r from-green-400 to-green-600"></div>
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <img
                  src={
                    profil.gambar
                      ? `http://localhost:4000${profil.gambar}`
                      : "/assets/default-profile.png"
                  }
                  alt={profil.nama || "User"}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              </div>
            </div>

            <div className="mt-20 text-center px-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {profil.nama || "Nama Tidak Ditemukan"}
              </h1>
              
              <div className="flex items-center justify-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-green-500" />
                  <span>{profil.lokasi || "Tidak Diketahui"}</span>
                </div>
                <div className="flex items-center">
                  <FaLeaf className="mr-2 text-green-500" />
                  <span>{profil.metode_pertanian || "Metode Pertanian tidak tersedia"}</span>
                </div>
              </div>

              {Number(localStorage.getItem("userid")) !== Number(userId) && (
                <button
                  onClick={handleChatClick}
                  className="inline-flex items-center px-6 py-3 bg-green-500 text-white font-semibold rounded-full shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  <FaComment className="mr-2" />
                  Kirim Pesan
                </button>
              )}
            </div>

            <div className="mt-12 px-6 pb-8">
              <div className="flex items-center mb-6">
                <FaStore className="text-2xl text-green-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Produk Pengguna</h2>
              </div>
              
              {produk && produk.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {produk.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="relative h-48">
                        <img
                          src={
                            item.gambar
                              ? `http://localhost:4000${item.gambar}`
                              : "/assets/placeholder.jpg"
                          }
                          alt={item.nama || "Produk"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {item.nama || "Produk"}
                        </h3>
                        <p className="text-lg font-bold text-green-600 mb-2">
                          {item.harga
                            ? `Rp ${parseInt(item.harga).toLocaleString('id-ID')}`
                            : "Harga tidak tersedia"}
                        </p>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {item.deskripsi || "Deskripsi tidak tersedia"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FaStore className="mx-auto text-4xl text-gray-400 mb-4" />
                  <p className="text-gray-500 text-lg">Belum ada produk tersedia.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Profil pengguna tidak ditemukan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DetailPasar;