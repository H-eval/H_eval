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
import EvaluationPage from "./page/EvaluationPage";
import ProtectedRoute from "./page/ProtectedRoute";
import Corell from "./page/corell";
<<<<<<< HEAD
import Profile from "./page/Profile";
import BatchAnalysis from "./page/BatchAnalysis";
=======
import History from "./page/History";
>>>>>>> a1be30bb2301f9e47fac35a98ec53be93e7ca8ce

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
      
      <Route
  path="/home"
  element={
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  }
/>
<Route
  path="/home"
  element={
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  }
/>

<Route path="/history" element={<History />} />

      {/* Translation and Line Viewer pages */}
      {/* <Route path="/translate/:fileId" element={<TranslatePage />} /> */}
      {/* <Route path="/lineviewer" element={<LineViewer />} /> */}
      <Route path="/lineviewer" element={<LineViewer />} />


      <Route path="/evaluate/:sentenceId/:translationId"element={<EvaluationPage />}/>

<<<<<<< HEAD
      
      <Route path="/corell" element={<Corell />} />
      <Route
         path="/profile"
         element={
          <ProtectedRoute>
             <Profile />
          </ProtectedRoute>
        }
     />
       <Route
  path="/history/:batchId"
  element={
    <ProtectedRoute>
      <BatchAnalysis />
    </ProtectedRoute>
  }
/>
=======

      <Route path="/corell/:translationId" element={<Corell />} />


>>>>>>> a1be30bb2301f9e47fac35a98ec53be93e7ca8ce
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
