import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Spin,
  Card,
  Popconfirm,
  Modal,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  UserDeleteOutlined,
  UserOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/header/Header";

const Profile = () => {
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  const [editBlogModal, setEditBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm] = Form.useForm();

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
      setBlogs((prev) => prev.filter((b) => b._id !== blogId));
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

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    blogForm.setFieldsValue({
      title: blog.title,
      content: blog.content,
    });
    setEditBlogModal(true);
  };

  const handleUpdateBlog = async (values) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/blogs/${editingBlog._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      );
      if (!res.ok) throw new Error("Blog güncellenemedi");
      const updated = await res.json();
      setBlogs((prev) =>
        prev.map((b) => (b._id === updated._id ? updated : b))
      );
      message.success("Blog güncellendi");
      setEditBlogModal(false);
      setEditingBlog(null);
    } catch (err) {
      console.error(err);
      message.error(err.message);
    }
  };

  if (loading && !user)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Profilim
        </h1>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          {user && !editMode && (
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex-shrink-0">
                {user.avatar ? (
                  <img
                    src={`http://localhost:5000${user.avatar}`}
                    alt="Profil"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center">
                    <UserOutlined className="text-5xl text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex-grow text-center md:text-left">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {user.username}
                </h2>
                <p className="text-gray-600 mb-4">{user.email}</p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Button
                    type="primary"
                    onClick={() => setEditMode(true)}
                    className="flex items-center justify-center"
                  >
                    <EditOutlined className="mr-1" /> Profili Düzenle
                  </Button>
                  <Popconfirm
                    title="Hesabınızı silmek istediğinizden emin misiniz? Tüm bloglarınız da silinecek."
                    onConfirm={handleDeleteAccount}
                    okText="Evet"
                    cancelText="Hayır"
                  >
                    <Button
                      type="danger"
                      icon={<UserDeleteOutlined />}
                      className="flex items-center justify-center"
                    >
                      Hesabı Sil
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          )}

          {user && editMode && (
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Form.Item
                    label="Kullanıcı Adı"
                    name="username"
                    rules={[
                      { required: true, message: "Kullanıcı adı gerekli" },
                    ]}
                  >
                    <Input disabled={loading} size="large" />
                  </Form.Item>
                  <Form.Item
                    label="E-posta"
                    name="email"
                    rules={[
                      { required: true, message: "E-posta gerekli" },
                      { type: "email", message: "Geçerli e-posta girin" },
                    ]}
                  >
                    <Input disabled={loading} size="large" />
                  </Form.Item>
                </div>

                <div>
                  <Form.Item label="Profil Resmi">
                    <Upload
                      beforeUpload={() => false}
                      maxCount={1}
                      onChange={handleAvatarChange}
                      listType="picture"
                      accept="image/*"
                      disabled={loading}
                    >
                      <Button
                        icon={<UploadOutlined />}
                        size="large"
                        className="w-full"
                      >
                        Resim Yükle
                      </Button>
                    </Upload>
                    <div className="mt-4 flex justify-center">
                      {user.avatar ? (
                        <img
                          src={`http://localhost:5000${user.avatar}`}
                          alt="Profil"
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                          <UserOutlined className="text-2xl text-gray-400" />
                        </div>
                      )}
                    </div>
                  </Form.Item>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  className="flex-1"
                >
                  Değişiklikleri Kaydet
                </Button>
                <Button
                  type="default"
                  onClick={() => {
                    setEditMode(false);
                    form.setFieldsValue({
                      username: user.username,
                      email: user.email,
                    });
                  }}
                  size="large"
                  className="flex-1"
                >
                  İptal
                </Button>
              </div>
            </Form>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            Bloglarım
          </h2>

          {blogs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">Henüz blog eklemediniz</p>
              <Button
                type="primary"
                className="mt-4"
                onClick={() => navigate("/blog-add-page")}
              >
                İlk Blogunu Ekle
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {blogs.map((blog) => (
                <Card
                  key={blog._id}
                  className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300"
                  title={
                    <h3 className="text-lg font-semibold text-gray-800 m-0">
                      {blog.title}
                    </h3>
                  }
                >
                  <p className="text-gray-600 mb-4">
                    {blog.content.length > 150
                      ? `${blog.content.substring(0, 150)}...`
                      : blog.content}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Popconfirm
                      title="Blog silinsin mi?"
                      onConfirm={() => handleDeleteBlog(blog._id)}
                      okText="Evet"
                      cancelText="Hayır"
                    >
                      <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                      >
                        Sil
                      </Button>
                    </Popconfirm>
                    <Button
                      type="default"
                      icon={<EditOutlined />}
                      onClick={() => handleEditBlog(blog)}
                      size="small"
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      Düzenle
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        title="Blog Güncelle"
        open={editBlogModal}
        onCancel={() => setEditBlogModal(false)}
        footer={null}
        width={700}
      >
        <Form form={blogForm} layout="vertical" onFinish={handleUpdateBlog}>
          <Form.Item
            label="Başlık"
            name="title"
            rules={[{ required: true, message: "Başlık gerekli" }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="İçerik"
            name="content"
            rules={[{ required: true, message: "İçerik gerekli" }]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
          <div className="flex justify-end gap-3">
            <Button onClick={() => setEditBlogModal(false)}>İptal</Button>
            <Button type="primary" htmlType="submit">
              Güncelle
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default Profile;
