
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
import TranslatePage from './page/ViewTranslations'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/Login' element={<Login/>}/>
        <Route path="/home" element={<Home />} />
        <Route path="/translate/:fileId" element={<TranslatePage />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
 