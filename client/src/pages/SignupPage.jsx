import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:5002";

function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/auth/register`,
        formData
      );

      localStorage.setItem(
        "chatUser",
        JSON.stringify(data)
      );

      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Signup failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-800">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-500">
          Signup
        </h1>

        <form
          onSubmit={handleSignup}
          className="space-y-5"
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-4 rounded-2xl font-semibold"
          >
            Signup
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 cursor-pointer ml-2"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;