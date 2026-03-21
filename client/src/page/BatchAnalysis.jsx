import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
const BatchAnalysis = () => {

  const { batchId } = useParams();
  const [stats, setStats] = useState({
   totalSentences: 0,
  evaluatedSentences: 0,
  averageScore: 0,
  lastEvaluation: null,
  criteriaUsed: []
});
const navigate = useNavigate();
const [sentenceData, setSentenceData] = useState([]);
useEffect(() => {

  const fetchBatchStats = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/evaluator/batchStats/${batchId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      setStats(data);

    } catch (error) {
      console.error("Error fetching batch stats:", error);
    }

  };

  fetchBatchStats();

}, [batchId]);
useEffect(() => {

  const fetchSentenceData = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/evaluator/sentenceEvaluations/${batchId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      setSentenceData(data);

    } catch (error) {
      console.error("Error fetching sentence evaluations:", error);
    }

  };

  fetchSentenceData();

}, [batchId]);
  return (
  <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0f1c] to-[#111827] text-white py-16">

    <div className="max-w-6xl mx-auto px-6">

      {/* Page Title */}
      <div className="mb-20">
        <h1 className="text-6xl font-extrabold text-green-400 leading-tight">
          Batch Analysis
        </h1>
        {/* <h1 className="text-6xl font-extrabold text-green-400 leading-tight">
          Analysis
        </h1> */}

        <p className="mt-6 text-gray-400 text-lg max-w-2xl">
          Explore evaluation insights and analytics for this translation batch.
        </p>
      </div>


      {/* Batch Information */}
      <div className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl shadow-2xl mb-16">

        <h2 className="text-2xl font-semibold text-white mb-8">
          Batch Information
        </h2>

        <div className="grid md:grid-cols-2 gap-y-6 gap-x-12">

          {/* <div>
            <p className="text-gray-400 text-sm">Batch ID</p>
            <p className="text-lg font-medium text-white">
              {batchId}
            </p>
          </div> */}

          <div>
            <p className="text-gray-400 text-sm">Total Sentences</p>
            <p className="text-lg font-medium text-white">
  {stats.totalSentences}
</p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Sentences Evaluated</p>
            <p className="text-lg font-medium text-white">
  {stats.evaluatedSentences}
</p>
          </div>
          {/* <div>
  <p className="text-gray-400 text-sm">Average Score Given</p>
  <p className="text-lg font-medium text-white">
    {stats.averageScore}
  </p>
</div> */}

{/* <div>
  <p className="text-gray-400 text-sm">Last Evaluation</p>
  <p className="text-lg font-medium text-white">
    {stats.lastEvaluation
      ? new Date(stats.lastEvaluation).toLocaleDateString()
      : "N/A"}
  </p>
</div> */}

{/* <div>
  <p className="text-gray-400 text-sm">Evaluation Criteria Used</p>
  <p className="text-lg font-medium text-white">
    {stats.criteriaUsed?.length
  ? stats.criteriaUsed.join(", ")
  : "Not available"}
  </p>
</div> */}

   <div>
  <p className="text-gray-400 text-sm mb-2">Evaluation Progress</p>

  <div className="w-full bg-white/10 rounded-full h-3 mb-2">
    <div
      className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full"
      style={{
        width: `${
          stats.totalSentences > 0
            ? (stats.evaluatedSentences / stats.totalSentences) * 100
            : 0
        }%`
      }}
    ></div>
  </div>

  <p className="text-sm text-gray-300">
    {stats.totalSentences > 0
      ? Math.round((stats.evaluatedSentences / stats.totalSentences) * 100)
      : 0
    }% completed
  </p>
</div>


        </div>
         </div>
{/* Evaluation Details */}
<h2 className="text-3xl font-bold text-white mt-20 mb-10">
  Evaluation Details
</h2>

<div className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl shadow-2xl mb-16">

  <div className="grid md:grid-cols-2 gap-y-6 gap-x-12">

    <div>
      <p className="text-gray-400 text-sm">Average Score Given</p>
      <p className="text-lg font-medium text-white">
        {stats.averageScore}
      </p>
    </div>

    <div>
      <p className="text-gray-400 text-sm">Last Evaluation</p>
      <p className="text-lg font-medium text-white">
        {stats.lastEvaluation
          ? new Date(stats.lastEvaluation).toLocaleDateString()
          : "N/A"}
      </p>
    </div>

    <div>
      <p className="text-gray-400 text-sm">Evaluation Criteria Used</p>
      <p className="text-lg font-medium text-white">
        {stats.criteriaUsed?.length
          ? stats.criteriaUsed.join(", ")
          : "Not available"}
      </p>
    </div>

  </div>

</div>

{/* Sentence Evaluation Summary */}

<h2 className="text-3xl font-bold text-white mt-20 mb-10">
  Sentence Evaluation Summary
</h2>

<div className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl shadow-2xl">

  <table className="w-full text-left">

    <thead className="text-gray-400 border-b border-white/10">
      <tr>
        <th className="pb-4">Sentence ID</th>
        <th className="pb-4">Translator</th>
        <th className="pb-4">Your Score</th>
      </tr>
    </thead>

    <tbody>

      {sentenceData.length === 0 ? (
        <tr>
          <td colSpan="3" className="py-6 text-gray-400">
            No sentence evaluations available.
          </td>
        </tr>
      ) : (
        sentenceData.map((item, index) => (
          <tr
            key={index}
            className="border-b border-white/10 hover:bg-white/5 transition"
          >

            <td className="py-4">{item.sentenceId}</td>

            <td className="py-4">{item.translator}</td>

            <td className="py-4 text-purple-400 font-semibold">
              {item.score}
            </td>

          </tr>
        ))
      )}

    </tbody>

  </table>

</div>
      {/* Evaluation Insights */}
      <h2 className="text-3xl font-bold text-white mt-20 mb-10">
        Evaluation Insights
      </h2>

      <div className="flex flex-col items-center justify-center h-64 border border-white/10 rounded-2xl">

  <p className="text-gray-400 text-lg mb-6">
    Detailed evaluation graphs and correlation analysis are available for this batch.
  </p>

 <button
  onClick={() => navigate(`/analysis/${batchId}`)}
  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:scale-105 transition duration-300 shadow-lg"
>
  VIEW GRAPH ANALYSIS
</button>

</div>

    </div>

  </div>
);
};

export default BatchAnalysis;