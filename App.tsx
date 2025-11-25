import React, { useState, Suspense, useMemo, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Loader } from '@react-three/drei';
import { Scene3D } from './components/Scene3D';
import { InfoPanel } from './components/InfoPanel';
import { CameraController } from './components/CameraController';
import { TourCameraCommand, TourCameraDriver } from './components/TourCameraDriver';
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

const BGM_VOLUME = 0.06; // Lower background volume so narration stays clear
const TOUR_VOICE_CREDIT = 'VOICEVOX: 小夜/SAYO';

type TourId = 'tour1' | 'tour2' | 'tour3';

const TOUR_SELECT_OPTIONS: { id: TourId; label: string }[] = [
  { id: 'tour1', label: 'ツアー1: 太陽系グランドツアー' },
  { id: 'tour2', label: 'Tour 2 (準備中)' },
  { id: 'tour3', label: 'Tour 3 (準備中)' }
];

const CAMERA_DISTANCES = {
  overview: [0, 55, 120] as [number, number, number],
  sun: 1.1,
  earth: 0.38,
  mars: 0.3,
  jupiter: 1.2,
  saturn: 1.2,
  pluto: 0.35
};

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
  const [selectedTour, setSelectedTour] = useState<TourId>('tour1');
  const [tourState, setTourState] = useState<'idle' | 'running'>('idle');
  const [tourStatusText, setTourStatusText] = useState<string>('');
  const [controlsLocked, setControlsLocked] = useState<boolean>(false);
  const [tourCameraCommand, setTourCameraCommand] = useState<TourCameraCommand>({ mode: 'idle' });
  const [orbitSpeedOverrides, setOrbitSpeedOverrides] = useState<Record<string, number>>({});
  const [showSunEffects, setShowSunEffects] = useState<boolean>(false);
  const [tourNotice, setTourNotice] = useState<string>('');
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const narrationRef = useRef<HTMLAudioElement | null>(null);
  const tourBgmRef = useRef<HTMLAudioElement | null>(null);
  const tourAbortRef = useRef<{ aborted: boolean }>({ aborted: false });
  const prevTimeScaleRef = useRef<number>(1);

  // Handle dropdown change
  const handleBodySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (controlsLocked) return;
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

  const handleSceneSelect = (body: CelestialBodyData) => {
    if (controlsLocked) return;
    setSelectedBody(body);
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

  const isTourRunning = tourState === 'running';

  const ensureNotAborted = () => {
    if (tourAbortRef.current.aborted) {
      throw new Error('tour-aborted');
    }
  };

  const waitMs = (ms: number) =>
    new Promise<void>((resolve, reject) => {
      let settled = false;
      const safeResolve = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      const safeReject = () => {
        if (settled) return;
        settled = true;
        reject(new Error('tour-aborted'));
      };
      if (tourAbortRef.current.aborted) {
        safeReject();
        return;
      }
      const timer = setTimeout(() => {
        if (tourAbortRef.current.aborted) {
          safeReject();
        } else {
          safeResolve();
        }
      }, ms);
      const stopOnAbort = () => {
        if (tourAbortRef.current.aborted) {
          clearTimeout(timer);
          safeReject();
        }
      };
      // Lightweight abort check shortly after scheduling
      setTimeout(stopOnAbort, 0);
    });

  const stopNarration = () => {
    if (narrationRef.current) {
      narrationRef.current.onended = null;
      narrationRef.current.onpause = null;
      narrationRef.current.onerror = null;
      narrationRef.current.pause();
      narrationRef.current = null;
    }
  };

  const stopTourBgm = () => {
    if (tourBgmRef.current) {
      tourBgmRef.current.onended = null;
      tourBgmRef.current.onerror = null;
      tourBgmRef.current.onpause = null;
      tourBgmRef.current.pause();
      tourBgmRef.current = null;
    }
  };

  const playNarration = (filename: string) =>
    new Promise<void>((resolve, reject) => {
      ensureNotAborted();
      stopNarration();
      const audio = new Audio(toAssetPath(`/audio/tour_a/${filename}`));
      narrationRef.current = audio;
      audio.onended = () => {
        if (tourAbortRef.current.aborted) {
          reject(new Error('tour-aborted'));
        } else {
          resolve();
        }
      };
      audio.onpause = () => {
        if (!audio.ended) {
          reject(new Error('tour-aborted'));
        }
      };
      audio.onerror = () => reject(new Error(`failed to play ${filename}`));
      audio.play().catch(() => reject(new Error(`failed to play ${filename}`)));
    });

  const startTourBgm = () => {
    ensureNotAborted();
    if (!tourBgmRef.current) {
      const audio = new Audio(toAssetPath('/audio/tour_a/tour_a_bgm.mp3'));
      audio.loop = false;
      audio.volume = 0.12;
      tourBgmRef.current = audio;
    }
    tourBgmRef.current.currentTime = 0;
    tourBgmRef.current.play().catch(() => {
      tourBgmRef.current = null;
    });
  };

  const waitForTourBgmEnd = () =>
    new Promise<void>((resolve) => {
      let settled = false;
      const safeResolve = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      if (tourAbortRef.current.aborted) {
        safeResolve();
        return;
      }
      const audio = tourBgmRef.current;
      if (!audio) {
        safeResolve();
        return;
      }
      if (audio.ended) {
        safeResolve();
        return;
      }
      const done = () => {
        audio.onended = null;
        audio.onerror = null;
        audio.onpause = null;
        clearInterval(abortCheck);
        safeResolve();
      };
      const abortCheck = setInterval(() => {
        if (tourAbortRef.current.aborted) {
          done();
        }
      }, 150);
      audio.onended = done;
      audio.onerror = done;
      audio.onpause = done;
    });

  const resetTourVisuals = () => {
    setOrbitSpeedOverrides({});
    setShowSunEffects(false);
    setTourCameraCommand({ mode: 'idle' });
  };

  const finalizeTour = () => {
    tourAbortRef.current.aborted = false;
    setTourStatusText('');
    setTourState('idle');
    setTourNotice('');
    setControlsLocked(false);
    resetTourVisuals();
    stopNarration();
    stopTourBgm();
    setTimeScale(prevTimeScaleRef.current);
  };

  const stopTour = () => {
    tourAbortRef.current.aborted = true;
    setTourStatusText('ツアーを終了しています...');
    if (narrationRef.current) {
      narrationRef.current.pause();
    }
    if (tourBgmRef.current) {
      tourBgmRef.current.pause();
    }
  };

  const runTour1 = async () => {
    tourAbortRef.current.aborted = false;
    setTourState('running');
    prevTimeScaleRef.current = timeScale;
    setTimeScale(1);
    setIsPaused(false);
    setSelectedBody(null);
    setShowTargets(false);
    setTourStatusText('Tour 1: Overview');
    setTourNotice('ツアー中は操作できません。終了するには開始ボタンを押してください。');
    setControlsLocked(true);
    setIsBgmOn(false);
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;
    }
    stopNarration();
    stopTourBgm();

    try {
      // Overview
      setTourCameraCommand({
        mode: 'overview',
        position: CAMERA_DISTANCES.overview,
        lookAt: [0, 0, 0],
        durationMs: 1800
      });
      await waitMs(1800);
      await playNarration('tour_a_000.wav');
      ensureNotAborted();

      // Sun
      setTourStatusText('Tour 1: Sun');
      startTourBgm();
      setTourCameraCommand({
        mode: 'moveToBody',
        targetBodyId: 'sun',
        distance: CAMERA_DISTANCES.sun,
        durationMs: 1500
      });
      await waitMs(1500);
      await waitMs(1000);
      ensureNotAborted();
      setShowSunEffects(true);
      setTourCameraCommand({
        mode: 'followBody',
        targetBodyId: 'sun',
        distance: CAMERA_DISTANCES.sun,
        orbitSpeed: 0.25
      });
      await playNarration('tour_a_001.wav');
      ensureNotAborted();

      // Earth
      setShowSunEffects(false);
      setTourStatusText('Tour 1: Earth');
      setOrbitSpeedOverrides({ moon: 0.05, iss: 0.05 });
      setTourCameraCommand({
        mode: 'moveToBody',
        targetBodyId: 'earth',
        distance: CAMERA_DISTANCES.earth,
        durationMs: 1000
      });
      await waitMs(1000);
      await waitMs(1000);
      ensureNotAborted();
      setTourCameraCommand({
        mode: 'followBody',
        targetBodyId: 'earth',
        distance: CAMERA_DISTANCES.earth
      });
      await playNarration('tour_a_002.wav');
      ensureNotAborted();

      // Mars
      setTourStatusText('Tour 1: Mars');
      setOrbitSpeedOverrides({ phobos: 0.1, deimos: 0.1 });
      setTourCameraCommand({
        mode: 'moveToBody',
        targetBodyId: 'mars',
        distance: CAMERA_DISTANCES.mars,
        durationMs: 1000,
        sunFacing: true,
        offset: [0, 0.35, 0]
      });
      await waitMs(1000);
      await waitMs(1000);
      ensureNotAborted();
      setTourCameraCommand({
        mode: 'followBody',
        targetBodyId: 'mars',
        distance: CAMERA_DISTANCES.mars,
        offset: [0, 0.35, 0],
        sunFacing: true
      });
      await playNarration('tour_a_003.wav');
      ensureNotAborted();

      // Jupiter
      setTourStatusText('Tour 1: Jupiter');
      setOrbitSpeedOverrides({ io: 0.1, europa: 0.1, ganymede: 0.1, callisto: 0.1 });
      setTourCameraCommand({
        mode: 'moveToBody',
        targetBodyId: 'jupiter',
        distance: CAMERA_DISTANCES.jupiter,
        durationMs: 1100
      });
      await waitMs(1100);
      await waitMs(1000);
      ensureNotAborted();
      setTourCameraCommand({
        mode: 'followBody',
        targetBodyId: 'jupiter',
        distance: CAMERA_DISTANCES.jupiter
      });
      await playNarration('tour_a_004.wav');
      ensureNotAborted();

      // Saturn
      setTourStatusText('Tour 1: Saturn');
      setOrbitSpeedOverrides({ titan: 0.1, enceladus: 0.1 });
      setTourCameraCommand({
        mode: 'moveToBody',
        targetBodyId: 'saturn',
        distance: CAMERA_DISTANCES.saturn,
        durationMs: 1100
      });
      await waitMs(1100);
      ensureNotAborted();
      setTourCameraCommand({
        mode: 'followBody',
        targetBodyId: 'saturn',
        distance: CAMERA_DISTANCES.saturn
      });
      await playNarration('tour_a_005.wav');
      ensureNotAborted();

      // Pluto
      setTourStatusText('Tour 1: Pluto');
      setOrbitSpeedOverrides({ charon: 0.33 });
      setTourCameraCommand({
        mode: 'moveToBody',
        targetBodyId: 'pluto',
        distance: CAMERA_DISTANCES.pluto,
        durationMs: 1000
      });
      await waitMs(1000);
      ensureNotAborted();
      setTourCameraCommand({
        mode: 'followBody',
        targetBodyId: 'pluto',
        distance: CAMERA_DISTANCES.pluto
      });
      await playNarration('tour_a_006.wav');
      ensureNotAborted();

      // Return to Sun and wait for BGM to end
      setTourStatusText('Tour 1: Returning');
      setOrbitSpeedOverrides({});
      setShowSunEffects(false);
      setTourCameraCommand({
        mode: 'moveToBody',
        targetBodyId: 'sun',
        distance: CAMERA_DISTANCES.sun,
        durationMs: 2000
      });
      await waitMs(2000);
      setTourCameraCommand({
        mode: 'followBody',
        targetBodyId: 'sun',
        distance: CAMERA_DISTANCES.sun,
        orbitSpeed: 0.18
      });
      await waitForTourBgmEnd();
    } finally {
      finalizeTour();
    }
  };

  const handleTourStartStop = () => {
    if (isTourRunning) {
      stopTour();
      return;
    }

    if (selectedTour === 'tour1') {
      runTour1().catch(() => {});
    } else {
      setTourNotice('選択したツアーは準備中です');
    }
  };

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
      stopNarration();
      stopTourBgm();
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
              onSelect={handleSceneSelect} 
              timeScale={timeScale} 
              isPaused={isPaused}
              showHighlights={showTargets}
              selectedId={selectedBody?.id}
              orbitSpeedOverrides={orbitSpeedOverrides}
              showSunEffects={showSunEffects}
            />
            {/* Controls camera movement when a body is selected */}
            {!isTourRunning && <CameraController selectedBody={selectedBody} />}
            {isTourRunning && <TourCameraDriver command={tourCameraCommand} />}
          </Suspense>
          
          <OrbitControls 
            makeDefault
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            minDistance={0.05}
            maxDistance={400}
            enabled={!controlsLocked}
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
                disabled={controlsLocked}
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

            {/* Tour Controls */}
            <div className="w-full flex flex-col gap-2">
              <div className="flex flex-wrap justify-end gap-2 items-center">
                <select
                  value={selectedTour}
                  onChange={(e) => {
                    setSelectedTour(e.target.value as TourId);
                    setTourNotice('');
                  }}
                  disabled={isTourRunning}
                  className="bg-slate-800 text-slate-200 text-xs md:text-sm rounded px-2 py-1.5 border border-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                >
                  {TOUR_SELECT_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
                <button
                  onClick={handleTourStartStop}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all border ${
                    isTourRunning
                      ? 'bg-red-600 border-red-400 text-white shadow-[0_0_10px_rgba(248,113,113,0.4)]'
                      : 'bg-emerald-600 border-emerald-400 text-white hover:bg-emerald-500'
                  } ${selectedTour !== 'tour1' ? 'opacity-70' : ''}`}
                >
                  {isTourRunning ? 'Stop Tour' : 'Start Tour'}
                </button>
                <span className="text-[10px] text-slate-400">{TOUR_VOICE_CREDIT}</span>
              </div>
              {(tourNotice || tourStatusText) && (
                <div className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded text-right">
                  <div>{tourNotice || 'ツアー進行中'}</div>
                  {tourStatusText && <div className="text-[10px] text-slate-200">{tourStatusText}</div>}
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-end gap-2 items-center">
              
              {/* Highlight Toggle */}
              <button
                onClick={() => setShowTargets(!showTargets)}
                disabled={controlsLocked}
                className={`px-3 py-1 rounded text-xs font-bold transition-all border ${
                  showTargets 
                    ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_10px_rgba(147,51,234,0.5)]' 
                    : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                } ${controlsLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {showTargets ? "HIDE SMALL TARGETS" : "FIND SMALL TARGETS"}
              </button>

              <div className="h-4 w-px bg-slate-700 mx-1"></div>

              {/* BGM Toggle */}
              <button
                onClick={() => setIsBgmOn(!isBgmOn)}
                disabled={controlsLocked}
                className={`px-3 py-1 rounded text-xs font-bold transition-all border ${
                  isBgmOn
                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                    : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                } ${controlsLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isBgmOn ? "BGM ON" : "BGM OFF"}
              </button>

              <div className="h-4 w-px bg-slate-700 mx-1"></div>

              <button 
                onClick={() => setIsPaused(!isPaused)}
                disabled={controlsLocked}
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
                  onChange={(e) => !controlsLocked && setTimeScale(parseFloat(e.target.value))}
                  disabled={controlsLocked}
                  className={`w-20 md:w-24 h-1 bg-slate-600 rounded-lg appearance-none ${controlsLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} accent-blue-500`}
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
