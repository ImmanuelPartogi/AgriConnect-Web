import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const EditSetting = () => {
    const [penggunaData, setPenggunaData] = useState({
        nama: '',
        email: '',
        pengalaman: '',
        tentang: '',
        alamat: '',
        jenis_kelamin: '',
        pekerjaan: '',
        no_hp: '',
        kata_sandi: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isFetching, setIsFetching] = useState(true);
    const [success, setSuccess] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPenggunaData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Token tidak ditemukan');

                const decodedToken = jwtDecode(token);
                const userId = decodedToken.id;

                const response = await fetch(`/api/pengguna/${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const result = await response.json();
                    throw new Error(result.message || 'Gagal memuat data pengguna');
                }

                const data = await response.json();
                setPenggunaData({
                    nama: data.data?.nama || '',
                    email: data.data?.email || '',
                    pengalaman: data.data?.pengalaman || '',
                    tentang: data.data?.tentang || '',
                    alamat: data.data?.alamat || '',
                    jenis_kelamin: data.data?.jenis_kelamin || '',
                    pekerjaan: data.data?.pekerjaan || '',
                    no_hp: data.data?.no_hp || '',
                    kata_sandi: '',
                });
            } catch (err) {
                console.error(err);
                setError(err.message || 'Gagal memuat data pengguna');
            } finally {
                setIsFetching(false);
            }
        };

        fetchPenggunaData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPenggunaData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;

            const bodyData = { ...penggunaData };
            if (!penggunaData.kata_sandi) {
                delete bodyData.kata_sandi;
            }

            const response = await fetch(`/api/pengguna/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bodyData),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || 'Gagal memperbarui data pengguna');
            }

            setSuccess(true);
            setTimeout(() => navigate('/pengaturan'), 2000);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Gagal memperbarui data pengguna');
        } finally {
            setLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="px-6 py-8 border-2 border-gray-200">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                        Pengaturan Profil
                    </h2>
                    <p className="text-center text-gray-600 mb-8">
                        Perbarui informasi profil dan pengaturan akun Anda
                    </p>

                    {error && (
                        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg border border-green-200">
                            Profil berhasil diperbarui! Mengalihkan...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    name="nama"
                                    value={penggunaData.nama}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={penggunaData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    No HP
                                </label>
                                <input
                                    type="text"
                                    name="no_hp"
                                    value={penggunaData.no_hp}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jenis Kelamin
                                </label>
                                <select
                                    name="jenis_kelamin"
                                    value={penggunaData.jenis_kelamin}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Pilih jenis kelamin</option>
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pekerjaan
                                </label>
                                <input
                                    type="text"
                                    name="pekerjaan"
                                    value={penggunaData.pekerjaan}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pengalaman
                                </label>
                                <input
                                    type="text"
                                    name="pengalaman"
                                    value={penggunaData.pengalaman}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Alamat
                            </label>
                            <textarea
                                name="alamat"
                                value={penggunaData.alamat}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tentang
                            </label>
                            <textarea
                                name="tentang"
                                value={penggunaData.tentang}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kata Sandi Baru (Kosongkan jika tidak ingin mengubah)
                            </label>
                            <input
                                type="password"
                                name="kata_sandi"
                                value={penggunaData.kata_sandi}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex justify-end space-x-4 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate('/pengaturan')}
                                disabled={loading}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Memperbarui...
                                    </div>
                                ) : (
                                    'Simpan Perubahan'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditSetting;