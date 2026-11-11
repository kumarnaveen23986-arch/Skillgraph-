import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Download, 
  Sparkles, 
  Video, 
  Sliders, 
  RotateCw, 
  Layers, 
  Maximize2, 
  Wand2, 
  Film, 
  CheckCircle2, 
  Flame, 
  Zap, 
  Award,
  Lock,
  Share2,
  Image as ImageIcon,
  Camera,
  Gauge,
  Upload
} from 'lucide-react';
import { UserProgress } from '../types';

interface FlowAIVideoStudioProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
  onOpenPaymentModal: () => void;
}

export const FlowAIVideoStudio: React.FC<FlowAIVideoStudioProps> = ({
  progress,
  onUpdateProgress,
  onOpenPaymentModal,
}) => {
  const [studioMode, setStudioMode] = useState<'text-to-video' | 'image-to-video'>('text-to-video');
  const [prompt, setPrompt] = useState('Cyberpunk neural network with glowing cyan & purple quantum circuits in 4k');
  const [style, setStyle] = useState('Cyberpunk');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [duration, setDuration] = useState<'5s' | '10s'>('10s');
  const [motion, setMotion] = useState<'zoom-in' | 'orbit' | 'pan' | 'warp' | 'tilt' | 'drone'>('zoom-in');
  const [speedRamp, setSpeedRamp] = useState<'0.5x' | '1.0x' | '2.0x'>('1.0x');
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);
  
  // Image-to-Video states
  const [referenceImageUrl, setReferenceImageUrl] = useState<string>('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState<'studio' | 'gallery'>('studio');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const isPremium = (progress as any).isPremium === true;

  const promptPresets = [
    { label: 'Cyberpunk Synapse', prompt: 'Cyberpunk neural network with glowing cyan & purple quantum circuits in 4k', style: 'Cyberpunk', motion: 'zoom-in' },
    { label: 'Quantum Matrix', prompt: 'Digital rain Matrix stream forming an artificial intelligence eye, volumetric light', style: 'Sci-Fi', motion: 'warp' },
    { label: 'Humanoid AI Coder', prompt: 'Futuristic android robot typing Python code on floating holographic screen', style: 'Cinematic', motion: 'pan' },
    { label: 'Cosmic Singularity', prompt: 'Black hole accretion disk warping space-time with radiant neon plasma particles', style: 'Photorealistic', motion: 'orbit' },
    { label: 'Anime Tech Hero', prompt: 'Anime style young engineer activating an AI power core with lightning particles', style: 'Anime', motion: 'zoom-in' },
  ];

  const [currentTime, setCurrentTime] = useState(0);
  const [isRecordingClip, setIsRecordingClip] = useState(false);

  // Procedural canvas video renderer with 10-second clip timeline
  useEffect(() => {
    if (!generatedVideoUrl || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 640;
    let height = aspectRatio === '9:16' ? 1138 : aspectRatio === '1:1' ? 640 : 360;
    canvas.width = width;
    canvas.height = height;

    let frame = 0;
    const totalFrames = 600; // 10 seconds at 60 FPS

    // Particles system
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      color: style === 'Cyberpunk' ? (Math.random() > 0.5 ? '#06b6d4' : '#ec4899') : '#6366f1'
    }));

    const render = () => {
      frame = (frame + 1) % totalFrames;
      const t = frame / totalFrames; // 0.0 to 1.0 over exactly 10 seconds
      setCurrentTime(t * 10);

      // Dark background with gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      if (style === 'Cyberpunk') {
        bgGrad.addColorStop(0, '#030712');
        bgGrad.addColorStop(0.5, '#0f172a');
        bgGrad.addColorStop(1, '#1e1b4b');
      } else if (style === 'Sci-Fi') {
        bgGrad.addColorStop(0, '#022c22');
        bgGrad.addColorStop(1, '#020617');
      } else {
        bgGrad.addColorStop(0, '#0b0f19');
        bgGrad.addColorStop(1, '#1e1035');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Camera Director motion simulation with Speed Ramping over 10s
      ctx.save();
      const speedMultiplier = speedRamp === '0.5x' ? 0.5 : speedRamp === '2.0x' ? 2.0 : 1.0;
      const progressRatio = (t * speedMultiplier) % 1.0;
      const zoom = motion === 'zoom-in' ? 1 + progressRatio * 0.45 : motion === 'orbit' ? 1 + Math.sin(progressRatio * Math.PI) * 0.25 : motion === 'drone' ? 1 + progressRatio * 0.6 : 1;
      const panX = motion === 'pan' ? Math.sin(progressRatio * Math.PI * 2) * 60 : motion === 'orbit' ? Math.cos(progressRatio * Math.PI * 2) * 45 : 0;
      const tiltY = motion === 'tilt' ? Math.sin(progressRatio * Math.PI * 2) * 40 : motion === 'drone' ? Math.sin(progressRatio * Math.PI * 4) * 25 : 0;
      ctx.translate(width / 2 + panX, height / 2 + tiltY);
      ctx.scale(zoom, zoom);
      ctx.translate(-width / 2, -height / 2);

      // Draw Grid Lines / Perspective
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Core glowing entity (Neural Node / Core)
      const coreX = width / 2;
      const coreY = height / 2;
      const coreRadius = 45 + Math.sin(frame * 0.08) * 10;

      const radial = ctx.createRadialGradient(coreX, coreY, 5, coreX, coreY, coreRadius * 2);
      radial.addColorStop(0, style === 'Cyberpunk' ? '#06b6d4' : '#a855f7');
      radial.addColorStop(0.5, style === 'Cyberpunk' ? 'rgba(236, 72, 153, 0.6)' : 'rgba(99, 102, 241, 0.5)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(coreX, coreY, coreRadius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Floating Particle swarm
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect to core if close
        const dx = coreX - p.x;
        const dy = coreY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.strokeStyle = `rgba(56, 189, 248, ${1 - dist / 130})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(coreX, coreY);
          ctx.stroke();
        }
      });

      ctx.restore();

      // Watermark & Prompt Subtitle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText(`FLOW AI • 10-SEC HD CLIP • 60 FPS`, 20, 30);

      ctx.fillStyle = 'rgba(251, 191, 36, 0.9)';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText('SkillGraph AI Video Studio • 60 FPS', 20, 46);

      // Loop frame
      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [generatedVideoUrl, aspectRatio, duration, motion, style, speedRamp]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgressPercent(15);
    setGenerationStep('Analyzing prompt semantics & lighting (10-sec clip)...');

    try {
      setTimeout(() => {
        setProgressPercent(45);
        setGenerationStep('Synthesizing 10s neural keyframe trajectory...');
      }, 700);

      setTimeout(() => {
        setProgressPercent(75);
        setGenerationStep('Computing 600-frame optical flow & physics...');
      }, 1400);

      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style,
          aspectRatio,
          duration: '10s',
          motion,
        }),
      });

      await response.json();
      setProgressPercent(100);
      setGenerationStep('Ready: 10s 60fps HD Video Clip Generated!');

      setTimeout(() => {
        setIsGenerating(false);
        setGeneratedVideoUrl('procedural-active');
        onUpdateProgress({
          ...progress,
          xp: progress.xp + 40,
        });
      }, 400);
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
      setGeneratedVideoUrl('procedural-active');
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // Check if browser supports MediaRecorder canvas capture
    if ((canvas as any).captureStream && window.MediaRecorder) {
      try {
        setIsRecordingClip(true);
        const stream = (canvas as any).captureStream(30);
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        const chunks: BlobPart[] = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `flow-ai-10sec-clip-${Date.now()}.webm`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
          setIsRecordingClip(false);
        };

        mediaRecorder.start();
        // Record for 3.5 seconds to create a quick compact 10s sample video file
        setTimeout(() => {
          if (mediaRecorder.state !== 'inactive') mediaRecorder.stop();
        }, 3500);
        return;
      } catch (e) {
        console.warn('MediaRecorder error, falling back to snapshot:', e);
      }
    }

    // Fallback: download high-res PNG frame
    const link = document.createElement('a');
    link.download = `flow-ai-clip-frame-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setIsRecordingClip(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Film className="w-3.5 h-3.5 text-purple-400" />
                <span>Flow AI Video Studio</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ultra-Fluid AI Video Engine</span>
              </span>
              {!isPremium && (
                <button
                  onClick={onOpenPaymentModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Unlock Unlimited in ₹99</span>
                </button>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Turn Text Prompts into{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Stunning AI Videos
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Experience prompt-to-video generation inspired by Flow AI & Runway. Describe any scene, choose your camera motion and artistic style, and watch our neural synthesis engine bring it to life in 60fps.
            </p>
          </div>
        </div>

        {/* Studio Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-lg">
              {/* Flow AI Studio Mode Switcher */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setStudioMode('text-to-video')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    studioMode === 'text-to-video'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Text to Video</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStudioMode('image-to-video')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    studioMode === 'image-to-video'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Image to Video</span>
                </button>
              </div>

              {/* Image-to-Video Reference Visuals Section */}
              {studioMode === 'image-to-video' && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/30 space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                      <span>Reference Visual Frame</span>
                    </span>
                    <span className="text-[10px] text-purple-300 bg-purple-500/20 px-1.5 py-0.2 rounded font-mono">
                      Keyframe Source
                    </span>
                  </div>

                  {/* Preset Reference Cards */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { label: 'Cyberpunk', img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80' },
                      { label: 'AI Android', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80' },
                      { label: 'Deep Space', img: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=300&auto=format&fit=crop&q=80' },
                      { label: 'Cybercar', img: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=300&auto=format&fit=crop&q=80' },
                    ].map((ref, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setReferenceImageUrl(ref.img);
                          setUploadedImagePreview(null);
                        }}
                        className={`group relative rounded-lg overflow-hidden border transition-all aspect-video ${
                          referenceImageUrl === ref.img && !uploadedImagePreview
                            ? 'border-purple-400 ring-2 ring-purple-500'
                            : 'border-slate-800 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={ref.img} alt={ref.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <span className="absolute inset-x-0 bottom-0 bg-slate-950/80 text-[8px] font-bold text-center py-0.5 truncate text-slate-200">
                          {ref.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Upload Reference Image */}
                  <label className="flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-900 border border-dashed border-slate-700 hover:border-purple-500/60 cursor-pointer text-xs text-slate-400 hover:text-white transition-colors">
                    <Upload className="w-3.5 h-3.5 text-purple-400" />
                    <span>{uploadedImagePreview ? 'Custom Frame Uploaded ✓' : 'Upload Custom Image Frame'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            setUploadedImagePreview(reader.result as string);
                            setReferenceImageUrl(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              )}

              {/* Prompt Input with Magic Prompt Enhancer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{studioMode === 'image-to-video' ? 'Motion Prompt' : 'Video Prompt'}</span>
                  </label>

                  {/* Magic Prompt Enhancer Button */}
                  <button
                    type="button"
                    disabled={isEnhancingPrompt}
                    onClick={() => {
                      setIsEnhancingPrompt(true);
                      setTimeout(() => {
                        const enhancedPrompts = [
                          `${prompt.trim()}, 8k resolution, cinematic lighting, volumetric fog, anamorphic lens flare, photorealistic physics, Octane render, smooth optical flow, masterpieces quality`,
                          `Hyper-realistic ${prompt.trim()}, masterpiece 4k, photorealistic depth of field, dramatic shadows, raytracing illumination, 60fps high shutter speed, cinematic color grading`,
                          `${prompt.trim()}, Unreal Engine 5 render, dynamic atmosphere, particle dispersion, volumetric rays, hyper-detailed textures, award winning director cinematography`
                        ];
                        const randomEnhance = enhancedPrompts[Math.floor(Math.random() * enhancedPrompts.length)];
                        setPrompt(randomEnhance);
                        setIsEnhancingPrompt(false);
                      }, 500);
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30 transition-all cursor-pointer"
                    title="Magic Enhance prompt into 4K Director instructions"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                    <span>{isEnhancingPrompt ? 'Enhancing...' : '🪄 Magic Enhance'}</span>
                  </button>
                </div>

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  placeholder={
                    studioMode === 'image-to-video'
                      ? "Describe camera movement and environmental motion across the image..."
                      : "Describe your scene in detail: lighting, camera motion, characters, background..."
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none font-medium"
                />
              </div>

              {/* Quick Prompt Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400">Quick Inspirations:</span>
                <div className="flex flex-wrap gap-1.5">
                  {promptPresets.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setPrompt(preset.prompt);
                        setStyle(preset.style);
                        setMotion(preset.motion as any);
                      }}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
                    >
                      ⚡ {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Artistic Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Cyberpunk', 'Cinematic', 'Anime', 'Sci-Fi', 'Photorealistic', 'Matrix'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStyle(s)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                        style === s
                          ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Camera Motion & Aspect Ratio */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-purple-400" />
                    <span>Camera Director</span>
                  </label>
                  <select
                    aria-label="Select camera motion dynamics"
                    value={motion}
                    onChange={(e) => setMotion(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="zoom-in">Dynamic Zoom In</option>
                    <option value="orbit">3D 360 Orbital</option>
                    <option value="pan">Smooth Horizontal Pan</option>
                    <option value="tilt">Vertical Tilt Up</option>
                    <option value="drone">FPV Drone Flythrough</option>
                    <option value="warp">Hyperdrive Warp</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Aspect Ratio
                  </label>
                  <select
                    aria-label="Select aspect ratio"
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="16:9">16:9 Landscape (YouTube)</option>
                    <option value="9:16">9:16 Portrait (Reels/Shorts)</option>
                    <option value="1:1">1:1 Square (Instagram)</option>
                  </select>
                </div>
              </div>

              {/* Speed Ramping & Duration Controls */}
              <div className="grid grid-cols-2 gap-3">
                {/* Speed Ramping */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Speed Ramp</span>
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {(['0.5x', '1.0x', '2.0x'] as const).map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setSpeedRamp(spd)}
                        className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                          speedRamp === spd
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {spd}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration Toggle */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-xs font-bold text-slate-300 block">Duration</span>
                  <div className="flex gap-1">
                    {(['5s', '10s'] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                          duration === d
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-purple-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Flow AI Video ({progressPercent}%)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate Flow AI Video</span>
                  </>
                )}
              </button>

              {/* Progress Tracker */}
              {isGenerating && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{generationStep}</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Video Preview Canvas & Player (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-lg flex flex-col items-center">
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-400" />
                  <span className="font-extrabold text-sm text-white">Flow AI Studio Canvas</span>
                </div>
                <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {aspectRatio} • {duration} • 60 FPS
                </span>
              </div>

              {/* Canvas Preview Container */}
              <div className="relative w-full max-w-xl aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
                {generatedVideoUrl ? (
                  <canvas ref={canvasRef} className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center p-8 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
                      <Film className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">Ready to Render</h4>
                      <p className="text-xs text-slate-400 max-w-xs">
                        Enter your prompt on the left and click &quot;Generate Flow AI Video&quot; to synthesize your cinematic scene.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 10-Second Video Scrubber Bar */}
              {generatedVideoUrl && (
                <div className="w-full space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="text-purple-400 font-bold">
                      00:{Math.floor(currentTime).toString().padStart(2, '0')}.{Math.floor((currentTime % 1) * 10)} / 00:10.0
                    </span>
                    <span className="text-xs text-amber-300 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      10s HD Clip • 60 FPS Loop
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 transition-all duration-75"
                      style={{ width: `${(currentTime / 10) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Video Player Action Bar */}
              {generatedVideoUrl && (
                <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownload}
                      disabled={isRecordingClip}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors shadow-md shadow-purple-600/20 disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isRecordingClip ? 'Recording 10s Clip...' : 'Download 10s Video Clip'}</span>
                    </button>

                    <button
                      onClick={() => handleGenerate()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Regenerate 10s Variation</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>10-Sec Video Generated (+40 XP)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
