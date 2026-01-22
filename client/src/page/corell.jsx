import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Sparkles, TrendingUp, TrendingDown, CheckCircle2, AlertTriangle, ChevronRight, Zap } from 'lucide-react';

const Corell = ({ superId: propSuperId, onBack: propOnBack }) => {
  const navigate = useNavigate();
  const { superId: paramSuperId } = useParams();
  const superId = propSuperId || paramSuperId || 'demo_001';
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMetric, setActiveMetric] = useState('bleu');

  const handleBack = () => {
    if (propOnBack) {
      propOnBack();
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    fetchCorrelationData();
  }, [superId]);

  const fetchCorrelationData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/correlation/${superId}`);
      
      if (!response.ok) throw new Error('Failed to fetch correlation data');
      
      const result = await response.json();
      
      // Transform backend data to match UI format
      if (result.success && result.data) {
        const backendData = result.data;
        
        // Calculate composite score (average of all metrics)
        const composite = ((backendData.bleu + backendData.meteor + backendData.ter) / 3).toFixed(1);
        
        // Convert metrics to percentage (assuming 0-4 scale, convert to 0-100%)
        const bleuPercent = ((backendData.bleu / 4) * 100).toFixed(1);
        const meteorPercent = ((backendData.meteor / 4) * 100).toFixed(1);
        const terPercent = ((backendData.ter / 4) * 100).toFixed(1);
        const compositePercent = ((parseFloat(composite) / 4) * 100).toFixed(1);
        
        // Calculate comparison metrics
        const difference = backendData.human - parseFloat(composite);
        const absDifference = Math.abs(difference);
        
        // Determine agreement level
        let agreement = 'High Agreement';
        if (absDifference > 1.0) {
          agreement = difference > 0 ? 'Underestimate' : 'Overestimate';
        } else if (absDifference > 0.5) {
          agreement = 'High Agreement';
        }
        
        // Transform to expected format
        const transformedData = {
          superId: superId,
          humanEvaluation: {
            score: backendData.human,
            criteria: { 
              accuracy: backendData.human, 
              fluency: backendData.human, 
              grammar: backendData.human, 
              terminology: backendData.human, 
              style: backendData.human 
            }
          },
          automaticEvaluation: {
            score: parseFloat(composite),
            metrics: { 
              bleu: parseFloat(bleuPercent), 
              fscore: parseFloat(meteorPercent), 
              editScore: parseFloat(terPercent), 
              composite: parseFloat(compositePercent) 
            }
          },
          comparison: { 
            difference: parseFloat(difference.toFixed(2)), 
            absDifference: parseFloat(absDifference.toFixed(2)), 
            agreement: agreement 
          },
         sentences: {
  source: result.sentences.source,
  mtOutput: result.sentences.mtOutput,
  reference: result.sentences.reference
}
,
          metadata: { 
            evaluatedAt: new Date().toISOString(), 
            evaluator: 'system' 
          }
        };
        
        setData(transformedData);
      } else {
        throw new Error('Invalid response format');
      }
      
      setError(null);
    } catch (err) {
      setError(err.message);
      // Fallback to demo data
      setData({
        superId: superId || 'demo_001',
        humanEvaluation: {
          score: 3.45,
          criteria: { accuracy: 4.0, fluency: 3.5, grammar: 3.8, terminology: 3.2, style: 3.4 }
        },
        automaticEvaluation: {
          score: 3.12,
          metrics: { bleu: 62.4, fscore: 78.5, editScore: 82.1, composite: 74.3 }
        },
        comparison: { difference: -0.33, absDifference: 0.33, agreement: 'High Agreement' },
        sentences: {
          source: 'The quick brown fox jumps over the lazy dog.',
          mtOutput: 'El rápido zorro marrón salta sobre el perro perezoso.',
          reference: 'El veloz zorro marrón salta sobre el perro perezoso.'
        },
        metadata: { evaluatedAt: new Date().toISOString(), evaluator: 'demo_user' }
      });
    } finally {
      setLoading(false);
    }
  };

  const getAgreementConfig = (agreement) => {
    const configs = {
      'High Agreement': { 
        color: 'from-emerald-400 via-teal-500 to-cyan-600', 
        bg: 'from-emerald-500/20 to-teal-500/10',
        icon: CheckCircle2,
        glow: 'shadow-emerald-500/50'
      },
      'Overestimate': { 
        color: 'from-amber-400 via-orange-500 to-red-500', 
        bg: 'from-amber-500/20 to-orange-500/10',
        icon: TrendingUp,
        glow: 'shadow-amber-500/50'
      },
      'Underestimate': { 
        color: 'from-blue-400 via-indigo-500 to-purple-600', 
        bg: 'from-blue-500/20 to-indigo-500/10',
        icon: TrendingDown,
        glow: 'shadow-blue-500/50'
      }
    };
    return configs[agreement] || configs['High Agreement'];
  };

  const metrics = [
    { id: 'bleu', name: 'BLEU', color: 'from-blue-500 to-cyan-600' },
    { id: 'fscore', name: 'F-Score', color: 'from-cyan-500 to-blue-600' },
    { id: 'editScore', name: 'Edit Distance', color: 'from-blue-600 to-navy-700' },
    { id: 'composite', name: 'Composite', color: 'from-cyan-600 to-blue-700' }
  ];

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />
        <div className="relative">
          <div className="w-24 h-24 relative">
            <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full animate-ping" />
            <div className="absolute inset-0 border-4 border-t-indigo-500 border-r-purple-500 border-b-pink-500 border-l-cyan-500 rounded-full animate-spin" />
          </div>
          <p className="text-indigo-300 text-xl font-light mt-8 tracking-wider animate-pulse">Analyzing Correlation...</p>
        </div>
      </div>
    );
  }

  const agreementConfig = getAgreementConfig(data.comparison.agreement);
  const AgreementIcon = agreementConfig.icon;

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* Unsplash Textured Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1920&q=80')",
          filter: "brightness(0.3)"
        }}
      />
      
      {/* Dark Navy Blue Overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-blue-950/75 to-slate-950/85" />
      
      {/* Animated Background with Grid Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Diagonal Grid Lines - Tech Mesh */}
        <div className="absolute inset-0 opacity-15">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="techGrid" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <path d="M 0 0 L 80 0 L 80 80" fill="none" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="0.5"/>
                <path d="M 0 40 L 80 40" fill="none" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="0.3"/>
                <path d="M 40 0 L 40 80" fill="none" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="0.3"/>
              </pattern>
              <radialGradient id="gridGlow" cx="50%" cy="50%">
                <stop offset="0%" stopColor="rgba(6, 182, 212, 0.3)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#techGrid)" />
            <rect width="100%" height="100%" fill="url(#gridGlow)" opacity="0.3" />
          </svg>
        </div>
        
        {/* Floating Gradient Orbs with Mix Blend */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse opacity-20" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse opacity-15" style={{ animationDelay: '0.5s' }} />
        
        {/* Animated Scan Lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-pulse" style={{ animationDelay: '0.3s' }} />
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse" style={{ animationDelay: '0.7s' }} />
        </div>
        
        {/* Vertical accent lines */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute left-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent" />
          <div className="absolute left-3/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        
        {/* Floating Back Button */}
        <button
          onClick={handleBack}
          className="group mb-8 px-6 py-3 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 text-white hover:bg-white/10 transition-all duration-500 flex items-center gap-3 hover:gap-4 hover:border-indigo-400/50 shadow-xl hover:shadow-indigo-500/25"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Dashboard</span>
        </button>
        
        {/* Hero Header */}
        <div className="mb-16 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl" />
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 p-12 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
                  <span className="text-cyan-300 font-mono text-sm tracking-widest uppercase">Correlation Analysis</span>
                </div>
                <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent mb-4 leading-tight">
                  Translation Evaluation
                </h1>
                <p className="text-2xl text-cyan-200/80 font-light">
                  Human Intelligence vs Machine Precision
                </p>
              </div>
              <div className="px-6 py-3 bg-cyan-500/20 backdrop-blur-xl rounded-2xl border border-cyan-400/30">
                <p className="text-cyan-300 text-sm font-mono">{data.superId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Score Comparison - Cinematic Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* Human Score - Premium Card */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 rounded-3xl opacity-75 group-hover:opacity-100 blur-xl transition duration-500 group-hover:duration-200" />
            <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl rounded-3xl border border-blue-500/30 p-8 shadow-2xl transform hover:scale-105 transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-blue-300 text-sm font-bold tracking-widest uppercase">Human Evaluation</h3>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              </div>
              
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="transform -rotate-90 w-48 h-48">
                  <defs>
                    <linearGradient id="humanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#1e40af" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <circle cx="96" cy="96" r="80" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
                  <circle
                    cx="96" cy="96" r="80"
                    stroke="url(#humanGrad)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(data.humanEvaluation.score / 4) * 502.65} 502.65`}
                    strokeLinecap="round"
                    filter="url(#glow)"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-7xl font-black bg-gradient-to-br from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {data.humanEvaluation.score}
                  </span>
                  <span className="text-blue-300/60 text-sm font-light mt-1">/4.0</span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-blue-200 font-medium mb-2">Expert Assessment</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30">
                  <span className="text-blue-300 text-sm">{Object.keys(data.humanEvaluation.criteria).length} Criteria</span>
                </div>
              </div>
            </div>
          </div>

          {/* Agreement Status - Hero Card */}
          <div className="group relative">
            <div className={`absolute -inset-1 bg-gradient-to-r ${agreementConfig.color} rounded-3xl opacity-75 group-hover:opacity-100 blur-xl transition duration-500`} />
            <div className={`relative bg-gradient-to-br ${agreementConfig.bg} backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl transform hover:scale-105 transition-all duration-500`}>
              <div className="flex items-center justify-center mb-8">
                <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${agreementConfig.color} flex items-center justify-center shadow-2xl ${agreementConfig.glow} animate-pulse`}>
                  <AgreementIcon className="w-16 h-16 text-white" strokeWidth={2.5} />
                </div>
              </div>
              
              <div className="text-center mb-6">
                <p className="text-white/60 text-sm font-medium mb-2 uppercase tracking-wider">Agreement Level</p>
                <h2 className="text-4xl font-black text-white mb-4">{data.comparison.agreement}</h2>
                
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white">{Math.abs(data.comparison.difference)}</span>
                    <span className="text-white/60 text-lg">pts</span>
                  </div>
                </div>
                <p className="text-white/60 text-sm mt-2">Absolute Difference</p>
              </div>
              
              <div className={`w-full h-2 bg-white/10 rounded-full overflow-hidden`}>
                <div 
                  className={`h-full bg-gradient-to-r ${agreementConfig.color} rounded-full transition-all duration-1000`}
                  style={{ width: `${100 - (data.comparison.absDifference / 4 * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Automatic Score - Tech Card */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 rounded-3xl opacity-75 group-hover:opacity-100 blur-xl transition duration-500 group-hover:duration-200" />
            <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl rounded-3xl border border-cyan-500/30 p-8 shadow-2xl transform hover:scale-105 transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-cyan-300 text-sm font-bold tracking-widest uppercase">Automatic Evaluation</h3>
                <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
              
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="transform -rotate-90 w-48 h-48">
                  <defs>
                    <linearGradient id="autoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <circle cx="96" cy="96" r="80" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
                  <circle
                    cx="96" cy="96" r="80"
                    stroke="url(#autoGrad)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(data.automaticEvaluation.score / 4) * 502.65} 502.65`}
                    strokeLinecap="round"
                    filter="url(#glow)"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-7xl font-black bg-gradient-to-br from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {data.automaticEvaluation.score}
                  </span>
                  <span className="text-cyan-300/60 text-sm font-light mt-1">/4.0</span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-cyan-200 font-medium mb-2">AI-Powered Analysis</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 rounded-full border border-cyan-400/30">
                  <span className="text-cyan-300 text-sm">Real-time Computed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Breakdown - Interactive Grid */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-4xl font-bold text-white">Metric Breakdown</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/50 to-transparent" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, idx) => (
              <div
                key={metric.id}
                onClick={() => setActiveMetric(metric.id)}
                className={`group cursor-pointer relative transform hover:scale-105 transition-all duration-500 ${activeMetric === metric.id ? 'scale-105' : ''}`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${metric.color} rounded-2xl opacity-50 group-hover:opacity-100 blur-lg transition duration-300 ${activeMetric === metric.id ? 'opacity-100' : ''}`} />
                <div className={`relative bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl border ${activeMetric === metric.id ? 'border-white/30' : 'border-white/10'} p-6 shadow-xl`}>
                  <div className="flex items-center justify-between mb-4">
                    <ChevronRight className={`w-5 h-5 text-white/40 transition-transform ${activeMetric === metric.id ? 'rotate-90' : ''}`} />
                  </div>
                  
                  <h3 className="text-white/60 text-xs font-bold tracking-widest uppercase mb-3">{metric.name}</h3>
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-black text-white">
                      {data.automaticEvaluation.metrics[metric.id]}
                    </span>
                    <span className="text-white/40 text-xl font-light">%</span>
                  </div>
                  
                  <div className="relative w-full h-3 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 bg-gradient-to-r ${metric.color} rounded-full transition-all duration-1000 shadow-lg`}
                      style={{ width: `${data.automaticEvaluation.metrics[metric.id]}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-indigo-400/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-300 text-sm font-medium mb-1">Normalized Score (0-4 Scale)</p>
                <p className="text-white text-3xl font-bold">{data.automaticEvaluation.score}</p>
              </div>
              <div className="text-right">
                <p className="text-indigo-300 text-sm font-medium mb-1">Composite Score</p>
                <p className="text-white text-3xl font-bold">{data.automaticEvaluation.metrics.composite}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sentence Context - Cinematic View */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-4xl font-bold text-white">Translation Context</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent" />
          </div>
          
          <div className="space-y-6">
            {[
              { label: 'Source', text: data.sentences.source, color: 'from-blue-500 to-cyan-500' },
              { label: 'MT Output', text: data.sentences.mtOutput, color: 'from-blue-600 to-blue-400' },
              { label: 'Reference', text: data.sentences.reference, color: 'from-cyan-500 to-blue-500' }
            ].map((item, idx) => (
              <div key={idx} className="group relative" style={{ animationDelay: `${idx * 150}ms` }}>
                <div className={`absolute -inset-1 bg-gradient-to-r ${item.color} rounded-2xl opacity-20 group-hover:opacity-40 blur-xl transition duration-500`} />
                <div className="relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-2xl rounded-2xl border border-white/10 p-8 shadow-xl group-hover:border-white/20 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-sm font-bold tracking-widest uppercase bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                      {item.label}
                    </span>
                  </div>
                  <p className="text-white text-lg leading-relaxed font-light">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Research Disclaimer - Premium Alert */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl opacity-30 group-hover:opacity-50 blur-xl transition duration-500" />
          <div className="relative bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-2xl rounded-2xl border border-amber-400/30 p-8 shadow-2xl">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-xl">
                  <AlertTriangle className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-amber-100 mb-3">Research Disclaimer</h3>
                <p className="text-amber-200/80 leading-relaxed text-lg font-light">
                  Sentence-level correlation provides indicative insights but should not be used for definitive quality assessment. Corpus-level analysis with statistical significance testing is required for robust translation quality evaluation. Automatic metrics offer valuable reference points but cannot capture all nuances of translation quality assessed by human evaluators.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Corell;
