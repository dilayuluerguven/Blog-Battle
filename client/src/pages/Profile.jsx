import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, message, Spin, Card, Popconfirm } from "antd";
import { UploadOutlined, DeleteOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/header/Header";

const Profile = () => {
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return navigate("/login");

      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/Users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Kullanıcı bilgileri alınamadı");
        const data = await res.json();
        setUser(data);

        form.setFieldsValue({
          username: data.username,
          email: data.email,
        });

        const blogRes = await fetch("http://localhost:5000/api/blogs/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const blogData = await blogRes.json();
        setBlogs(blogData);
      } catch (err) {
        console.error(err);
        message.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, navigate, form]);

  const handleAvatarChange = ({ file }) => {
    if (file.status === "removed") setAvatarFile(null);
    else setAvatarFile(file.originFileObj);
  };

  const handleSubmit = async (values) => {
    if (!token) return navigate("/login");

    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("email", values.email);
    if (avatarFile) formData.append("avatar", avatarFile);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/users/me", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Güncelleme başarısız");
      const data = await res.json();
      setUser(data);
      setEditMode(false);
      message.success("Profil güncellendi!");
    } catch (err) {
      console.error(err);
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Blog silinemedi");
      setBlogs(prev => prev.filter(b => b._id !== blogId));
      message.success("Blog silindi");
    } catch (err) {
      console.error(err);
      message.error(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/me", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Hesap silinemedi");
      message.success("Hesabınız silindi");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error(err);
      message.error(err.message);
    }
  };

  if (loading && !user) return <div className="flex justify-center items-center min-h-screen"><Spin size="large" /></div>;

  return (
    <>
      <Header />
      <div className="max-w-xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold text-center mb-8">Profilim</h1>

        {user && !editMode && (
          <div className="text-center mb-6">
            {user.avatar && <img src={`http://localhost:5000${user.avatar}`} alt="Profil" className="mx-auto w-24 h-24 rounded-full object-cover mb-4" />}
            <p className="text-lg font-semibold">{user.username}</p>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex justify-center gap-2 mt-4">
              <Button type="primary" onClick={() => setEditMode(true)}>Güncelle</Button>
              <Popconfirm
                title="Hesabınızı silmek istediğinizden emin misiniz? Tüm bloglarınız da silinecek."
                onConfirm={handleDeleteAccount}
              >
                <Button type="danger" icon={<UserDeleteOutlined />}>Hesabı Kaldır</Button>
              </Popconfirm>
            </div>
          </div>
        )}

        {user && editMode && (
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Kullanıcı Adı" name="username" rules={[{ required: true, message: "Kullanıcı adı gerekli" }]}>
              <Input disabled={loading} />
            </Form.Item>
            <Form.Item label="E-posta" name="email" rules={[{ required: true, message: "E-posta gerekli" }, { type: "email", message: "Geçerli e-posta girin" }]}>
              <Input disabled={loading} />
            </Form.Item>
            <Form.Item label="Profil Resmi">
              <Upload beforeUpload={() => false} maxCount={1} onChange={handleAvatarChange} listType="picture" accept="image/*" disabled={loading}>
                <Button icon={<UploadOutlined />}>Resim Yükle</Button>
              </Upload>
              {user.avatar && <img src={`http://localhost:5000${user.avatar}`} alt="Profil" className="mt-3 w-20 h-20 rounded-full object-cover" />}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>Kaydet</Button>
              <Button type="default" onClick={() => { setEditMode(false); form.setFieldsValue({ username: user.username, email: user.email }); }} block className="mt-2">İptal</Button>
            </Form.Item>
          </Form>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Bloglarım</h2>
          {blogs.length === 0 ? (
            <p>Henüz blog eklemediniz</p>
          ) : (
            blogs.map(blog => (
              <Card key={blog._id} title={blog.title} className="mb-4">
                <p>{blog.content}</p>
                <Popconfirm title="Blog silinsin mi?" onConfirm={() => handleDeleteBlog(blog._id)}>
                  <Button type="primary" danger icon={<DeleteOutlined />}>Sil</Button>
                </Popconfirm>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
