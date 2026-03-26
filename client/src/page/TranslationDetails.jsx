import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TranslationDetails = () => {
  const { translationId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:5000/api/evaluator/translationDetails/${translationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // 🚨 IMPORTANT CHECK
        if (!res.ok) {
          const text = await res.text();
          console.error("❌ API Error:", text);
          throw new Error("Failed to fetch translation details");
        }

        const result = await res.json();
        console.log("✅ API DATA:", result);

        setData(result);

      } catch (err) {
        console.error("❌ Fetch Error:", err);
        setData({ error: true }); // fallback
      }
    };

    fetchDetails();
  }, [translationId]);

  if (!data) return <div className="text-white p-10">Loading...</div>;

  if (data.error) {
    return (
      <div className="text-red-400 p-10">
        Failed to load data. Check backend route.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0f1c] to-[#111827] text-white py-16">
      <div className="max-w-5xl mx-auto px-6">

        {/* Title */}
        <h1 className="text-5xl font-extrabold text-blue-400 mb-12">
          Translation Analysis
        </h1>

        {/* Top Info */}
        <div className="bg-white/5 p-8 rounded-3xl mb-10">
          <p className="text-gray-400 mb-2">English Sentence</p>
          <p className="mb-6">{data.sentence}</p>

          <p className="text-gray-400 mb-2">Translation</p>
          <p className="mb-6 text-gray-300">{data.translation}</p>

          <p className="text-gray-400 mb-2">Translator</p>
          <p>{data.translator}</p>
        </div>

        {/* Avg Score */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-8 rounded-3xl text-center mb-10">
          <p className="text-lg">Average Score</p>
          <h2 className="text-5xl font-bold">{data.avgScore}</h2>
        </div>

        {/* Criteria */}
        <div className="bg-white/5 p-8 rounded-3xl mb-10">
          <h2 className="text-2xl font-semibold mb-6">
            Criteria Breakdown ({data.criteria.length})
          </h2>

          <div className="space-y-4">
            {data.criteria.map((c, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-black/30 p-4 rounded-xl"
              >
                <div>
                  {/* English */}
                  <p className="font-medium text-white">
                    {c.name.split(".")[0]}.
                  </p>

                  {/* Hindi */}
                  <p className="text-gray-400 mt-1">
                    {c.name.split(".")[1]}
                  </p>

                  <p className="text-sm text-gray-400 mt-2 italic">
                    {c.comment && c.comment.trim() !== ""
                      ? `Comment: ${c.comment}`
                      : "No comment"}
                  </p>
                </div>

                <div className="text-purple-400 font-bold text-lg">
                  {c.score}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 transition"
        >
          Back
        </button>

      </div>
    </div>
  );
};

export default TranslationDetails;