 
import React, { useState, useEffect } from "react";
 
import { useNavigate } from "react-router-dom";


import { motion } from "framer-motion";
import CurvedCarousel from "./CurvedCarousel";
import LightRays from "./LightRays";
import ElectricBorder from "./ElectricBorder";
import TextType from "./TextType";
import { Link } from "react-router-dom";


export default function Home({onGoToEvaluation}) {



  const navigate = useNavigate();
  
  // 🔗 Test Backend Connection
  useEffect(() => {
    fetch("http://localhost:5000")
      .then(res => res.text())
      .then(data => console.log("✅ Backend Connected:", data))
      .catch(err => console.log("❌ Backend Error:", err));
  }, []);

  function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // 3️⃣ Redirect to login page
  navigate("/login", { replace: true });
}


  const config = {
    footer_text:
      "TATVA makes human evaluation of translation systems faster, more accurate, and research-friendly.",
  };
  const title = "Upload Your Data";

  const [referenceFile, setReferenceFile] = useState(null);
  const [englishFile, setEnglishFile] = useState(null);
  const [translationFiles, setTranslationFiles] = useState([]);
  const [errors, setErrors] = useState({});
const [uploading, setUploading] = useState(false);
const [uploadVisible, setUploadVisible] = useState(false);


const allowedExtensions = ["xml", "json", "txt"];

function validateFile(file) {
  const ext = (file.name || "").split(".").pop().toLowerCase();
  return allowedExtensions.includes(ext);
}

function handleReferenceUpload(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  if (!validateFile(file)) {
    setErrors(prev => ({ ...prev, reference: "Only xml, json, txt allowed." }));
    return;
  }
  setReferenceFile(file);
  setErrors(prev => ({ ...prev, reference: null }));
}

function handleEnglishUpload(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  if (!validateFile(file)) {
    setErrors(prev => ({ ...prev, english: "Only xml, json, txt allowed." }));
    return;
  }
  setEnglishFile(file);
  setErrors(prev => ({ ...prev, english: null }));
}

function handleTranslationUpload(e) {
  const selected = Array.from(e.target.files || []);
  const validFiles = selected.filter(validateFile);
  const invalidFiles = selected.filter(f => !validateFile(f));
  if (invalidFiles.length > 0) {
    setErrors(prev => ({
      ...prev,
      translation: "Some files were rejected (only xml/json/txt allowed)."
    }));
  } else {
    setErrors(prev => ({ ...prev, translation: null }));
  }
  setTranslationFiles(validFiles);
}


async function handleUploadClick() {
  if (uploading) return;

  if (!referenceFile) {
    alert("Reference file is required.");
    return;
  }

  if (!englishFile) {
    alert("English file is required.");
    return;
  }

  if (translationFiles.length === 0) {
    alert("At least one translation file is required.");
    return;
  }

  const formData = new FormData();
  formData.append("reference", referenceFile);
  formData.append("english", englishFile);
  translationFiles.forEach(file => formData.append("translations", file));

  
    // 🔍 DEBUG: see exactly what is being sent
  console.log("FormData entries:");
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1].name);
  }

  
  setUploading(true);

  try {
    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem("token")}`,
      // },
      body: formData,
    });

      if (!res.ok) {
      throw new Error("Upload failed");
    }
    const data = await res.json();

    console.log("Upload response RAW:", data);
    setReferenceFile(null);
    setEnglishFile(null);
    setTranslationFiles([]);
    setUploadVisible(true);

    navigate("/lineviewer");

  } catch (err) {
    alert("Upload failed");
  }finally{
    setUploading(false);
  }
}



 const tatvaLines = [
  "Watch how TATVA transforms raw translation outputs into clear, human-centred evaluation insights. First, users upload their XML or JSON file containing multiple translations for each source sentence. TATVA automatically reads and organizes the data for evaluation.",
  "Human evaluators then review each translation, scoring fluency, adequacy, and overall quality. They can compare different system outputs side-by-side and provide accurate judgments.",
  "Once all evaluations are submitted, TATVA aggregates the scores from multiple evaluators and calculates final averages. The platform generates a clean summary showing per-sentence scores, system-wise performance, and overall rankings.",
  "The final dashboard helps researchers clearly identify which translation system performs best according to human judgment. This workflow makes TATVA fast, reliable, and research-friendly for real-world evaluation needs."
];


 
  return (
    

      <div className="relative min-h-screen bg-black text-white font-inter overflow-x-hidden">
    
    

    <div className="absolute inset-0 pointer-events-none">
   
           <LightRays
      raysOrigin="top-center"
      raysColor="#ebf3f3ff"
      raysSpeed={1.5}
      followMouse={true}
      mouseInfluence={0.2}
      className="absolute inset-0 pointer-events-none"
    />
           </div>
      <div className="relative ">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
        
          <span className="text-lg font-semibold">TATVA</span>
        </div>

        <ul className="hidden md:flex space-x-8 text-gray-300">
  <li>
    <a href="#home" className="hover:text-white cursor-pointer">Home</a>
  </li>
  <li>
    <a href="#features" className="hover:text-white cursor-pointer">Features</a>
  </li>
  <li>
    <a href="#how-it-works" className="hover:text-white cursor-pointer">About Us</a>

  </li>
  <li>
    <a href="#upload" className="hover:text-white cursor-pointer">Upload</a>
  </li>
  <li>
  <Link to="/profile" className="hover:text-white cursor-pointer">
    Profile
  </Link>
</li>
</ul>


        <div className="space-x-4">
          
         <button
  onClick={handleLogout}
  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-md transition"
>
  Logout
</button>

        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="text-center mt-20 relative overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Human Evaluation for <br />  translation
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-gray-400"
        >
          <span className="text-white-400 font-semibold">T</span>ranslation <span className="text-white-400 font-semibold">A</span>ssessment with <span className="text-white-400 font-semibold">T</span>rustworthy <span className="text-white-400 font-semibold">V</span>erdict and <span className="text-white-400 font-semibold">A</span>nnotation
        </motion.p>

        {/* <div className="absolute inset-0 hero-bg"></div> */}
      </section>



      {/* CAROUSEL SECTION */}
       <div id="features">
  <CurvedCarousel />
</div>



      {/* COMPARISON SECTION */}
      


     

        {/* <section className="max-w-4xl mx-auto mt-12 px-6 text-left">
  <h3 className="text-2xl md:text-3xl font-semibold mb-4">
    How TATVA Works
  </h3>

  <DecryptedText
    text={tatvaDescription}
    animateOn="view"            // 👈 auto-animate when section comes into view
    revealDirection="center"    // same style as example 3
    speed={40}
    maxIterations={20}
    className="text-base md:text-lg leading-relaxed text-gray-200"
    encryptedClassName="text-base md:text-lg leading-relaxed text-emerald-400"
  />
</section>

          <section className="px-6 py-12 max-w-3xl mx-auto flex justify-center">
        <ElectricBorder
          color="#7df9ff"
          speed={1}
          chaos={0.5}
          thickness={2}
          style={{ borderRadius: 16 }}
        >
          <div className="w-[500px] h-[300px] flex items-center justify-center">
            <video
        src="/demovideo.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />

          </div>
        </ElectricBorder>
      </section>
        </div> */}
      

{/* HOW + VIDEO SIDE BY SIDE */}
<section  id="how-it-works" className="max-w-6xl mx-auto mt-12 px-6">
  <div className="grid md:grid-cols-2 gap-12 items-center">

   {/* LEFT: Text typing animation */}
    <div className="text-left">
      <h3 className="text-2xl md:text-3xl font-semibold mb-4">
        How TATVA Works
      </h3>

      <TextType
        text={tatvaLines}
        typingSpeed={90}
        pauseDuration={1500}
        showCursor={true}
        startOnVisible={true}
        cursorCharacter="|"
        className="text-base md:text-lg leading-relaxed text-gray-200"
      />
    </div>

    {/* RIGHT SIDE – Electric Border with Video */}
    <div className="flex justify-center md:justify-end">
      <ElectricBorder
        color="#7df9ff"
        speed={1}
        chaos={0.5}
        thickness={2}
        style={{ borderRadius: 16 }}
      >
        <div className="w-[500px] h-[300px] rounded-[16px] overflow-hidden">
          <video
            src=""
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </ElectricBorder>
    </div>

  </div>
</section>

    {/* ================= UPLOAD SECTION ================= */}
<section id="upload" className="py-12">
  {/* Hidden inputs (separate) */}
  <input
    type="file"
    accept=".xml,.json,.txt"
    hidden
    id="reference-input"
    onChange={handleReferenceUpload}
  />

  <input
    type="file"
    accept=".xml,.json,.txt"
    hidden
    id="english-input"
    onChange={handleEnglishUpload}
  />

  <input
    type="file"
    accept=".xml,.json,.txt"
    multiple
    hidden
    id="translation-input"
    onChange={handleTranslationUpload}
  />

  <div className="max-w-4xl mx-auto px-6">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold mb-2 text-white">
        {title}
      </h2>
      <p className="text-lg text-gray-600">
        Upload 1 English file and multiple translation files
      </p>
    </div>

    {/* 3 Column Upload Layout */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* Column 1 – Reference File */}
      <div
        className="rounded-2xl p-6 text-center cursor-pointer border border-gray-800 bg-[#111] hover:border-indigo-500 transition"
        onClick={() => document.getElementById("reference-input").click()}
        role="button"
        aria-label="Upload reference file"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ")
            document.getElementById("reference-input").click();
        }}
      >
        <div className="space-y-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto text-lg">
            📄
          </div>
          <h3 className="text-lg font-semibold text-white">
            Reference File
          </h3>

          {referenceFile ? (
            <div className="mt-4 text-sm text-green-400">
              <p>{referenceFile.name}</p>
              <p>{(referenceFile.size / 1024).toFixed(1)} KB</p>
              <p className="text-gray-400 mt-1">Click to replace</p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm mt-2">Upload xml / json / txt</p>
          )}

          {errors.reference && (
            <p id="reference-error" className="text-red-400 mt-2 text-sm">
              {errors.reference}
            </p>
          )}
        </div>
      </div>

      {/* Column 2 – English File */}
      <div
        className="rounded-2xl p-6 text-center cursor-pointer border border-gray-800 bg-[#111] hover:border-emerald-500 transition"
        onClick={() => document.getElementById("english-input").click()}
        role="button"
        aria-label="Upload English file"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ")
            document.getElementById("english-input").click();
        }}
      >
        <div className="space-y-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto text-lg">
            🇬🇧
          </div>
          <h3 className="text-lg font-semibold text-white">English File</h3>

          {englishFile ? (
            <div className="mt-4 text-sm text-green-400">
              <p>{englishFile.name}</p>
              <p>{(englishFile.size / 1024).toFixed(1)} KB</p>
              <p className="text-gray-400 mt-1">Click to replace</p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm mt-2">Required (_En.xml)</p>
          )}

          {errors.english && (
            <p id="english-error" className="text-red-400 mt-2 text-sm">
              {errors.english}
            </p>
          )}
        </div>
      </div>

      {/* Column 3 – Translation Files */}
      <div
        className="rounded-2xl p-6 text-center cursor-pointer border border-gray-800 bg-[#111] hover:border-purple-500 transition"
        onClick={() => document.getElementById("translation-input").click()}
        role="button"
        aria-label="Upload translation files"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ")
            document.getElementById("translation-input").click();
        }}
      >
        <div className="space-y-4">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto text-lg">
            🌍
          </div>
          <h3 className="text-lg font-semibold text-white">Translation Files</h3>

          {translationFiles.length > 0 ? (
            <div className="mt-4 text-sm text-green-400">
              {translationFiles.map((file, index) => (
                <p key={index}>
                  {file.name} — {(file.size / 1024).toFixed(1)} KB
                </p>
              ))}
              <p className="text-gray-400 mt-1">Click to replace files</p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm mt-2">Multiple (_Hi_*.xml)</p>
          )}

          {errors.translation && (
            <p id="translation-error" className="text-red-400 mt-2 text-sm">
              {errors.translation}
            </p>
          )}
        </div>
      </div>

    </div>

    {/* Selected File Count */}
    {((referenceFile ? 1 : 0) + (englishFile ? 1 : 0) + translationFiles.length) > 0 && (
      <p className="text-center text-green-400 mt-6">
        {(referenceFile ? 1 : 0) + (englishFile ? 1 : 0) + translationFiles.length} file(s) selected
      </p>
    )}

    {/* Submit Button */}
    <div className="text-center mt-6">
      <button
        type="button"
        onClick={handleUploadClick}
        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload & Continue"}
      </button>
    </div>

    {uploadVisible && (
      <p className="text-center text-green-400 mt-4">
        Upload successful! Redirecting...
      </p>
    )}
  </div>
</section>
{/* ================= END UPLOAD SECTION ================= */}




  


      {/* Footer */}
      <footer id="contact" className="bg-[#0b0710] text-white py-1">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                
                <span className="text-xl font-semibold">TATVA</span>
              </div>
              <p id="footer-text" className="text-gray-300 mb-6">
                {"TATVA (h-eval) is a human-centric evaluation platform designed to assess the quality of machine translation systems across multiple languages using structured human judgments."
}
              </p>
              <p className="text-gray-400 text-sm">Contact: hevalpro5@gmail.com</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <div className="space-y-3">
                <a href="#home" className="block text-gray-300 hover:text-white">Home</a>
                <a href="#features" className="block text-gray-300 hover:text-white">Features</a>
                <a href="#how-it-works" className="block text-gray-300 hover:text-white">About Us</a>
                <a href="#upload" className="block text-gray-300 hover:text-white">Upload</a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Research</h3>
              <div className="space-y-3">
                <a href="#" className="block text-gray-300 hover:text-white">Evaluation Methodology</a>
                <a href="#" className="block text-gray-300 hover:text-white">Scoring Guidelines</a>
                <a href="#https://github.com/H-eval/H_eval" className="block text-gray-300 hover:text-white">GitHub Repository</a>
                {/* <a href="#" className="block text-gray-300 hover:text-white">License</a> */}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">© 2025 TATVA (H-eval)</p>
          </div>
        </div>
      </footer>
    </div>
  </div>
  );
}
  


