import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Scatter } from "react-chartjs-2";
import {
 Chart as ChartJS,
 LinearScale,
 PointElement,
 Tooltip,
 Legend
} from "chart.js";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const GraphPage = () => {

 const { batchId } = useParams();
 const [points, setPoints] = useState([]);

 useEffect(() => {

  console.log("Batch ID:", batchId);

  fetch(`http://localhost:5000/api/history/${batchId}`)
   .then(res => res.json())
   .then(data => {

    console.log("API DATA:", data);

    const graphPoints = data.map(item => {

     const scores = item.Criterions
       .map(c => Number(c.score))
       .filter(s => !isNaN(s));

     const human =
       scores.reduce((a,b)=>a+b,0) / scores.length;

     const auto = item.auto?.score || 0;

     return { x: human, y: auto };

    });

    console.log("GRAPH POINTS:", graphPoints);

    setPoints(graphPoints);

   })
   .catch(err => console.error(err));

 }, [batchId]);

 return (
  <div className="min-h-screen bg-black text-white p-10">

    <h1 className="text-4xl font-bold mb-10">
      Graph Analysis
    </h1>

    <div style={{ width: "600px", height: "400px", margin: "auto" }}>

      <Scatter
        data={{
          datasets: [
            {
              label: "Human vs Automatic Score",
              data: points,
              backgroundColor: "cyan",
              pointRadius: 4
            }
          ]
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: "Human Evaluation Score"
              }
            },
            y: {
              title: {
                display: true,
                text: "Automatic Evaluation Score"
              }
            }
          }
        }}
      />

    </div>

  </div>
);


};

export default GraphPage;