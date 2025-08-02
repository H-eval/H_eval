// ViewTranslations.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewTranslations = () => {
  const { fileId } = useParams();
  const [lines, setLines] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
         const response = await fetch(`/api/translations/${fileId}`);
        const data = await response.json();
        setLines(data.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching translation:", err);
      }
    };
    fetchTranslations();
  }, [fileId]);

  const handleNext = () => {
    if (currentIndex < lines.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (lines.length === 0) return <div>No translations found.</div>;

  const currentLine = lines[currentIndex];

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>Line {currentIndex + 1} of {lines.length}</h2>
      <p><strong>English:</strong> {currentLine.english}</p>
      <p><strong>Hindi E1:</strong> {currentLine.hindi1}</p>
      <p><strong>Hindi E2:</strong> {currentLine.hindi2}</p>
      <p><strong>Hindi R1:</strong> {currentLine.hindi3}</p>
      <button onClick={handleNext} disabled={currentIndex >= lines.length - 1}>
        Next
      </button>
    </div>
  );
};

export default ViewTranslations;