import { useEffect, useState } from "react";
import BlurText from "../componets/Blur";

export default function SplashScreen({ onFinish }) {
  const [showFullForm, setShowFullForm] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);

    // Show full form after 2s
    const formTimer = setTimeout(() => setShowFullForm(true), 2000);
    // End splash after 5s
    const finishTimer = setTimeout(() => {
    if (typeof onFinish === "function") {
      onFinish();
    } else {
      console.warn("⚠️ SplashScreen rendered without onFinish prop!");
    }
  }, 5000);
    // Floating words background
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

    function getRandomFont() {
      const fonts = [
        "Arial", "Verdana", "Georgia", "Courier New",
        "Comic Sans MS", "Impact", "Times New Roman", "Trebuchet MS", "Lucida Console"
      ];
      return fonts[Math.floor(Math.random() * fonts.length)];
    }

    function createWord(row, col, rows, cols) {
      const word = document.createElement("div");
      word.className = "floating-word";
      word.innerText = words[Math.floor(Math.random() * words.length)];

      const cellWidth = 100 / cols;
      const cellHeight = 100 / rows;
      const top = row * cellHeight + Math.random() * (cellHeight - 10);
      const left = col * cellWidth + Math.random() * (cellWidth - 10);

      word.style.top = top + "vh";
      word.style.left = left + "vw";
      word.style.fontSize = (Math.random() * 2 + 1.5) + "rem"; // slightly bigger
      word.style.fontWeight = Math.random() > 0.5 ? "bold" : "lighter";
      word.style.fontFamily = getRandomFont();
      word.style.animationDuration = (5 + Math.random() * 5) + "s";

      document.body.appendChild(word);
    }

    const rows = 6, cols = 8;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        createWord(r, c, rows, cols);
      }
    }

    return () => {
      clearTimeout(formTimer);
      clearTimeout(finishTimer);
      document.querySelectorAll(".floating-word").forEach(el => el.remove());
    };
  }, [onFinish]);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-black text-white relative overflow-hidden">
      {/* Main TATVA text bigger and bolder */}
      <BlurText
        text="TATVA"
        delay={150}
        className={`text-8xl md:text-9xl font-extrabold transition-transform duration-1000 ease-out ${
          animate ? "scale-150 opacity-100" : "scale-50 opacity-0"
        }`}
        stepDuration={0.5}
      />

      {/* Full form */}
      {showFullForm && (
        <BlurText
          text="Translation Assessment with Trustworthy Verdict and Annotation"
          delay={80}
          className="mt-4 text-xl md:text-2xl font-medium text-center"
          stepDuration={0.4}
        />
      )}

      {/* Floating words CSS */}
      <style >{`
        .floating-word {
          position: absolute;
          color: rgba(255, 255, 255, 0.25);
          pointer-events: none;
          white-space: nowrap;
          filter: blur(2px);
          animation: float 6s infinite ease-in-out alternate;
        }

        @keyframes float {
          0% { transform: translate(0px, 0px) rotate(0deg); }
          50% { transform: translate(15px, -15px) rotate(3deg); }
          100% { transform: translate(-10px, 10px) rotate(-3deg); }
        }
      `}</style>
    </div>
  );
}
