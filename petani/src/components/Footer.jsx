import React from "react";
import { useNavigate } from "react-router-dom";
import { FaDiscord, FaInstagram, FaFacebook } from "react-icons/fa";

const Footer = ({ isOpen, toggleSidebar, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-r from-[#2A4D21] to-[#1A3B16] text-white py-16 px-8">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Logo & Description */}
        <div className="lg:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left">
          <img
            src="/assets/logos.png"
            alt="Logo"
            className="w-[50%] lg:w-[40%] h-auto mb-4 transition-transform transform hover:scale-105 duration-300"
          />
          <p className="text-white opacity-90 max-w-md mx-auto lg:mx-0">
            Meningkatkan sektor pertanian dengan inovasi teknologi untuk
            mendukung petani dan masa depan berkelanjutan. Kami berkomitmen
            memberikan solusi tepat guna, memperkenalkan teknologi terbaru, dan
            memastikan keberlanjutan pembangunan pertanian.
          </p>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-1 flex flex-col items-center lg:items-start space-y-6 text-center lg:text-left">
          <h4 className="text-xl font-semibold text-[#FFC107] uppercase tracking-wide">
            Akses Cepat
          </h4>
          <ul className="space-y-4 text-base font-light">
            <li>
              <button
                className="hover:text-[#FFC107] cursor-pointer transition-transform transform hover:translate-x-2 duration-300"
                onClick={() => navigate("/")}
              >
                Beranda
              </button>
            </li>
            <li>
              <button
                className="hover:text-[#FFC107] cursor-pointer transition-transform transform hover:translate-x-2 duration-300"
                onClick={() => navigate("/blog")}
              >
                Blog
              </button>
            </li>
            <li>
              <button
                className="hover:text-[#FFC107] cursor-pointer transition-transform transform hover:translate-x-2 duration-300"
                onClick={() => navigate("/berita")}
              >
                Berita
              </button>
            </li>
            <li>
              <button
                className="hover:text-[#FFC107] cursor-pointer transition-transform transform hover:translate-x-2 duration-300"
                onClick={() => navigate("/edukasi")}
              >
                Edukasi
              </button>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="lg:col-span-1 flex flex-col items-center lg:items-start space-y-6 text-center lg:text-left">
          <h4 className="text-xl font-semibold text-[#FFC107] uppercase tracking-wide">
            Ikuti Kami
          </h4>
          <div className="flex space-x-6 justify-center lg:justify-start">
            <a
              href="https://discord.com"
              className="text-white hover:text-[#FFC107] transition-transform transform hover:scale-125 duration-300"
              aria-label="Discord"
            >
              <FaDiscord size={24} />
            </a>
            <a
              href="https://www.instagram.com"
              className="text-white hover:text-[#FFC107] transition-transform transform hover:scale-125 duration-300"
              aria-label="Instagram"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://www.facebook.com"
              className="text-white hover:text-[#FFC107] transition-transform transform hover:scale-125 duration-300"
              aria-label="Facebook"
            >
              <FaFacebook size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-12 border-t pt-6 border-white opacity-60">
        <p className="text-sm">
          &copy; 2024 Semua Hak Dilindungi. Semua hak cipta dilindungi oleh hukum
          yang berlaku.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
