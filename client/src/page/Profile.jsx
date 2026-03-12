import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalEvaluations: 0,
    avgScore: 0
  });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/auth/me", {
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

        const res = await fetch("http://localhost:5000/api/evaluator/stats", {
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

        const res = await fetch("http://localhost:5000/api/evaluator/history", {
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
        <div className="mb-20">
          <h1 className="text-6xl font-extrabold text-green-400 leading-tight">
            Your Evaluator
          </h1>
          <h1 className="text-6xl font-extrabold text-white/90 leading-tight">
            Dashboard
          </h1>
          <p className="mt-6 text-gray-400 text-lg max-w-2xl">
            Monitor your evaluation activity, contribution insights, and overall performance within TATVA.
          </p>
        </div>

        {/* Personal Info Section */}
        <div className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl shadow-2xl mb-16">
          <h2 className="text-2xl font-semibold text-white mb-8">
            Personal Information
          </h2>

          <div className="grid md:grid-cols-2 gap-y-4 gap-x-12">
            <div>
              <p className="text-gray-400 text-sm">Full Name</p>
              <p className="text-lg font-medium">
                {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
              </p>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-lg font-medium">{user ? user.email : "Loading..."}</p>
            </div> 

            {/* <div>
              <p className="text-gray-400 text-sm">User ID</p>
              <p className="text-lg font-medium"> {user ? user.userId || user._id : "Loading..."}</p>
            </div> */}
            
            {/* <div>
              <p className="text-gray-400 text-sm">Role</p>
              <p className="text-lg font-medium">--</p>
            </div> */}
            
            <div>
              <p className="text-gray-400 text-sm">Languages</p>
              <p className="text-lg font-medium">{user ? user.languages?.join(", ") : "Loading..."}</p>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm">Registered On</p>
              <p className="text-lg font-medium">{user ? new Date(user.registrationDate).toLocaleDateString() : "Loading..."}</p>
            </div>
          </div>
        </div>

        {/* Contribution Overview */}
        <h2 className="text-3xl font-bold text-white mt-20 mb-10">
          Contribution Overview
        </h2>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-gradient-to-br from-purple-600/20 to-transparent p-6 rounded-2xl backdrop-blur-md hover:scale-105 transition duration-300">
            <h3 className="text-gray-400 text-sm mb-2">Total Evaluations</h3>
            <p className="text-3xl font-bold text-purple-400">{stats.totalEvaluations}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-transparent p-6 rounded-2xl backdrop-blur-md hover:scale-105 transition duration-300">
            <h3 className="text-gray-400 text-sm mb-2">Pending Evaluations</h3>
            <p className="text-3xl font-bold text-green-400">0</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-transparent p-6 rounded-2xl backdrop-blur-md hover:scale-105 transition duration-300">
            <h3 className="text-gray-400 text-sm mb-2">Average Score</h3>
            <p className="text-3xl font-bold text-blue-400">{stats.avgScore}</p>
          </div>

          <div className="bg-gradient-to-br from-pink-500/20 to-transparent p-6 rounded-2xl backdrop-blur-md hover:scale-105 transition duration-300">
            <h3 className="text-gray-400 text-sm mb-2">Files Assigned</h3>
            <p className="text-3xl font-bold text-pink-400">0</p>
          </div>
        </div>

        {/* Evaluation History Section */}
        <h2 className="text-3xl font-bold text-white mt-20 mb-2">
          Evaluation History
        </h2>

        <p className="text-gray-400 mb-10">
          List of translation batches you have evaluated.
        </p>

        <div  className="grid grid-cols-4 text-sm text-gray-400 border-b border-white/10 pb-3 mb-4">
          
           <p className="font-semibold">Dataset / Batch</p>
<p className="font-semibold">Sentences Evaluated</p>
<p className="font-semibold">Last Evaluation</p>
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
  className="grid grid-cols-4 items-center border-b border-white/10 py-4"
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

