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
 


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Added
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // ✅ Added

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      navigate('/home'); // ✅ Go to Home page
    }
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
        </form>
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
