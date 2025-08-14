<<<<<<< HEAD:client/src/Login.js
// import React, { useState } from "react";
// import "./Login.css";

// const Login = () => {
//   const [isSignUp, setIsSignUp] = useState(false);

//   return (
//     <div
//       className={
//         isSignUp ? "container right-panel-active animate" : "container animate"
//       }
//       id="container"
//     >
//       {/* Sign Up Form */}
//       <div className="form-container sign-up-container">
//         <form>
//           <h1>Registration</h1>
//           <div className="input-box">
//             <input type="text" placeholder="Username" required />
//             <i className="bx bxs-user"></i>
//           </div>
//           <div className="input-box">
//             <input type="email" placeholder="Email" required />
//             <i className="bx bxs-envelope"></i>
//           </div>
//           <div className="input-box">
//             <input type="password" placeholder="Password" required />
//             <i className="bx bxs-lock-alt"></i>
//           </div>
//           <button type="submit">Register</button>
//           <span>or register with social platforms</span>
//           <div className="social-icons">
//             <a href="#"><i className="bx bxl-google"></i></a>
//             <a href="#"><i className="bx bxl-facebook"></i></a>
//             <a href="#"><i className="bx bxl-github"></i></a>
//             <a href="#"><i className="bx bxl-linkedin"></i></a>
//           </div>
//         </form>
//       </div>

//       {/* Sign In Form */}
//       <div className="form-container sign-in-container">
//         <form>
//           <h1>Login</h1>
//           <div className="input-box">
//             <input type="text" placeholder="Username" required />
//             <i className="bx bxs-user"></i>
//           </div>
//           <div className="input-box">
//             <input type="password" placeholder="Password" required />
//             <i className="bx bxs-lock-alt"></i>
//           </div>
//           <a href="#">Forgot Password?</a>
//           <button type="submit">Login</button>
//           <span>or login with social platforms</span>
//           <div className="social-icons">
//             <a href="#"><i className="bx bxl-google"></i></a>
//             <a href="#"><i className="bx bxl-facebook"></i></a>
//             <a href="#"><i className="bx bxl-github"></i></a>
//             <a href="#"><i className="bx bxl-linkedin"></i></a>
//           </div>
//         </form>
//       </div>

//       {/* Overlay */}
//       <div className="overlay-container">
//         <div className="overlay">
//           <div className="overlay-panel overlay-left">
//             <h1>Welcome Back!</h1>
//             <p>Already have an account?</p>
//             <button className="ghost" onClick={() => setIsSignUp(false)}>
//               Login
//             </button>
//           </div>
//           <div className="overlay-panel overlay-right">
//             <h1>Hello, Welcome!</h1>
//             <p>Don't have an account?</p>
//             <button className="ghost" onClick={() => setIsSignUp(true)}>
//               Register
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from "react";
import "./Login.css";

export default function Login() {
  const [isActive, setIsActive] = useState(false);
=======
 


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // ✅ Added
// import './Login.css';

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate(); // ✅ Added

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (email && password) {
//     localStorage.setItem("token", "dummy-auth-token");

//       navigate('/home'); // ✅ Go to Home page
//     }
//   };

//   return (
//     <div className="login-wrapper">
//       <div className="login-box">
//         <h2>Welcome Back 👋</h2>
//         <p>Please log in to continue</p>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="email"
//             placeholder="Email Address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <button type="submit">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

   
     const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.msg || 'Login failed');
      return;
    }
<<<<<<< HEAD

    // ✅ No localStorage, just navigate
    console.log('Token from server (stored in DB):', data.token);
    navigate('/home');
  } catch (err) {
    console.error('Login error:', err);
    setError('Something went wrong. Please try again.');
  }
};

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>Welcome Back 👋</h2>
        <p>Please log in to continue</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
=======
  };
>>>>>>> 46405568d4136addd56a2a32c4a9beabf7ed4c66:client/src/page/Login.js

  return (
    <div className={`container ${isActive ? "right-panel-active" : ""}`}>
      
      {/* Register Form */}
      <div className="form-container sign-up-container">
        <form>
          <h1>Register</h1>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Register</button>
>>>>>>> 5fa727952deb5c4ac1d9f788ed6eac79971530ec
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      {/* Login Form */}
      <div className="form-container sign-in-container">
        <form>
          <h1>Login</h1>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Login</button>
        </form>
      </div>

      {/* Overlay Section */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>Please login with your personal details</p>
            <button className="ghost" onClick={() => setIsActive(false)}>
              Login
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your details and start your journey with us</p>
            <button className="ghost" onClick={() => setIsActive(true)}>
              Register
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
