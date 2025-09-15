import React, { useState, useEffect } from "react";
import "./index.css"; // ensure this line is present so the CSS above is loaded

const WORDS = [
  // English
  "Welcome", "Translation", "Language", "Communication", "Learn", "Speak", "Understand",
  // Hindi
  "स्वागत", "अनुवाद", "भाषा", "संचार", "सीखना", "बोलो", "समझो",
  // Kannada
  "ಸ್ವಾಗತ", "ಅನುವಾದ", "ಭಾಷೆ", "ಸಂಪರ್ಕ", "ಕಲಿಯಿರಿ", "ಮಾತನಾಡಿ",
  // Malayalam
  "സ്വാഗതം", "പരിഭാഷ", "ഭാഷ", "സംസാരം", "പഠിക്കുക", "പറയുക",
  // Odia
  "ସ୍ବାଗତ", "ଅନୁବାଦ", "ଭାଷା", "ସଂଚାର", "ଶିଖ", "କହନ୍ତୁ",
  // Marathi
  "स्वागत", "भाषा", "अनुवाद", "संचार", "शिका", "बोल"
];

function shuffleArray(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function MovingBackground() {
  // create positions synchronously (first render has positions)
  const [cells] = useState(() => {
    // choose grid size — more cells than words to get spread
    const rows = 6;
    const cols = 12;
    const cellWidth = 100 / cols;
    const cellHeight = 100 / rows;
    const coords = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        coords.push({ r, c, cellLeft: c * cellWidth, cellTop: r * cellHeight, cellW: cellWidth, cellH: cellHeight });
      }
    }
    return shuffleArray(coords);
  });

  // take first N safe cells and create per-word styles
  const [placed, setPlaced] = useState(() => {
    const chosen = cells.slice(0, WORDS.length);
    return chosen.map((cell, i) => {
      // random offset inside the cell (leave small margins)
      const marginX = Math.max(6, cell.cellW * 0.12);
      const marginY = Math.max(4, cell.cellH * 0.12);

      const left = cell.cellLeft + marginX * Math.random() * 0.8 + Math.random() * (cell.cellW - marginX * 2);
      const top  = cell.cellTop  + marginY * Math.random() * 0.8 + Math.random() * (cell.cellH - marginY * 2);

      // choose size class
      const sizes = ["size-xs", "size-sm", "size-md", "size-lg", "size-xl"];
      const sizesWeights = [0.18, 0.28, 0.26, 0.2, 0.08]; // weighted pick
      const pickWeighted = (arr, weights) => {
        const rnd = Math.random();
        let acc = 0;
        for (let k = 0; k < arr.length; k++) {
          acc += weights[k];
          if (rnd <= acc) return arr[k];
        }
        return arr[arr.length - 1];
      };
      const sizeClass = pickWeighted(sizes, sizesWeights);

      // choose drift class
      const drifts = ["drift-slow", "drift-medium", "drift-fast"];
      const driftClass = drifts[Math.floor(Math.random() * drifts.length)];

      // color tint roughly
      const tints = ["tint-1","tint-2","tint-3","tint-4"];
      const tint = tints[Math.floor(Math.random() * tints.length)];

      // small random blur variance
      const blurPx = Math.random() * 1.4 + 0.2; // 0.2 - 1.6 px

      return {
        top: `${top}%`,
        left: `${left}%`,
        sizeClass,
        driftClass,
        tint,
        blurPx,
      };
    });
  });

  // on resize, recalc positions (but keep same number / distribution)
  useEffect(() => {
    const onResize = () => {
      // recompute new random offsets inside the same grid cells
      setPlaced(prev => prev.map(p => {
        // compute new top/left jitter within same percent ranges
        const jitterX = (Math.random() - 0.5) * 4; // +/-2%
        const jitterY = (Math.random() - 0.5) * 3;
        // parse percent, add jitter but clamp
        const parse = s => Number(s.replace("%",""));
        const newLeft = Math.max(1, Math.min(99, parse(prev[0]?.left || p.left) + jitterX));
        const newTop  = Math.max(1, Math.min(99, parse(prev[0]?.top || p.top)  + jitterY));
        return {...p, left: `${newLeft}%`, top: `${newTop}%`};
      }));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="moving-bg">
      {/* background words */}
      {WORDS.map((w, i) => {
        const pos = placed[i];
        if (!pos) return null;
        return (
          <div
            key={i}
            className={`bg-word ${pos.sizeClass} ${pos.driftClass} ${pos.tint}`}
            style={{
              top: pos.top,
              left: pos.left,
              filter: `blur(${pos.blurPx}px)`,
              opacity: 1,
            }}
            aria-hidden
          >
            {w}
          </div>
        );
      })}

      {/* front content (keeps readable) */}
      <div className="front-content">
        <div className="text-center center-safe">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-lg">
            🌍 Welcome — Multilingual Demo
          </h1>
          <p className="text-sm md:text-base text-white/70 mt-3">Translation · Language · Communication</p>
        </div>
      </div>
    </div>
  );
}
