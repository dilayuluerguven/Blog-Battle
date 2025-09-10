import { useState, useEffect } from "react";
import { Badge, message } from "antd";
import {
  HomeFilled,
  ShoppingFilled,
  LogoutOutlined,
  UserSwitchOutlined,
  MenuOutlined,
  CloseOutlined,
  FileAddOutlined,
  NotificationOutlined,
  FlagOutlined
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState(""); // Giriş yapan kullanıcı adı
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    message.success("Çıkış yapıldı!");
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Kullanıcı adını fetch ile al
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Kullanıcı bilgisi alınamadı");
        const data = await res.json();
        setUsername(data.username);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [token]);

  return (
    <div className="border-b border-gray-200 shadow-sm bg-white sticky top-0 z-50">
      <header className="container mx-auto py-4 px-6 flex justify-between items-center">
        <div className="logo">
          <Link to="/">
            <h2 className="text-2xl font-bold md:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BlogApp
            </h2>
          </Link>
        </div>

        <div className="hidden md:flex justify-between items-center gap-7">
          <Link to="/" className="menu-link group flex flex-col items-center text-gray-600 hover:text-blue-500 transition-all duration-300">
            <HomeFilled className="text-xl group-hover:scale-110 transition-transform" />
            <span className="text-xs mt-1">Ana Sayfa</span>
          </Link>

          <Link to="/tournament" className="menu-link group flex flex-col items-center text-gray-600 hover:text-blue-500 transition-all duration-300">
            <FlagOutlined className="text-xl group-hover:scale-110 transition-transform" />
            <span className="text-xs mt-1">Blog yarışları</span>
          </Link>

          <Link to="/blog-add-page" className="menu-link group flex flex-col items-center text-gray-600 hover:text-blue-500 transition-all duration-300">
            <FileAddOutlined className="text-xl group-hover:scale-110 transition-transform" />
            <span className="text-xs mt-1">Blog Oluştur</span>
          </Link>

          <Link to="/notification" className="menu-link group flex flex-col items-center text-gray-600 hover:text-blue-500 transition-all duration-300">
            <NotificationOutlined className="text-xl group-hover:scale-110 transition-transform" />
            <span className="text-xs mt-1">Bildirimler</span>
          </Link>

          <Link to="/profile" className="menu-link group flex flex-col items-center text-gray-600 hover:text-blue-500 transition-all duration-300">
            <UserSwitchOutlined className="text-xl group-hover:scale-110 transition-transform" />
            <span className="text-xs mt-1">{username || "Profil"}</span>
          </Link>

          <button onClick={handleLogout} className="menu-link group flex flex-col items-center text-gray-600 hover:text-red-500 transition-all duration-300">
            <LogoutOutlined className="text-xl group-hover:scale-110 transition-transform" />
            <span className="text-xs mt-1">Çıkış Yap</span>
          </button>
        </div>

        <button className="md:hidden text-gray-600 focus:outline-none" onClick={toggleMenu}>
          {isMenuOpen ? <CloseOutlined className="text-xl" /> : <MenuOutlined className="text-xl" />}
        </button>
      </header>
    </div>
  );
};
