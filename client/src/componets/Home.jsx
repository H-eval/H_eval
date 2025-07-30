import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import logo from "../assets/logo.jpg";

const features = [
  {
    title: "Voice",
    color: "#d6f5f5",
    icon: "🎤",
    details: "Speak and get instant translations powered by speech recognition.",
  },
  {
    title: "Write",
    color: "#f5d6f8",
    icon: "✍️",
    details: "Type words or sentences and get accurate results instantly.",
  },
  {
    title: "Documents",
    color: "#ffebb4",
    icon: "📄",
    details: "Upload documents and translate them entirely with ease.",
  },
  {
    title: "API",
    color: "#d6f5f5",
    icon: "💻",
    details: "Integrate our powerful API into your own application or tool.",
  },
];

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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

  const handleFileUpload = () => {
    if (!selectedFile) {
      setUploadMessage("Please select a file first.");
      return;
    }

    if (selectedFile.type !== "text/xml" && !selectedFile.name.endsWith(".xml")) {
      setUploadMessage("Only .xml files are supported.");
      return;
    }

    // Example: showing success message. You can replace this with actual upload logic (e.g., POST to server)
    setUploadMessage(`${selectedFile.name} uploaded successfully.`);
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
      <section id="about" className="container">
        <h1 className="heading">Translator Features</h1>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-box ${activeIndex === index ? "active" : ""}`}
              style={{ backgroundColor: feature.color }}
              onClick={() => toggleBox(index)}>
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
      </section>

      <section id="upload" className="upload-section">
   
  <div className="upload-container">
    <div className="drop-area">
      <input
        type="file"
        accept=".xml"
        id="fileInput"
        onChange={(e) => setSelectedFile(e.target.files[0])}
      />
      <label htmlFor="fileInput">
        <div className="icon">📄</div>
        <p>Drag & drop or <span>browse</span> your .xml file</p>
      </label>
    </div>

    <button className="upload-btn" onClick={handleFileUpload}>
      Upload
    </button>

    {uploadMessage && (
      <p className="upload-message">{uploadMessage}</p>
    )}
  </div>
</section>

    </>
  );
};

export default Home;
