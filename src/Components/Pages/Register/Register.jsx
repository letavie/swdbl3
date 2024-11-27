import React, { useState } from "react";
import { Form, Button, Input } from "antd";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../../config";
import "./Register.css";
import bg from "../../Assets/bgclassroom.jpg";
const Register = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login,
        password,
        email,
        langKey: "en",
      }),
    });

    if (response && response.ok) {
      window.history.pushState({}, "", "/login");
      window.location.reload();
    }
    console.log("response", response);
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign-In");
  };

  return (
    <div className="containers">
      {/* Left section with image */}
      <div className="left-section">
        <img src={bg} alt="background" />
      </div>

      {/* Right section with form */}
      <div className="right-section">
        <div className="flex flex-col justify-center items-center w-full max-w-md">
          <div className="sign-in-container">
            <h2>Tạo tài khoản mới</h2>
            <p>Vui lòng nhập thông tin để đăng ký</p>

            <Form
              name="register"
              className="mt-10 w-full"
              initialValues={{ remember: true }}
              onFinish={handleSubmit}
            >
              <Form.Item
                name="email"
                rules={[{ required: true, message: "Vui lòng nhập email!" }]}
              >
                <Input
                  className="h-10"
                  placeholder="Email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                name="login"
                rules={[
                  { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                ]}
              >
                <Input
                  className="h-10"
                  placeholder="Tên đăng nhập"
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password className="h-10" placeholder="Password" />
              </Form.Item>

              <Form.Item
                name="confirm"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Vui lòng nhập lại mật khẩu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu nhập lại không khớp!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  className="h-10"
                  placeholder="Xác nhận mật khẩu"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="button-primary"
                >
                  Đăng ký
                </Button>
              </Form.Item>

              <Form.Item>
                <div className="w-full flex justify-center gap-4">
                  <Button
                    type="primary"
                    className="button-google"
                    onClick={handleGoogleSignIn}
                  >
                    <FcGoogle />
                    Đăng ký với Google
                  </Button>
                </div>
              </Form.Item>

              <Form.Item>
                <p className="text-center">
                  Bạn đã có tài khoản?
                  <Link to="/login" className="text-cyan-700">
                    Đăng nhập
                  </Link>
                </p>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
