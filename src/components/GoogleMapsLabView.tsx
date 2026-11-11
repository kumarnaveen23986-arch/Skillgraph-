import React, { useState, useEffect } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow 
} from '@vis.gl/react-google-maps';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Layers, 
  Sparkles, 
  Code2, 
  Play, 
  CheckCircle2, 
  Globe2, 
  ExternalLink,
  Info,
  Route,
  Zap
} from 'lucide-react';
import { LanguageTone, UserProgress } from '../types';

interface TechHubLocation {
  id: string;
  name: string;
  category: string;
  city: string;
  lat: number;
  lng: number;
  csAnalogy: string;
  description: string;
  pinColor: string;
}

const GLOBAL_TECH_HUBS: TechHubLocation[] = [
  {
    id: 'googleplex',
    name: 'Googleplex (HQ)',
    category: 'AI & Transformers Hub',
    city: 'Mountain View, California',
    lat: 37.422,
    lng: -122.0841,
    csAnalogy: 'Where the Transformer architecture ("Attention is All You Need") and Gemini were engineered.',
    description: 'Home of Google AI research, Google Maps Platform core engineering, and large-scale distributed computing.',
    pinColor: '#4285F4',
  },
  {
    id: 'deepmind',
    name: 'Google DeepMind',
    category: 'Deep Reinforcement Learning',
    city: 'London, United Kingdom',
    lat: 51.5314,
    lng: -0.1261,
    csAnalogy: 'Like chess grandmasters thinking 20 moves ahead: AlphaFold and AlphaGo were trained here.',
    description: 'Pioneered deep reinforcement learning, solving the 50-year-old protein folding mystery.',
    pinColor: '#EA4335',
  },
  {
    id: 'mit-csail',
    name: 'MIT CSAIL',
    category: 'Computer Science Birthplace',
    city: 'Cambridge, Massachusetts',
    lat: 42.3619,
    lng: -71.0906,
    csAnalogy: 'The root vertex in the tree of modern operating systems, cryptographic protocols, and the World Wide Web.',
    description: 'Computer Science and Artificial Intelligence Laboratory where Tim Berners-Lee based W3C.',
    pinColor: '#FBBC05',
  },
  {
    id: 'bengaluru-ai',
    name: 'Bengaluru Tech & AI Corridor',
    category: 'Silicon Valley of the East',
    city: 'Bengaluru, India',
    lat: 12.9716,
    lng: 77.5946,
    csAnalogy: 'A massive high-throughput distributed message queue handling millions of concurrent requests daily.',
    description: 'Premier engineering and research ecosystem driving global AI deployments, fintech, and cloud scale.',
    pinColor: '#34A853',
  },
  {
    id: 'tokyo-ai',
    name: 'Tokyo Robotics & AI Hub',
    category: 'Robotics & Computer Vision',
    city: 'Tokyo, Japan',
    lat: 35.6762,
    lng: 139.6503,
    csAnalogy: 'Sensory feedback loops: connecting neural nets to physical robotic actuators with sub-millisecond precision.',
    description: 'Global epicenter for autonomous robotics, computer vision, and industrial neural control.',
    pinColor: '#8B5CF6',
  },
];

interface GoogleMapsLabViewProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
  languageTone: LanguageTone;
  onJumpToCodeLab: (code: string) => void;
}

export const GoogleMapsLabView: React.FC<GoogleMapsLabViewProps> = ({
  progress,
  onUpdateProgress,
  languageTone,
  onJumpToCodeLab,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBxThuJ6_tUufPRJhHOA2RIWtBJ0tfj9jE';

  const [selectedHub, setSelectedHub] = useState<TechHubLocation | null>(GLOBAL_TECH_HUBS[0]);
  const [clickedLocation, setClickedLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  // Graph Routing demo between two hubs
  const [originHubId, setOriginHubId] = useState<string>(GLOBAL_TECH_HUBS[0].id);
  const [destHubId, setDestHubId] = useState<string>(GLOBAL_TECH_HUBS[3].id);

  // Haversine distance calculator
  const calculateGreatCircleDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const originHub = GLOBAL_TECH_HUBS.find((h) => h.id === originHubId) || GLOBAL_TECH_HUBS[0];
  const destHub = GLOBAL_TECH_HUBS.find((h) => h.id === destHubId) || GLOBAL_TECH_HUBS[3];
  const routeDistanceKm = calculateGreatCircleDistance(
    originHub.lat,
    originHub.lng,
    destHub.lat,
    destHub.lng
  );

  const sampleHaversineCode = `// Real-world Google Maps Distance Formula (Haversine)
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in kilometers
  const toRad = deg => (deg * Math.PI) / 180;
  
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Distance from Googleplex to Bengaluru AI Hub
const distance = getDistanceKm(37.422, -122.084, 12.971, 77.594);
console.log("Global geodesic distance:", distance + " km");`;

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-1">
            <Globe2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Google Maps Platform & Geospatial Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Geospatial Computing & Graph Algorithms
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Explore live Google Maps data, understand how Graph Search (Dijkstra / A*) powers GPS routing, and test geospatial code formulas in the sandbox.
          </p>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <div>
            <div className="font-bold text-slate-200">Google Maps Platform API</div>
            <div className="text-[10px] text-slate-500">Live @vis.gl/react-google-maps</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map on Left, CS & Algorithm Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Google Map Container */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl relative min-h-[500px] flex flex-col">
          {/* Map Top Bar */}
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-10 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span>Global AI & CS Research Landmarks</span>
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                Click pins to inspect
              </span>
            </div>

            <div className="text-slate-400 text-[11px] hidden sm:block">
              Coordinates: {selectedHub?.lat.toFixed(4)}, {selectedHub?.lng.toFixed(4)}
            </div>
          </div>

          {/* Interactive Google Map using @vis.gl/react-google-maps */}
          <div className="w-full flex-1 relative min-h-[460px]">
            <APIProvider apiKey={apiKey}>
              <Map
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                defaultCenter={{ lat: 30.0, lng: 10.0 }}
                defaultZoom={2}
                gestureHandling="greedy"
                disableDefaultUI={false}
                style={{ width: '100%', height: '100%', minHeight: '460px' }}
                onClick={(e) => {
                  if (e.detail.latLng) {
                    setClickedLocation({
                      lat: e.detail.latLng.lat,
                      lng: e.detail.latLng.lng,
                    });
                  }
                }}
              >
                {/* Global Landmark Advanced Markers */}
                {GLOBAL_TECH_HUBS.map((hub) => (
                  <AdvancedMarker
                    key={hub.id}
                    position={{ lat: hub.lat, lng: hub.lng }}
                    onClick={() => setSelectedHub(hub)}
                    title={hub.name}
                  >
                    <Pin
                      background={hub.pinColor}
                      glyphColor="#ffffff"
                      borderColor="#0f172a"
                      scale={1.1}
                    />
                  </AdvancedMarker>
                ))}

                {/* Custom Clicked Marker */}
                {clickedLocation && (
                  <AdvancedMarker position={clickedLocation}>
                    <Pin
                      background="#ec4899"
                      glyphColor="#ffffff"
                      borderColor="#0f172a"
                      scale={1.2}
                    />
                  </AdvancedMarker>
                )}

                {/* InfoWindow for Selected Landmark */}
                {selectedHub && (
                  <InfoWindow
                    position={{ lat: selectedHub.lat, lng: selectedHub.lng }}
                    onCloseClick={() => setSelectedHub(null)}
                  >
                    <div className="p-2 text-slate-900 max-w-xs space-y-1">
                      <div className="font-extrabold text-xs text-indigo-700">
                        {selectedHub.name}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-600">
                        {selectedHub.category} • {selectedHub.city}
                      </div>
                      <p className="text-[11px] text-slate-800 leading-snug">
                        {selectedHub.description}
                      </p>
                      <div className="pt-1 text-[10px] text-indigo-600 font-bold">
                        🌟 Metaphor: {selectedHub.csAnalogy}
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          </div>

          {/* Map Footer Bar with selected landmark insight */}
          {selectedHub && (
            <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-white">{selectedHub.name}: </span>
                <span className="text-slate-300">{selectedHub.csAnalogy}</span>
              </div>
              <span className="text-indigo-400 font-mono text-[11px] shrink-0 pl-2">
                [{selectedHub.lat}, {selectedHub.lng}]
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Computer Science & Algorithm Learning Tools */}
        <div className="lg:col-span-4 space-y-4">
          {/* 1. Dijkstra & Graph Routing Simulator */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                <Route className="w-4 h-4 text-cyan-400" />
                <span>Real-Life Graph Algorithm (Dijkstra & A*)</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                O(E + V log V)
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Google Maps turns Earth into a weighted directed graph where road segments are edges and intersections are vertices!
            </p>

            {/* Hub Selectors */}
            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">Origin Vertex (A):</label>
                <select
                  value={originHubId}
                  onChange={(e) => setOriginHubId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                >
                  {GLOBAL_TECH_HUBS.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">Destination Vertex (B):</label>
                <select
                  value={destHubId}
                  onChange={(e) => setDestHubId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                >
                  {GLOBAL_TECH_HUBS.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calculated Distance Card */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                Geodesic Great-Circle Distance
              </span>
              <div className="text-2xl font-mono font-extrabold text-cyan-400">
                {routeDistanceKm.toLocaleString()} km
              </div>
              <div className="text-[11px] text-slate-400">
                ~{Math.round(routeDistanceKm / 1.609).toLocaleString()} miles
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed font-medium">
              🌟 <strong className="text-white">Real-Life Metaphor: </strong>
              Dijkstra’s algorithm searches road networks like water flooding through connected pipes—it naturally arrives at the shortest path first!
            </div>
          </div>

          {/* 2. Haversine Math & Code Sandbox Integration */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Geospatial Coding Sandbox</span>
              </span>

              <button
                onClick={() => onJumpToCodeLab(sampleHaversineCode)}
                className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Test in Code Lab</span>
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Curved trigonometry on Earth: Run the Haversine formula directly in JavaScript or Python!
            </p>

            <pre className="p-3 bg-slate-950 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-36">
              <code>{sampleHaversineCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
