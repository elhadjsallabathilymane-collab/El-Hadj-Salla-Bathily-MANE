import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Video, 
  Image as ImageIcon, 
  Mic, 
  Settings, 
  Search, 
  Download, 
  Play, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Menu,
  X,
  Plus,
  Copy,
  ChevronRight,
  TrendingUp,
  History,
  Terminal,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface VideoEntry {
  id: string;
  topic: string;
  title: string;
  tags: string[];
  description: string;
  status: 'processing' | 'completed' | 'failed';
  date: string;
  thumbnail?: string;
  video_url?: string;
}

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'video_gen', label: 'Video Factory', icon: Video },
    { id: 'thumbnail_gen', label: 'Thumbnail Lab', icon: ImageIcon },
    { id: 'library', label: 'Library', icon: History },
    { id: 'voice_control', label: 'Satan Voice', icon: Mic },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen text-slate-300 flex flex-col border-r border-slate-800">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
          S
        </div>
        <span className="font-bold text-xl tracking-tight text-white">SATAN-CC</span>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin Account</p>
            <p className="text-xs text-slate-500 truncate">V2 Pro Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardView = ({ videos }: { videos: VideoEntry[] }) => (
  <div className="p-8 space-y-8 max-w-6xl mx-auto">
    <header className="flex justify-between items-end">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
        <p className="text-slate-500 mt-1">Satan command center is online and ready.</p>
      </div>
      <div className="flex gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Channel Growth</p>
            <p className="text-xl font-bold text-slate-900">+12% this week</p>
          </div>
        </div>
      </div>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-white/10 rounded-2xl">
            <Video size={24} />
          </div>
          <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest">Active Batch</span>
        </div>
        <h3 className="text-3xl font-bold mb-1">04</h3>
        <p className="text-indigo-100/80 font-medium">Videos Rendering</p>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-slate-100 rounded-2xl text-slate-600">
            <ImageIcon size={24} />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-slate-900 mb-1">28</h3>
        <p className="text-slate-500 font-medium">Thumbnails Ready</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-slate-100 rounded-2xl text-slate-600">
            <Clock size={24} />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-slate-900 mb-1">12h</h3>
        <p className="text-slate-500 font-medium">Render Time Saved</p>
      </div>
    </div>

    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Terminal size={20} className="text-indigo-600" /> Recent Operations
      </h3>
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Topic</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {videos.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                  No videos produced yet. Start in the Video Factory.
                </td>
              </tr>
            ) : videos.map(video => (
              <tr key={video.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <span className="font-semibold text-slate-900">{video.topic}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {video.status === 'completed' ? (
                      <span className="flex items-center gap-1.5 text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full text-xs">
                        <CheckCircle2 size={12} /> Live
                      </span>
                    ) : video.status === 'processing' ? (
                      <span className="flex items-center gap-1.5 text-amber-600 font-medium bg-amber-50 px-3 py-1 rounded-full text-xs">
                        <Clock size={12} /> Rendering
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-rose-600 font-medium bg-rose-50 px-3 py-1 rounded-full text-xs">
                        <AlertCircle size={12} /> Failed
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">{video.date}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                    <ChevronRight size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// --- Thumbnail Lab View ---

const ThumbnailLabView = () => {
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [sourceImageUrl, setSourceImageUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [mode, setMode] = useState<'free' | 'premium'>('premium');

  const fetchSourceThumbnail = async (url: string) => {
    if (!url) return;
    try {
      const res = await fetch(`/api/thumbnail/source?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.thumbnailUrl) setSourceImageUrl(data.thumbnailUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate = async () => {
    if (!sourceImageUrl) {
      alert("Collez d'abord un lien YouTube valide.");
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch('/api/thumbnail/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mode, 
          sourceUrl: sourceImageUrl 
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setGeneratedUrl(data.url);
    } catch (err) {
      console.error(err);
      alert("La création a échoué. Vérifiez vos clés API.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-black text-slate-900 font-display italic uppercase tracking-tighter">
          Clonage de Miniature <span className="text-indigo-600">Satan</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Donnez simplement le lien d'une vidéo. Satan analyse le style, comprend le sujet, et génère une version **ORIGINALE** et **PROPRIÉTAIRE** pour vous.
        </p>
      </header>

      <div className="max-w-3xl mx-auto bg-white border-2 border-slate-200 rounded-[40px] p-10 shadow-2xl space-y-10">
        <div className="space-y-6">
          <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
            <Search size={16} className="text-indigo-600" /> Lien de la vidéo concurrente
          </label>
          <div className="relative group">
            <input 
              type="text" 
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 outline-none text-lg font-medium focus:border-indigo-600 transition-all shadow-inner"
              value={competitorUrl}
              onChange={(e) => {
                setCompetitorUrl(e.target.value);
                const match = e.target.value.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
                if (match) fetchSourceThumbnail(e.target.value);
              }}
            />
            {sourceImageUrl && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-24 aspect-video rounded-xl overflow-hidden border-2 border-white shadow-md">
                <img src={sourceImageUrl} className="w-full h-full object-cover" alt="Source" />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900">Mode Stratégique</h4>
            <p className="text-xs text-slate-500">Gemini analyse les KPIs visuels de la cible.</p>
          </div>
          <div className="flex bg-slate-200 p-1 rounded-xl">
            {['free', 'premium'].map((m) => (
              <button 
                key={m}
                onClick={() => setMode(m as 'free' | 'premium')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === m ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !sourceImageUrl}
          className="w-full py-8 bg-slate-950 text-white rounded-3xl font-black text-2xl tracking-[0.1em] uppercase hover:bg-indigo-600 transition-all transform hover:-translate-y-1 active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none shadow-2xl"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center gap-4">
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Infiltration en cours...</span>
            </div>
          ) : "Engager le Clonage Original"}
        </button>
      </div>

      <AnimatePresence>
        {generatedUrl && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <div className="aspect-video bg-slate-900 rounded-[50px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border-8 border-white border-t-indigo-100 relative group">
              <img src={generatedUrl} className="w-full h-full object-cover" alt="Original Artwork" />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button 
                   onClick={() => window.open(generatedUrl, '_blank')}
                   className="p-6 bg-white text-slate-900 rounded-full font-black text-sm uppercase tracking-widest hover:scale-110 transition-transform flex items-center gap-2"
                 >
                   <Download size={20} /> Télécharger l'Asset
                 </button>
              </div>
            </div>
            <p className="text-center text-slate-400 font-mono text-[10px] uppercase tracking-widest">
              Généré via Satan Logic Protocol v4.0 • Asset Original Non-Plagié
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// --- Settings View ---

const SettingsView = () => {
  const [config, setConfig] = useState({
    geminiKey: localStorage.getItem('satan_gemini_key') || '',
    heygenKey: localStorage.getItem('satan_heygen_key') || '',
    avatarId: localStorage.getItem('satan_avatar_id') || '',
    voiceId: localStorage.getItem('satan_voice_id') || '',
  });

  const saveConfig = () => {
    localStorage.setItem('satan_gemini_key', config.geminiKey);
    localStorage.setItem('satan_heygen_key', config.heygenKey);
    localStorage.setItem('satan_avatar_id', config.avatarId);
    localStorage.setItem('satan_voice_id', config.voiceId);
    alert("Configuration sauvegardée localement !");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 font-display">Configuration Système</h1>
        <p className="text-slate-500">Gérez vos clés API et vos identifiants de production.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Settings className="text-indigo-600" size={20} /> Clés API
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Gemini API Key (Optionnel si défini sur serveur)</label>
              <input 
                type="password"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600"
                value={config.geminiKey}
                onChange={(e) => setConfig({...config, geminiKey: e.target.value})}
                placeholder="AIza..."
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">HeyGen API Key</label>
              <input 
                type="password"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600"
                value={config.heygenKey}
                onChange={(e) => setConfig({...config, heygenKey: e.target.value})}
                placeholder="sk_v2_..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Video className="text-amber-600" size={20} /> Identifiants HeyGen
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Avatar ID</label>
              <input 
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600"
                value={config.avatarId}
                onChange={(e) => setConfig({...config, avatarId: e.target.value})}
                placeholder="Identifiant de votre Talking Photo"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Voice ID</label>
              <input 
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600"
                value={config.voiceId}
                onChange={(e) => setConfig({...config, voiceId: e.target.value})}
                placeholder="Identifiant de la voix"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-6">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Terminal className="text-indigo-400" size={20} /> Scripts de Commande Claude
        </h3>
        <p className="text-slate-400 text-sm">Copiez ces prompts dans Claude pour préparer vos batchs de contenus.</p>
        
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Rewrite Engine Prompt</span>
              <button 
                onClick={() => navigator.clipboard.writeText("Prends ce transcript vidéo et réécris-le entièrement pour mon avatar secret. Ton expert en santé, 15000 chars, structure captivante...")}
                className="text-slate-500 hover:text-white transition-colors"
                title="Copier le prompt"
              >
                <Copy size={16} />
              </button>
            </div>
            <p className="text-xs text-slate-300 font-mono italic opacity-70">"Analyse le transcript fourni. Réécris une version originale de 15 000 caractères..."</p>
          </div>
          
          <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Thumbnail Strategy Prompt</span>
              <button 
                onClick={() => navigator.clipboard.writeText("Génère une stratégie de miniature YouTube hyper-cliquable pour ce sujet. Texte en gros, contraste élevé, flèches rouges...")}
                className="text-slate-500 hover:text-white transition-colors"
                title="Copier le prompt"
              >
                <Copy size={16} />
              </button>
            </div>
            <p className="text-xs text-slate-300 font-mono italic opacity-70">"Crée un concept de miniature 16:9 à fort impact visuel basé sur..."</p>
          </div>
        </div>
      </div>

      <button 
        onClick={saveConfig}
        className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl tracking-widest uppercase hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20"
      >
        Sauvegarder & Connecter
      </button>
    </div>
  );
};

const VideoFactoryView = ({ onGenerated }: { onGenerated: () => void }) => {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(0); // 0: input, 1: transcript, 2: script, 3: submit
  const [transcript, setTranscript] = useState('');
  const [script, setScript] = useState<any>(null);
  const [hasHeyGen, setHasHeyGen] = useState(true);

  useEffect(() => {
    // Check if HeyGen key is configured on mount/check
    fetch('/api/health').then(() => {
      // Small check to see if we have the key (we'd ideally expose key availability in health)
    });
  }, []);

  const steps = [
    { label: 'Capture', icon: Search },
    { label: 'Analyze', icon: Terminal },
    { label: 'Rewrite', icon: Plus },
    { label: 'Render', icon: Play },
  ];

  const handleStart = async () => {
    setIsProcessing(true);
    setStep(1);
    try {
      const res = await fetch(`/api/transcript?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        throw new Error(data.error);
      }
      setTranscript(data.text);
      setStep(2);
      
      // Call AI Rewrite
      const aiRes = await fetch('/api/ai/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: data.text, url })
      });
      const aiData = await aiRes.json();
      if (aiData.error) throw new Error(aiData.error);
      
      setScript({
        video_inputs: [{
          input_text: aiData.input_text || "Error generating script.",
          character: { type: "talking_photo", talking_photo_id: localStorage.getItem('satan_avatar_id') || "your_photo_id" },
          voice: { type: "text", input_text: aiData.input_text, voice_id: localStorage.getItem('satan_voice_id') || "your_voice_id" }
        }]
      });
      setStep(3);
    } catch (err: any) {
      console.error(err);
      if (!err.message.includes("transcript")) {
        alert("Erreur système lors de la réécriture IA. Vérifiez vos clés API.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRender = async () => {
    if (!script) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/heygen/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic: url.split('v=')[1]?.substring(0, 10) || "Auto Video",
          video_inputs: script.video_inputs 
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onGenerated();
    } catch (err) {
      console.error(err);
      alert("HeyGen submission failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Video Factory</h1>
        <p className="text-slate-500">Transform any competitor URL into a proprietary script & video.</p>
      </header>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-8">
        <div className="flex justify-between relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 -z-0"></div>
          {steps.map((st, i) => (
            <div key={st.label} className="relative z-10 flex flex-col items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                i <= step ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-100 text-slate-400'
              }`}>
                <st.icon size={20} />
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest ${i <= step ? 'text-slate-900' : 'text-slate-400'}`}>
                {st.label}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-900 uppercase tracking-widest">Reference Video URL</label>
          <div className="flex gap-4">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 focus-within:border-indigo-600 transition-colors flex items-center gap-4">
              <Video className="text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="https://www.youtube.com/watch?v=..." 
                className="bg-transparent border-none outline-none w-full font-medium text-slate-900 placeholder:text-slate-400"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <button 
              onClick={handleStart}
              disabled={!url || isProcessing}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-900/10 flex items-center gap-2"
            >
              {isProcessing ? 'Processing...' : 'Auto-Generate'} <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 pt-6 border-t border-slate-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <History size={16} className="text-indigo-600" /> Source Transcript
                  </h4>
                  <div className="h-64 bg-slate-50 rounded-2xl p-4 overflow-y-auto text-sm text-slate-600 leading-relaxed font-mono">
                    {transcript || 'Capturing raw data...'}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Terminal size={16} className="text-amber-600" /> New Proprietary Script
                  </h4>
                  <div className="h-64 bg-slate-900 rounded-2xl p-4 overflow-y-auto text-sm text-slate-300 leading-relaxed font-mono border border-slate-800">
                    {script ? script.video_inputs[0].input_text : 'Pending AI rewrite...'}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button className="px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all">
                  Edit Script
                </button>
                <button 
                  onClick={handleRender}
                  disabled={!script || isProcessing}
                  className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
                >
                  {isProcessing ? 'Submitting...' : 'Confirm & Render'} <Play size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
const LibraryView = ({ videos }: { videos: VideoEntry[] }) => (
  <div className="p-8 max-w-6xl mx-auto space-y-8">
    <header>
      <h1 className="text-3xl font-bold text-slate-900 font-display">Video Library</h1>
      <p className="text-slate-500">Manage your production assets and local downloads.</p>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {videos.map(video => (
        <div key={video.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="aspect-video bg-slate-100 relative group">
            {video.thumbnail ? (
              <img src={video.thumbnail} className="w-full h-full object-cover" alt={video.topic} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <Clock size={40} className="animate-pulse" />
              </div>
            )}
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              {video.video_url && (
                <a 
                  href={video.video_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-3 bg-white rounded-full text-indigo-600 hover:scale-110 transition-transform"
                >
                  <Play size={20} fill="currentColor" />
                </a>
              )}
            </div>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-slate-900 truncate">{video.topic}</h4>
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                video.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                video.status === 'processing' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {video.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">{video.date}</p>
            
            <div className="flex gap-2">
              <button 
                onClick={async () => {
                  if (video.video_url) {
                    // Standard browser download
                    window.open(video.video_url, '_blank');
                    // Plus local system automation trigger
                    await fetch('/api/video/download-local', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ url: video.video_url, filename: `${video.topic}.mp4` })
                    });
                  }
                }}
                disabled={!video.video_url}
                className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Download size={14} /> Download MP4
              </button>
              <button className="px-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all">
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SatanVoiceView = ({ onCommand }: { onCommand: (cmd: string) => void }) => {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{role: 'satan' | 'user', text: string}[]>([]);
  const recognitionRef = useRef<any>(null);
  
  useEffect(() => {
    // Initializing Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = (event: any) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
        setMessages(prev => [...prev, { role: 'user', text: command }]);
        
        if (command.includes('ouvre la fabrique') || command.includes('factory')) {
          onCommand('video_gen');
          speakSatan("Ouverture de la fabrique de vidéos.");
        } else if (command.includes('bibliothèque') || command.includes('library')) {
          onCommand('library');
          speakSatan("Accès à la bibliothèque.");
        } else if (command.includes('tableau de bord') || command.includes('dashboard')) {
          onCommand('dashboard');
          speakSatan("Retour au centre de commandement.");
        } else {
          speakSatan("Commande non reconnue par le centre Satan.");
        }
      };

      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, []);

  const speakSatan = (text: string) => {
    setMessages(prev => [...prev, { role: 'satan', text }]);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.pitch = 0.5; // Satan voice pitch
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      speakSatan("Satan est à l'écoute. Je commande votre machine.");
    }
    setIsListening(!isListening);
  };

  return (
    <div className="h-screen bg-slate-950 text-white p-12 flex flex-col justify-center items-center text-center">
      <motion.div 
        animate={{ scale: isListening ? [1, 1.05, 1] : 1 }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="relative mb-12"
      >
        <div className={`w-48 h-48 rounded-full border-4 transition-all duration-500 flex items-center justify-center ${
          isListening ? 'border-indigo-500 shadow-[0_0_80px_rgba(79,70,229,0.4)]' : 'border-slate-800'
        }`}>
          <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening ? 'bg-indigo-600' : 'bg-slate-800'
          }`}>
            <Mic size={48} className={isListening ? 'animate-pulse' : 'text-slate-400'} />
          </div>
        </div>
      </motion.div>

      <div className="max-w-xl w-full">
        <h2 className="text-4xl font-extrabold tracking-tight mb-4 italic uppercase font-display">
          {isListening ? 'Système Vocal Actif' : 'Satan en Sommeil'}
        </h2>
        <p className="text-slate-500 text-lg mb-8">
          Contrôlez votre ordinateur par la voix.
        </p>

        <div className="space-y-4 text-left max-h-64 overflow-y-auto mb-8 px-4 scrollbar-hide">
          {messages.map((m, i) => (
            <motion.div 
              initial={{ opacity: 0, x: m.role === 'satan' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              key={i} 
              className={`p-4 rounded-2xl max-w-[80%] ${
                m.role === 'satan' ? 'bg-indigo-900/30 text-indigo-200 ml-0 border border-indigo-500/20' : 'bg-slate-800 text-slate-100 ml-auto'
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-50">{m.role}</p>
              <p className="font-medium">{m.text}</p>
            </motion.div>
          ))}
        </div>

        <button 
          onClick={toggleListening}
          className={`px-12 py-5 rounded-3xl font-black text-xl tracking-widest uppercase transition-all ${
            isListening ? 'bg-rose-600 hover:bg-rose-500' : 'bg-indigo-600 hover:bg-indigo-500'
          }`}
        >
          {isListening ? 'Eteindre le Micro' : 'Réveiller Satan'}
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [videos, setVideos] = useState<VideoEntry[]>([]);

  // Fetch videos on mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('/api/videos');
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.error("Failed to fetch videos", err);
      }
    };
    fetchVideos();
    const interval = setInterval(fetchVideos, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, []);

  // Poll processing videos
  useEffect(() => {
    const processing = videos.filter(v => v.status === 'processing');
    processing.forEach(async (v) => {
      try {
        await fetch(`/api/heygen/status?video_id=${v.id}`);
      } catch (err) {
        console.error("Status check failed", err);
      }
    });
  }, [videos]);

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="h-full"
            >
              {activeTab === 'dashboard' && <DashboardView videos={videos} />}
              {activeTab === 'video_gen' && <VideoFactoryView onGenerated={() => setActiveTab('library')} />}
              {activeTab === 'thumbnail_gen' && <ThumbnailLabView />}
              {activeTab === 'library' && <LibraryView videos={videos} />}
              {activeTab === 'voice_control' && <SatanVoiceView onCommand={setActiveTab} />}
              {activeTab === 'settings' && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
