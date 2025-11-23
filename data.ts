import rawSource from './Original_data.json';
import {
  CelestialBodyCategory,
  CelestialBodyData,
  RingData,
  SolarSystemData
} from './types';

interface RawDescription {
  overview_ja?: string;
  composition_ja?: string;
  features_ja?: string;
}

interface RawPhysical {
  mean_radius_km?: number | null;
  mass_kg?: number | null;
  bulk_density_kg_m3?: number | null;
  surface_gravity_m_s2?: number | null;
  escape_velocity_km_s?: number | null;
  geometric_albedo?: number | null;
  bond_albedo?: number | null;
  mean_temperature_K?: number | null;
  min_temperature_K?: number | null;
  max_temperature_K?: number | null;
  effective_temperature_K?: number | null;
  luminosity_W?: number | null;
  dimensions_m?: {
    length?: number | null;
    span?: number | null;
    height?: number | null;
  };
}

interface RawRotation {
  sidereal_period_hours?: number | null;
  axis_tilt_deg_to_ecliptic?: number | null;
  is_retrograde?: boolean | null;
}

interface RawOrbit {
  central_body?: string | null;
  frame?: string | null;
  reference?: string | null;
  epoch_julian_day?: number | null;
  semi_major_axis_au?: number | null;
  eccentricity?: number | null;
  inclination_deg?: number | null;
  longitude_of_ascending_node_deg?: number | null;
  longitude_of_perihelion_deg?: number | null;
  argument_of_periapsis_deg?: number | null;
  mean_longitude_deg?: number | null;
  mean_anomaly_deg?: number | null;
  sidereal_orbital_period_days?: number | null;
}

interface RawBody {
  id: string;
  english_name: string;
  japanese_name: string;
  type: CelestialBodyCategory | string;
  parent_id: string | null;
  description?: RawDescription;
  physical: RawPhysical;
  rotation?: RawRotation | null;
  orbit: RawOrbit | null;
}

interface RawData {
  metadata: {
    schema_version: string;
    coordinate_system: string;
    epoch_julian_day: number;
    note_ja: string;
  };
  bodies: RawBody[];
}

const rawData = rawSource as unknown as RawData;

const TEXTURE_MAP: Record<string, string> = {
  sun: '/textures/sun.png',
  mercury: '/textures/mercury.png',
  venus: '/textures/venus.png',
  earth: '/textures/earth.png',
  moon: '/textures/moon.png',
  iss: '/textures/iss.png',
  mars: '/textures/mars.png',
  phobos: '/textures/phobos.png',
  deimos: '/textures/deimos.png',
  jupiter: '/textures/jupiter.png',
  io: '/textures/io.png',
  europa: '/textures/europa.png',
  ganymede: '/textures/ganymede.png',
  callisto: '/textures/callisto.png',
  saturn: '/textures/saturn.png',
  titan: '/textures/titan.png',
  enceladus: '/textures/enceladus.png',
  uranus: '/textures/uranus.png',
  neptune: '/textures/neptune.png',
  triton: '/textures/triton.png',
  ceres: '/textures/ceres.png',
  pluto: '/textures/pluto.png',
  charon: '/textures/charon.png',
  haumea: '/textures/haumea.png',
  makemake: '/textures/makemake.png',
  eris: '/textures/eris.png',
  halley_comet: '/textures/halley_comet.png'
};

const RING_ENRICHMENTS: Record<string, RingData> = {
  jupiter: {
    inner_radius_r: 1.2,
    outer_radius_r: 1.8,
    opacity: 0.1,
    color: '#AA8866'
  },
  saturn: {
    inner_radius_r: 1.2,
    outer_radius_r: 2.3,
    opacity: 0.7,
    color: '#d4c79e'
  },
  uranus: {
    inner_radius_r: 1.5,
    outer_radius_r: 2.0,
    opacity: 0.4,
    color: '#99badd'
  },
  neptune: {
    inner_radius_r: 1.5,
    outer_radius_r: 2.2,
    opacity: 0.2,
    color: '#88aaff'
  },
  haumea: {
    inner_radius_r: 1.8,
    outer_radius_r: 2.0,
    opacity: 0.5,
    color: '#ffffff'
  }
};

const coordinateSystem = {
  frame: rawData.metadata.coordinate_system,
  epoch_julian_date: rawData.metadata.epoch_julian_day,
  epoch_iso: '2000-01-01T12:00:00 TT',
  description: rawData.metadata.note_ja
};

const toPeriodYears = (days: number | null | undefined): number | null => {
  if (days == null) return null;
  return days / 365.25;
};

const normalizedCategory = (type: string): CelestialBodyCategory => {
  switch (type) {
    case 'star':
    case 'planet':
    case 'dwarf_planet':
    case 'moon':
    case 'comet':
    case 'artificial_satellite':
      return type;
    default:
      return 'planet';
  }
};

const computeMeanAnomaly = (orbit: RawOrbit): number | null => {
  if (orbit.mean_anomaly_deg != null) return orbit.mean_anomaly_deg;
  if (
    orbit.mean_longitude_deg != null &&
    orbit.longitude_of_perihelion_deg != null
  ) {
    return orbit.mean_longitude_deg - orbit.longitude_of_perihelion_deg;
  }
  return null;
};

const computeArgumentOfPeriapsis = (orbit: RawOrbit): number | null => {
  if (orbit.argument_of_periapsis_deg != null) {
    return orbit.argument_of_periapsis_deg;
  }
  if (
    orbit.longitude_of_perihelion_deg != null &&
    orbit.longitude_of_ascending_node_deg != null
  ) {
    return orbit.longitude_of_perihelion_deg - orbit.longitude_of_ascending_node_deg;
  }
  return null;
};

const convertBody = (body: RawBody): CelestialBodyData => {
  const category = normalizedCategory(body.type);
  const rotationHours = body.rotation?.sidereal_period_hours ?? null;
  const spinHours =
    rotationHours != null && body.rotation?.is_retrograde
      ? rotationHours * -1
      : rotationHours;

  const orbit =
    body.orbit && body.orbit.semi_major_axis_au != null
      ? {
          reference_body_id:
            body.orbit.central_body ?? body.parent_id ?? 'sun',
          coordinate_frame:
            body.orbit.frame ??
            body.orbit.reference ??
            rawData.metadata.coordinate_system,
          epoch_julian_date: body.orbit.epoch_julian_day ?? rawData.metadata.epoch_julian_day,
          epoch_iso: null,
          elements: {
            semi_major_axis_au: body.orbit.semi_major_axis_au ?? null,
            eccentricity: body.orbit.eccentricity ?? null,
            inclination_deg: body.orbit.inclination_deg ?? null,
            longitude_of_ascending_node_deg: body.orbit.longitude_of_ascending_node_deg ?? null,
            argument_of_periapsis_deg: computeArgumentOfPeriapsis(body.orbit),
            mean_anomaly_deg: computeMeanAnomaly(body.orbit)
          },
          sidereal_orbital_period_years: toPeriodYears(
            body.orbit.sidereal_orbital_period_days
          )
        }
      : null;

  return {
    id: body.id,
    name: {
      ja: body.japanese_name,
      en: body.english_name
    },
    category,
    parent_id: body.parent_id ?? null,
    description: {
      overview_ja: body.description?.overview_ja,
      composition_ja: body.description?.composition_ja,
      features_ja: body.description?.features_ja
    },
    description_ja: body.description?.overview_ja,
    orbit,
    physical: {
      equatorial_radius_km: body.physical.mean_radius_km ?? null,
      mean_radius_km: body.physical.mean_radius_km ?? null,
      mass_kg: body.physical.mass_kg ?? null,
      bulk_density_kg_m3: body.physical.bulk_density_kg_m3 ?? null,
      equatorial_gravity_m_s2: body.physical.surface_gravity_m_s2 ?? null,
      escape_velocity_km_s: body.physical.escape_velocity_km_s ?? null,
      sidereal_rotation_period_hours: spinHours ?? null,
      sidereal_rotation_period_days: spinHours != null ? spinHours / 24 : null,
      axial_tilt_deg: body.rotation?.axis_tilt_deg_to_ecliptic ?? null,
      dimensions_m: body.physical.dimensions_m
    },
    temperature: {
      mean_surface_temp_K: body.physical.mean_temperature_K ?? null,
      min_surface_temp_K: body.physical.min_temperature_K ?? null,
      max_surface_temp_K: body.physical.max_temperature_K ?? null,
      photosphere_effective_temperature_K: body.physical.effective_temperature_K ?? undefined
    },
    photometry: {
      luminosity_W: body.physical.luminosity_W ?? undefined,
      geometric_albedo: body.physical.geometric_albedo ?? undefined,
      bond_albedo: body.physical.bond_albedo ?? null
    },
    ring: RING_ENRICHMENTS[body.id],
    textureMap: TEXTURE_MAP[body.id] ?? `/textures/${body.id}.png`
  };
};

const bodies: CelestialBodyData[] = rawData.bodies.map(convertBody);

export const SOLAR_SYSTEM_DATA: SolarSystemData = {
  coordinate_system: coordinateSystem,
  bodies
};
