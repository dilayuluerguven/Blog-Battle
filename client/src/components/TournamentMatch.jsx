import React, { useEffect, useState } from "react";
import { Button, Spin, Badge } from "antd";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/header/Header";

const TournamentMatch = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voteLoading, setVoteLoading] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/tournament", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      if (!res.ok) {
        const text = await res.text(); 
        console.error("Sunucudan gelen hata:", text);
        throw new Error("Turnuva eşleşmeleri yüklenemedi");
      }

      const data = await res.json();
      setMatches(data);
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchMatches();
}, [token]);


  const vote = async (matchId, blogId, authorId) => {
    if (!token) {
      setMessage("Oy vermek için giriş yapmalısınız!");
      setTimeout(() => navigate("/login"), 500);
      return;
    }
    if (authorId === userId) {
      setMessage("Kendi blogunuza oy veremezsiniz!");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    const match = matches.find((m) => m._id === matchId);
    if (match.votes.some((v) => v.user === userId)) {
      setMessage("Bu maçta zaten oy kullandınız!");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    try {
      setVoteLoading(matchId);
      const res = await fetch(
        `http://localhost:5000/api/tournament/${matchId}/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ blogId }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Oy verilemedi");
      setMatches((prev) =>
        prev.map((m) => (m._id === matchId ? data.match || m : m))
      );
      setMessage("Oy verildi!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setVoteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (matches.length === 0) {
    return <p className="text-center mt-20 text-gray-700">Henüz eşleşme yok</p>;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Turnuva Eşleşmeleri
        </h1>

        <div className="flex flex-col gap-10 max-w-5xl mx-auto">
          {matches.map((match) => (
            <div
              key={match._id}
              className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow"
            >
              {[match.blog1, match.blog2].map((blog) =>
                blog ? (
                  <div
                    key={blog._id}
                    className={`flex-1 flex flex-col rounded-2xl overflow-hidden border p-4 ${
                      match.completed && match.winner === blog._id
                        ? "border-4 border-green-500 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    {blog.image ? (
                      <div className="w-full aspect-square mb-4 rounded-lg overflow-hidden">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-square bg-gray-200 flex items-center justify-center rounded-lg mb-4">
                        Resim yok
                      </div>
                    )}

                    <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>

                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full mb-3">
                      {blog.category || "Kategori yok"}
                    </span>

                    <div className="text-gray-700 mb-4 flex-1 overflow-auto max-h-40">
                      {blog.content}
                    </div>

                    {blog.author && (
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mr-3">
                          {blog.author.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-800">
                          {blog.author.username}
                        </span>
                      </div>
                    )}

                    <Button
                      type="primary"
                      onClick={() =>
                        vote(match._id, blog._id, blog.author?._id)
                      }
                      loading={voteLoading === match._id}
                      block
                      disabled={
                        match.completed ||
                        blog.author?._id === userId ||
                        match.votes.some((v) => v.user === userId)
                      }
                      title={
                        blog.author?._id === userId
                          ? "Kendi blogunuza oy veremezsiniz"
                          : match.votes.some((v) => v.user === userId)
                          ? "Zaten oy kullandınız"
                          : ""
                      }
                      className="mt-auto rounded-xl"
                    >
                      Oy Ver <Badge count={blog.votes?.length || 0} />
                    </Button>

                    {match.completed && match.winner === blog._id && (
                      <p className="text-green-600 font-bold mt-2 text-center text-lg">
                        Kazanan!
                      </p>
                    )}
                  </div>
                ) : null
              )}
            </div>
          ))}
        </div>

        {message && (
          <p className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-full shadow-lg animate-pulse">
            {message}
          </p>
        )}
      </div>
    </>
  );
};

export default TournamentMatch;
