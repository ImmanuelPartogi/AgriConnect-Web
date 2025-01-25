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

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPenggunaData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Token tidak ditemukan');

                const decodedToken = jwtDecode(token);
                const userId = decodedToken.id;

                const response = await fetch(`/api/pengguna/${userId}`, {
                    method: 'GET',
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

    // Menghandle perubahan input
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

        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;

            const bodyData = { ...penggunaData };
            if (!penggunaData.kata_sandi) {
                delete bodyData.kata_sandi; // Jangan kirim kata_sandi jika kosong
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

            alert('Akun berhasil diperbarui');
            navigate('/pengaturan');
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
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6 flex justify-center">
            <div className="bg-white shadow-xl rounded-lg w-full max-w-2xl p-8 space-y-6">
                <h1 className="text-2xl font-semibold text-gray-800 flex flex-col items-center">Pengaturan</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm text-gray-500">Nama Lengkap</label>
                        <input
                            type="text"
                            name="nama"
                            value={penggunaData.nama}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={penggunaData.email}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500">Pengalaman</label>
                        <input
                            type="text"
                            name="pengalaman"
                            value={penggunaData.pengalaman}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500">Tentang</label>
                        <textarea
                            name="tentang"
                            value={penggunaData.tentang}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500">Alamat</label>
                        <input
                            type="text"
                            name="alamat"
                            value={penggunaData.alamat}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500">Jenis Kelamin</label>
                        <select
                            name="jenis_kelamin"
                            value={penggunaData.jenis_kelamin}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500">Pekerjaan</label>
                        <input
                            type="text"
                            name="pekerjaan"
                            value={penggunaData.pekerjaan}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500">No HP</label>
                        <input
                            type="text"
                            name="no_hp"
                            value={penggunaData.no_hp}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500">Kata Sandi</label>
                        <input
                            type="password"
                            name="kata_sandi"
                            value={penggunaData.kata_sandi}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditSetting;
