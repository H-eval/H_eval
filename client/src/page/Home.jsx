// src/pages/Home.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [englishFile, setEnglishFile] = useState(null);
  const [translationFiles, setTranslationFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogoutWithEffect = (e) => {
    const button = e.currentTarget;

    for (let i = 0; i < 20; i++) {
      const sparkle = document.createElement("span");
      sparkle.className = "sparkle";
      sparkle.style.left = `${e.clientX - button.getBoundingClientRect().left}px`;
      sparkle.style.top = `${e.clientY - button.getBoundingClientRect().top}px`;
      sparkle.style.setProperty("--x", Math.random());
      sparkle.style.setProperty("--y", Math.random());

      button.appendChild(sparkle);

      setTimeout(() => {
        sparkle.remove();
      }, 1000);
    }

    setTimeout(() => {
      localStorage.removeItem("token");
      navigate("/login");
    }, 1200);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleBox = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadMessage("");
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      setUploadMessage("Please select a file before submitting.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUploadMessage(`${selectedFile.name} uploaded successfully.`);
      navigate("/nextpage"); // Replace with your actual route
    }, 2000);
  };
   
   

  return (
    <>
      <header className="header">
        <div className="left-section">
          <img src={logo} alt="Logo" className="logo" />
          <h2 className="title">H-Eval</h2>
        </div>

        <nav className="center-nav">
          <span onClick={() => scrollToSection("about")}>About</span>
          <span onClick={() => scrollToSection("use")}>Use</span>
          <span onClick={() => scrollToSection("upload")}>Upload</span>
        </nav>

        <div className="right-section">
          <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
            &#9776;
          </div>
          {menuOpen && (
            <div className="dropdown">
              <button className="logout-btn" onClick={(e) => handleLogoutWithEffect(e)}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* About Section */}
      {/* <section id="about" className="container">
        <h1 className="heading">Translator Features</h1>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-box ${activeIndex === index ? "active" : ""}`}
              style={{ backgroundColor: feature.color }}
              onClick={() => toggleBox(index)}
            >
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              {activeIndex === index && (
                <div className="feature-details">
                  <p>{feature.details}</p>
                  <button className="start-btn">Get started now</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section> */}
      <section id="about" className="container">
      <h1 className="heading">Translator Features</h1>
      <div className="feature-grid">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            details={feature.details}
          />
        ))}
      </div>
    </section>

        <div>
      {/* Image + Text Section Only */}
      <div className="feature-container">
        <div className="feature-image">
          <img src={uploadimage} alt="Translation Illustration" />
        </div>

        {/* Upload Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#4CAF50",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default Home;


//   import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import styled from "styled-components";
// import "./Home.css";
// import logo from "../assets/logo.jpg";
// import uploadimage from "../assets/hello.png";

// const features = [
//   {
//     title: "User Authentication",
//     color: "#3ab8aaff",
//     details:
//       " Secure login and registration using JWT. Users have protected access to upload and view their translations, with sessions managed in localStorage.",
//   },
//   {
//     title: "Upload English XML File",
//     color: "#3ab8aaff",
//     details:
//       " Upload structured English XML files through a simple interface. Files are parsed on the backend and prepared for matching with translations.",
//   },
//   {
//     title: "Smart Translation Matching",
//     color: "#3ab8aaff",
//     details:
//       " The backend intelligently aligns uploaded English sentences with corresponding Hindi lines from preloaded datasets using structured logic.",
//   },
//   {
//     title: "Seamless User Interface",
//     color: "#3ab8aaff",
//     details:
//       " A smooth and responsive UI guides users from file upload to translation viewing, with intuitive navigation and clean layout for easy readability.",
//   },
// ];

// const StyledWrapper = styled.div`
//   .card {
//     position: relative;
//     width: 220px;
//     height: 320px;
//     background: mediumturquoise;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 25px;
//     font-weight: bold;
//     border-radius: 15px;
//     cursor: pointer;
//   }

//   .card::before,
//   .card::after {
//     position: absolute;
//     content: "";
//     width: 20%;
//     height: 20%;
//     background-color: lightblue;
//     transition: all 0.5s;
//     z-index: -1;
//   }

//   .card::before {
//     top: 0;
//     right: 0;
//     border-radius: 0 15px 0 100%;
//   }

//   .card::after {
//     bottom: 0;
//     left: 0;
//     border-radius: 0 100% 0 15px;
//   }

//   .card:hover::before,
//   .card:hover::after {
//     width: 100%;
//     height: 100%;
//     border-radius: 15px;
//   }

//   .card:hover::after {
//     content: "HELLO";
//     color: black;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }
// `;

// const Home = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadMessage, setUploadMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleLogoutWithEffect = (e) => {
//     const button = e.currentTarget;

//     for (let i = 0; i < 20; i++) {
//       const sparkle = document.createElement("span");
//       sparkle.className = "sparkle";
//       sparkle.style.left = `${e.clientX - button.getBoundingClientRect().left}px`;
//       sparkle.style.top = `${e.clientY - button.getBoundingClientRect().top}px`;
//       sparkle.style.setProperty("--x", Math.random());
//       sparkle.style.setProperty("--y", Math.random());

//       button.appendChild(sparkle);

//       setTimeout(() => {
//         sparkle.remove();
//       }, 1000);
//     }

//     setTimeout(() => {
//       localStorage.removeItem("token");
//       navigate("/login");
//     }, 1200);
//   };

//   const scrollToSection = (id) => {
//     const element = document.getElementById(id);
//     if (element) {
//       element.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       setUploadMessage("");
//     }
//   };

//   const handleSubmit = () => {
//     if (!selectedFile) {
//       setUploadMessage("Please select a file before submitting.");
//       return;
//     }

//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       setUploadMessage(`${selectedFile.name} uploaded successfully.`);
//       navigate("/nextpage");
//     }, 2000);
//   };

//   return (
//     <>
//       <header className="header">
//         <div className="left-section">
//           <img src={logo} alt="Logo" className="logo" />
//           <h2 className="title">H-Eval</h2>
//         </div>

//         <nav className="center-nav">
//           <span onClick={() => scrollToSection("about")}>About</span>
//           <span onClick={() => scrollToSection("use")}>Use</span>
//           <span onClick={() => scrollToSection("upload")}>Upload</span>
//         </nav>

//         <div className="right-section">
//           <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
//             &#9776;
//           </div>
//           {menuOpen && (
//             <div className="dropdown">
//               <button className="logout-btn" onClick={(e) => handleLogoutWithEffect(e)}>
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </header>

//       <section id="about" className="container">
//         <h1 className="heading">Translator Features</h1>
//         <div className="feature-grid">
//           {features.map((feature, index) => (
//             <StyledWrapper key={index}>
//               <div className="card">{feature.title}</div>
//             </StyledWrapper>
//           ))}
//         </div>
//       </section>

//       <div className="feature-container">
//         <div className="feature-image">
//           <img src={uploadimage} alt="Translation Illustration" />
//         </div>
//         <div className="feature-text">
//           <h2>Upload. Translate. Understand.</h2>
//           <p>
//             Easily upload XML files and view line-by-line translations. Perfect for learners,
//             researchers, and anyone working with multilingual content — simple, fast, and clear.
//           </p>
//         </div>
//       </div>

//       <section id="use" className="use-section">
//         <h2 className="section-title">How to Use</h2>
//         <p className="section-description">
//           Our platform offers a seamless way to translate documents with human-level accuracy.
//           Simply follow these steps:
//         </p>
//         <ul className="use-steps">
//           <li>
//             <strong>Login to your account:</strong> Ensure secure access to your workspace.
//           </li>
//           <li>
//             <strong>Upload your file:</strong> Upload an <code>.xml</code> file that needs translation.
//           </li>
//           <li>
//             <strong>Get line-by-line results:</strong> After uploading, you'll be redirected to a new
//             page where each line of the original content is displayed alongside its human-evaluated
//             translation.
//           </li>
//         </ul>
//         <p className="section-note">
//           This feature is ideal for researchers, language learners, and professionals who need
//           accurate and contextual translations of structured documents.
//         </p>
//       </section>

//       <section id="upload" className="upload-container">
//         <label className="upload-label">
//           <input type="file" onChange={handleFileChange} />
//           <span className="upload-btn-text">📁 Upload File</span>
//         </label>

//         {selectedFile && (
//           <div className="file-preview">
//             <span className="file-name">{selectedFile.name}</span>
//             {loading ? (
//               <div className="loader"></div>
//             ) : (
//               <button className="submit-btn" onClick={handleSubmit}>
//                 Submit 🚀
//               </button>
//             )}
//           </div>
//         )}

//         {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
//       </section>

//       <footer className="footer">
//         <div className="footer-content">
//           <div className="footer-column">
//             <h4>About</h4>
//             <a href="#about">Our Mission</a>
//             <a href="#team">Team</a>
//             <a href="#faq">FAQ</a>
//           </div>

//           <div className="footer-column">
//             <h4>Tools</h4>
//             <a href="#voice">Voice Translator</a>
//             <a href="#text">Text Translator</a>
//             <a href="#history">Translation History</a>
//           </div>

//           <div className="footer-column">
//             <h4>Resources</h4>
//             <a href="#help">Help Center</a>
//             <a href="#languages">Supported Languages</a>
//             <a href="#blog">Blog</a>
//           </div>

//           <div className="footer-column">
//             <h4>Follow Us</h4>
//             {/* Icons go here */}
//           </div>
//         </div>
//         <hr />
//         <p className="footer-bottom">
//           &copy; {new Date().getFullYear()} H-Eval Translator. All rights reserved.
//         </p>
//       </footer>
//     </>
//   );
// };

// export default Home;
