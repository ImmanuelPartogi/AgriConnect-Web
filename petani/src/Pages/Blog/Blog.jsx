import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetching all blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:4000/api/blog");
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        setPosts(data); // Save all posts in state
        setFilteredPosts(data); // Initialize filtered posts
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Handle search filter locally
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredPosts(posts); // If search term is empty, show all posts
    } else {
      const filtered = posts.filter((post) =>
        post.judul.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered); // Update filtered posts
    }
  }, [searchTerm, posts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full h-full py-10 bg-gray-100">
      <div className="w-full max-w-7xl px-5">
        <input
          type="text"
          placeholder="Cari Blog..."
          className="p-3 mb-5 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm
        />

        {/* Blog Posts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg flex flex-col hover:transform hover:-translate-y-1 transition-transform duration-300"
              onClick={() => navigate(`/blog/${post.id}`)}
            >
              <img
                src={
                  post?.gambar
                    ? `http://localhost:4000${post.gambar}`
                    : "/default-placeholder.png"
                }
                alt={post.judul || "Blog Post"}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = "/default-placeholder.png"; // Handle image loading errors
                }}
              />
              <div className="p-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {post.judul}
                </h3>
                <p className="text-sm text-gray-600">
                  {post.konten && post.konten.split(" ").length > 10
                    ? `${post.konten.split(" ").slice(0, 10).join(" ")}...`
                    : post.konten}
                </p>
              </div>
              {/* Section for Category and Date */}
              <div className="flex justify-between items-center p-4 bg-gray-100 mt-auto">
                <div className="text-sm text-gray-500">{post.kategori}</div>
                <p className="text-sm text-gray-500">
                  {new Date(post.dibuat_pada).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
