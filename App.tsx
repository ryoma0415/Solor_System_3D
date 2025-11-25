import React, { useState, Suspense, useMemo, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Loader } from '@react-three/drei';
import { Scene3D } from './components/Scene3D';
import { InfoPanel } from './components/InfoPanel';
import { CameraController } from './components/CameraController';
import { CelestialBodyCategory, CelestialBodyData } from './types';
import { SOLAR_SYSTEM_DATA } from './data';

const CATEGORY_ORDER: CelestialBodyCategory[] = [
  'star',
  'planet',
  'dwarf_planet',
  'moon',
  'artificial_satellite',
  'comet'
];

const CATEGORY_LABELS: Record<CelestialBodyCategory, string> = {
  star: 'Star',
  planet: 'Planets',
  dwarf_planet: 'Dwarf Planets',
  moon: 'Moons',
  artificial_satellite: 'Satellites',
  comet: 'Comets'
};

const BGM_VOLUME = 0.25; // Lower background volume so narration stays clear

const toAssetPath = (path: string): string => {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
};

export default function App() {
  const [selectedBody, setSelectedBody] = useState<CelestialBodyData | null>(null);
  const [timeScale, setTimeScale] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showTargets, setShowTargets] = useState<boolean>(false);
  const [isBgmOn, setIsBgmOn] = useState<boolean>(false);
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  // Handle dropdown change
  const handleBodySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bodyId = e.target.value;
    if (!bodyId) {
      setSelectedBody(null);
      return;
    }
    const body = SOLAR_SYSTEM_DATA.bodies.find(b => b.id === bodyId);
    if (body) {
      setSelectedBody(body);
    }
  };

  // Group bodies for the dropdown
  const groupedBodies = useMemo(() => {
    const groups: Partial<Record<CelestialBodyCategory, CelestialBodyData[]>> = {};
    CATEGORY_ORDER.forEach(cat => {
      groups[cat] = [];
    });
    SOLAR_SYSTEM_DATA.bodies.forEach(b => {
      if (!groups[b.category]) groups[b.category] = [];
      groups[b.category]?.push(b);
    });
    return groups;
  }, []);

  // Manage BGM loop play/pause
  useEffect(() => {
    if (!isBgmOn) {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current.currentTime = 0;
      }
      return;
    }

    if (!bgmRef.current) {
      const audio = new Audio(toAssetPath('/audio/BGM/birth_of_the_universe.mp3'));
      audio.loop = true;
      audio.volume = BGM_VOLUME;
      audio.onerror = () => setIsBgmOn(false);
      bgmRef.current = audio;
    }

    bgmRef.current.volume = BGM_VOLUME;
    bgmRef.current.loop = true;
    bgmRef.current.onerror = () => setIsBgmOn(false);
    bgmRef.current.play().catch(() => setIsBgmOn(false));
  }, [isBgmOn]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
    },
    []
  );

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden font-sans">
      {/* 3D Canvas Layer */}
      <div className="absolute inset-0 z-0">
        {/* Adjusted camera position to see more of the system at launch */}
        <Canvas camera={{ position: [0, 40, 50], fov: 45 }}>
          <color attach="background" args={['#050505']} />
          <ambientLight intensity={0.1} />
          <pointLight position={[0, 0, 0]} intensity={2} decay={0} distance={1000} color="#fffaed" />
          <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <Suspense fallback={null}>
            <Scene3D 
              onSelect={setSelectedBody} 
              timeScale={timeScale} 
              isPaused={isPaused}
              showHighlights={showTargets}
              selectedId={selectedBody?.id}
            />
            {/* Controls camera movement when a body is selected */}
            <CameraController selectedBody={selectedBody} />
          </Suspense>
          
          <OrbitControls 
            makeDefault
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            minDistance={0.05}
            maxDistance={400}
          />
        </Canvas>
      </div>

      {/* Loading overlay if R3F assets take time */}
      <Loader />

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-4 md:p-6">
        
        {/* Header */}
        <header className="pointer-events-auto flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Solar System
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">Interactive 3D Explorer</p>
          </div>
          
          {/* Time & View Controls */}
          <div className="flex flex-col gap-2 items-end bg-slate-900/50 backdrop-blur-md p-3 rounded-lg border border-slate-800">
            
            {/* Navigation Dropdown */}
            <div className="w-full mb-2 border-b border-slate-700/50 pb-2">
              <select 
                value={selectedBody?.id || ""} 
                onChange={handleBodySelect}
                className="w-full bg-slate-800 text-slate-200 text-xs md:text-sm rounded px-2 py-1.5 border border-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">Select a celestial body...</option>
                {CATEGORY_ORDER.map(cat => {
                  const list = groupedBodies[cat];
                  if (!list || list.length === 0) return null;
                  return (
                    <optgroup key={cat} label={CATEGORY_LABELS[cat]}>
                      {list.map(b => <option key={b.id} value={b.id}>{b.name.en} ({b.name.ja})</option>)}
                    </optgroup>
                  );
                })}
              </select>
            </div>

            <div className="flex flex-wrap justify-end gap-2 items-center">
              
              {/* Highlight Toggle */}
              <button
                onClick={() => setShowTargets(!showTargets)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all border ${
                  showTargets 
                    ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_10px_rgba(147,51,234,0.5)]' 
                    : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {showTargets ? "HIDE SMALL TARGETS" : "FIND SMALL TARGETS"}
              </button>

              <div className="h-4 w-px bg-slate-700 mx-1"></div>

              {/* BGM Toggle */}
              <button
                onClick={() => setIsBgmOn(!isBgmOn)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all border ${
                  isBgmOn
                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                    : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isBgmOn ? "BGM ON" : "BGM OFF"}
              </button>

              <div className="h-4 w-px bg-slate-700 mx-1"></div>

              <button 
                onClick={() => setIsPaused(!isPaused)}
                className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-xs font-bold transition-colors"
              >
                {isPaused ? "PLAY" : "PAUSE"}
              </button>
              
              <div className="flex items-center gap-2 bg-slate-800/50 px-2 py-1 rounded">
                <span className="text-xs text-slate-300">Speed:</span>
                <input 
                  type="range" 
                  min="0" 
                  max="5" 
                  step="0.5" 
                  value={timeScale}
                  onChange={(e) => setTimeScale(parseFloat(e.target.value))}
                  className="w-20 md:w-24 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <span className="text-xs w-8 text-right font-mono">{timeScale}x</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 text-right leading-snug">
              <div>Orbits are to scale (AU). Sizes are exaggerated.</div>
              <div>音楽: BGMer (http://bgmer.net)</div>
            </div>
          </div>
        </header>

        {/* Footer / Legend or Selection Indicator */}
        <footer className="pointer-events-auto mt-auto">
          {!selectedBody && (
            <div className="bg-slate-900/50 backdrop-blur-sm p-4 rounded-lg border border-slate-800 max-w-md inline-block animate-pulse">
              <p className="text-sm text-slate-300">Click on a planet or star to view details.</p>
            </div>
          )}
        </footer>
      </div>

      {/* Detail Side Panel */}
      <InfoPanel 
        body={selectedBody} 
        onClose={() => setSelectedBody(null)} 
      />
    </div>
  );
}
