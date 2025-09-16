import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import SplashScreen from "./page/SplashScreen";
import Login from "./page/Login";
import Home from "./page/Home";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  return showSplash ? (
    <SplashScreen
      onFinish={() => {
        console.log("✅ Splash finished — navigating to login");
        setShowSplash(false);
        navigate("/login");
      }}
    />
  ) : (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
