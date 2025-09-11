import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/header/Header";
import {
  PlusOutlined,
  EyeOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error(err);
      setMessage("Bloglar yüklenemedi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Tarih formatlama yardımcı fonksiyonu
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("tr-TR", options);
  };

  // İçerik kısaltma fonksiyonu
  const truncateContent = (content, maxLength = 120) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + "...";
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  return (
    <>
      <Header />

      <section className="relative bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-24 px-6 text-center overflow-hidden rounded-b-3xl shadow-lg mb-16">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-soft-light"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-soft-light"></div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            Fikirlerinizle Dünyayı{" "}
            <span className="text-yellow-300">Değiştirin</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 opacity-90">
            Farklı kategorilerdeki blog yazılarını keşfedin, ilham alın, okuyun
            ve kendi hikayenizi paylaşın.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() =>
                document
                  .getElementById("blog-list")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-all transform hover:-translate-y-1"
            >
              Blogları Keşfet
            </button>
            <button
              onClick={() => navigate("/blog-add-page")}
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-indigo-600 transition-all"
            >
              Blog Yaz
            </button>
          </div>
        </div>
      </section>

      <div
        id="blog-list"
        className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Son Eklenen Bloglar
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Topluluğumuzun paylaştığı en güncel ve ilham verici yazıları
              keşfedin.
            </p>
          </div>

          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
                <EyeOutlined className="text-3xl text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Henüz blog yok
              </h3>
              <p className="text-gray-600 mb-6">
                İlk blogu eklemek ister misiniz?
              </p>
              <button
                onClick={() => navigate("/blog-add-page")}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                İlk Blogu Ekle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-gray-100 hover:border-indigo-100 group cursor-pointer"
                  onClick={() => navigate(`/blog/${blog._id}`)}
                >
                  {blog.image ? (
                    <div className="relative overflow-hidden aspect-square">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {blog.category}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full aspect-square bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {blog.title?.charAt(0).toUpperCase() || "B"}
                      </span>
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold mr-2">
                          {blog.author && blog.author.username
                            ? blog.author.username.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {blog.author && blog.author.username
                            ? blog.author.username
                            : "Unknown"}
                        </span>
                      </div>
                      {blog.createdAt && (
                        <div className="flex items-center text-xs text-gray-500">
                          <ClockCircleOutlined className="mr-1" />
                          {formatDate(blog.createdAt)}
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                      {blog.title}
                    </h3>

                    <div className="text-gray-600 mb-4 flex-1 overflow-y-auto max-h-50">
                      <p>{blog.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => navigate("/blog-add-page")}
        className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-all transform hover:scale-110 z-10"
        aria-label="Yeni blog ekle"
      >
        <PlusOutlined className="text-2xl" />
      </button>

      {message && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full shadow-xl animate-bounce">
          {message}
        </div>
      )}
    </>
  );
};

export default HomePage;
