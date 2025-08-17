// src/pages/Home.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [englishFile, setEnglishFile] = useState(null);
  const [translationFiles, setTranslationFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // // Handle file upload
  // const handleUpload = async (e) => {
  //   e.preventDefault();
  //   if (!englishFile || translationFiles.length !== 3) {
  //     alert("Please upload 1 English file and exactly 3 Hindi translation files.");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("english", englishFile);
  //   translationFiles.forEach((file) => formData.append("translations", file));

  //   setLoading(true);
  //   try {
  //     const res = await fetch("http://localhost:5000/api/uploads", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const data = await res.json();
  //     setLoading(false);

  //     if (res.ok) {
  //       alert("Upload successful!");
  //       navigate("/translate"); // ✅ Directly go to line viewer page
  //     } else {
  //       alert(data.message || "Upload failed");
  //     }
  //   } catch (err) {
  //     console.error("Upload error:", err);
  //     setLoading(false);
  //   }
  // };
  const handleUpload = async (e) => {
  e.preventDefault();
  if (!englishFile || translationFiles.length !== 3) {
    alert("Please upload 1 English file and exactly 3 Hindi translation files.");
    return;
  }

  const formData = new FormData();
  formData.append("english", englishFile);
  translationFiles.forEach((file) => formData.append("translations", file));

  setLoading(true);
  try {
    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
  const next = data?.fileId ? `/translate/${data.fileId}` : `/translate`;
  navigate(next);
} else {
  alert(data.message || "Upload failed");
}
  } catch (err) {
    console.error("Upload error:", err);
    setLoading(false);
  }
};

  // ✅ Append instead of overwrite when adding translation files
  const handleTranslationFilesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setTranslationFiles((prev) => [...prev, ...newFiles]);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Upload Files</h1>

      <form
        onSubmit={handleUpload}
        style={{
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        {/* English File */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "bold" }}>English File: </label>
          <input
            type="file"
            accept=".xml"
            onChange={(e) => setEnglishFile(e.target.files[0])}
          />
          {englishFile && (
            <p style={{ fontSize: "14px" }}>📄 {englishFile.name}</p>
          )}
        </div>

        {/* Translation Files */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "bold" }}>
            Translation Files (3 Hindi):
          </label>
          <input
            type="file"
            accept=".xml"
            multiple
            onChange={handleTranslationFilesChange}
          />
          {translationFiles.length > 0 && (
            <ul style={{ fontSize: "14px", marginTop: "5px" }}>
              {translationFiles.map((file, index) => (
                <li key={index}>📄 {file.name}</li>
              ))}
            </ul>
          )}
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
