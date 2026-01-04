 
import React, { useState } from "react";
 
import { useNavigate } from "react-router-dom";


import { motion } from "framer-motion";
import CurvedCarousel from "./CurvedCarousel";
import LightRays from "./LightRays";
import ElectricBorder from "./ElectricBorder";
import TextType from "./TextType";



export default function Home({onGoToEvaluation}) {



  const navigate = useNavigate();
  function handleLogout() {
  // // 1️⃣ Remove token
  // localStorage.removeItem("token");

  // // 2️⃣ (Optional) Inform backend
  // fetch("http://localhost:5000/api/logout", {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${localStorage.getItem("token")}`,
  //   },
  // }).catch(() => {
  //   // ignore error if backend logout fails
  // });
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

   const [files, setFiles] = useState([]);
const [uploading, setUploading] = useState(false);
const [uploadVisible, setUploadVisible] = useState(false);


function handleFileSelect(selectedFiles) {
  if (selectedFiles.length !== 4) {
    alert("Please select exactly 4 files (1 English + 3 Hindi)");
    return;
  }

  setFiles([...selectedFiles]);
}


async function handleUploadClick() {
  if (uploading) return;

  if (files.length !== 4) {
    alert("Please select 4 files first");
    return;
  }

      const englishFile = files.find(file =>
      file.name.toLowerCase().includes("_en")
    );

    const translationFiles = files.filter(file =>
      file.name.toLowerCase().includes("_hi")
    );

    if (!englishFile || translationFiles.length !== 3) {
      alert("Must upload 1 English (_En.xml) and 3 Hindi (_Hi_*.xml) files");
      return;
    }

    const formData = new FormData();
    formData.append("english", englishFile);
    translationFiles.forEach(file =>
      formData.append("translations", file)
    );

  
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
    setFiles([]); 
    setUploadVisible(true);

    navigate(`/lineviewer/${data.fileId}`);
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
    // <div className="min-h-screen bg-gradient-to-b from-[#0B0B1A] to-[#101020] text-white font-inter overflow-x-hidden">
//    <div className="relative min-h-screen bg-black text-white font-inter overflow-x-hidden">

      <div className="relative min-h-screen bg-black text-white font-inter overflow-x-hidden">
    {/* 🔦 FULLSCREEN LIGHT RAYS BACKGROUND */}
    {/* <LightRays
      raysOrigin="top-center"
      raysColor="#00ffff"
      raysSpeed={1.5}
      followMouse={true}
      mouseInfluence={0.2}
      className="absolute inset-0 pointer-events-none"
    /> */}
    

    <div className="absolute inset-0 pointer-events-none">
       {/* <LightRays 
       raysOrigin="top-center"
        raysColor="#00ffff" 
        raysSpeed={1.5} 
        lightSpread={0.8} 
        rayLength={1.2}
         followMouse={true} 
         mouseInfluence={0.1}
          noiseAmount={0.1}
           distortion={0.05} 
           className="w-full h-full" 
           /> */}

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
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold">
            P
          </div>
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
            src="/demovideo.mp4"
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



        {/* UPLOAD SECTION */}
        

      {/* <section id="upload" className="py-12">

  <input
  type="file"
  accept=".xml,.json"
  multiple
  hidden
  id="multi-upload"
  onChange={(e) => handleFileSelect(e.target.files)}
/>
 
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 id="upload-title" className="text-3xl font-bold mb-2 text-white">

            {title}
          </h2>
          <p className="text-lg text-gray-600">Get started by uploading your translation files</p>
        </div>

        <div
          className="upload-zone rounded-2xl p-8 text-center cursor-pointer border border-black-200 shadow-sm"
          onClick={() => document.getElementById("multi-upload").click()}

          role="button"
          tabIndex={0}
         onKeyDown={(e) => {
  if (e.key === "Enter" || e.key === " ")
    document.getElementById("multi-upload").click();
}}

          //aria-label="Upload files (click or press Enter)"
        >
          <div className="space-y-6">
            <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-teal-400 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-1 text-white">Drop files here or click to browse</h3>
              <p className="text-gray-600">Supports .xml and .json files up to 50MB</p>
            </div>

            <div className="flex justify-center space-x-3">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">.XML</span>
              <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">.JSON</span>
            </div>

            <div>
              <button
                type="button"
                 onClick={handleUploadClick}

                className="mt-2 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>

        {uploadVisible && (
          <div id="upload-success" className="mt-4 p-3 bg-transparent border border-green-200 rounded-lg">

            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span className="text-green-800 font-medium">File uploaded successfully!</span>
              <button
                className="ml-auto text-green-600 hover:text-green-800"
                onClick={() => {
                  if (typeof onGoToEvaluation === "function") onGoToEvaluation();
                }}
              >
                Go to evaluation →
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          After upload, the site will navigate to the evaluation configuration page
        </p>
      </div>
    </section> */}

      {/* ================= UPLOAD SECTION ================= */}
<section id="upload" className="py-12">
  {/* Hidden input (multiple files) */}
  <input
    type="file"
    accept=".xml,.json"
    multiple
    hidden
    id="multi-upload"
    onChange={(e) => handleFileSelect(e.target.files)}
  />

  <div className="max-w-4xl mx-auto px-6">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold mb-2 text-white">
        {title}
      </h2>
      <p className="text-lg text-gray-600">
        Upload exactly 4 files (1 English + 3 Hindi)
      </p>
    </div>

    {/* Upload Zone (ONLY opens file picker) */}
    <div
      className="upload-zone rounded-2xl p-8 text-center cursor-pointer border border-black-200 shadow-sm"
      onClick={() => document.getElementById("multi-upload").click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ")
          document.getElementById("multi-upload").click();
      }}
    >
      <div className="space-y-6">
        <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-teal-400 rounded-full flex items-center justify-center mx-auto">
          ⬆️
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-1 text-white">
            Click to select files
          </h3>
          <p className="text-gray-600">
            XML / JSON • Select all 4 files together
          </p>
        </div>

        {files.length > 0 && (
          <p className="text-green-400">
            {files.length} files selected
          </p>
        )}
      </div>
    </div>

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
                {config.footer_text}
              </p>
              <p className="text-gray-400 text-sm">Contact: research@tatva-eval.org</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <div className="space-y-3">
                <a href="#" className="block text-gray-300 hover:text-white">Documentation</a>
                <a href="#upload" className="block text-gray-300 hover:text-white">Upload Data</a>
                <a href="#" className="block text-gray-300 hover:text-white">Demo</a>
                <a href="#" className="block text-gray-300 hover:text-white">Privacy Policy</a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Research</h3>
              <div className="space-y-3">
                <a href="#" className="block text-gray-300 hover:text-white">Publications</a>
                <a href="#" className="block text-gray-300 hover:text-white">Methodology</a>
                <a href="#" className="block text-gray-300 hover:text-white">Open Source</a>
                <a href="#" className="block text-gray-300 hover:text-white">License</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">© 2024 TATVA Research Project. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  </div>
  );
}
  





