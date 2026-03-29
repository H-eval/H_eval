import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalEvaluations: 0,
    bestScore: 0
  });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(" https://h-eval-backend.onrender.com/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      console.log(data);
      setUser(data);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(" https://h-eval-backend.onrender.com/api/evaluator/stats", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(" https://h-eval-backend.onrender.com/api/evaluator/history", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        setHistory(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0f1c] to-[#111827] text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Page Title */}
        <div className="mb-20 flex justify-between items-start">

          {/* Left Side (Title) */}
          <div>
            <h1 className="text-6xl font-extrabold text-blue-400 leading-tight">
              Your Evaluator
            </h1>
            <h1 className="text-6xl font-extrabold text-white/90 leading-tight">
              Dashboard
            </h1>
            <p className="mt-6 text-gray-400 text-lg max-w-2xl">
              Monitor your evaluation activity, contribution insights, and overall performance within TATVA.
            </p>
          </div>

          {/* Right Side (Button) */}
          <button
            onClick={() => navigate("/Home")}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm hover:scale-105 transition"
          >
            ⬅ Home
          </button>

        </div>

        {/* Personal Info Section */}
        <div className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl shadow-2xl mb-16">
          <h2 className="text-2xl font-semibold text-white mb-8">
            Personal Information
          </h2>

          <div className="grid md:grid-cols-3 gap-y-4 gap-x-12">
            <div>
              <p className="text-gray-400 text-sm">Full Name</p>
              <p className="text-lg font-medium">
                {user?.firstName
                  ? `${user.firstName} ${user.middleName || ""} ${user.lastName || ""}`
                  : "Not Provided"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-lg font-medium">
                {user?.email || "Not Available"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Languages</p>
              <p className="text-lg font-medium">
                {user?.languages?.length
                  ? user.languages.join(", ")
                  : "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Registered On</p>
              <p className="text-lg font-medium">
                {user?.registrationDate
                  ? new Date(user.registrationDate).toLocaleDateString()
                  : "Not Available"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Education</p>
              <p className="text-lg font-medium">
                {user?.education || "Not Provided"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Gender</p>
              <p className="text-lg font-medium">
                {user?.gender || "Not Provided"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Age</p>
              <p className="text-lg font-medium">
                {user?.age ?? "Not Provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Contribution Overview */}
        <h2 className="text-3xl font-bold text-white mt-20 mb-10">
          Contribution Overview
        </h2>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Total Evaluations */}
          <div className="bg-gradient-to-br from-purple-600/20 to-transparent p-6 rounded-2xl backdrop-blur-md">
            <h3 className="text-gray-400 text-sm mb-2">Total Evaluations</h3>
            <p className="text-3xl font-bold text-purple-400">
              {stats.totalEvaluations}
            </p>
          </div>

          {/* Batches Evaluated */}
          <div className="bg-gradient-to-br from-green-500/20 to-transparent p-6 rounded-2xl backdrop-blur-md">
            <h3 className="text-gray-400 text-sm mb-2">Batches Evaluated</h3>
            <p className="text-3xl font-bold text-green-400">
              {history.length}
            </p>
          </div>

          {/* Best Score */}
          <div className="bg-gradient-to-br from-pink-500/20 to-transparent p-6 rounded-2xl backdrop-blur-md">
            <h3 className="text-gray-400 text-sm mb-2">Best Score Given</h3>
            <p className="text-3xl font-bold text-pink-400">
              {stats.bestScore}
            </p>
          </div>

        </div>

        {/* Evaluation History Section */}
        <h2 className="text-3xl font-bold text-white mt-20 mb-2">
          Evaluation History
        </h2>

        <p className="text-gray-400 mb-10">
          List of translation batches you have evaluated.
        </p>

        <div  className="grid grid-cols-5 text-sm text-gray-400 border-b border-white/10 pb-3 mb-4">
          
           <p className="font-semibold">Dataset </p>
<p className="font-semibold">Sentences Evaluated</p>
<p className="font-semibold">Last Evaluation</p>
<p className="font-semibold">Avg Score</p>
<p className="font-semibold text-right">Action</p>
          </div>
          
          {history.length === 0 ? (
            <p className="text-gray-400 text-lg">
              No evaluation history available yet.
            </p>
          ) : (
            history.map((item, index) => (
          <div
  key={index}
  className="grid grid-cols-5 items-center border-b border-white/10 py-4"
>

  <div>
  <p className="text-white font-medium">
    Translation Batch
  </p>

  <p className="text-sm text-gray-400">
    ID: {item.batchId.slice(0, 8)}...
  </p>
</div>
  <p className="text-gray-300">
    {item.totalEvaluations}
  </p>
<p className="text-gray-300">
  {new Date(item.lastEvaluation).toLocaleDateString()}
</p>
<p className="text-purple-400 font-bold text-lg">
  {item.avgScore ?? "N/A"}
</p>
  <button
  onClick={() => navigate(`/batch-analysis/${item.batchId}`)}
  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:scale-105 transition duration-300"
>
  View Analysis
</button>

</div>
            ))
          )}
        </div>

        {/* <div className="mt-14 flex justify-center">
          <button className="px-8 py-4 rectangle-full bg-gradient-to-r from-green-400 to-purple-500 text-black font-semibold text-lg hover:scale-105 transition duration-300 shadow-lg">
            View Evaluation Analytics
          </button>
        </div> */}
      </div>
    
  );
};

export default Profile;

