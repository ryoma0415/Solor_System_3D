import React, { useEffect, useRef, useState } from 'react';
import { CelestialBodyData } from '../types';

interface InfoPanelProps {
  body: CelestialBodyData | null;
  onClose: () => void;
}

const AUDIO_CREDITS = {
  audio_a: 'VOICEVOX: 小夜/SAYO',
  audio_b: 'VOICEVOX: 九州そら',
  audio_c: 'VOICEVOX: 冥鳴ひまり'
} as const;

type AudioFolder = keyof typeof AUDIO_CREDITS;

const audioEntry = (folder: AudioFolder, filename: string) => ({
  src: `/audio/${folder}/${filename}`,
  credit: AUDIO_CREDITS[folder]
});

const AUDIO_SOURCES: Partial<Record<string, { src: string; credit: string }>> = {
  sun: audioEntry('audio_a', 'sun_a.wav'),
  mercury: audioEntry('audio_a', 'mercury_a.wav'),
  venus: audioEntry('audio_a', 'venus_a.wav'),
  earth: audioEntry('audio_a', 'earth_a.wav'),
  moon: audioEntry('audio_c', 'moon_c.wav'),
  iss: audioEntry('audio_b', 'iss_b.wav'),
  mars: audioEntry('audio_a', 'mars_a.wav'),
  phobos: audioEntry('audio_c', 'phobos_c.wav'),
  deimos: audioEntry('audio_c', 'deimos_c.wav'),
  jupiter: audioEntry('audio_a', 'jupiter_a.wav'),
  io: audioEntry('audio_c', 'io_c.wav'),
  europa: audioEntry('audio_c', 'europa_c.wav'),
  ganymede: audioEntry('audio_c', 'ganymede_c.wav'),
  callisto: audioEntry('audio_c', 'callisto_c.wav'),
  saturn: audioEntry('audio_a', 'saturn_a.wav'),
  titan: audioEntry('audio_c', 'titan_c.wav'),
  enceladus: audioEntry('audio_c', 'enceladus_c.wav'),
  uranus: audioEntry('audio_a', 'uranus_a.wav'),
  neptune: audioEntry('audio_a', 'neptune_a.wav'),
  triton: audioEntry('audio_c', 'triton_c.wav'),
  ceres: audioEntry('audio_b', 'ceres_b.wav'),
  pluto: audioEntry('audio_b', 'pluto_b.wav'),
  charon: audioEntry('audio_c', 'charon_c.wav'),
  haumea: audioEntry('audio_b', 'haumea_b.wav'),
  makemake: audioEntry('audio_b', 'makemake_b.wav'),
  eris: audioEntry('audio_b', 'eris_b.wav'),
  halley_comet: audioEntry('audio_b', 'halley_comet_b.wav')
};

const toAssetPath = (path: string): string => {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
};

export const InfoPanel: React.FC<InfoPanelProps> = ({ body, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatNumber = (value: number | null | undefined, fraction = 0) =>
    value == null ? 'N/A' : value.toLocaleString(undefined, { maximumFractionDigits: fraction, minimumFractionDigits: fraction });
  const formatExp = (value: number | null | undefined) =>
    value == null ? 'N/A' : value.toExponential(2);
  const formatFixed = (value: number | null | undefined, digits = 2) =>
    value == null ? 'N/A' : value.toFixed(digits);
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
  };

  // Stop audio when component unmounts
  useEffect(() => () => stopAudio(), []);

  // Stop audio when body changes (including when it becomes null)
  useEffect(() => {
    stopAudio();
  }, [body?.id]);

  if (!body) return null;

  const categoryLabelMap: Partial<Record<string, string>> = {
    star: 'Star',
    planet: 'Planet',
    dwarf_planet: 'Dwarf Planet',
    moon: 'Moon',
    artificial_satellite: 'Artificial Satellite',
    comet: 'Comet'
  };
  const categoryLabel = categoryLabelMap[body.category] ?? body.category.replace('_', ' ');
  const descriptionBlocks = [
    { title: 'Overview', text: body.description?.overview_ja ?? body.description_ja },
    { title: 'Composition', text: body.description?.composition_ja },
    { title: 'Features', text: body.description?.features_ja },
  ].filter(block => block.text);

  const audioInfo = body ? AUDIO_SOURCES[body.id] : undefined;
  const audioSrc = audioInfo ? toAssetPath(audioInfo.src) : null;

  const handleAudioToggle = () => {
    if (!audioSrc) return;
    if (isPlaying) {
      stopAudio();
      return;
    }
    const audio = new Audio(audioSrc);
    audioRef.current = audio;
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => setIsPlaying(false);
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        setIsPlaying(false);
        audioRef.current = null;
      });
  };

  return (
    <div className="absolute right-0 top-0 h-full w-full md:w-96 bg-slate-900/90 backdrop-blur-xl border-l border-slate-700 p-6 overflow-y-auto transition-transform duration-300 ease-in-out z-20 shadow-2xl">
      <button 
        onClick={() => {
          stopAudio();
          onClose();
        }}
        className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <div className="mt-8 space-y-6">
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-900/30 px-2 py-1 rounded-sm border border-blue-900/50">
            {categoryLabel}
          </span>
          <h2 className="text-4xl font-bold mt-2 text-white">{body.name.ja}</h2>
          <h3 className="text-xl text-slate-400 font-light">{body.name.en}</h3>

          {audioSrc && (
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <button
                onClick={handleAudioToggle}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all border ${
                  isPlaying
                    ? 'bg-green-600 border-green-400 text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]'
                    : 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700'
                }`}
              >
                {isPlaying ? 'Stop Audio' : 'Play Audio'}
              </button>
              <span className="text-[11px] text-slate-400">{audioInfo?.credit}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {descriptionBlocks.length > 0 && (
          <div className="space-y-3">
            {descriptionBlocks.map(block => (
              <div key={block.title} className="prose prose-invert prose-sm">
                <h4 className="text-xs uppercase tracking-wide text-slate-400">{block.title}</h4>
                <p className="leading-relaxed text-slate-300 text-justify">
                  {block.text}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="h-px bg-slate-800 w-full" />

        {/* Physical Stats Grid */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
            Physical Characteristics (物理的特徴)
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <StatBox label="Radius (半径)" value={`${formatNumber(body.physical.mean_radius_km, 0)} km`} />
            <StatBox label="Mass (質量)" value={`${formatExp(body.physical.mass_kg)} kg`} />
            <StatBox label="Gravity (重力)" value={`${formatFixed(body.physical.equatorial_gravity_m_s2, 2)} m/s²`} />
            <StatBox label="Rotation (自転周期)" value={`${formatFixed(body.physical.sidereal_rotation_period_hours, 1)} hrs`} />
            <StatBox label="Axial Tilt (赤道傾斜角)" value={`${body.physical.axial_tilt_deg ?? 'N/A'}°`} />
            <StatBox label="Mean Temp (平均温度)" value={`${body.temperature.mean_surface_temp_K ?? 'N/A'} K`} />
          </div>
        </div>

        {/* Orbital Stats Grid */}
        {body.orbit && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
               <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
               Orbital Parameters (軌道要素)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <StatBox label="Period (公転周期)" value={`${formatFixed(body.orbit.sidereal_orbital_period_years, 3)} yrs`} />
              <StatBox label="Distance (軌道長半径)" value={`${formatFixed(body.orbit.elements.semi_major_axis_au, 4)} AU`} />
              <StatBox label="Eccentricity (離心率)" value={`${formatFixed(body.orbit.elements.eccentricity, 4)}`} />
              <StatBox label="Inclination (軌道傾斜角)" value={`${formatFixed(body.orbit.elements.inclination_deg, 2)}°`} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const StatBox = ({ label, value }: { label: string, value: string }) => (
  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{label}</div>
    <div className="text-sm font-mono font-medium text-blue-100">{value}</div>
  </div>
);
