import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';

const TambahUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    experience: '',
    about: '',
    address: '',
    gender: '',
    job: '',
    phone: '',
    password: '',
    role: 'petani',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama: formData.name,
          email: formData.email,
          pengalaman: formData.experience,
          tentang: formData.about,
          alamat: formData.address,
          jenis_kelamin: formData.gender,
          pekerjaan: formData.job,
          no_hp: formData.phone,
          kata_sandi: formData.password,
          peran: formData.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Pengguna berhasil ditambahkan');
        navigate('/users');
      } else {
        toast.error(data.message || 'Gagal menambahkan pengguna');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menambahkan pengguna');
      console.error('Error adding user:', error);
    }
  };

  const handleBack = () => {
    navigate('/users');
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gradient-to-br from-gray-50 to-green-50 min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full bg-white border rounded-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Tambah Pengguna</h1>
          <p className="text-gray-500">Isi formulir di bawah ini untuk menambahkan pengguna baru.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Masukkan email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">No. HP</label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="phone"
                  placeholder="Masukkan nomor handphone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Pengalaman</label>
            <textarea
              name="experience"
              placeholder="Masukkan pengalaman"
              value={formData.experience}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Tentang</label>
            <textarea
              name="about"
              placeholder="Masukkan tentang diri Anda"
              value={formData.about}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Alamat</label>
            <textarea
              name="address"
              placeholder="Masukkan alamat"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Jenis Kelamin</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
                <option value="other">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Pekerjaan</label>
              <input
                type="text"
                name="job"
                placeholder="Masukkan pekerjaan"
                value={formData.job}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              onClick={handleBack}
              className="flex-1 px-6 py-3 bg-white text-black rounded-lg hover:bg-green-50 hover:text-green-600 border focus:outline-none focus:ring-2 focus:ring-green-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center"
            >
              Kembali
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center"
            >
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahUser;
