import React, { useState } from 'react';
import { 
  Compass, 
  Activity, 
  FileText, 
  Sliders, 
  Sparkles, 
  Zap, 
  RefreshCw, 
  Info,
  Maximize2
} from 'lucide-react';

interface VectorPoint {
  id: string;
  label: string;
  x: number; // 0 to 1
  y: number; // 0 to 1
  category: 'royalty' | 'food' | 'animals' | 'tech';
}

const INITIAL_POINTS: VectorPoint[] = [
  { id: 'king', label: 'King 👑', x: 0.25, y: 0.85, category: 'royalty' },
  { id: 'queen', label: 'Queen 👸', x: 0.35, y: 0.88, category: 'royalty' },
  { id: 'man', label: 'Man 👨', x: 0.22, y: 0.55, category: 'royalty' },
  { id: 'woman', label: 'Woman 👩', x: 0.32, y: 0.58, category: 'royalty' },
  
  { id: 'apple', label: 'Apple 🍎', x: 0.85, y: 0.8, category: 'food' },
  { id: 'orange', label: 'Orange 🍊', x: 0.88, y: 0.74, category: 'food' },
  
  { id: 'cat', label: 'Cat 🐱', x: 0.75, y: 0.25, category: 'animals' },
  { id: 'dog', label: 'Dog 🐶', x: 0.82, y: 0.22, category: 'animals' },
  
  { id: 'laptop', label: 'Laptop 💻', x: 0.15, y: 0.2, category: 'tech' },
  { id: 'phone', label: 'Phone 📱', x: 0.22, y: 0.18, category: 'tech' },
];

export const VisualSimulatorsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'embeddings' | 'neuron' | 'tokens'>('embeddings');

  // --- 1. Embeddings Simulator State ---
  const [points, setPoints] = useState<VectorPoint[]>(INITIAL_POINTS);
  const [selectedPointA, setSelectedPointA] = useState<VectorPoint>(points[0]);
  const [selectedPointB, setSelectedPointB] = useState<VectorPoint>(points[1]);

  // Compute cosine similarity between A and B
  const computeSimilarity = (p1: VectorPoint, p2: VectorPoint) => {
    const dot = p1.x * p2.x + p1.y * p2.y;
    const mag1 = Math.sqrt(p1.x * p1.x + p1.y * p1.y);
    const mag2 = Math.sqrt(p2.x * p2.x + p2.y * p2.y);
    if (mag1 === 0 || mag2 === 0) return 0;
    return Math.round((dot / (mag1 * mag2)) * 1000) / 1000;
  };

  const similarity = computeSimilarity(selectedPointA, selectedPointB);

  // --- 2. Artificial Neuron State ---
  const [input1, setInput1] = useState(1.0);
  const [input2, setInput2] = useState(0.5);
  const [weight1, setWeight1] = useState(0.8);
  const [weight2, setWeight2] = useState(-0.4);
  const [bias, setBias] = useState(-0.2);
  const [activationFunc, setActivationFunc] = useState<'relu' | 'sigmoid' | 'step'>('relu');

  const rawSum = input1 * weight1 + input2 * weight2 + bias;
  let neuronOutput = 0;
  if (activationFunc === 'relu') {
    neuronOutput = Math.max(0, rawSum);
  } else if (activationFunc === 'sigmoid') {
    neuronOutput = 1 / (1 + Math.exp(-rawSum));
  } else {
    neuronOutput = rawSum > 0 ? 1 : 0;
  }
  const isNeuronFired = neuronOutput > 0.1;

  // --- 3. Tokenizer Inspector State ---
  const [tokenInputText, setTokenInputText] = useState(
    'SkillGraph is an interactive education platform where coding and artificial intelligence make sense.'
  );

  // Naive tokenizer simulation: splits on whitespace and punctuation / syllables
  const simulatedTokens = React.useMemo(() => {
    if (!tokenInputText) return [];
    // Split into regex matches preserving punctuation
    const rawMatches = tokenInputText.match(/[\w']+|[.,!?;:"\/\\#$@&()+-]/g) || [];
    const tokens: { text: string; id: number }[] = [];
    let idCounter = 101;

    for (const match of rawMatches) {
      if (match.length > 5) {
        // split long words into 2 pseudo BPE tokens
        const mid = Math.ceil(match.length / 2);
        tokens.push({ text: match.slice(0, mid), id: idCounter++ });
        tokens.push({ text: match.slice(mid), id: idCounter++ });
      } else {
        tokens.push({ text: match, id: idCounter++ });
      }
    }
    return tokens;
  }, [tokenInputText]);

  const TOKEN_COLORS = [
    'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    'bg-amber-500/20 text-amber-300 border-amber-500/40',
    'bg-pink-500/20 text-pink-300 border-pink-500/40',
    'bg-purple-500/20 text-purple-300 border-purple-500/40',
  ];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hands-on Visual Labs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Concept Simulators
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Tweak the dials of artificial intelligence: drag vector coordinates, fire artificial neurons, and inspect token splits.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('embeddings')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'embeddings'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Vector Space</span>
          </button>

          <button
            onClick={() => setActiveTab('neuron')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'neuron'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Neuron & Weights</span>
          </button>

          <button
            onClick={() => setActiveTab('tokens')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tokens'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>LLM Tokenizer</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: 2D VECTOR EMBEDDINGS SPACE --- */}
      {activeTab === 'embeddings' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>The Supermarket GPS Map of Meaning</span>
              </h3>
              <p className="text-xs text-slate-300">
                Click any two words below to measure their semantic similarity. Notice how "King" and "Queen" cluster together, while "Laptop" and "Phone" form a tech cluster!
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  Cosine Similarity
                </span>
                <span
                  className={`text-lg font-mono font-extrabold ${
                    similarity > 0.85
                      ? 'text-emerald-400'
                      : similarity > 0.5
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {similarity}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                {similarity > 0.85
                  ? '🎯 Highly Related!'
                  : similarity > 0.5
                  ? '⚡ Moderate Link'
                  : '❌ Different Meaning'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Interactive 2D Graph Canvas */}
            <div className="lg:col-span-8 rounded-3xl bg-slate-950 border border-slate-800 p-6 relative overflow-hidden shadow-2xl flex flex-col items-center justify-center min-h-[420px]">
              {/* Grid Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"></div>

              {/* Axis labels */}
              <div className="absolute bottom-3 right-6 text-[11px] text-slate-500 font-mono">
                X-Axis: Dimension 1 (Abstract Concept) &rarr;
              </div>
              <div className="absolute top-4 left-4 text-[11px] text-slate-500 font-mono">
                &uarr; Y-Axis: Dimension 2 (Hierarchy & Tone)
              </div>

              {/* Vector Lines from origin to selected points */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Line to Point A */}
                <line
                  x1="20"
                  y1="380"
                  x2={`${selectedPointA.x * 85 + 5}%`}
                  y2={`${(1 - selectedPointA.y) * 85 + 5}%`}
                  stroke="#6366f1"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.8"
                />
                {/* Line to Point B */}
                <line
                  x1="20"
                  y1="380"
                  x2={`${selectedPointB.x * 85 + 5}%`}
                  y2={`${(1 - selectedPointB.y) * 85 + 5}%`}
                  stroke="#06b6d4"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.8"
                />
              </svg>

              {/* Plotted Words */}
              <div className="relative w-full h-80 z-10">
                {points.map((pt) => {
                  const isA = selectedPointA.id === pt.id;
                  const isB = selectedPointB.id === pt.id;

                  return (
                    <button
                      key={pt.id}
                      onClick={() => {
                        if (isA) return;
                        setSelectedPointB(pt);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setSelectedPointA(pt);
                      }}
                      style={{
                        left: `${pt.x * 85 + 5}%`,
                        top: `${(1 - pt.y) * 85 + 5}%`,
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 ${
                        isA
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/30 scale-110 z-20'
                          : isB
                          ? 'bg-cyan-600 text-white ring-4 ring-cyan-500/30 scale-110 z-20'
                          : 'bg-slate-900/90 text-slate-300 border border-slate-700 hover:border-slate-400 hover:scale-105'
                      }`}
                    >
                      <span>{pt.label}</span>
                      {isA && <span className="text-[10px] bg-indigo-900 px-1 rounded">A</span>}
                      {isB && <span className="text-[10px] bg-cyan-900 px-1 rounded">B</span>}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Equation Ribbon */}
              <div className="relative z-10 mt-4 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <span className="text-amber-400 font-bold">Famous Vector Math:</span>
                <span className="font-mono text-white">King - Man + Woman ≈ Queen</span>
              </div>
            </div>

            {/* Right Control & Selector Column */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Select Comparison Words
                </h4>

                {/* Point A picker */}
                <div className="space-y-1.5">
                  <label className="text-xs text-indigo-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    <span>Vector Point A:</span>
                  </label>
                  <select
                    value={selectedPointA.id}
                    onChange={(e) => {
                      const found = points.find((p) => p.id === e.target.value);
                      if (found) setSelectedPointA(found);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {points.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Point B picker */}
                <div className="space-y-1.5">
                  <label className="text-xs text-cyan-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                    <span>Vector Point B:</span>
                  </label>
                  <select
                    value={selectedPointB.id}
                    onChange={(e) => {
                      const found = points.find((p) => p.id === e.target.value);
                      if (found) setSelectedPointB(found);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    {points.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Coordinates Inspector */}
                <div className="p-3 rounded-xl bg-slate-950 text-xs font-mono space-y-1 text-slate-400 border border-slate-800/80">
                  <div>
                    A [{selectedPointA.label}]: [{selectedPointA.x}, {selectedPointA.y}]
                  </div>
                  <div>
                    B [{selectedPointB.label}]: [{selectedPointB.x}, {selectedPointB.y}]
                  </div>
                  <div className="text-cyan-400 pt-1 border-t border-slate-800">
                    Similarity: {similarity}
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  💡 In real LLMs, words have <strong className="text-white">1,536 dimensions</strong>, capturing subtle relationships like verb tenses, cultural context, and tone!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: ARTIFICIAL NEURON & WEIGHTS --- */}
      {activeTab === 'neuron' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Interactive Controls */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>Neuron Weights & Inputs</span>
              </h3>

              {/* Input 1 & Weight 1 */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">Input 1 (x₁)</span>
                  <span className="font-mono text-cyan-400">{input1.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={input1}
                  onChange={(e) => setInput1(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500"
                />

                <div className="flex justify-between text-xs font-medium pt-2 border-t border-slate-900">
                  <span className="text-slate-400">Weight 1 (w₁)</span>
                  <span className="font-mono text-indigo-400">{weight1.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={weight1}
                  onChange={(e) => setWeight1(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              {/* Input 2 & Weight 2 */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">Input 2 (x₂)</span>
                  <span className="font-mono text-cyan-400">{input2.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={input2}
                  onChange={(e) => setInput2(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500"
                />

                <div className="flex justify-between text-xs font-medium pt-2 border-t border-slate-900">
                  <span className="text-slate-400">Weight 2 (w₂)</span>
                  <span className="font-mono text-indigo-400">{weight2.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={weight2}
                  onChange={(e) => setWeight2(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              {/* Bias Slider */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">Neuron Bias (Threshold offset)</span>
                  <span className="font-mono text-amber-400">{bias.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={bias}
                  onChange={(e) => setBias(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Activation Function */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold">
                  Activation Curve:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['relu', 'sigmoid', 'step'] as const).map((fn) => (
                    <button
                      key={fn}
                      onClick={() => setActivationFunc(fn)}
                      className={`py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                        activationFunc === fn
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {fn}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Visual Neural Circuit */}
            <div className="lg:col-span-7 rounded-3xl bg-slate-950 border border-slate-800 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
              <div className="w-full max-w-md space-y-6 text-center">
                <div className="flex items-center justify-between text-xs text-slate-400 px-4">
                  <span>Input Layer</span>
                  <span>Weights & Bias</span>
                  <span>Activation & Output</span>
                </div>

                {/* Circuit Visualization */}
                <div className="flex items-center justify-around relative py-6">
                  {/* Inputs */}
                  <div className="space-y-8">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex flex-col items-center justify-center text-cyan-300 font-mono text-xs shadow-lg">
                      <span className="text-[10px] text-slate-400">x₁</span>
                      <strong>{input1}</strong>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex flex-col items-center justify-center text-cyan-300 font-mono text-xs shadow-lg">
                      <span className="text-[10px] text-slate-400">x₂</span>
                      <strong>{input2}</strong>
                    </div>
                  </div>

                  {/* Center Artificial Neuron Node */}
                  <div
                    className={`relative w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-300 ${
                      isNeuronFired
                        ? 'border-emerald-400 bg-emerald-950/40 shadow-2xl shadow-emerald-500/40 animate-pulse'
                        : 'border-slate-700 bg-slate-900 shadow-inner'
                    }`}
                  >
                    <Activity
                      className={`w-7 h-7 mb-1 ${
                        isNeuronFired ? 'text-emerald-300' : 'text-slate-600'
                      }`}
                    />
                    <span className="text-[11px] font-mono text-slate-400">
                      z = {rawSum.toFixed(2)}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-500">
                      {activationFunc}
                    </span>
                  </div>

                  {/* Output Node */}
                  <div>
                    <div
                      className={`w-16 h-16 rounded-2xl border flex flex-col items-center justify-center font-mono text-sm font-extrabold transition-all shadow-xl ${
                        isNeuronFired
                          ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-emerald-500/50 scale-105'
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                    >
                      <span className="text-[9px] uppercase font-bold opacity-80">Output</span>
                      <span>{neuronOutput.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Math Formula Card */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                  <div className="text-slate-500 text-[11px]">Formula in Action:</div>
                  <div className="text-indigo-300">
                    z = ({input1} * {weight1}) + ({input2} * {weight2}) + ({bias}) ={' '}
                    <strong className="text-white">{rawSum.toFixed(3)}</strong>
                  </div>
                  <div className="text-emerald-300 pt-1 border-t border-slate-800">
                    Output = {activationFunc.toUpperCase()}({rawSum.toFixed(3)}) ={' '}
                    <strong className="text-white">{neuronOutput.toFixed(3)}</strong>
                  </div>
                </div>

                <div className="text-xs text-slate-400">
                  {isNeuronFired ? (
                    <span className="text-emerald-400 font-bold">
                      ⚡ Action Potential Reached! The neuron fired!
                    </span>
                  ) : (
                    <span className="text-slate-500">
                      💤 Below firing threshold. Tweak inputs or increase weights.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: LLM TOKENIZER INSPECTOR --- */}
      {activeTab === 'tokens' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white">
                  Interactive Tokenizer & Scrabble Tile Inspector
                </h3>
                <p className="text-xs text-slate-400">
                  Type any sentence below to see how Large Language Models (LLMs) split human language into token syllables.
                </p>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500">Tokens: </span>
                  <span className="text-indigo-400 font-bold">{simulatedTokens.length}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500">Characters: </span>
                  <span className="text-cyan-400 font-bold">{tokenInputText.length}</span>
                </div>
              </div>
            </div>

            {/* Input textarea */}
            <textarea
              value={tokenInputText}
              onChange={(e) => setTokenInputText(e.target.value)}
              placeholder="Type anything to inspect its token breakdown..."
              className="w-full h-24 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none font-mono"
            />

            {/* Visual Token Output Tiles */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Visual Token Syllables:
              </span>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/90 flex flex-wrap gap-2 min-h-24 items-center">
                {simulatedTokens.map((token, idx) => {
                  const colorClass = TOKEN_COLORS[idx % TOKEN_COLORS.length];
                  return (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-medium shadow-sm transition-all hover:scale-105 cursor-default ${colorClass}`}
                      title={`Token ID: ${token.id} | Length: ${token.text.length} chars`}
                    >
                      {token.text}
                      <span className="text-[9px] opacity-60 ml-1">#{token.id}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Real-Life Context Card */}
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed font-medium flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Why does this matter? </strong>
                LLMs do not charge or think in words—they process Tokens! 1,000 tokens is roughly 750 English words. This is why API billing is calculated "per 1M tokens" and why context windows are measured in tokens (e.g. Gemini's 1 Million+ token window).
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
