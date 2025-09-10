import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/header/Header";

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

  if (loading) return <p className="text-center mt-20">Yükleniyor...</p>;

  return (
    <>
      <Header />

      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20 px-6 text-center rounded-b-3xl shadow-md mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Hoş Geldiniz!
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Bu site, farklı kategorilerdeki blog yazılarını keşfedebileceğiniz ve
          favori yazılarınızı takip edebileceğiniz bir platformdur. İlham alın,
          okuyun ,paylaşın ve yarışmaya katılın!
        </p>
        <button
          onClick={() => window.scrollTo({ top: 500, behavior: "smooth" })}
          className="mt-6 px-8 py-3 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition"
        >
          Blogları Keşfet
        </button>
      </section>

      <div className="min-h-screen bg-gray-100 py-12 px-6">
        <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-900">
          Bloglar
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col overflow-hidden border border-gray-200"
            >
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full aspect-square object-cover"
                />
              )}

              <div className="p-6 flex flex-col flex-1">
                {blog.author && (
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mr-3">
                      {blog.author.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-800 font-semibold">
                      {blog.author.username}
                    </span>
                  </div>
                )}

                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {blog.title}
                </h2>

                <div className="text-gray-700 mb-4 flex-1 overflow-auto max-h-48">
                  {blog.content}
                </div>

                <div className="flex justify-start items-center text-sm text-gray-500 mb-4">
                  <span className="bg-gray-200 px-3 py-1 rounded-full font-medium">
                    {blog.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {message && (
          <p className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full shadow-xl animate-bounce">
            {message}
          </p>
        )}
      </div>
    </>
  );
};

export default HomePage;
