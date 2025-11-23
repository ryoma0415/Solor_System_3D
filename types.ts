export interface LocalizedName {
  ja: string;
  en: string;
}

export type CelestialBodyCategory =
  | 'star'
  | 'planet'
  | 'dwarf_planet'
  | 'moon'
  | 'comet'
  | 'artificial_satellite';

export interface OrbitalElements {
  semi_major_axis_au: number | null;
  eccentricity: number | null;
  inclination_deg: number | null;
  longitude_of_ascending_node_deg: number | null;
  argument_of_periapsis_deg: number | null;
  mean_anomaly_deg: number | null;
}

export interface OrbitData {
  reference_body_id: string;
  coordinate_frame: string;
  epoch_julian_date: number | null;
  epoch_iso: string | null;
  elements: OrbitalElements;
  sidereal_orbital_period_years: number | null;
}

export interface PhysicalData {
  equatorial_radius_km: number | null;
  mean_radius_km: number | null;
  mass_kg: number | null;
  bulk_density_kg_m3: number | null;
  equatorial_gravity_m_s2: number | null;
  escape_velocity_km_s: number | null;
  sidereal_rotation_period_hours: number | null;
  sidereal_rotation_period_days: number | null;
  axial_tilt_deg: number | null;
  dimensions_m?: {
    length: number | null;
    span: number | null;
    height: number | null;
  };
}

export interface TemperatureData {
  core_temperature_K?: number;
  photosphere_effective_temperature_K?: number;
  corona_temperature_K?: number;
  mean_surface_temp_K?: number | null;
  min_surface_temp_K?: number | null;
  max_surface_temp_K?: number | null;
}

export interface PhotometryData {
  luminosity_W?: number;
  luminosity_L_sun?: number;
  absolute_magnitude_V?: number;
  visual_magnitude_V10?: number;
  geometric_albedo?: number;
  bond_albedo?: number | null;
}

export interface RingData {
  inner_radius_r: number; // Multiplier of planet radius (e.g. 1.5x)
  outer_radius_r: number; // Multiplier of planet radius (e.g. 2.5x)
  texture?: string;       // Optional texture path for rings
  color?: string;         // Fallback color
  opacity?: number;
}

export interface CelestialBodyData {
  id: string;
  name: LocalizedName;
  category: CelestialBodyCategory;
  parent_id: string | null;
  description_ja?: string;
  description?: {
    overview_ja?: string;
    composition_ja?: string;
    features_ja?: string;
  };
  orbit: OrbitData | null;
  physical: PhysicalData;
  temperature: TemperatureData;
  photometry: PhotometryData;
  ring?: RingData; // Optional ring data
  textureMap?: string; // Path to texture image (e.g., '/textures/jupiter.jpg')
}

export interface SolarSystemData {
  coordinate_system: {
    frame: string;
    epoch_julian_date: number;
    epoch_iso: string;
    description: string;
  };
  bodies: CelestialBodyData[];
}
