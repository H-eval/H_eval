 

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Login.css';

// function Login() {
//   const [isActive, setIsActive] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch('http://localhost:5000/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.msg || 'Login failed');
//         return;
//       }

//       console.log('Token from server (stored in DB):', data.token);
//       navigate('/home');
//     } catch (err) {
//       console.error('Login error:', err);
//       setError('Something went wrong. Please try again.');
//     }
//   };

//   return (
//     <div className={`container ${isActive ? 'right-panel-active' : ''}`}>
//       {/* Register Form */}
//       <div className="form-container sign-up-container">
//         <form>
//           <h1>Register</h1>
//           <input type="text" placeholder="Name" />
//           <input type="email" placeholder="Email" />
//           <input type="password" placeholder="Password" />
//           <button>Register</button>
//         </form>
//       </div>

//       {/* Login Form */}
//       <div className="form-container sign-in-container">
//         <form onSubmit={handleSubmit}>
//           <h1>Login</h1>
//           <input
//             type="email"
//             placeholder="Email Address"
//             value={email}
//              onChange={(e) => setEmail(e.target.value.trim())}

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
//           {error && <p style={{ color: 'red' }}>{error}</p>}
//         </form>
//       </div>

//       {/* Overlay Section */}
//       <div className="overlay-container">
//         <div className="overlay">
//           <div className="overlay-panel overlay-left">
//             <h1>Welcome Back!</h1>
//             <p>Please login with your personal details</p>
//             <button className="ghost" onClick={() => setIsActive(false)}>
//               Login
//             </button>
//           </div>
//           <div className="overlay-panel overlay-right">
//             <h1>Hello, Friend!</h1>
//             <p>Enter your details and start your journey with us</p>
//             <button className="ghost" onClick={() => setIsActive(true)}>
//               Register
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;

 import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [isActive, setIsActive] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Register handler
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          password: regPassword
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || 'Registration failed');
        return;
      }

      alert('Registration successful! Please log in.');
      setIsActive(false);
    } catch (err) {
      console.error('Registration error:', err);
      setError('Something went wrong during registration.');
    }
  };

  // Login handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || 'Login failed');
        return;
      }

      console.log('Token from server:', data.token);
      navigate('/home');
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className={`container ${isActive ? 'right-panel-active' : ''}`}>
      {/* Register Form */}
      <div className="form-container sign-up-container">
        <form onSubmit={handleRegister}>
          <h1>Register</h1>
          <input
            type="text"
            placeholder="Name"
            value={regName}
            onChange={(e) => setRegName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value.trim())} // ✅ trim here
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
      </div>

      {/* Login Form */}
      <div className="form-container sign-in-container">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())} // ✅ trim here
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
          {error && <p style={{ color: 'red' }}>{error}</p>}
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

export default Login;