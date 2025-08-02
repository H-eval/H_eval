 import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import logo from "../assets/logo.jpg";
import uploadimage from "../assets/hello.png";

 

import FeatureCard from "./FeatureCard"; // correct path if it's in src/components

const features = [
  {
    title: "User Authentication",
    details: " Secure login and registration using JWT. Users have protected access to upload and view their translations, with sessions managed in localStorage.",
  },
  {
    title: "Upload English XML File",
    details: " Upload structured English XML files through a simple interface. Files are parsed on the backend and prepared for matching with translations.",
  },
  {
    title: "Smart Translation Matching",
    details: " The backend intelligently aligns uploaded English sentences with corresponding Hindi lines from preloaded datasets using structured logic.",
  },
  {
    title: "Seamless User Interface",
    details: " A smooth and responsive UI guides users from file upload to translation viewing, with intuitive navigation and clean layout for easy readability.",
  },
];

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
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

      e.preventDefault();
      localStorage.removeItem("token");
      navigate("/Login");
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
const handleSubmit = async () => {
  if (!selectedFile) {
    setUploadMessage("Please select a file before submitting.");
    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }
    

    const data = await response.json();
    const fileId = data.fileId; // ✅ Ensure backend sends fileId

    setUploadMessage(`${selectedFile.name} uploaded successfully.`);
    setLoading(false);

    navigate(`/translate/${fileId}`); // ✅ Correct route from App.jsx
  } catch (error) {
    console.error("Upload failed", error);
    setLoading(false);
    setUploadMessage("File upload failed.");
  }
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
        <div className="feature-text">
          <h2>Upload. Translate. Understand.</h2>
          <p>
            Easily upload XML files and view line-by-line translations. Perfect
            for learners, researchers, and anyone working with multilingual
            content — simple, fast, and clear.
          </p>
        </div>
      </div>
    </div>


      <section id="use" className="use-section">
  <h2 className="section-title">How to Use</h2>
  <p className="section-description">
    Our platform offers a seamless way to translate documents with human-level accuracy.
    Simply follow these steps:
  </p>
  <ul className="use-steps">
    <li>
      <strong>Login to your account:</strong> Ensure secure access to your workspace.
    </li>
    <li>
      <strong>Upload your file:</strong> Upload an <code>.xml</code> file that needs translation.
    </li>
    <li>
      <strong>Get line-by-line results:</strong> After uploading, you'll be redirected to a new page
      where each line of the original content is displayed alongside its human-evaluated translation.
    </li>
  </ul>
  <p className="section-note">
    This feature is ideal for researchers, language learners, and professionals who need
    accurate and contextual translations of structured documents.
  </p>
</section>
   
      {/* Upload Section */}
      <section id="upload" className="upload-container">
        <label className="upload-label">
          <input type="file" onChange={handleFileChange} />
          <span className="upload-btn-text">📁 Upload File</span>
        </label>

        {selectedFile && (
          <div className="file-preview">
            <span className="file-name">{selectedFile.name}</span>
            {loading ? (
              <div className="loader"></div>
            ) : (
              <button className="submit-btn" onClick={handleSubmit}>
                Submit 🚀
              </button>
            )}
          </div>
        )}

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
            <svg width={0} height={0} style={{ position: "absolute" }}>
              <defs>
                <clipPath id="squircleClip" clipPathUnits="objectBoundingBox">
                  <path d="M 0,0.5 C 0,0 0,0 0.5,0 S 1,0 1,0.5 1,1 0.5,1 0,1 0,0.5" />
                </clipPath>
              </defs>
            </svg>

            <div className="relative social-animated-icons">
              <div className="relative flex items-end gap-x-2 p-2">
                <div className="relative">
                  <div
                    style={{ clipPath: "url(#squircleClip)" }}
                    className="animated-icon from-gray-700 to-gray-900 border-gray-600/50"
                  >
                    <i className="fab fa-github text-white text-xl"></i>
                  </div>
                </div>
                <div className="relative">
                  <div
                    style={{ clipPath: "url(#squircleClip)" }}
                    className="animated-icon from-blue-600 to-blue-800 border-blue-500/50"
                  >
                    <i className="fab fa-linkedin-in text-white text-xl"></i>
                  </div>
                </div>
                <div className="relative">
                  <div
                    style={{ clipPath: "url(#squircleClip)" }}
                    className="animated-icon from-red-600 to-red-800 border-red-500/50"
                  >
                    <i className="fab fa-youtube text-white text-xl"></i>
                  </div>
                </div>
                <div className="relative">
                  <div
                    style={{ clipPath: "url(#squircleClip)" }}
                    className="animated-icon from-indigo-600 to-indigo-800 border-indigo-500/50"
                  >
                    <i className="fab fa-discord text-white text-xl"></i>
                  </div>
                </div>
              </div>
            </div>
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


 