// src/pages/LineViewer.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//import WebName from "../components/WebName";
import Stepper, { Step } from '../components/Stepper';
import BackgroundWords from "../componets/BackgroundWords";
  

const LineViewer = () => {
  const { id:fileId } = useParams(); // may be undefined
  console.log("FILE ID FROM URL:", fileId);

  const [lines, setLines] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [posTags, setPosTags] = useState([]);
  const navigate = useNavigate();


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

  const posColorMap = {
     NOUN: "bg-blue-600",
    VERB: "bg-red-600",
    ADJ: "bg-purple-600",
    ADV: "bg-pink-600",
    PRON: "bg-green-600",
    DET: "bg-yellow-600",
    ADP: "bg-indigo-600",
    CCONJ: "bg-teal-600",
    PROPN: "bg-orange-600",
    PUNCT: "bg-gray-600",
  };

  // const getRandomColor = () => {
  //   return posColors[Math.floor(Math.random() * posColors.length)];
  // };

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
    setPosTags([]);
    if (lines.length > 0 && lines[currentIndex]) {
      const sentence = lines[currentIndex].text;
      getPOSTags(sentence).then((tags) => setPosTags(tags));
    } else {
      setPosTags([]);
    }
  }, [currentIndex, lines]);

   if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-red-400 font-semibold">{error}</p>
      </div>
    );

  if (!lines.length)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-gray-400">No lines found.</p>
      </div>
    );
  const currentLine = lines[currentIndex] || { text: "", translations: [] };
 
  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  }; 
   
  return (
  <div className="relative min-h-screen bg-gray-900 text-white flex justify-center items-center p-6 overflow-hidden">
    {/* Aurora Background
    <Aurora
      className="absolute inset-0"
      colorStops={["#1C1C1C", "#555555", "#888888"]}
      blend={0.5}
      amplitude={1.0}
      speed={0.5}
    /> */}

    {/* Animated Words Background */}
    <BackgroundWords />

    {/* Website Name in Top Left */}
     {/* <div className="absolute top-4 left-4 z-20">
      <WebName
        text="TATVA"
        className="text-3xl font-bold text-blue-400"
        delay={100}
        duration={0.6}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 40 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        rootMargin="-100px"
        textAlign="left"
        onLetterAnimationComplete={handleAnimationComplete}
      />
    </div>  */}
    <div className=" 
                    w-full max-w-11xl 
                    min-h-[75vh] max-h-[85vh] 
                    flex flex-col justify-between">  
    <Stepper
      initialStep={1}
      onStepChange={(step) => {
        setCurrentIndex(step - 1); 
        console.log(step);
      }}
      onEvaluate={() => {
        const translationId = lines[currentIndex]?._id;
        navigate(`/evaluate/${translationId}`);
      }}

      onFinalStepCompleted={() => console.log("All steps completed!")}
      backButtonText="Previous"
      nextButtonText="Next"
    >
      {lines.map((line, idx) => (
        <Step key={line._id || idx}className="bg-transparent">
          <div className="h-auto pr-2">

            {/* English Line with colored POS words */}
            <div className="mb-4">
              <div className="text-lg font-semibold text-white flex flex-wrap gap-2">
                <span className="text-gray-400">English:</span>
                {idx === currentIndex && posTags.length > 0 ? (
                  posTags.map((token, i) => {
                    const color = posColorMap[token.upos] || "bg-gray-700";
                    return (
                      <span
                        key={i}
                        className={`relative group px-2 py-1 rounded ${color} text-white`}
                      >
                        {token.text}
                        {/* Tooltip */}
                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded shadow-lg z-20 whitespace-nowrap">
                          <div>
                            <strong>Lemma:</strong> {token.lemma}
                          </div>
                          <div>
                            <strong>POS:</strong> {token.upos}
                          </div>
                          {token.ner && (
                            <div>
                              <strong>NER:</strong> {token.ner}
                            </div>
                          )}
                        </div>   
                      </span>
                    );
                  })
                ) : (
                  <span className="ml-2 text-gray-400">{line.text}</span>
              )}

              </div>
            </div>

            {/* Legend Block */}
            <div className="mt-6 p-3 rounded-lg bg-gray-800 border border-gray-700">
              <h4 className="text-gray-300 text-sm mb-2">Legend</h4>
              <div className="flex flex-wrap gap-4 text-sm">
                {Object.entries(posColorMap).map(([pos, color], idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${color}`}></div>
                    <span>{pos}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hindi Translations */}
            {line.translations?.length > 0 ? (
              <div className="mt-4">
                {line.translations.map((t, tIdx) => (
                  <p
                    key={tIdx}
                    className="text-gray-200 bg-gray-800 px-3 py-2 rounded-lg border border-gray-700 mb-1"
                  >
                    <span className="font-semibold text-blue-400">
                      {t?.translator?.code || `T0${tIdx + 1}`}:
                    </span>{" "}
                    {t?.translatedText}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-4">No translations available</p>
            )}
          </div>
        </Step>
     ))} 
    </Stepper>
  </div>
  </div>
);

};

export default LineViewer;
