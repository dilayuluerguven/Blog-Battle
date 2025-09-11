import { useState, useEffect } from "react";
import { Badge, message, Dropdown, Avatar } from "antd";
import {
  HomeFilled,
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
  FileAddOutlined,
  NotificationOutlined,
  FlagOutlined,
  UserSwitchOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    message.success("Çıkış yapıldı!");
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: <Link to="/profile">Profilim</Link>,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Çıkış Yap",
      danger: true,
    },
  ];

  const menuItems = [
    { to: "/", icon: <HomeFilled className="text-lg" />, label: "Ana Sayfa" },
    {
      to: "/tournament",
      icon: <FlagOutlined className="text-lg" />,
      label: "Yarışmalar",
    },
    {
      to: "/blog-add-page",
      icon: <FileAddOutlined className="text-lg" />,
      label: "Blog Yaz",
    },
    {
      to: "/notification",
      icon: <NotificationOutlined className="text-lg" />,
      label: "Bildirimler",
      badge: unreadCount,
    },
  ];

  const renderMenuItems = menuItems.map((item) => (
    <Link
      key={item.to}
      to={item.to}
      className="menu-link flex items-center gap-2 py-2 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 relative"
    >
      {item.badge ? (
        <Badge count={item.badge} size="small">
          {item.icon}
        </Badge>
      ) : (
        item.icon
      )}
      <span className="font-medium">{item.label}</span>
    </Link>
  ));

  return (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
      <header className="container mx-auto py-3 px-4 sm:px-6 flex justify-between items-center">
        <div className="logo flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <h2 className="text-xl font-bold md:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
              BlogApp
            </h2>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {renderMenuItems}
        </div>

        <div className="flex items-center gap-4">
          {token ? (
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: (e) => {
                  if (e.key === "logout") handleLogout();
                },
              }}
              trigger={["click"]}
              placement="bottomRight"
              overlayClassName="w-40"
            >
              <div className="flex items-center gap-2 cursor-pointer py-1 px-3 rounded-lg hover:bg-gray-100 transition-colors">
                <Avatar
                  size="default"
                  icon={<UserOutlined />}
                  className="bg-blue-100 text-blue-600"
                />
                <span className="text-gray-700 font-medium text-sm max-w-24 truncate">
                  {username || "Kullanıcı"}
                </span>
              </div>
            </Dropdown>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              <UserSwitchOutlined />
              <span>Giriş Yap</span>
            </Link>
          )}

          <button
            className="md:hidden text-gray-600 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={toggleMenu}
            aria-label="Menü"
          >
            {isMenuOpen ? (
              <CloseOutlined className="text-xl" />
            ) : (
              <MenuOutlined className="text-xl" />
            )}
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="container mx-auto py-4 px-4 flex flex-col gap-2">
            {renderMenuItems}

            {token ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
              >
                <UserOutlined className="text-lg" />
                <span className="font-medium">Profilim</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
              >
                <UserSwitchOutlined className="text-lg" />
                <span className="font-medium">Giriş Yap</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
