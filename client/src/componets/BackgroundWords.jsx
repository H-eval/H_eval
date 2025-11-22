// import React, { useEffect } from "react";
// import "./BackgroundWords.css"; 
// const words = [
//   "Welcome", "Translation", "Language", "Communication", "Learn",
//   "स्वागत", "अनुवाद", "भाषा", "संचार", "सीखना",
//   "স্বাগতম", "অনুবাদ", "ভাষা", "শিক্ষা", "যোগাযোগ",
//   "ಸ್ವಾಗತ", "ಅನುವಾದ", "ಭಾಷೆ", "ಕಲಿಯಿರಿ", "ಸಂಪರ್ಕ",
//   "സ്വാഗതം", "ഭാഷ", "പരിഭാഷ", "പഠിക്കുക", "ബന്ധം",
//   "வரவேற்கிறேன்", "மொழி", "மொழிபெயர்ப்பு", "கற்பது", "தொடர்பு",
//   "స్వాగతం", "అనువాదం", "భాష", "నేర్చుకోండి", "సంప్రదించండి",
//   "ସ୍ୱାଗତ", "ଅନୁବାଦ", "ଭାଷା", "ଶିଖ", "ଯୋଗାଯୋଗ"
// ];

// const fonts = [
//   "Arial", "Verdana", "Georgia", "Courier New",
//   "Comic Sans MS", "Impact", "Times New Roman", "Trebuchet MS", "Lucida Console"
// ];

// export default function BackgroundWords() {
//   useEffect(() => {
//     const container = document.createElement("div");
//     container.className = "background-container";
//     document.body.appendChild(container);

//     const rows = 6, cols = 8;

//     function createWord(row, col) {
//       const word = document.createElement("div");
//       word.className = "background-word";
//       word.innerText = words[Math.floor(Math.random() * words.length)];

//       const cellWidth = 100 / cols;
//       const cellHeight = 100 / rows;
//       const top = row * cellHeight + Math.random() * (cellHeight - 10);
//       const left = col * cellWidth + Math.random() * (cellWidth - 10);

//       word.style.top = top + "vh";
//       word.style.left = left + "vw";
//       word.style.fontSize = (Math.random() * 2 + 1.2) + "rem";
//       word.style.fontWeight = Math.random() > 0.5 ? "bold" : "lighter";
//       word.style.fontFamily = fonts[Math.floor(Math.random() * fonts.length)];
//       word.style.animationDuration = (5 + Math.random() * 5) + "s";

//       container.appendChild(word);
//     }

//     for (let r = 0; r < rows; r++) {
//       for (let c = 0; c < cols; c++) {
//         createWord(r, c);
//       }
//     }

//     return () => container.remove(); // Cleanup on unmount
//   }, []);

//   return null;
// }
// src/components/BackgroundWords.jsx
import React, { useEffect, useRef } from "react";
import "./BackgroundWords.css";

const words = [
  "Welcome", "Translation", "Language", "Communication", "Learn",
  "स्वागत", "अनुवाद", "भाषा", "संचार", "सीखना",
  "স্বাগতম", "অনুবাদ", "ভাষা", "শিক্ষা", "যোগাযোগ",
  "ಸ್ವಾಗತ", "ಅನುವಾದ", "ಭಾಷೆ", "ಕಲಿಯಿರಿ", "ಸಂಪರ್ಕ",
  "സ്വാഗതം", "ഭാഷ", "പരിഭാഷ", "പഠിക്കുക", "ബന്ധം",
  "வரவேற்கிறேன்", "மொழி", "மொழிபெயர்ப்பு", "கற்பது", "தொடர்பு",
  "స్వాగతం", "అనువాదం", "భాష", "నేర్చుకోండి", "సంప్రదించండి",
  "ସ୍ୱାଗତ", "ଅନୁବାଦ", "ଭାଷା", "ଶିଖ", "ଯୋଗାଯୋଗ"
];

const fonts = [
  "Arial", "Verdana", "Georgia", "Courier New",
  "Comic Sans MS", "Impact", "Times New Roman", "Trebuchet MS", "Lucida Console"
];

export default function BackgroundWords({ className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // defensive clear
    container.innerHTML = "";

    const rows = 6;
    const cols = 8;

    function createWord(row, col) {
      const word = document.createElement("div");
      word.className = "background-word";
      word.innerText = words[Math.floor(Math.random() * words.length)];

      const cellWidth = 100 / cols;
      const cellHeight = 100 / rows;
      const top = row * cellHeight + Math.random() * (cellHeight - 10);
      const left = col * cellWidth + Math.random() * (cellWidth - 10);

      word.style.position = "absolute";
      word.style.top = top + "vh";
      word.style.left = left + "vw";
      word.style.fontSize = (Math.random() * 2 + 1.2) + "rem";
      word.style.fontWeight = Math.random() > 0.5 ? "700" : "300";
      word.style.fontFamily = fonts[Math.floor(Math.random() * fonts.length)];
      word.style.animationDuration = (5 + Math.random() * 5) + "s";
      word.style.pointerEvents = "none"; // so clicks pass through

      container.appendChild(word);
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        createWord(r, c);
      }
    }

    // cleanup on unmount
    return () => {
      container.innerHTML = "";
    };
  }, []);

  return <div ref={containerRef} className={`background-container ${className}`} aria-hidden="true" />;
}
