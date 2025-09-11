import React, { useEffect, useState } from "react";
import { Button, Spin, Badge, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/header/Header";
import { 
  TrophyOutlined, 
  UserOutlined, 
  LikeOutlined, 
  ClockCircleOutlined, 
  DeleteOutlined 
} from "@ant-design/icons";

const TournamentMatch = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voteLoading, setVoteLoading] = useState(null);
  const [voteMessages, setVoteMessages] = useState({}); // Kart bazlı mesajlar
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

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
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [token]);

  const vote = async (matchId, blogId, authorId) => {
    setVoteMessages(prev => ({ ...prev, [matchId]: null }));

    if (!token) {
      setVoteMessages(prev => ({ ...prev, [matchId]: { type: "error", text: "Oy vermek için giriş yapmalısınız!" } }));
      setTimeout(() => navigate("/login"), 500);
      return;
    }
    if (authorId === userId) {
      setVoteMessages(prev => ({ ...prev, [matchId]: { type: "error", text: "Kendi blogunuza oy veremezsiniz!" } }));
      return;
    }

    const match = matches.find((m) => m._id === matchId);
    if (match.votes.some((v) => v.user === userId)) {
      setVoteMessages(prev => ({ ...prev, [matchId]: { type: "error", text: "Bu maçta zaten oy kullandınız!" } }));
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
      setVoteMessages(prev => ({ ...prev, [matchId]: { type: "success", text: "Oy verildi!" } }));
    } catch (err) {
      setVoteMessages(prev => ({ ...prev, [matchId]: { type: "error", text: err.message } }));
    } finally {
      setVoteLoading(null);
    }
  };

  const deleteBlog = async (blogId) => {
    if (!token) {
      message.warning("Silmek için giriş yapmalısınız!");
      setTimeout(() => navigate("/login"), 500);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Silme işlemi başarısız");

      message.success(data.message || "Blog ve ilişkili maçlar silindi");

      fetchMatches();
    } catch (err) {
      message.error(err.message);
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
            <UserOutlined size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Henüz Eşleşme Yok</h2>
            <p className="text-gray-500 mb-6">Turnuva için henüz yeterli katılım bulunmuyor.</p>
            <Button type="primary" onClick={() => navigate("/blogs")}>
              Blog Yazmaya Başla
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-4">
              <TrophyOutlined className="h-10 w-10 text-yellow-500 mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">Turnuva Eşleşmeleri</h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Aşağıdaki blogları inceleyin ve en beğendiğinize oy verin. Kazanan bir sonraki tura yükselir!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => {
              const winnerId = match.winner?._id || match.winner;
              const isMatchCompleted = match.completed;

              return (
                <div
                  key={match._id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="p-5 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-700">Tur #{match.round || 1}</h3>
                      <div className="flex items-center">
                        <ClockCircleOutlined size={16} className="text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">
                          {new Date(match.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    </div>
                    {isMatchCompleted && (
                      <div className="mt-2 flex items-center text-green-600 text-sm">
                        <TrophyOutlined size={16} className="mr-1" />
                        <span>Tamamlandı</span>
                      </div>
                    )}
                    {voteMessages[match._id] && (
                      <div className={`text-sm mt-2 ${voteMessages[match._id].type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {voteMessages[match._id].text}
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="space-y-5">
                      {[match.blog1, match.blog2].map((blog) =>
                        blog ? (
                          <div
                            key={blog._id}
                            className={`border rounded-xl p-4 transition-all ${
                              isMatchCompleted && winnerId?.toString() === blog._id.toString()
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200"
                            }`}
                          >
                            {blog.image ? (
                              <div className="w-full h-40 mb-4 rounded-lg overflow-hidden">
                                <img
                                  src={blog.image}
                                  alt={blog.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-full h-40 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center rounded-lg mb-4">
                                <div className="text-gray-400 text-sm">Görsel Yok</div>
                              </div>
                            )}

                            <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{blog.title}</h2>
                            {blog.category && (
                              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full mb-3">
                                {blog.category}
                              </span>
                            )}

                            <div className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {blog.content}
                            </div>

                            {blog.author && (
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold mr-2">
                                    {blog.author.username.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-medium text-gray-700 text-sm">
                                    {blog.author.username}
                                  </span>
                                </div>
                                {blog.author._id === userId && (
                                  <Popconfirm
                                    title="Bu blogu silmek istediğinize emin misiniz?"
                                    onConfirm={() => deleteBlog(blog._id)}
                                    okText="Evet"
                                    cancelText="Hayır"
                                    okButtonProps={{ danger: true }}
                                  >
                                    <Button 
                                      type="text" 
                                      size="small" 
                                      danger 
                                      icon={<DeleteOutlined size={16} />}
                                    />
                                  </Popconfirm>
                                )}
                              </div>
                            )}

                            <div className="mb-3">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Oy Oranı</span>
                                <span>
                                  {(() => {
                                    const totalVotes = match.votes.length;
                                    const blogVotes = match.votes.filter(
                                      (v) => v.blog === blog._id
                                    ).length;
                                    const percent =
                                      totalVotes > 0
                                        ? Math.round((blogVotes / totalVotes) * 100)
                                        : 0;
                                    return `${percent}% (${blogVotes} oy)`;
                                  })()}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{
                                    width: `${
                                      match.votes.length > 0
                                        ? (match.votes.filter((v) => v.blog === blog._id).length /
                                            match.votes.length) *
                                          100
                                        : 0
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            </div>

                            <Button
                              type="primary"
                              onClick={() => vote(match._id, blog._id, blog.author?._id)}
                              loading={voteLoading === match._id}
                              block
                              disabled={
                                isMatchCompleted || 
                                blog.author?._id === userId || 
                                match.votes.some((v) => v.user === userId)
                              }
                              icon={<LikeOutlined size={16} />}
                              className="flex items-center justify-center"
                            >
                              Oy Ver
                              <Badge
                                count={
                                  match.votes.filter((v) => v.blog === blog._id).length || 0
                                }
                                className="ml-2"
                              />
                            </Button>

                            {isMatchCompleted && winnerId?.toString() === blog._id.toString() && (
                              <div className="flex items-center justify-center mt-3 gap-2 text-green-600 font-semibold text-sm">
                                <TrophyOutlined size={16} />
                                <span>Kazanan</span>
                              </div>
                            )}
                          </div>
                        ) : null
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                      <div className="text-sm text-gray-500">
                        Toplam Oy: {match.votes.length}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default TournamentMatch;
