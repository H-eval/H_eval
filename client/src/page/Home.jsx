import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BackgroundWords from "../componets/BackgroundWords";
import "./Home.css";

const cards = [
  { title: "Multi-Language Support", desc: "Translates text between multiple languages, including English, Hindi, and other regional languages." },
  { title: "Line-by-Line Translation Viewer", desc: "Displays translations for each line individually, allowing users to follow along easily." },
  { title: "XML File Upload", desc: "Users can upload XML files containing text, and the translator automatically parses and processes them." },
  { title: "Matched Translation Comparison", desc: "Matches uploaded English lines with preloaded translations in other languages for side-by-side comparison." },
  { title: "Progress Tracking", desc: "Shows translation progress with a visual indicator, helping users keep track of completed and pending lines." }
];

const Home = () => {
  const navigate = useNavigate();

  const sections = ["English", "Indian Language 1", "Indian Language 2", "Indian Language 3"];
  const [selectedType, setSelectedType] = useState(0);
  const [files, setFiles] = useState([null, null, null, null]);
  const [progress, setProgress] = useState([0, 0, 0, 0]);

  const scrollRef = useRef(null);
  const [paused, setPaused] = useState(false);

  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const newFiles = [...files];
      newFiles[selectedType] = {
        name: selectedFile.name,
        size: (selectedFile.size / 1024).toFixed(2) + " KB",
        ext: selectedFile.name.split(".").pop().toUpperCase(),
      };
      setFiles(newFiles);

      let uploadProgress = 0;
      const interval = setInterval(() => {
        uploadProgress += 5;
        if (uploadProgress >= 100) {
          clearInterval(interval);
          uploadProgress = 100;
        }
        const newProgress = [...progress];
        newProgress[selectedType] = uploadProgress;
        setProgress(newProgress);
      }, 200);
    }
  };

  // Auto navigate after all uploads complete
  useEffect(() => {
    if (progress.every((p) => p === 100) && progress.some((p) => p > 0)) {
      setTimeout(() => navigate("/translator"), 1000);
    }
  }, [progress, navigate]);

  // Auto-scroll feature cards
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const step = () => {
      if (!paused) {
        scrollContainer.scrollLeft += 0.5;
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        }
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [paused]);

  return (
    <div className="relative flex flex-col min-h-screen font-inter text-white bg-black">
      {/* Background */}
      <BackgroundWords className="absolute inset-0 z-0" />

      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-lg">
        <nav className="flex justify-between items-center max-w-6xl mx-auto p-4">
          <div className="flex gap-6">
            <a href="#home" className="hover:text-indigo-400">Home</a>
            <a href="#about" className="hover:text-indigo-400">About</a>
            <a href="#services" className="hover:text-indigo-400">Services</a>
            <a href="#upload" className="hover:text-indigo-400">Upload</a>
            <a href="#features" className="hover:text-indigo-400">Features</a>
            <a href="#contact" className="hover:text-indigo-400">Contact</a>
          </div>
          <button className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full hover:shadow-lg transition">
            Logout
          </button>
        </nav>
      </header>

      {/* Spacer */}
      <div className="h-20" />

      {/* Main */}
      <main className="flex-1 relative z-10">
        {/* Upload Section */}
        <section id="upload" className="flex justify-center items-center py-24">
          <div className="relative w-[420px] rounded-xl bg-gradient-to-b from-blue-900/30 to-black/40 backdrop-blur-md p-6 shadow-lg">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-30 blur-2xl rounded-xl"></div>

            <div className="relative z-10 space-y-4">
              {/* File Type Dropdown */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(Number(e.target.value))}
                className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600"
              >
                {sections.map((label, index) => (
                  <option key={index} value={index}>
                    {label}
                  </option>
                ))}
              </select>

              {/* File Upload */}
              <label htmlFor="fileInput" className="cursor-pointer flex items-center space-x-4">
                <div className="relative w-16 h-20">
                  <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-400 to-blue-700 shadow-md relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                  </div>
                  <div className="absolute -left-3 bottom-3 bg-gradient-to-br from-blue-900 to-blue-800 text-white text-xs font-bold px-3 py-1 rounded-md shadow-lg border border-gray-700">
                    {files[selectedType] ? files[selectedType].ext : "TXT"}
                  </div>
                </div>
                <div>
                  <p className="text-white font-medium text-lg truncate max-w-[220px]">
                    {files[selectedType]
                      ? files[selectedType].name
                      : `${sections[selectedType]} File.txt`}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {files[selectedType] ? files[selectedType].size : "0 KB"}
                  </p>
                </div>
              </label>
              <input id="fileInput" type="file" className="hidden" onChange={handleFileSelect} />

              {/* Progress Bar */}
              <div className="mt-6">
                <p className="text-gray-300 text-sm mb-2">
                  {progress[selectedType] < 100 ? "Uploading..." : "Completed"}
                </p>
                <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress[selectedType]}%` }}
                    transition={{ ease: "easeOut", duration: 0.5 }}
                  />
                </div>
                <p className="text-right text-white font-semibold mt-2">{progress[selectedType]} %</p>
              </div>

              {/* Show All Progress */}
              <div className="mt-4 text-gray-300 text-sm">
                {sections.map((label, index) => (
                  <p key={index}>{label}: {progress[index]}%</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-black text-white py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Key Features</h2>
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-hidden"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {cards.concat(cards).map((c, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-80 rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 flex flex-col justify-center transform transition duration-500 hover:scale-105 hover:rotate-1"
                >
                  <h3 className="text-xl font-semibold mb-2 break-words">{c.title}</h3>
                  <p className="text-sm opacity-80 break-words">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gradient-to-t from-black/70 to-transparent text-gray-200 backdrop-blur-md py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400 bg-clip-text text-transparent"></div>
          <div className="flex gap-6 text-sm">
            {["Home", "About", "Services", "Upload", "Features", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-indigo-400">{item}</a>
            ))}
          </div>
          <div className="flex gap-4 text-lg">
            <a href="#" className="hover:text-indigo-400"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="hover:text-indigo-400"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-indigo-400"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" className="hover:text-indigo-400"><i className="fab fa-github"></i></a>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 mt-4">
          © {new Date().getFullYear()} H_EVAL. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
