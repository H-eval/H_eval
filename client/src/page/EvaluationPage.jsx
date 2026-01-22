import React, { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const EvaluationPage = () => {
  const { sentenceId, translationId,userId} = useParams();
  const navigate = useNavigate();


  const [criteria, setCriteria] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [hoveredScore, setHoveredScore] = useState(null);
  const [animatingButton, setAnimatingButton] = useState(null);
  const [liveAverage, setLiveAverage] = useState(0);
  const [averagePulse, setAveragePulse] = useState(false);
  const [focusedCriterion, setFocusedCriterion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("token");


  const scores = [
    { value: 4, label: '4', color: 'bg-green-600', tooltip: 'Ideal / अति उत्तम' },
    { value: 3, label: '3', color: 'bg-blue-600', tooltip: 'Perfect / उत्तम' },
    { value: 2, label: '2', color: 'bg-yellow-600', tooltip: 'Acceptable / मान्य' },
    { value: 1, label: '1', color: 'bg-orange-600', tooltip: 'Partially Acceptable / बुरा किन्तु मान्य' },
    { value: 0, label: '0', color: 'bg-red-600', tooltip: 'Not Acceptable / अमान्य' },
    { value: 'NA', label: 'NA', color: 'bg-gray-600', tooltip: 'Not Applicable / लागू नहीं' }
  ];

  // Fetch criteria from database
  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/ranks/criteria');
        
        if (!response.ok) {
          throw new Error('Failed to fetch criteria');
        }
        
        const data = await response.json();
        console.log(`✅ Loaded ${data.length} criteria:`, data.map(c => c.CId).join(', '));
        
        // Ensure we have all 11 criteria and sort them properly
        const sortedData = data.sort((a, b) => {
          const numA = parseInt(a.CId.replace('C', ''));
          const numB = parseInt(b.CId.replace('C', ''));
          return numA - numB;
        });
        
        if (sortedData.length !== 11) {
          console.warn(`⚠️ Expected 11 criteria but found ${sortedData.length}`);
        }
        
        setCriteria(sortedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching criteria:', err);
        setError('Failed to load evaluation criteria. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCriteria();
  }, []);

  const calculateAverage = () => {
    const numericRatings = Object.values(ratings).filter(r => r !== 'NA' && typeof r === 'number');
    if (numericRatings.length === 0) return 0;
    return (numericRatings.reduce((a, b) => a + b, 0) / numericRatings.length);
  };

  useEffect(() => {
    const newAverage = calculateAverage();
    if (newAverage !== liveAverage) {
      setAveragePulse(true);
      setLiveAverage(newAverage);
      setTimeout(() => setAveragePulse(false), 600);
    }
  }, [ratings, liveAverage]);

  const handleRating = (criterionId, score) => {
    setAnimatingButton(`${criterionId}-${score}`);
    setRatings({ ...ratings, [criterionId]: score });
    setFocusedCriterion(criterionId);
    setTimeout(() => setAnimatingButton(null), 600);
  };

  const handleComment = (criterionId, comment) => {
    setComments({ ...comments, [criterionId]: comment });
  };
  const handleSubmit = async () => {
  try {
    setSubmitting(true);
    setError(null);

    // Build array of criterion evaluations
    const criterionsArray = criteria.map(criterion => ({
      name: criterion.CName,
      score: ratings[criterion._id]?.toString() || 'NA',
      comment: comments[criterion._id] || ''
    }));

    // Build payload with dynamic userId
    const payload = {
      SID: sentenceId,
      TID: translationId,
      Criterions: criterionsArray
    };

    console.log('📤 Submitting evaluation:', payload);

     const response = await fetch("http://localhost:5000/api/ranks/rank", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔑
        },
        body: JSON.stringify(payload),
      });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Failed to submit ranking');

    console.log('✅ Evaluation submitted successfully:', data);
    setSubmitted(true);

    // Optional: navigate to LineViewer after submit
    // navigate(`/lineviewer/${sentenceId}/${userId}`);

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);

  } catch (err) {
    console.error('Error submitting ranking:', err);
    setError(err.message || 'Failed to submit ranking. Please try again.');
  } finally {
    setSubmitting(false);
  }
};

  

  const handleBack = () => {
    if (submitted) {
      // If submitted, reset form for new evaluation
      setSubmitted(false);
      setRatings({});
      setComments({});
      setFocusedCriterion(null);
      setError(null);
    } else {
      // If not submitted, navigate back to previous page
      navigate(-1);
    }
  };

  const ratedCount = Object.keys(ratings).length;
  const progressPercentage = (ratedCount / criteria.length) * 100;

  const getScoreColor = (value) => {
    const map = { 4: 'bg-green-600', 3: 'bg-blue-600', 2: 'bg-yellow-600', 1: 'bg-orange-600', 0: 'bg-red-600', 'NA': 'bg-gray-600' };
    return map[value] || 'bg-gray-600';
  };

  const getScoreInfo = (value) => scores.find(s => s.value === value);
  const isScoreSelected = (criterionId, scoreValue) => ratings[criterionId] === scoreValue;
  const isScoreBeforeSelected = (criterionId, scoreValue) => {
    const currentRating = ratings[criterionId];
    if (currentRating === undefined || currentRating === 'NA' || scoreValue === 'NA') return false;
    return scores.findIndex(s => s.value === scoreValue) < scores.findIndex(s => s.value === currentRating);
  };

  const isRated = (criterionId) => ratings[criterionId] !== undefined;
  const isFocused = (criterionId) => focusedCriterion === criterionId;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading evaluation criteria...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <style>{`
        @keyframes pulse-scale { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes number-update { 0% { transform: scale(1); color: #fff; } 50% { transform: scale(1.2); color: #60a5fa; } 100% { transform: scale(1); color: #fff; } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-slow { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ripple { 0% { transform: scale(0.8); opacity: 0.6; } 100% { transform: scale(2.5); opacity: 0; } }
        @keyframes bounce-scale { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        @keyframes ping-once { 0% { transform: scale(1); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }
        @keyframes gentle-pulse { 0%, 100% { box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3); } 50% { box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.5); } }
        @keyframes scale-in { from { transform: scale(0); } to { transform: scale(1); } }
        .animate-pulse-scale { animation: pulse-scale 0.6s ease-in-out; }
        .animate-number-update { animation: number-update 0.6s ease-out; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out; }
        .animate-fade-in-slow { animation: fade-in-slow 0.8s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-ripple { animation: ripple 0.6s ease-out; }
        .animate-bounce { animation: bounce-scale 0.3s ease-in-out; }
        .animate-ping { animation: ping-once 0.4s ease-out; }
        .animate-gentle-pulse { animation: gentle-pulse 2s ease-in-out infinite; }
        .animate-scale-in { animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-800 bg-opacity-95 backdrop-blur-sm border-b border-gray-700 shadow-2xl">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Translation Evaluation</h1>
              <p className="text-gray-400 text-xs mt-0.5">Quality Assessment Platform • {criteria.length} Criteria</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{ratedCount}/{criteria.length}</span>
                <div className="w-32 bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
                </div>
              </div>
              
              <div className={`px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg ${averagePulse ? 'animate-pulse-scale' : ''}`}>
                <span className="text-xs text-blue-200 font-medium mr-2">Live Avg:</span>
                <span className={`text-xl font-bold ${averagePulse ? 'animate-number-update' : ''}`}>{liveAverage.toFixed(2)}</span>
              </div>
            </div>
            
            <button onClick={handleBack} className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all border border-gray-600 hover:scale-105">
              <ChevronLeft className="w-4 h-4" />
              {submitted ? 'New Evaluation' : 'Back'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 pb-20">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-900 border border-red-700 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-200 font-semibold">Error</p>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Warning if not all 11 criteria are loaded */}
        {!loading && !error && criteria.length !== 11 && (
          <div className="mb-6 bg-yellow-900 border border-yellow-700 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-200 font-semibold">Warning</p>
              <p className="text-yellow-300 text-sm mt-1">Expected 11 criteria but only {criteria.length} were loaded. Please check the database.</p>
            </div>
          </div>
        )}

        {!submitted ? (
          <div className="space-y-4 mb-8 animate-slide-up">
            {criteria.map((criterion) => {
              const rated = isRated(criterion._id);
              const focused = isFocused(criterion._id);
              const selectedScore = ratings[criterion._id];
              const scoreInfo = selectedScore !== undefined ? getScoreInfo(selectedScore) : null;
              
              return (
                <div key={criterion._id} className={`rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.01] cursor-pointer ${focused ? 'bg-gray-800 ring-2 ring-blue-500 shadow-2xl shadow-blue-500/20' : rated ? 'bg-gray-800 border-l-4 shadow-lg' : 'bg-gray-800 border border-gray-700 hover:border-gray-600'}`} onClick={() => setFocusedCriterion(criterion._id)}>
                  <div className="bg-gray-900 px-5 py-3 border-b border-gray-700 flex items-center justify-between">
                    <h3 className="text-base font-bold text-blue-400">{criterion.CId}: {criterion.CName}</h3>
                    {rated && !focused && <CheckCircle className="w-5 h-5 text-green-500 animate-fade-in" />}
                  </div>
                  
                  <div className="p-5">
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Rate this criterion (Weight: {criterion.CWeight})</label>
                      
                      <div className="relative mb-3">
                        <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-700"></div>
                        <div className="absolute top-6 left-6 h-0.5 bg-blue-500 transition-all duration-500" style={{ width: ratings[criterion._id] !== undefined ? `calc(${(scores.findIndex(s => s.value === ratings[criterion._id]) / (scores.length - 1)) * 100}% - 24px)` : '0%' }}></div>
                        
                        <div className="flex justify-between items-center relative">
                          {scores.map((score) => {
                            const isSelected = isScoreSelected(criterion._id, score.value);
                            const isBefore = isScoreBeforeSelected(criterion._id, score.value);
                            const isAnimating = animatingButton === `${criterion._id}-${score.value}`;
                            
                            return (
                              <div key={score.value} className="relative flex flex-col items-center">
                                <button onClick={(e) => { e.stopPropagation(); handleRating(criterion._id, score.value); }} onMouseEnter={() => setHoveredScore(`${criterion._id}-${score.value}`)} onMouseLeave={() => setHoveredScore(null)} className={`w-12 h-12 rounded-full font-bold text-white transition-all duration-300 relative z-10 ${isSelected ? `${getScoreColor(score.value)} ring-4 ring-blue-400 ring-offset-2 ring-offset-gray-800 scale-125 shadow-lg` : isBefore ? `${getScoreColor(score.value)} scale-90` : 'bg-gray-700 hover:bg-gray-600 scale-90'} ${isAnimating ? 'animate-ping' : ''}`}>
                                  <span className={isAnimating ? 'animate-bounce' : ''}>{score.label}</span>
                                  {isAnimating && <span className="absolute inset-0 rounded-full bg-white opacity-30 animate-ripple"></span>}
                                </button>
                                <span className={`mt-2 text-xs transition-all ${isSelected ? 'text-blue-400 font-semibold' : 'text-gray-500'}`}>{score.label}</span>
                                {hoveredScore === `${criterion._id}-${score.value}` && (
                                  <div className="absolute bottom-full mb-16 px-3 py-2 bg-black text-white text-xs rounded shadow-xl z-20 whitespace-nowrap border border-gray-700 animate-fade-in-up">
                                    {score.tooltip}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black"></div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {selectedScore !== undefined && (
                        <div className="text-sm text-gray-400 animate-fade-in-up pl-1">{scoreInfo?.tooltip}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Comments (Optional)</label>
                      <textarea value={comments[criterion._id] || ''} onChange={(e) => { e.stopPropagation(); handleComment(criterion._id, e.target.value); }} onClick={(e) => e.stopPropagation()} placeholder="Add your comments here..." className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-200 placeholder-gray-600 text-sm shadow-inner" rows="3" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {!submitted && (
          <div className="flex justify-center mb-12">
            <button onClick={handleSubmit} disabled={ratedCount === 0 || submitting} className={`px-12 py-4 rounded-lg font-bold text-lg text-white transition-all duration-300 ${ratedCount === 0 || submitting ? 'bg-gray-700 cursor-not-allowed opacity-50' : 'bg-blue-600 hover:bg-blue-500 hover:scale-105 shadow-lg hover:shadow-blue-500/50 animate-gentle-pulse'}`}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        )}

        {submitted && (
          <div className="animate-fade-in-slow">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center animate-scale-in">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold">Review Submitted Successfully!</h2>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 mb-8 border border-gray-700 shadow-inner">
                <div className="flex items-center justify-center gap-8">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-2xl shadow-blue-500/30">
                    <div className="w-28 h-28 rounded-full bg-gray-900 flex items-center justify-center">
                      <span className="text-4xl font-bold text-blue-400">{liveAverage.toFixed(2)}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-200 mb-2">Final Average Score</h3>
                    <p className="text-gray-400">Based on {ratedCount} rated criteria</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {criteria.map((criterion) => (
                  ratings[criterion._id] !== undefined && (
                    <div key={criterion._id} className="bg-gray-900 rounded-lg p-4 border border-gray-700 flex items-center justify-between hover:bg-gray-850 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-200 text-sm mb-1">{criterion.CId}: {criterion.CName}</h4>
                        {comments[criterion._id] && (
                          <p className="text-xs text-gray-500 mt-2 italic">{comments[criterion._id]}</p>
                        )}
                      </div>
                      <div className={`ml-4 px-4 py-2 rounded-full ${getScoreColor(ratings[criterion._id])} text-white font-bold text-sm shadow-md`}>
                        {ratings[criterion._id]}
                      </div>
                    </div>
                  )
                ))}
              </div>

              <div className="flex gap-4">
                <button onClick={handleBack} className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all border border-gray-600 hover:scale-105">
                  Start New Evaluation
                </button>
                <button onClick={() => navigate(-1)} className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all hover:scale-105">
                  Back to Translations
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationPage;