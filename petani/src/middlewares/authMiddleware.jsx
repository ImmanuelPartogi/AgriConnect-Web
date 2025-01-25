import { toast } from 'react-toastify';

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    // Jika respons tidak ok (status bukan 200-299)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Terjadi kesalahan pada server' }));
      
      if (response.status === 401) {
        // Token tidak valid atau kadaluarsa
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem("userid");
        toast.error('Sesi habis, silakan login kembali.');
        window.location.href = '/';
      } else {
        toast.error(`Error: ${errorData.message || 'Terjadi kesalahan pada server'}`);
        throw new Error(errorData.message);
      }
    }

    // Mengambil data JSON dari respons
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch Error:', error);
    toast.error('Gagal mengambil data. Coba lagi nanti.');
    return { success: false, message: error.message };
  }
};
