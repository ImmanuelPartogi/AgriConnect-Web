import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function DetailBlog() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/blog/${id}`);
                const data = await response.json();
                setBlog(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching blog:", error);
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="text-xl font-semibold">Loading...</span>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="text-xl font-semibold text-red-600">Blog tidak ditemukan.</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                    src={blog.gambar ? `http://localhost:4000${blog.gambar}` : '/default-placeholder.png'}
                    alt={blog.judul || 'Blog'}
                    className="w-full h-72 object-cover"
                />
                <div className="p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-3">{blog.judul}</h1>
                    <span className="text-sm text-gray-500 mb-4 inline-block">{blog.kategori}</span>
                    <p className="text-gray-700 text-lg mb-6">{blog.konten}</p>
                    <div className="mt-4 border-t pt-4">
                        <p className="text-sm text-gray-500">
                            Ditulis oleh <span className="font-semibold">{blog.nama || 'Pengguna Tidak Dikenal'}</span> pada{' '}
                            {new Date(blog.dibuat_pada).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailBlog;
