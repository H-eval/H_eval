import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import BackgroundWords from "../componets/BackgroundWords";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ Login Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Login failed");
        return;
      }

      console.log("Token from server:", data.token);

      // OPTIONAL: save token
      localStorage.setItem("token", data.token);

      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Background animation */}
      <BackgroundWords />

      {/* Login Container */}
      <div className="container relative z-10">
        <div className="form-container sign-in-container">
          <form onSubmit={handleSubmit}>
            <h1>Login</h1>

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>

            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
