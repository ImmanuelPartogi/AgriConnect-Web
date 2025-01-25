import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaExclamationCircle, FaPaperPlane, FaArrowLeft, FaEllipsisV, FaTrash, FaSearch, FaClock, FaCheck, FaCheckDouble
} from "react-icons/fa";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUserId = useRef(localStorage.getItem("userid"));
  const messageContainerRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      const response = await fetch("http://localhost:4000/api/chat/pengguna/chat", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (userId) => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/chat/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch messages");

      const data = await response.json();
      setChatMessages(data);
      setSelectedUser(userId);
      if (window.innerWidth <= 768) {
        setIsMobileView(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/chat/kirim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          penerima_id: selectedUser,
          pengirim_id: currentUserId.current,
          pesan: newMessage,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setNewMessage("");
      await fetchMessages(selectedUser);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/chat/${messageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("You can only delete your own messages");

      setChatMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchUsers();

    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [fetchUsers]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, scrollToBottom]);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMessageStatus = (message) => {
    const isSent = true; // Replace with actual message status
    const isDelivered = true; // Replace with actual message status
    const isRead = false; // Replace with actual message status

    return (
      <span className="text-xs">
        {isRead ? (
          <FaCheckDouble className="w-4 h-4" />
        ) : isDelivered ? (
          <FaCheck className="w-4 h-4" />
        ) : isSent ? (
          <FaCheck className="w-4 h-4" />
        ) : null}
      </span>
    );
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 ${isMobileView && selectedUser ? "hidden" : "w-full md:w-96"
          }`}
      >
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
          <div className="mt-4 relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="search"
              placeholder="Search contacts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-140px)]">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="p-4 border-b border-gray-100 animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-full" />
                <div className="h-4 w-32 bg-gray-200 rounded mt-2" />
              </div>
            ))
          ) : error ? (
            <div className="m-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
              <FaExclamationCircle className="h-4 w-4 mr-2" />
              <p>{error}</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => fetchMessages(user.id)}
                className={`flex items-center p-4 cursor-pointer transition-colors ${selectedUser === user.id
                    ? "bg-green-50 border-l-4 border-green-500"
                    : "hover:bg-gray-50 border-l-4 border-transparent"
                  }`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {user.nama[0].toUpperCase()}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-medium text-gray-900">{user.nama}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {user.lastMessage || "Mulai Percakapan"}
                  </p>
                </div>
                {user.unreadCount > 0 && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {user.unreadCount}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!selectedUser && !isMobileView ? "hidden md:flex" : "flex"}`}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                {isMobileView && (
                  <button
                    onClick={() => {
                      setIsMobileView(false);
                      setSelectedUser(null);
                    }}
                    className="mr-4 p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FaArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white">
                  {users.find((u) => u.id === selectedUser)?.nama[0].toUpperCase()}
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">
                    {users.find((u) => u.id === selectedUser)?.nama}
                  </h3>
                  {/* <p className="text-sm text-gray-500">Active now</p> */}
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={messageContainerRef}
              className="flex-1 overflow-y-auto bg-gray-50 p-6"
            >
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"} mb-4`}>
                    <div className="h-16 w-64 bg-gray-200 rounded-2xl animate-pulse" />
                  </div>
                ))
              ) : error ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
                  <FaExclamationCircle className="h-4 w-4 mr-2" />
                  <p>{error}</p>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto space-y-4">
                  {chatMessages.map((msg, index) => {
                    const isSender = String(msg.pengirim_id) === String(currentUserId.current);
                    return (
                      <div
                        key={index}
                        className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[70%] group relative ${isSender ? "ml-12" : "mr-12"}`}>
                          <div
                            className={`p-4 rounded-2xl shadow-sm ${isSender
                                ? "bg-green-500 text-white"
                                : "bg-white text-gray-800"
                              }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.pesan}</p>
                            <div className={`flex items-center justify-end mt-1 space-x-2 ${isSender ? "text-green-100" : "text-gray-400"
                              } text-xs`}>
                              <FaClock className="w-3 h-3" />
                              <span>{formatTime(msg.dibuat_pada)}</span>
                              {isSender && renderMessageStatus(msg)}
                            </div>
                          </div>

                          {isSender && (
                            <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                className="p-2 hover:bg-gray-100 rounded-full"
                                onClick={() => handleDeleteMessage(msg.id)}
                              >
                                <FaTrash className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="bg-white border-t border-gray-200 p-4">
              <div className="max-w-3xl mx-auto flex items-center space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isSending}
                />
                <button
                  type="submit"
                  className={`p-3 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${isSending || !newMessage.trim() ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  disabled={isSending || !newMessage.trim()}
                >
                  <FaPaperPlane className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center min-h-screen bg-gray-50 md:flex hidden">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Welcome to Messages
              </h3>
              <p className="text-gray-500">
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;