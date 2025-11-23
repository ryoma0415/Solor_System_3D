import React from 'react';
import { CelestialBodyData } from '../types';

interface InfoPanelProps {
  body: CelestialBodyData | null;
  onClose: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ body, onClose }) => {
  if (!body) return null;

  return (
    <div className="absolute right-0 top-0 h-full w-full md:w-96 bg-slate-900/90 backdrop-blur-xl border-l border-slate-700 p-6 overflow-y-auto transition-transform duration-300 ease-in-out z-20 shadow-2xl">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <div className="mt-8 space-y-6">
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-900/30 px-2 py-1 rounded-sm border border-blue-900/50">
            {body.category.replace('_', ' ')}
          </span>
          <h2 className="text-4xl font-bold mt-2 text-white">{body.name.ja}</h2>
          <h3 className="text-xl text-slate-400 font-light">{body.name.en}</h3>
        </div>

        {/* Description */}
        <div className="prose prose-invert prose-sm">
          <p className="leading-relaxed text-slate-300 text-justify">
            {body.description_ja}
          </p>
        </div>

        <div className="h-px bg-slate-800 w-full" />

        {/* Physical Stats Grid */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
            Physical Characteristics (物理的特徴)
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <StatBox label="Radius (半径)" value={`${body.physical.mean_radius_km.toLocaleString()} km`} />
            <StatBox label="Mass (質量)" value={`${body.physical.mass_kg.toExponential(2)} kg`} />
            <StatBox label="Gravity (重力)" value={`${body.physical.equatorial_gravity_m_s2} m/s²`} />
            <StatBox label="Rotation (自転周期)" value={`${body.physical.sidereal_rotation_period_hours.toFixed(1)} hrs`} />
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
              <StatBox label="Period (公転周期)" value={`${body.orbit.sidereal_orbital_period_years?.toFixed(2)} yrs`} />
              <StatBox label="Distance (軌道長半径)" value={`${body.orbit.elements.semi_major_axis_au?.toFixed(3)} AU`} />
              <StatBox label="Eccentricity (離心率)" value={`${body.orbit.elements.eccentricity?.toFixed(4)}`} />
              <StatBox label="Inclination (軌道傾斜角)" value={`${body.orbit.elements.inclination_deg?.toFixed(2)}°`} />
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