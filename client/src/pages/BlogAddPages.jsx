import React, { useState } from "react";
import { Button, Form, Input, Upload, message, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/header/Header";
import { useEffect } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";


const { TextArea } = Input;
const { Option } = Select;

const BlogAdd = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      setTimeout(() => {
        message.warning("Lütfen blog eklemek için giriş yapın!");
        navigate("/login");
      }, 100);
    }
  }, [token, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Blog eklenemedi");

      message.success("Blog başarıyla eklendi!");
      navigate("/");
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-white-700 hover:text-indigo-800 mb-6 transition-colors duration-200 font-medium"
          >
            <ArrowLeftOutlined className="mr-2" />
            Geri Dön
          </button>
            <h1 className="text-3xl font-bold">Yeni Blog Yazısı Ekle</h1>
            <p className="text-blue-100 mt-2">
              Düşüncelerinizi paylaşın ve diğer kullanıcılarla etkileşime geçin
            </p>
          </div>

          <div className="p-6">
            <Form layout="vertical" onFinish={onFinish} className="space-y-6">
              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">Başlık</span>
                }
                name="title"
                rules={[{ required: true, message: "Başlık boş olamaz!" }]}
              >
                <Input
                  className="h-12 rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
                  placeholder="Blog yazınızın başlığını girin"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">İçerik</span>
                }
                name="content"
                rules={[{ required: true, message: "İçerik boş olamaz!" }]}
              >
                <TextArea
                  rows={6}
                  className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
                  placeholder="Blog içeriğinizi yazın..."
                />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item
                  label={
                    <span className="text-gray-700 font-medium">Kategori</span>
                  }
                  name="category"
                  className="mb-0"
                >
                  <Select
                    placeholder="Kategori seçin"
                    className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
                  >
                    <Option value="Teknoloji">Teknoloji</Option>
                    <Option value="Seyahat">Seyahat</Option>
                    <Option value="Yemek">Yemek</Option>
                    <Option value="Sağlık">Sağlık</Option>
                    <Option value="Diğer">Diğer</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-gray-700 font-medium">
                      Görsel URL
                    </span>
                  }
                  name="image"
                  className="mb-0"
                >
                  <Input
                    placeholder="https://example.com/resim.jpg"
                    className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
                  />
                </Form.Item>
              </div>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-none text-white font-semibold text-lg rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {loading ? "Paylaşılıyor..." : "Blogu Paylaş"}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogAdd;
