import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

/**
 * Beranda Page
 *
 * This page renders the main landing page of the application.
 *
 * @returns {JSX.Element} The rendered page.
 */

function Beranda() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/kategori")
      .then((response) => response.json())
      .then((data) => {
        // console.log("Category data:", data); // Add this line
        setCategories(data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const navigate = useNavigate();
  const handleRegister = () => navigate(`/register`);

  return (
    <div>
      <div className="font-sans">
        {/* Banner */}
        <section className="bg-primary pt-5 rounded-lg px-6 max-w-screen-xl my-4 md:my-12 mx-4 md:mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 px-6 md:px-12 lg:px-20">
            {/* ================= Left Side ================= */}
            <div className="md:w-1/2 flex flex-col items-start gap-6">
              <p className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight">
                Terhubung dengan Petani Ahli <br /> Tingkatkan Pertanian Anda
              </p>

              <div className="flex flex-col md:flex-row items-center gap-4 text-white text-ms font-light">
                <p>
                  Jelajahi jaringan petani berpengalaman, <br className="hidden sm:block" />
                  dapatkan saran ahli, dan temukan sumber daya untuk meningkatkan pengalaman bertani Anda.
                </p>
              </div>

              <button
                onClick={handleRegister}
                className="flex items-center gap-2 bg-white px-6 py-3 rounded-full text-gray-600 text-sm hover:scale-105 transition-all duration-300"
              >
                Mulai Pertanian Anda
              </button>
            </div>

            {/* ================= Right Side (Image) ================= */}
            <div className="md:w-1/2 flex justify-center items-center">
              <img
                className="w-full max-w-md h-auto rounded-lg"
                src={assets.petani}
                alt="Petani Sedang Bekerja"
              />
            </div>
          </div>
        </section>


        {/* Edukasi Section */}
        <section className="flex flex-col items-center gap-6 my-16 md:pb-8 text-gray-800">
          <div className="text-center">
            <h1 className="text-3xl font-medium">
              Edukasi Pertanian
            </h1>
            <p className="mt-4 text-lg text-gray-800">
              Temukan wawasan menarik untuk mendukung kesuksesan Anda.
            </p>
          </div>
          <div className="flex sm:justify-center gap-6 pt-5 w-full overflow-x-auto sm:overflow-x-hidden">
            {categories.length > 0 ? (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
                  onClick={() => navigate(`/edukasi?kategori=${category.id}`)}
                >
                  <img
                    src={`http://localhost:4000/uploads/${category.gambar}`}
                    alt={`Kategori: ${category.nama}`}
                    className="w-20 h-20 sm:w-20 rounded-full object-cover mx-4"
                  />
                  <p className="text-center mt-2 leading-relaxed text-sm">{category.nama}</p>
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-600">
                Loading categories...
              </p>
            )}
          </div>
        </section>

        {/* Keunggulan Platform */}
        <section className="py-24 relative overflow-hidden bg-gradient-to-b from-green-50 via-white to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-green-800 mb-4">
                Keunggulan Platform
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Mengapa memilih kami? Kami menghadirkan solusi terbaik untuk
                pertanian Anda dengan teknologi inovatif yang teruji.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
              {[
                {
                  icon: "🌱",
                  title: "Dukungan Petani",
                  desc: "Membantu petani memanfaatkan teknologi modern untuk mengoptimalkan hasil panen dan efisiensi operasional.",
                },
                {
                  icon: "📈",
                  title: "Meningkatkan Produktivitas",
                  desc: "Menghubungkan petani dengan pasar baru dan peluang bisnis untuk pertumbuhan yang berkelanjutan.",
                },
                {
                  icon: "🤝",
                  title: "Komunitas yang Terhubung",
                  desc: "Menciptakan ruang kolaborasi interaktif untuk berbagi wawasan, pengalaman, dan praktik terbaik.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Kolaborasi dan Mitra */}
        <section className="flex flex-col items-center gap-4 py-16 text-gray-800">
          <div className="text-center">
            <h1 className="text-3xl font-medium">
              Kolaborasi dan Mitra Kami
            </h1>
            <p className="mt-4 text-lg text-gray-800">
              Kami bekerja sama dengan berbagai pihak untuk menghadirkan solusi
              terbaik bagi petani.
            </p>
          </div>
          <div className="flex sm:justify-center gap-4 pt-5 w-full overflow-x-auto sm:overflow-x-hidden">
            {[assets.facebookLogo, assets.googleLogo, assets.kemenkesLogo, assets.kementerianPertanianLogo, assets.tutLogo].map((logo, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
              >
                <img
                  src={logo}
                  alt={`Mitra ${index + 1}`}
                  className="w-14 h-14 sm:w-14 rounded-full object-cover mx-4"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Tentang Kami */}
        <section className="py-24 bg-gradient-to-b from-green-50 via-white to-green-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center gap-16">
            {/* Bagian Teks */}
            <div className="lg:w-1/2">
              <h2 className="text-5xl font-extrabold text-green-800 mb-6">
                Tentang Kami
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Kami adalah platform digital yang dirancang untuk membantu petani Indonesia
                mengakses teknologi, pasar, dan komunitas. Dengan semangat keberlanjutan,
                kami berkomitmen untuk menciptakan ekosistem pertanian yang lebih modern dan inklusif.
              </p>
              <ul className="space-y-6">
                {[
                  {
                    title: "Misi Kami",
                    desc: "Memberdayakan petani melalui teknologi canggih dan koneksi pasar global.",
                  },
                  {
                    title: "Visi Kami",
                    desc: "Membangun ekosistem pertanian digital yang inklusif dan berkelanjutan.",
                  },
                  {
                    title: "Nilai-Nilai Kami",
                    desc: "Mengutamakan inovasi, keberlanjutan, dan kolaborasi yang berarti.",
                  },
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-green-100 text-green-800 rounded-full mr-4 text-lg font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-green-800 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bagian Visual */}
            <div className="lg:w-1/2 relative">
              <div className="rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <img
                  src={assets.IlmuPertanian}
                  alt="Tentang Kami"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full opacity-20 blur-2xl" />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default Beranda;
