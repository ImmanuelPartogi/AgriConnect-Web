import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTimesCircle } from 'react-icons/fa';

const EditProduk = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [produk, setProduk] = useState({
        nama: '',
        deskripsi: '',
        harga: '',
        stok: '',
        lokasi: '',
        kategori_id: '',
        imageUrl: '',
    });
    const [kategoriList, setKategoriList] = useState([]);
    const [file, setFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch product by ID
    useEffect(() => {
        const fetchProdukById = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('Token tidak ditemukan');
                    return;
                }

                const response = await fetch(`http://localhost:4000/api/produk/produkPetani/${id}`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();

                    // Fetch category details based on kategori_id
                    const categoryResponse = await fetch(`http://localhost:4000/api/kategori/${data.kategori_id}`);
                    const categoryData = await categoryResponse.json();

                    setProduk({
                        nama: data.nama,
                        deskripsi: data.deskripsi,
                        harga: data.harga,
                        stok: data.stok,
                        lokasi: data.lokasi,
                        kategori_id: data.kategori_id, // Keep the kategori_id
                        kategori_name: categoryData.nama, // Add the category name
                        imageUrl: data.gambar ? `http://localhost:4000${data.gambar}` : '',
                    });
                } else {
                    const errorData = await response.json();
                    toast.error(errorData.message || 'Gagal memuat data produk');
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                toast.error('Terjadi kesalahan saat memuat produk');
            }
        };

        fetchProdukById();
    }, [id]);

    // Fetch categories
    useEffect(() => {
        const fetchKategori = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/kategori');
                if (response.ok) {
                    const data = await response.json();
                    setKategoriList(data);
                } else {
                    toast.error('Gagal mengambil kategori');
                }
            } catch (err) {
                toast.error('Terjadi kesalahan saat mengambil kategori');
            }
        };

        fetchKategori();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Token tidak ditemukan');
                setLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append('nama', produk.nama);
            formData.append('deskripsi', produk.deskripsi);
            formData.append('harga', parseFloat(produk.harga));
            formData.append('stok', parseInt(produk.stok, 10));
            formData.append('lokasi', produk.lokasi);
            formData.append('kategori_id', produk.kategori_id); // Use 'kategori_id' to match backend

            if (file) {
                formData.append('gambar', file); // New image
            } else if (produk.imageUrl) {
                formData.append('gambar', produk.imageUrl); // Keep the old image if no new file
            }

            const response = await fetch(`http://localhost:4000/api/produk/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                toast.success('Produk berhasil diperbarui');
                navigate(`/detail-produk/${id}`);
            } else {
                const result = await response.json();
                toast.error(result.message || 'Gagal menyimpan perubahan');
            }
        } catch (err) {
            toast.error('Terjadi kesalahan saat menyimpan produk');
        } finally {
            setLoading(false);
        }
    };

    // Handle file change
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 2 * 1024 * 1024) {
                toast.error('Ukuran file tidak boleh lebih dari 2MB');
                return;
            }
            setFile(selectedFile);
            setPreviewImage(URL.createObjectURL(selectedFile));
        }
    };

    // Handle removing image
    const handleRemoveImage = () => {
        setFile(null);
        setPreviewImage(null);
    };

    if (loading) return <p className="text-center">Memuat...</p>;

    return (
        <div className="p-6 bg-white h-full w-full max-w-4xl mx-auto">
            <div className="p-8 bg-white rounded-lg shadow-md">
                <div className="text-center pb-4">
                    <h1 className="text-2xl font-semibold text-gray-800">Edit Produk</h1>
                </div>

                {/* Image Preview */}
                <div className="items-center pb-6">
                    {(previewImage || produk.imageUrl) && (
                        <div className="mb-6 relative">
                            <img
                                src={previewImage || produk.imageUrl}
                                alt="Preview Gambar Produk"
                                className="object-cover h-auto max-h-80 max-w-full rounded-md shadow-md mx-auto"
                            />
                        </div>
                    )}

                    {/* Button to Remove Image */}
                    {previewImage && (
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="px-4 text-red-500 hover:text-red-700 font-semibold rounded-lg flex items-center gap-2"
                            >
                                <FaTimesCircle size={20} />
                                Hapus Perubahan
                            </button>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="nama" className="block text-gray-700 font-medium mb-2">
                            Nama Produk
                        </label>
                        <input
                            type="text"
                            id="nama"
                            value={produk.nama}
                            onChange={(e) => setProduk({ ...produk, nama: e.target.value })}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow placeholder-gray-400"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="deskripsi" className="block text-gray-700 font-medium mb-2">
                            Deskripsi Produk
                        </label>
                        <textarea
                            id="deskripsi"
                            value={produk.deskripsi}
                            onChange={(e) => setProduk({ ...produk, deskripsi: e.target.value })}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow placeholder-gray-400"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="harga" className="block text-gray-700 font-medium mb-2">
                            Harga Produk
                        </label>
                        <input
                            type="number"
                            id="harga"
                            value={produk.harga}
                            onChange={(e) => setProduk({ ...produk, harga: e.target.value })}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow placeholder-gray-400"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="stok" className="block text-gray-700 font-medium mb-2">
                            Stok Produk
                        </label>
                        <input
                            type="number"
                            id="stok"
                            value={produk.stok}
                            onChange={(e) => setProduk({ ...produk, stok: e.target.value })}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow placeholder-gray-400"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="lokasi" className="block text-gray-700 font-medium mb-2">
                            Lokasi Produk
                        </label>
                        <input
                            type="text"
                            id="lokasi"
                            value={produk.lokasi}
                            onChange={(e) => setProduk({ ...produk, lokasi: e.target.value })}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow placeholder-gray-400"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="kategori_id" className="block text-gray-700 font-medium mb-2">
                            Kategori Produk
                        </label>
                        <select
                            id="kategori_id"
                            value={produk.kategori_id}
                            onChange={(e) => setProduk({ ...produk, kategori_id: e.target.value })}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow placeholder-gray-400"
                            required
                        >
                            {kategoriList.map((kategori) => (
                                <option key={kategori.id} value={kategori.id}>
                                    {kategori.nama}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="gambar" className="block text-gray-700 font-medium mb-2">
                            Gambar Produk
                        </label>
                        <input
                            type="file"
                            id="gambar"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow placeholder-gray-400"
                        />
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            disabled={loading}
                        >
                            {loading ? 'Memperbarui...' : 'Perbarui Produk'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduk;
