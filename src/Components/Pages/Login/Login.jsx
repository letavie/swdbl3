// export default Login;
import React from "react";
import { Form, Button, Input, Checkbox } from "antd";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../../config";
import "./Login.css";
import bg from "../../Assets/bgclassroom.jpg";
const Login = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    console.log("Google Sign-In");
  };

  const onFinish = async (values) => {
    try {
      const response = await fetch(`${API_URL}/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response && response.ok) {
        const data = await response.json();
        document.cookie = `token=${data.id_token};expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/`;
        window.history.pushState({}, "", "/");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
      return;
    }
  };

  return (
    <div className="containers">
      <div className="left-section">
        <img src={bg} alt="background" />
      </div>

      <div className="right-section">
        <div className="sign-in-container">
          <h2 className="font-semibold text-2xl mb-5 text-center">Đăng nhập</h2>

          <Form
            name="normal_login"
            className="mt-10 w-full"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input
                className="h-10"
                placeholder="Tên đăng nhập"
                style={{ borderRadius: "6px" }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password
                className="h-10"
                placeholder="Password"
                style={{ borderRadius: "6px" }}
              />
            </Form.Item>

            <Form.Item className="flex justify-between items-center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-base font-semibold">
                  Nhớ mật khẩu
                </Checkbox>
              </Form.Item>
              <Link
                to="/forget-password"
                className="text-base font-semibold text-cyan-700"
              >
                Quên mật khẩu ?
              </Link>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full text-base h-10 font-semibold button-primary"
              >
                Đăng nhập
              </Button>
            </Form.Item>

            <Form.Item>
              <div className="w-full flex justify-center gap-4">
                <Button
                  type="primary"
                  className="bg-red-500 flex-grow text-base h-10 font-semibold button-google"
                  onClick={handleGoogleSignIn}
                >
                  <FcGoogle />
                  Google+
                </Button>
              </div>
            </Form.Item>

            <Form.Item>
              <p className="text-base text-center font-semibold">
                Tôi chưa có tài khoản ?
                <Link to="/register" className="ml-2 font-bold text-cyan-700">
                  Đăng ký
                </Link>
              </p>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
