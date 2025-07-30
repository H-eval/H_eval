 import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./componets/Home"; // this is your main home page
 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;

