// src/pages/Home.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import "./Home.css";
import logo from "../assets/logo.jpg";
import uploadimage from "../assets/hello.png";

const features = [
  {
    title: "User Authentication",
    details:
      "Secure login and registration using JWT. Users have protected access to upload and view their translations, with sessions managed in localStorage.",
  },
  {
    title: "Upload English XML File",
    details:
      "Upload structured English XML files through a simple interface. Files are parsed on the backend and prepared for matching with translations.",
  },
  {
    title: "Smart Translation Matching",
    details:
      "The backend intelligently aligns uploaded English sentences with corresponding Hindi lines from preloaded datasets using structured logic.",
  },
  {
    title: "Seamless User Interface",
    details:
      "A smooth and responsive UI guides users from file upload to translation viewing, with intuitive navigation and clean layout for easy readability.",
  },
];

const StyledWrapper = styled.div`
  .card {
    position: relative;
    width: 220px;
    height: 320px;
    background: mediumturquoise;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
    border-radius: 15px;
    cursor: pointer;
    text-align: center;
    padding: 10px;
  }

  .card::before,
  .card::after {
    position: absolute;
    content: "";
    width: 20%;
    height: 20%;
    background-color: lightblue;
    transition: all 0.5s;
    z-index: -1;
  }

  .card::before {
    top: 0;
    right: 0;
    border-radius: 0 15px 0 100%;
  }

  .card::after {
    bottom: 0;
    left: 0;
    border-radius: 0 100% 0 15px;
  }

  .card:hover::before,
  .card:hover::after {
    width: 100%;
    height: 100%;
    border-radius: 15px;
  }
`;

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [englishFile, setEnglishFile] = useState(null);
  const [translationFiles, setTranslationFiles] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Logout animation
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
      setTimeout(() => sparkle.remove(), 1000);
    }
    setTimeout(() => {
      localStorage.removeItem("token");
      navigate("/login");
    }, 1200);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  // Handle English file
  const handleEnglishChange = (e) => {
    const file = e.target.files[0];
    setEnglishFile(file || null);
    setUploadMessage("");
  };

  // Handle Hindi translations (multiple files)
  const handleTranslationsChange = (e) => {
    const files = Array.from(e.target.files);
    setTranslationFiles(files);
    setUploadMessage("");
  };

const handleSubmit = async () => {
  if (!englishFile || translationFiles.length !== 3) {
    setUploadMessage("⚠️ Please select 1 English file and exactly 3 translation files.");
    return;
  }

  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("english", englishFile);
    translationFiles.forEach((file) => {
      formData.append("translations", file);
    });

    const res = await axios.post("http://localhost:5000/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("UPLOAD RESPONSE:", res.data);   // 👈 debug log
    setUploadMessage(res.data.message || "✅ Upload successful");
    setLoading(false);

    if (res.data.fileId) {
      console.log("Redirecting to:", `/lineviewer/${res.data.fileId}`);
      navigate(`/lineviewer/${res.data.fileId}`); // 👈 should redirect
    } else {
      console.warn("No fileId returned from backend!");
    }
  } catch (err) {
    console.error("❌ Upload failed:", err);
    setUploadMessage("❌ Upload failed. Please try again.");
    setLoading(false);
  }
};



  return (
    <>
      {/* Header */}
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
              <button className="logout-btn" onClick={handleLogoutWithEffect}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="container">
        <h1 className="heading">Translator Features</h1>
        <div className="feature-grid">
          {features.map((f, i) => (
            <StyledWrapper key={i}>
              <div className="card">{f.title}</div>
            </StyledWrapper>
          ))}
        </div>
      </section>

      {/* Upload Section Illustration */}
      <div className="feature-container">
        <div className="feature-image">
          <img src={uploadimage} alt="Translation Illustration" />
        </div>
        <div className="feature-text">
          <h2>Upload. Translate. Understand.</h2>
          <p>
            Easily upload XML files and view line-by-line translations. Perfect for learners,
            researchers, and anyone working with multilingual content — simple, fast, and clear.
          </p>
        </div>
      </div>

      {/* Upload File Section */}
      <section id="upload" className="upload-container">
        <div>
          <label className="upload-label">
            <input type="file" accept=".xml" onChange={handleEnglishChange} />
            <span className="upload-btn-text">📁 Upload English File</span>
          </label>
          {englishFile && <p className="file-name">English: {englishFile.name}</p>}
        </div>

        <div>
          <label className="upload-label">
            <input type="file" accept=".xml" multiple onChange={handleTranslationsChange} />
            <span className="upload-btn-text">📁 Upload 3 Translation Files</span>
          </label>
          {translationFiles.length > 0 && (
            <ul>
              {translationFiles.map((f, i) => (
                <li key={i}>{f.name}</li>
              ))}
            </ul>
          )}
        </div>

        <div>
          {loading ? (
            <div className="loader"></div>
          ) : (
            <button className="submit-btn" onClick={handleSubmit}>
              Submit 🚀
            </button>
          )}
        </div>

        {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <h4>About</h4>
            <a href="#about">Our Mission</a>
            <a href="#team">Team</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="footer-column">
            <h4>Tools</h4>
            <a href="#voice">Voice Translator</a>
            <a href="#text">Text Translator</a>
            <a href="#history">Translation History</a>
          </div>
          <div className="footer-column">
            <h4>Resources</h4>
            <a href="#help">Help Center</a>
            <a href="#languages">Supported Languages</a>
            <a href="#blog">Blog</a>
          </div>
          <div className="footer-column">
            <h4>Follow Us</h4>
          </div>
        </div>
        <hr />
        <p className="footer-bottom">
          &copy; {new Date().getFullYear()} H-Eval Translator. All rights reserved.
        </p>
      </footer>
    </>
  );
};

export default Home;
