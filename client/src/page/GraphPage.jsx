 import React, { useEffect, useState, useMemo } from "react";
import { useParams , useNavigate} from "react-router-dom";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

// ─── Helpers ───────────────────────────────────────────────────────────────

const avg = (arr) =>
  arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const barColor = (score) => {
  if (score >= 7) return "#1D9E75";
  if (score >= 5) return "#BA7517";
  return "#D85A30";
};




// 🧠 Correlation
const getCorrelation = (points) => {
  const n = points.length;
  if (!n) return 0;

  const avgX = avg(points.map(p => p.humanScore));
  const avgY = avg(points.map(p => p.autoScore));

  let num = 0, denX = 0, denY = 0;

  points.forEach(p => {
    num += (p.humanScore - avgX) * (p.autoScore - avgY);
    denX += Math.pow(p.humanScore - avgX, 2);
    denY += Math.pow(p.autoScore - avgY, 2);
  });
  //if (denX === 0 || denY === 0) return 0;
  return num / Math.sqrt(denX * denY);
};

// 📈 Regression
const getRegression = (points) => {
  const n = points.length;
  if (!n) return [];

  const sumX = points.reduce((a, p) => a + p.x, 0);
  const sumY = points.reduce((a, p) => a + p.y, 0);
  const sumXY = points.reduce((a, p) => a + p.x * p.y, 0);
  const sumX2 = points.reduce((a, p) => a + p.x * p.x, 0);

  const slope =
    (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  const intercept = (sumY - slope * sumX) / n;

  return points.map(p => ({
    x: p.x,
    y: slope * p.x + intercept
  }));
};

// ─── Components ────────────────────────────────────────────────────────────

const MetricCard = ({ label, value, color }) => (
  <div className="flex flex-col items-center justify-center bg-gray-900 border border-gray-800 rounded-xl p-5">
    <p className="text-xs text-gray-500 uppercase">{label}</p>
    <p className="text-3xl font-semibold" style={{ color }}>{value}</p>
  </div>
);

// ─── Main ──────────────────────────────────────────────────────────────────

const GraphPage = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();

  const [points, setPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);

  useEffect(() => {
    fetch(`  https://h-eval-backend.onrender.com/api/history/${batchId}`)
      .then(res => res.json())
      .then(data => {
         console.log(data);
        const graphPoints = data.map(item => {
          const scores = item.Criterions.map(c => Number(c.score)).filter(s => !isNaN(s));
          const humanScore = avg(scores);
          //const autoScore = item.auto?.score ?? 0;

          const autoRaw = Number(item.auto?.score);

          // 🔥 scale auto score to match human score
          const autoScore = isNaN(autoRaw) ? 0 : autoRaw * 3;

          console.log("Human:", humanScore, "Auto:", autoScore);

          return {
            x: humanScore,
            y: autoScore,
            humanScore,
            autoScore,
            diff: Math.abs(humanScore - autoScore),
            criterions: item.Criterions
          };
        });

        setPoints(graphPoints);
      });
  }, [batchId]);
  

  // 📊 Stats
  const avgHuman = avg(points.map(p => p.humanScore)).toFixed(2);
  const avgAuto = avg(points.map(p => p.autoScore)).toFixed(2);

  // const accuracy = points.length
  //   ? ((points.filter(p => p.diff < 1).length / points.length) * 100).toFixed(1)
  //   : "0";

   const accuracy = points.length
  ? (
      points.reduce((acc, p) => acc + (1 - Math.min(p.diff, 10) / 10), 0) 
      / points.length * 100
    ).toFixed(1)
  : "0";

  console.log(points.map(p => p.diff));

  const correlation = getCorrelation(points).toFixed(2);
  const corrValue = Number(correlation);

  const corrColor =
    corrValue > 0.5 ? "text-green-400" :
    corrValue > 0 ? "text-yellow-400" :
    corrValue === 0 ? "text-gray-400" :
    "text-red-400";


    let corrText = "";

    if (corrValue >= 0.8) corrText = "Strong positive correlation";
    else if (corrValue >= 0.5) corrText = "Moderate positive correlation";
    else if (corrValue > 0) corrText = "Weak positive correlation";
    else if (corrValue === 0) corrText = "No correlation";
    else if (corrValue > -0.5) corrText = "Weak negative correlation";
    else if (corrValue > -0.8) corrText = "Moderate negative correlation";
    else corrText = "Strong negative correlation";

  const regressionData = getRegression(points);

  const idealLine = points.map(p => ({ x: p.x, y: p.x }));

  return (
    <div className="relative min-h-screen bg-black text-white p-10">
      {/* 🔥 Back Button Top Left */}
      <div
        className="absolute top-6 left-6 z-50 cursor-pointer group"
        onClick={() => navigate(`/batch-analysis/${batchId}`)}
      >
        <div className="
          w-11 h-11 
          rounded-full 
          border-2 border-white 
          flex items-center justify-center 
          bg-transparent
          transition-all duration-200
          group-hover:bg-white group-hover:border-white
        ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-white group-hover:text-gray-900 transition-colors duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      </div>

      <h1 className="text-3xl text-center mb-6">Graph Analysis</h1>

      {/* Cards */}
      <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto mb-6">
        <MetricCard label="Avg Human" value={avgHuman} color="#378ADD" />
        <MetricCard label="Avg Auto" value={avgAuto} color="#1D9E75" />
        <MetricCard label="Accuracy" value={accuracy + "%"} color="#BA7517" />
        <MetricCard label="Correlation" value={correlation} color="#ff4dff" />
      </div>

      {/* Correlation text */}
      <div className={`text-center mb-6 ${corrColor}`}>
        {corrText}
      </div>

      <div className="flex gap-6">

        {/* GRAPH */}
        <div className="flex-1 bg-gray-900 p-6 rounded-xl">
          <div style={{ height: "400px" }}>
            <Scatter
              key={points.length}
              data={{
                datasets: [
                  {
                    label: "Scores",
                    data: points,
                    pointRadius: 7,
                    backgroundColor: (ctx) => {
                      const p = ctx?.raw;
                      if (!p) return "#888";
                      return p.diff < 1 ? "#00ffcc" : "#ff4d4d";
                    }
                  },
                  {
                    label: "Ideal",
                    data: idealLine,
                    borderColor: "#888",
                    showLine: true,
                    pointRadius: 0,
                    parsing: false
                  },
                  {
                    label: "Regression",
                    data: regressionData,
                    borderColor: "#00aaff",
                    showLine: true,
                    pointRadius: 0,
                    parsing: false
                  }
                ]
              }}
              options={{
                onClick: (e, elements, chart) => {
                  if (elements.length > 0) {
                    setSelectedPoint(chart.data.datasets[0].data[elements[0].index]);
                  }
                },
                plugins: {
                  legend: { labels: { color: "white" } }
                },
                scales: {
                  x: { ticks: { color: "white" } },
                  y: { ticks: { color: "white" } }
                }
              }}
            />
          </div>
        </div>

        {/* SIDE */}
        <div className="w-72 bg-gray-900 p-6 rounded-xl flex flex-col">

  {!selectedPoint ? (
    <p className="text-gray-400">Click a point</p>
  ) : (
    <>
      {/* Scores */}
      <p className="text-blue-400">
        Human: {selectedPoint.humanScore.toFixed(2)}
      </p>
      <p className="text-green-400">
        Auto: {selectedPoint.autoScore.toFixed(2)}
      </p>
      <p className="text-yellow-400 mb-3">
        Diff: {selectedPoint.diff.toFixed(2)}
      </p>

      {/* 🔥 Criteria Breakdown */}
      <div className="mt-2">
        <h3 className="text-sm text-gray-400 mb-2">
          Criteria Analysis
        </h3>

        {selectedPoint.criterions?.map((c, i) => {
          const score = Number(c.score);
          const width = Math.min(score * 10, 100);

          return (
            <div key={i} className="mb-2">
              <p className="text-xs text-gray-300">
                {c.name || `Criteria ${i + 1}`}
              </p>

              <div className="w-full bg-gray-700 h-2 rounded">
                <div
                  className="h-2 rounded bg-gradient-to-r from-green-400 to-blue-500"
                  style={{ width: `${width}%` }}
                />
              </div>

              <p className="text-xs text-gray-500">
                Score: {score}
              </p>
            </div>
          );
        })}
      </div>

      {/* 🧠 Insight */}
      <div className="mt-3 text-xs text-gray-400">
        {selectedPoint.diff > 1
          ? "⚠️ Model deviates from human scoring"
          : "✅ Model aligns well with human"}
      </div>
    </>
  )}
</div>
      </div>
    </div>
  );
};

export default GraphPage;