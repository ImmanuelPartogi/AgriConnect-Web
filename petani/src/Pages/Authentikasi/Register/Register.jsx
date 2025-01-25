import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs before sending to API
    if (!name || !email || !password) {
      setErrorMessage('Nama, Email, dan Password harus diisi');
      return;
    }

    setIsLoading(true); // Start loading
    try {
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama: name,
          email,
          kata_sandi: password,
          peran: 'petani', // Default role
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setErrorMessage(data.message || 'Registrasi gagal');
      }
    } catch (error) {
      setErrorMessage('Terjadi kesalahan saat registrasi');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-green-50 overflow-hidden">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Daftar Akun</h2>
        {errorMessage && (
          <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
        )}
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setErrorMessage('')} // Reset error on focus
            />
          </div>
          <div>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setErrorMessage('')} // Reset error on focus
            />
          </div>
          <div>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setErrorMessage('')} // Reset error on focus
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              disabled={isLoading} // Disable button during loading
            >
              {isLoading ? 'Loading...' : 'Daftar'}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Sudah memiliki akun?{' '}
            <a href="/login" className="text-green-600 font-semibold hover:text-green-700">
              Masuk disini
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
