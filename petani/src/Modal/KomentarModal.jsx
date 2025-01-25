import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaEllipsisV, FaEdit, FaTrash, FaTimes } from 'react-icons/fa'; // Add FaTimes for close icon
import { assets } from '../assets/assets';

Modal.setAppElement('#root');

function KomentarModal({ postId, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    if (postId) {
      setIsOpen(true);
      const fetchComments = async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/produk-komentar/${postId}`);
          if (!response.ok) throw new Error("Failed to fetch comments");
          const data = await response.json();
          setComments(data);
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      };

      fetchComments();
      const intervalId = setInterval(fetchComments, 5000);
      return () => clearInterval(intervalId);
    }
  }, [postId]);

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeDropdown]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const pengguna_id = localStorage.getItem("userid");
      if (!pengguna_id) throw new Error("User ID not found in localStorage.");

      const response = await fetch(`http://localhost:4000/api/produk-komentar/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          produk_id: postId,
          pengguna_id: pengguna_id,
          konten: newComment,
        }),
      });

      if (!response.ok) throw new Error("Failed to post comment");
      const data = await response.json();
      setNewComment("");
      setComments((prevComments) => [...prevComments, data]);
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleEdit = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/produk-komentar/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ konten: editContent }),
      });

      if (!response.ok) throw new Error("Failed to edit comment");

      setComments(comments.map(comment =>
        comment.id === commentId ? { ...comment, konten: editContent } : comment
      ));
      setEditingComment(null);
      setEditContent("");
      setActiveDropdown(null);
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/produk-komentar/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete comment");

      setComments(comments.filter(comment => comment.id !== commentId));
      setActiveDropdown(null);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} contentLabel="Komentar" className="modal">
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-lg w-full relative">
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FaTimes className="text-2xl" />
          </button>


          <div className="mt-4 max-h-60 overflow-y-auto space-y-4">
            {comments.length > 0 ? (
              comments.map((comment, index) => {
                const currentUserId = Number(localStorage.getItem("userid"));
                const isUserComment = Number(comment.pengguna_id) === currentUserId;

                return (
                  <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={comment.pengguna_gambar ? `http://localhost:4000${comment.pengguna_gambar}` : assets.upload_area}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <p className="text-gray-700 font-medium">{comment.pengguna_nama}</p>
                      </div>

                      {isUserComment && (
                        <div className="relative dropdown-container">
                          <button
                            className="p-2 text-gray-500 hover:bg-gray-200 rounded-full"
                            onClick={() => setActiveDropdown(activeDropdown === comment.id ? null : comment.id)}
                          >
                            <FaEllipsisV />
                          </button>

                          {activeDropdown === comment.id && (
                            <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                              <button
                                onClick={() => {
                                  setEditingComment(comment.id);
                                  setEditContent(comment.konten);
                                  setActiveDropdown(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-green-700 hover:bg-green-50 hover:text-green-600"
                              >
                                <FaEdit className="mr-2" /> Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
                                    handleDelete(comment.id);
                                  }
                                }}
                                className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50"
                              >
                                <FaTrash className="mr-2" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {editingComment === comment.id ? (
                      <div className="mt-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                          rows="3"
                        />
                        <div className="mt-2 flex space-x-2">
                          <button
                            onClick={() => handleEdit(comment.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Simpan
                          </button>
                          <button
                            onClick={() => {
                              setEditingComment(null);
                              setEditContent("");
                            }}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-gray-600">{comment.konten}</p>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">Tidak ada komentar untuk ditampilkan.</p>
            )}
          </div>

          <form onSubmit={handleCommentSubmit} className="space-y-4 mt-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tambah komentar..."
              rows="4"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            />
            <div className='flex justify-end'>
              <button
                type="submit"
                className="py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transform hover:scale-105 transition duration-300 ease-in-out shadow-lg"
              >
                Kirim
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}

export default KomentarModal;
