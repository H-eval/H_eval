
// import React from "react";
// import Login from "./components/Login";

// function App() {
//   return (
//     <div className="App">
//       <Login />
//     </div>
//   );
// }

// export default App;


 import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './page/Login';
import Home from './page/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />  {/* ✅ FIXED */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
 