 


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
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
