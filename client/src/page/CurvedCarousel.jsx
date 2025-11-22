// Replace the entire component with this version (React + Tailwind)
// Keeps your defaultConfig and carouselData the same as before.

import React, { useState, useEffect, useRef } from "react";

const defaultConfig = {
 // background_color:",
  card_border_color: "#ffffff",
  text_color: "#ffffff",
  button_color: "#000000",
  card_1_title: "Explore Nature",
  card_1_subtitle: "Discover the wilderness",
  card_2_title: "Urban Adventures",
  card_2_subtitle: "City life awaits",
  card_3_title: "Ocean Dreams",
  card_3_subtitle: "Dive into blue",
  card_4_title: "Mountain Peaks",
  card_4_subtitle: "Reach new heights",
  card_5_title: "Desert Wonders",
  card_5_subtitle: "Golden horizons",
  font_family: "Inter",
  font_size: 16,
};

let config = { ...defaultConfig };

const carouselData = [
  { id: 1, image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&fit=crop", titleKey: "card_1_title", subtitleKey: "card_1_subtitle" },
  { id: 2, image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=800&fit=crop", titleKey: "card_2_title", subtitleKey: "card_2_subtitle" },
  { id: 3, image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=800&fit=crop", titleKey: "card_3_title", subtitleKey: "card_3_subtitle" },
  { id: 4, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop", titleKey: "card_4_title", subtitleKey: "card_4_subtitle" },
  { id: 5, image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&h=800&fit=crop", titleKey: "card_5_title", subtitleKey: "card_5_subtitle" },
];

const Card = ({ card, isActive, position, cfg, baseFontSize }) => {
  const getOpacity = () => (position === 0 ? 1 : Math.abs(position) === 1 ? 0.95 : 0.7);
  const getScale = () => (isActive ? 1.02 : 0.98);

  return (
    <div
      className="flex-shrink-0 transition-all duration-[420ms] ease-[cubic-bezier(.22,.9,.28,1)]"
      style={{
        width: 360,
        height: 360,
        marginRight: 16,
        opacity: getOpacity(),
        transform: `scale(${getScale()})`,
        willChange: "transform, opacity",
      }}
    >
      {/* Image itself carries the white border and rounded corners.
          This avoids white background showing through the ellipse clip-path. */}
      <div className="w-full h-full rounded-xl overflow-hidden" style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.16)" }}>
        <img
          src={card.image}
          alt={cfg[card.titleKey] || defaultConfig[card.titleKey]}
          className="w-full h-full object-cover block"
          style={{
            borderRadius: 12,
            border: `6px solid ${cfg.card_border_color || defaultConfig.card_border_color}`,
            display: "block",
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-center pointer-events-none" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }}>
          <h3 className="font-semibold mb-1" style={{ fontSize: `${baseFontSize * 1.25}px`, color: cfg.text_color || defaultConfig.text_color }}>
            {cfg[card.titleKey] || defaultConfig[card.titleKey]}
          </h3>
          <p style={{ fontSize: `${baseFontSize * 0.875}px`, color: cfg.text_color || defaultConfig.text_color, opacity: 0.9 }}>
            {cfg[card.subtitleKey] || defaultConfig[card.subtitleKey]}
          </p>
        </div>
      </div>
    </div>
  );
};

const ArrowButton = ({ direction, onClick, disabled, buttonColor }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={`${direction === "left" ? "Previous" : "Next"} slide`}
    className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20"
    style={{ border: `2px solid ${buttonColor}`, background: "transparent", color: "rgba(0,0,0,0.6)" }}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {direction === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  </button>
);

const DotIndicator = ({ isActive, buttonColor }) => (
  <div className="w-2 h-2 rounded-full transition-all duration-200" style={{ backgroundColor: isActive ? buttonColor : `${buttonColor}60`, transform: isActive ? "scale(1.25)" : "scale(1)" }} />
);

export default function CurvedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [cfg, setCfg] = useState(config);
  const containerRef = useRef(null);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") setCurrentIndex((p) => Math.max(0, p - 1));
      if (e.key === "ArrowRight") setCurrentIndex((p) => Math.min(carouselData.length - 1, p + 1));
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const handlePrev = () => setCurrentIndex((p) => Math.max(0, p - 1));
  const handleNext = () => setCurrentIndex((p) => Math.min(carouselData.length - 1, p + 1));

  const handleDragStart = (clientX) => {
    isDraggingRef.current = true;
    startXRef.current = clientX;
  };
  const handleDragEnd = (clientX) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const delta = clientX - startXRef.current;
    if (Math.abs(delta) > 50) (delta > 0 ? handlePrev() : handleNext());
  };

  const calculateTransform = () => {
    const cardW = 360;
    const gap = 16;
    const containerW = containerRef.current?.offsetWidth || window.innerWidth;
    // center the card index in viewport
    const center = (containerW / 2) - (cardW / 2);
    const offset = center - currentIndex * (cardW + gap);
    return `translateX(${offset}px)`;
  };

  const baseFontSize = cfg.font_size || defaultConfig.font_size;

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center" style={{ background: cfg.background_color || defaultConfig.background_color, fontFamily: `${cfg.font_family || defaultConfig.font_family}, system-ui, -apple-system, sans-serif` }}>
      {/* clipped elliptical frame */}
      <div
        ref={containerRef}
        className="w-full relative overflow-hidden"
        style={{ height: 480, clipPath: "ellipse(55% 45% at 50% 55%)" }}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseUp={(e) => handleDragEnd(e.clientX)}
        onMouseLeave={(e) => isDraggingRef.current && handleDragEnd(e.clientX)}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
      >
        <div className="flex transition-transform duration-[420ms] ease-[cubic-bezier(.22,.9,.28,1)]" style={{ transform: calculateTransform(), paddingTop: 60, paddingBottom: 40, willChange: "transform" }}>
          {carouselData.map((card, i) => (
            <Card key={card.id} card={card} isActive={i === currentIndex} position={i - currentIndex} cfg={cfg} baseFontSize={baseFontSize} />
          ))}
        </div>
      </div>

      {/* controls placed OUTSIDE the clipped region */}
      <div className="flex items-center gap-6 mt-8">
        <ArrowButton direction="left" onClick={handlePrev} disabled={currentIndex === 0} buttonColor={cfg.button_color || defaultConfig.button_color} />
        <div className="flex gap-3 items-center">
          {carouselData.map((_, i) => <DotIndicator key={i} isActive={i === currentIndex} buttonColor={cfg.button_color || defaultConfig.button_color} />)}
        </div>
        <ArrowButton direction="right" onClick={handleNext} disabled={currentIndex === carouselData.length - 1} buttonColor={cfg.button_color || defaultConfig.button_color} />
      </div>

      <style>{`.perspective-left{transform:perspective(1200px) rotateY(6deg)} .perspective-right{transform:perspective(1200px) rotateY(-6deg)} @media (max-width:768px){.perspective-left,.perspective-right{transform:none}}`}</style>
    </div>
  );
}
