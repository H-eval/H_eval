// src/pages/LineViewer.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const LineViewer = () => {
  const { fileId } = useParams(); // may be undefined
  const [lines, setLines] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [posTags, setPosTags] = useState([]);

  // Call Python NLP service for POS tags
  const getPOSTags = async (sentence) => {
    try {
      const res = await fetch("http://127.0.0.1:5001/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sentence }),
      });

      if (!res.ok) throw new Error("Failed to fetch POS tags");

      const data = await res.json();
      return data.tokens || []; // array of { text, lemma, upos, ner }
    } catch (err) {
      console.error("NLP service error:", err);
      return [];
    }
  };

  // Fetch translations from Node backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `http://localhost:5000/api/translations/sequences${
          fileId ? `?fileId=${fileId}` : ""
        }`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch translations");
        const data = await res.json();
        setLines(data || []);
      } catch (err) {
        console.error(err);
        setError("Could not load translations.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fileId]);

  // Fetch POS tags whenever the current English line changes
  useEffect(() => {
    if (lines.length > 0 && lines[currentIndex]) {
      const sentence = lines[currentIndex].text;
      getPOSTags(sentence).then((tags) => setPosTags(tags));
    } else {
      setPosTags([]);
    }
  }, [currentIndex, lines]);

  if (loading) return <p>Loading translations...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!lines.length) return <p>No lines found.</p>;

  const currentLine = lines[currentIndex] || { text: "", translations: [] };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#333" }}>Line-by-Line Viewer</h2>

      {/* English Line */}
      <p style={{ fontSize: "18px", fontWeight: "bold" }}>
        English: {currentLine.text}
      </p>

      {/* Hindi Translations */}
      {currentLine.translations && currentLine.translations.length > 0 ? (
        <div>
          {currentLine.translations.map((t, idx) => (
            <p key={idx} style={{ fontSize: "16px", color: "#555" }}>
              {t?.translator?.code || `T0${idx + 1}`}: {t?.translatedText}
            </p>
          ))}
        </div>
      ) : (
        <p style={{ color: "#999" }}>No translations available</p>
      )}

      {/* POS Tags */}
      <div style={{ marginTop: "20px" }}>
        <h3>POS Tags</h3>
        {posTags.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {posTags.map((token, idx) => (
              <li key={idx} style={{ marginBottom: "5px" }}>
                <strong>{token.text}</strong> — {token.upos}{" "}
                <em>({token.lemma})</em> {token.ner && `[NER: ${token.ner}]`}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "#999" }}>No POS tags available</p>
        )}
      </div>

      {/* Navigation */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
          disabled={currentIndex === 0}
          style={{ marginRight: "10px", padding: "5px 10px" }}
        >
          Previous
        </button>
        <button
          onClick={() =>
            setCurrentIndex((i) => Math.min(i + 1, lines.length - 1))
          }
          disabled={currentIndex === lines.length - 1}
          style={{ padding: "5px 10px" }}
        >
          Next
        </button>
      </div>

      {/* Progress Indicator */}
      <p style={{ marginTop: "10px", color: "#777" }}>
        Line {currentIndex + 1} of {lines.length}
      </p>
    </div>
  );
};

export default LineViewer;
