import { Button, Carousel, Form, Input } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCarousel from "./AuthCarousel";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    const { username, email, password } = values;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || data.message || "Kayıt sırasında bir hata oluştu!"
        );
      }

      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen">
      <div className="flex justify-between h-full">
        <div className="xl:px-20 px-10 w-full flex flex-col h-full justify-center relative">
          <h1 className="text-center text-5xl font-bold mb-2">Blog Battle</h1>
          <p className="text-center mb-6 text-gray-600">
            Kendi blog yazınızı oluşturun ve diğer yazılarla yarışın!
          </p>
          <Form layout="vertical" onFinish={onFinish} autoComplete="off">
            <Form.Item
              label="Kullanıcı Adı:"
              name="username"
              rules={[
                { required: true, message: "Kullanıcı Adı Boş Bırakılamaz!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="E-Mail:"
              name="email"
              rules={[{ required: true, message: "E-Mail Boş Bırakılamaz!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Şifre:"
              name="password"
              rules={[{ required: true, message: "Şifre Boş Bırakılamaz!" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Şifre Tekrar:"
              name="passwordAgain"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Şifre Tekrar Boş Bırakılamaz!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value)
                      return Promise.resolve();
                    return Promise.reject(new Error("Şifreler aynı olmalı!"));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                size="large"
                loading={loading}
              >
                Kaydol ve Blogunu Paylaş
              </Button>
            </Form.Item>
          </Form>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="flex justify-center absolute left-0 bottom-10 w-full">
            Hesabınız var mı? &nbsp;
            <Link className="text-blue-600" to="/login">
              Giriş Yap
            </Link>
          </div>
        </div>

        <div className="xl:w-4/6 lg:w-3/5 md:w-1/2 md:flex hidden bg-[#6c63ff] h-full">
          <div className="w-full h-full flex items-center">
            <div className="w-full">
              <Carousel className="!h-full px-6" autoplay>
                <AuthCarousel
                  img="/images/responsive.svg"
                  title="Responsive"
                  desc="Tüm cihazlarla uyumlu"
                />
                <AuthCarousel
                  img="/images/statistic.svg"
                  title="İstatistikler"
                  desc="Oylamalar ve kazananlar"
                />
                <AuthCarousel
                  img="/images/customer.svg"
                  title="Topluluk"
                  desc="Kendi yazınızı paylaşın ve oy alın"
                />
                <AuthCarousel
                  img="/images/admin.svg"
                  title="Yönetici Paneli"
                  desc="Eşleşmeleri takip edin ve yönetin"
                />
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
