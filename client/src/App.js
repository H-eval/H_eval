 import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import SplashScreen from "./page/SplashScreen";
import Login from "./page/Login";
import Home from "./page/Home";
import LineViewer from "./page/LineViewer";

function AppRoutes() {
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
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Core pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />

      {/* Translation and Line Viewer pages */}
      {/* <Route path="/translate/:fileId" element={<TranslatePage />} /> */}
      <Route path="/lineviewer" element={<LineViewer />} />
      <Route path="/lineviewer/:fileId" element={<LineViewer />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
