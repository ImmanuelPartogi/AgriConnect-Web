import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSpinner, FaChevronLeft, FaEdit, FaClock, FaCalendarAlt } from 'react-icons/fa';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Initial state with empty fields for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    peran: '',
    pengalaman: '',
    tentang: '',
    alamat: '',
    jenis_kelamin: '',
    pekerjaan: '',
    no_hp: '',
    kata_sandi: '',  // Menambahkan field kata_sandi
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data when component is mounted
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Anda perlu login terlebih dahulu');
          navigate('/login'); // Redirect to login if no token
          return;
        }

        const response = await fetch(`http://localhost:4000/api/pengguna/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Gagal mengambil data pengguna');
        }

        const data = await response.json();
        if (data.success) {
          setFormData({
            name: data.data.nama,
            email: data.data.email,
            peran: data.data.peran,
            pengalaman: data.data.pengalaman || '',
            tentang: data.data.tentang || '',
            alamat: data.data.alamat || '',
            jenis_kelamin: data.data.jenis_kelamin || '',
            pekerjaan: data.data.pekerjaan || '',
            no_hp: data.data.no_hp || '',
            kata_sandi: '',  // Initial kosong untuk kata_sandi
          });
        } else {
          toast.error('Pengguna tidak ditemukan');
          navigate('/users');
        }
      } catch (error) {
        toast.error('Terjadi kesalahan saat mengambil data pengguna');
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [id, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submit to update user data
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Menangani nilai null untuk peran, jika peran tidak dipilih, set default value
    const peranToSend = formData.peran ? formData.peran : null;  // Kirim null jika tidak ada peran yang dipilih

    try {
      const response = await fetch(`http://localhost:4000/api/pengguna/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          nama: formData.name,
          email: formData.email,
          kata_sandi: formData.kata_sandi,
          pengalaman: formData.pengalaman,
          tentang: formData.tentang,
          alamat: formData.alamat,
          jenis_kelamin: formData.jenis_kelamin,
          pekerjaan: formData.pekerjaan,
          no_hp: formData.no_hp,
          peran: peranToSend,  // Pastikan peran tidak null
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Pengguna berhasil diperbarui');
        navigate('/users');
      } else {
        toast.error(data.message || 'Gagal memperbarui pengguna');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat memperbarui pengguna');
      console.error('Error updating user:', error);
    }
  };


  const handleBack = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmBack = () => {
    setIsModalOpen(false);
    navigate('/users');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between border-b pb-4 border-gray-300">
          <button
                onClick={handleBack}
                className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-green-600 transition duration-200"
              >
                <FaChevronLeft className="w-4 h-4 mr-1" />
                Kembali
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Edit Profil Pengguna</h1>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Pribadi</h2>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="no_hp" className="block text-sm font-medium text-gray-700">
                        Nomor Telepon
                      </label>
                      <input
                        type="text"
                        id="no_hp"
                        name="no_hp"
                        value={formData.no_hp}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information Section */}
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Profesional</h2>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="peran" className="block text-sm font-medium text-gray-700">
                        Peran
                      </label>
                      <select
                        id="peran"
                        name="peran"
                        value={formData.peran || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Pilih Peran</option>
                        <option value="petani">Petani</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="pekerjaan" className="block text-sm font-medium text-gray-700">
                        Pekerjaan
                      </label>
                      <input
                        type="text"
                        id="pekerjaan"
                        name="pekerjaan"
                        value={formData.pekerjaan}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="pengalaman" className="block text-sm font-medium text-gray-700">
                        Pengalaman
                      </label>
                      <input
                        type="text"
                        id="pengalaman"
                        name="pengalaman"
                        value={formData.pengalaman}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Tambahan</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="tentang" className="block text-sm font-medium text-gray-700">
                    Tentang
                  </label>
                  <textarea
                    id="tentang"
                    name="tentang"
                    value={formData.tentang}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">
                    Alamat
                  </label>
                  <textarea
                    id="alamat"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    rows="2"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="kata_sandi" className="block text-sm font-medium text-gray-700">
                    Kata Sandi Baru (opsional)
                  </label>
                  <input
                    type="password"
                    id="kata_sandi"
                    name="kata_sandi"
                    value={formData.kata_sandi}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 p-6">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 px-6 py-3 bg-white text-black rounded-lg hover:bg-green-50 hover:text-green-600 border focus:outline-none focus:ring-2 focus:ring-green-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg p-8 max-w-sm mx-auto relative z-50">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Konfirmasi</h3>
            <p className="text-gray-600 mb-6">
              Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin keluar?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmBack}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditUser;
