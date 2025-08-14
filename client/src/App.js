<<<<<<< HEAD
  import React from 'react';
=======
<<<<<<< HEAD
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
import React from "react";
import Login from "./Login";
import "./Login.css";

function App() {
  return (
    <div className="App">
      <Login />
    </div>
=======
 import React from 'react';
>>>>>>> 5fa727952deb5c4ac1d9f788ed6eac79971530ec
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
>>>>>>> 46405568d4136addd56a2a32c4a9beabf7ed4c66
  );
}

export default App;
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======



>>>>>>> 46405568d4136addd56a2a32c4a9beabf7ed4c66
>>>>>>> 5fa727952deb5c4ac1d9f788ed6eac79971530ec
