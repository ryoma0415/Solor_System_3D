import { SolarSystemData } from './types';

export const SOLAR_SYSTEM_DATA: SolarSystemData = {
  "coordinate_system": {
    "frame": "heliocentric ecliptic J2000",
    "epoch_julian_date": 2451545.0,
    "epoch_iso": "2000-01-01T12:00:00 TT",
    "description": "太陽を原点としたJ2000黄道座標系。軌道要素はJ2000平均黄道・分点基準。"
  },
  "bodies": [
    {
      "id": "sun",
      "name": { "ja": "太陽", "en": "Sun" },
      "category": "star",
      "parent_id": null,
      "description_ja": "太陽は太陽系の中心にあるG2V型の主系列星で, 主に水素とヘリウムから成る高温のプラズマ球体です。内部の核融合反応によって膨大なエネルギーを生み出し, 電磁波として放射することで惑星に光と熱を与えます。強い磁場活動により黒点やフレア, コロナ質量放出などが発生し, 太陽風として惑星間空間や惑星の磁気圏・大気に大きな影響を及ぼします。",
      "orbit": null,
      "physical": {
        "equatorial_radius_km": 695700.0,
        "mean_radius_km": 695700.0,
        "mass_kg": 1.9885e30,
        "bulk_density_kg_m3": 1408.0,
        "equatorial_gravity_m_s2": 274.0,
        "escape_velocity_km_s": 617.7,
        "sidereal_rotation_period_hours": 601.2,
        "sidereal_rotation_period_days": 25.05,
        "axial_tilt_deg": 7.25
      },
      "temperature": {
        "core_temperature_K": 15700000.0,
        "photosphere_effective_temperature_K": 5772.0,
        "corona_temperature_K": 5000000.0
      },
      "photometry": {
        "luminosity_W": 3.828e26,
        "luminosity_L_sun": 1.0,
        "absolute_magnitude_V": 4.83
      },
      "textureMap": "/textures/sun.png"
    },
    {
      "id": "mercury",
      "name": { "ja": "水星", "en": "Mercury" },
      "category": "planet",
      "parent_id": "sun",
      "description_ja": "水星は太陽に最も近い岩石惑星で, 半径は約2400kmと太陽系で最小の惑星です。主成分はケイ酸塩岩石と鉄で, 特に半径の大部分を占める巨大な金属核が特徴です。大気はほとんど存在せず, 表面はクレーターに覆われた古い地形で, 昼夜で数百ケルビン規模の極端な温度差が生じます。",
      "orbit": {
        "reference_body_id": "sun",
        "coordinate_frame": "heliocentric ecliptic J2000",
        "epoch_julian_date": 2451545.0,
        "epoch_iso": "2000-01-01T12:00:00 TT",
        "elements": {
          "semi_major_axis_au": 0.38709893,
          "eccentricity": 0.20563069,
          "inclination_deg": 7.00487,
          "longitude_of_ascending_node_deg": 48.33167,
          "argument_of_periapsis_deg": 29.12478,
          "mean_anomaly_deg": 174.79439
        },
        "sidereal_orbital_period_years": 0.2408467
      },
      "physical": {
        "equatorial_radius_km": 2440.53,
        "mean_radius_km": 2439.4,
        "mass_kg": 3.30103e23,
        "bulk_density_kg_m3": 5428.9,
        "equatorial_gravity_m_s2": 3.7,
        "escape_velocity_km_s": 4.25,
        "sidereal_rotation_period_hours": 1407.5088,
        "sidereal_rotation_period_days": 58.6462,
        "axial_tilt_deg": 0.01
      },
      "temperature": {
        "mean_surface_temp_K": 440.15,
        "min_surface_temp_K": null,
        "max_surface_temp_K": null
      },
      "photometry": {
        "visual_magnitude_V10": -0.6,
        "geometric_albedo": 0.106
      },
      "textureMap": "/textures/mercury.png"
    },
    {
      "id": "venus",
      "name": { "ja": "金星", "en": "Venus" },
      "category": "planet",
      "parent_id": "sun",
      "description_ja": "金星は地球とほぼ同じ大きさの岩石惑星で, 厚い二酸化炭素の大気と硫酸の雲に覆われています。非常に強い温室効果により表面温度は約700Kを超える高温となり, 地表圧力も地球の約90倍に達します。表面は広大な溶岩平原や火山地形が支配的で, 自転は極めて遅くさらに逆行自転をしている点も大きな特徴です。",
      "orbit": {
        "reference_body_id": "sun",
        "coordinate_frame": "heliocentric ecliptic J2000",
        "epoch_julian_date": 2451545.0,
        "epoch_iso": "2000-01-01T12:00:00 TT",
        "elements": {
          "semi_major_axis_au": 0.72333199,
          "eccentricity": 0.00677323,
          "inclination_deg": 3.39471,
          "longitude_of_ascending_node_deg": 76.68069,
          "argument_of_periapsis_deg": 54.85229,
          "mean_anomaly_deg": 50.44675
        },
        "sidereal_orbital_period_years": 0.61519726
      },
      "physical": {
        "equatorial_radius_km": 6051.8,
        "mean_radius_km": 6051.8,
        "mass_kg": 4.86731e24,
        "bulk_density_kg_m3": 5243.0,
        "equatorial_gravity_m_s2": 8.87,
        "escape_velocity_km_s": 10.36,
        "sidereal_rotation_period_hours": -5832.432,
        "sidereal_rotation_period_days": -243.018,
        "axial_tilt_deg": 177.4
      },
      "temperature": {
        "mean_surface_temp_K": 737.15,
        "min_surface_temp_K": null,
        "max_surface_temp_K": null
      },
      "photometry": {
        "visual_magnitude_V10": -4.47,
        "geometric_albedo": 0.65
      },
      "textureMap": "/textures/venus.png"
    },
    {
      "id": "earth",
      "name": { "ja": "地球", "en": "Earth" },
      "category": "planet",
      "parent_id": "sun",
      "description_ja": "地球は液体の水の海と窒素・酸素が主体の大気を持つ岩石惑星で, 現時点で生命が確認されている唯一の天体です。内部は鉄の核とケイ酸塩マントル・地殻から構成され, プレートテクトニクスにより大陸移動や火山活動が継続しています。比較的温暖な気候と強い地磁気・大気により, 宇宙線や太陽風から表面環境が保護されています。",
      "orbit": {
        "reference_body_id": "sun",
        "coordinate_frame": "heliocentric ecliptic J2000",
        "epoch_julian_date": 2451545.0,
        "epoch_iso": "2000-01-01T12:00:00 TT",
        "elements": {
          "semi_major_axis_au": 1.00000011,
          "eccentricity": 0.01671022,
          "inclination_deg": 0.00005,
          "longitude_of_ascending_node_deg": 348.73936,
          "argument_of_periapsis_deg": 114.20783,
          "mean_anomaly_deg": 357.51716
        },
        "sidereal_orbital_period_years": 1.0000174
      },
      "physical": {
        "equatorial_radius_km": 6378.1366,
        "mean_radius_km": 6371.0084,
        "mass_kg": 5.97217e24,
        "bulk_density_kg_m3": 5513.4,
        "equatorial_gravity_m_s2": 9.8,
        "escape_velocity_km_s": 11.19,
        "sidereal_rotation_period_hours": 23.93447232,
        "sidereal_rotation_period_days": 0.99726968,
        "axial_tilt_deg": 23.44
      },
      "temperature": {
        "mean_surface_temp_K": 288.15,
        "min_surface_temp_K": null,
        "max_surface_temp_K": null
      },
      "photometry": {
        "visual_magnitude_V10": -3.86,
        "geometric_albedo": 0.367
      },
      "textureMap": "/textures/earth.png"
    },
    {
      "id": "mars",
      "name": { "ja": "火星", "en": "Mars" },
      "category": "planet",
      "parent_id": "sun",
      "description_ja": "火星は地球のおよそ半分の大きさを持つ岩石惑星で, 主に二酸化炭素から成る薄い大気と極冠の水氷・ドライアイスを持ちます。表面は酸化鉄を含む砂や岩石で赤く見え, オリンポス山のような巨大火山やマリネリス峡谷といった大規模な地形が存在します。古い河道跡や堆積物から, 過去には液体の水が広範囲に存在したと考えられています。",
      "orbit": {
        "reference_body_id": "sun",
        "coordinate_frame": "heliocentric ecliptic J2000",
        "epoch_julian_date": 2451545.0,
        "epoch_iso": "2000-01-01T12:00:00 TT",
        "elements": {
          "semi_major_axis_au": 1.52366231,
          "eccentricity": 0.09341233,
          "inclination_deg": 1.85061,
          "longitude_of_ascending_node_deg": 49.57854,
          "argument_of_periapsis_deg": 286.4623,
          "mean_anomaly_deg": 19.41248
        },
        "sidereal_orbital_period_years": 1.8808476
      },
      "physical": {
        "equatorial_radius_km": 3396.19,
        "mean_radius_km": 3389.5,
        "mass_kg": 6.41691e23,
        "bulk_density_kg_m3": 3934.0,
        "equatorial_gravity_m_s2": 3.71,
        "escape_velocity_km_s": 5.03,
        "sidereal_rotation_period_hours": 24.62296224,
        "sidereal_rotation_period_days": 1.02595676,
        "axial_tilt_deg": 25.19
      },
      "temperature": {
        "mean_surface_temp_K": 208.15,
        "min_surface_temp_K": null,
        "max_surface_temp_K": null
      },
      "photometry": {
        "visual_magnitude_V10": -1.52,
        "geometric_albedo": 0.15
      },
      "textureMap": "/textures/mars.png"
    },
    {
      "id": "jupiter",
      "name": { "ja": "木星", "en": "Jupiter" },
      "category": "planet",
      "parent_id": "sun",
      "description_ja": "木星は主に水素とヘリウムから構成される巨大ガス惑星で, 太陽系で最も質量の大きい惑星です。内部には金属水素層と岩石・氷から成る核があると考えられ, 非常に強い磁場と放射帯を持ちます。上層大気にはアンモニアや水の雲が形成する縞状模様が見られ, 数百年以上続く大赤斑など巨大な渦が特徴的です。薄いリングと数多くの衛星系を従えています。",
      "orbit": {
        "reference_body_id": "sun",
        "coordinate_frame": "heliocentric ecliptic J2000",
        "epoch_julian_date": 2451545.0,
        "epoch_iso": "2000-01-01T12:00:00 TT",
        "elements": {
          "semi_major_axis_au": 5.20336301,
          "eccentricity": 0.04839266,
          "inclination_deg": 1.3053,
          "longitude_of_ascending_node_deg": 100.55615,
          "argument_of_periapsis_deg": 274.1977,
          "mean_anomaly_deg": 19.65053
        },
        "sidereal_orbital_period_years": 11.862615
      },
      "physical": {
        "equatorial_radius_km": 71492.0,
        "mean_radius_km": 69911.0,
        "mass_kg": 1.898125e27,
        "bulk_density_kg_m3": 1326.2,
        "equatorial_gravity_m_s2": 24.79,
        "escape_velocity_km_s": 60.2,
        "sidereal_rotation_period_hours": 9.92496,
        "sidereal_rotation_period_days": 0.41354,
        "axial_tilt_deg": 3.13
      },
      "temperature": {
        "mean_surface_temp_K": 163.15,
        "min_surface_temp_K": null,
        "max_surface_temp_K": null
      },
      "photometry": {
        "visual_magnitude_V10": -9.4,
        "geometric_albedo": 0.52
      },
      "ring": {
        "inner_radius_r": 1.2,
        "outer_radius_r": 1.8,
        "opacity": 0.1,
        "color": "#AA8866"
      },
      "textureMap": "/textures/jupiter.png"
    },
    {
      "id": "saturn",
      "name": { "ja": "土星", "en": "Saturn" },
      "category": "planet",
      "parent_id": "sun",
      "description_ja": "土星は木星に次ぐ大きさのガス惑星で, 主に水素とヘリウムから成り, 太陽系惑星の中で最も平均密度が低い天体です。氷と岩石から成る明るいリング系が非常に発達しており, 多数の氷衛星と共に複雑な共鳴や潮汐相互作用を示します。内部構造は金属水素層を含むと考えられ, 上層大気にはアンモニアや水の雲が形成する帯状模様が見られます。",
      "orbit": {
        "reference_body_id": "sun",
        "coordinate_frame": "heliocentric ecliptic J2000",
        "epoch_julian_date": 2451545.0,
        "epoch_iso": "2000-01-01T12:00:00 TT",
        "elements": {
          "semi_major_axis_au": 9.53707032,
          "eccentricity": 0.0541506,
          "inclination_deg": 2.48446,
          "longitude_of_ascending_node_deg": 113.71504,
          "argument_of_periapsis_deg": 338.7169,
          "mean_anomaly_deg": 317.51238
        },
        "sidereal_orbital_period_years": 29.447498
      },
      "physical": {
        "equatorial_radius_km": 60268.0,
        "mean_radius_km": 58232.0,
        "mass_kg": 5.68317e26,
        "bulk_density_kg_m3": 687.1,
        "equatorial_gravity_m_s2": 10.44,
        "escape_velocity_km_s": 36.09,
        "sidereal_rotation_period_hours": 10.65624,
        "sidereal_rotation_period_days": 0.44401,
        "axial_tilt_deg": 26.73
      },
      "temperature": {
        "mean_surface_temp_K": 133.15,
        "min_surface_temp_K": null,
        "max_surface_temp_K": null
      },
      "photometry": {
        "visual_magnitude_V10": -8.88,
        "geometric_albedo": 0.47
      },
      "ring": {
        "inner_radius_r": 1.2,
        "outer_radius_r": 2.3,
        "opacity": 0.7,
        "color": "#d4c79e"
      },
      "textureMap": "/textures/saturn.png"
    },
    {
      "id": "uranus",
      "name": { "ja": "天王星", "en": "Uranus" },
      "category": "planet",
      "parent_id": "sun",
      "description_ja": "天王星は水・アンモニア・メタンなどの揮発性物質を多く含む氷巨星で, 外層は水素・ヘリウム大気とメタンによる青緑色の雲に覆われています。自転軸がほぼ公転面に寝ているほど大きく傾いているため, 極端な季節変化が生じます。暗く細いリングと多くの衛星を持ち, 他の巨大惑星に比べて内部からの熱放出が小さいことも特徴です。",
      "orbit": {
        "reference_body_id": "sun",
        "coordinate_frame": "heliocentric ecliptic J2000",
        "epoch_julian_date": 2451545.0,
        "epoch_iso": "2000-01-01T12:00:00 TT",
        "elements": {
          "semi_major_axis_au": 19.19126393,
          "eccentricity": 0.04716771,
          "inclination_deg": 0.76986,
          "longitude_of_ascending_node_deg": 74.22988,
          "argument_of_periapsis_deg": 96.73436,
          "mean_anomaly_deg": 142.26794
        },
        "sidereal_orbital_period_years": 84.016846
      },
      "physical": {
        "equatorial_radius_km": 25559.0,
        "mean_radius_km": 25362.0,
        "mass_kg": 8.68099e25,
        "bulk_density_kg_m3": 1270.0,
        "equatorial_gravity_m_s2": 8.87,
        "escape_velocity_km_s": 21.38,
        "sidereal_rotation_period_hours": -17.23992,
        "sidereal_rotation_period_days": -0.71833,
        "axial_tilt_deg": 97.77
      },
      "temperature": {
        "mean_surface_temp_K": 78.15,
        "min_surface_temp_K": null,
        "max_surface_temp_K": null
      },
      "photometry": {
        "visual_magnitude_V10": -7.19,
        "geometric_albedo": 0.51
      },
      "ring": {
        "inner_radius_r": 1.5,
        "outer_radius_r": 2.0,
        "opacity": 0.4,
        "color": "#99badd"
      },
      "textureMap": "/textures/uranus.png"
    },
    {
      "id": "neptune",
      "name": { "ja": "海王星", "en": "Neptune" },
      "category": "planet",
      "parent_id": "sun",
      "description_ja": "海王星も氷巨星に分類され, 内部には水・アンモニア・メタンが混じった高圧の氷マントルと岩石核があると考えられています。大気は水素とヘリウムが主体で, メタンにより深い青色を呈し, 太陽系で最速級の強風や暗斑と呼ばれる巨大渦が観測されています。暗いリングと衛星トリトンなどの衛星系を持ち, 内部からの熱放出が比較的活発です。",
      "orbit": {
        "reference_body_id": "sun",
        "coordinate_frame": "heliocentric ecliptic J2000",
        "epoch_julian_date": 2451545.0,
        "epoch_iso": "2000-01-01T12:00:00 TT",
        "elements": {
          "semi_major_axis_au": 30.06896348,
          "eccentricity": 0.00858587,
          "inclination_deg": 1.76917,
          "longitude_of_ascending_node_deg": 131.72169,
          "argument_of_periapsis_deg": 273.24966,
          "mean_anomaly_deg": 259.90868
        },
        "sidereal_orbital_period_years": 164.79132
      },
      "physical": {
        "equatorial_radius_km": 24764.0,
        "mean_radius_km": 24622.0,
        "mass_kg": 1.024092e26,
        "bulk_density_kg_m3": 1638.0,
        "equatorial_gravity_m_s2": 11.15,
        "escape_velocity_km_s": 23.56,
        "sidereal_rotation_period_hours": 16.11,
        "sidereal_rotation_period_days": 0.67125,
        "axial_tilt_deg": 28.32
      },
      "temperature": {
        "mean_surface_temp_K": 73.15,
        "min_surface_temp_K": null,
        "max_surface_temp_K": null
      },
      "photometry": {
        "visual_magnitude_V10": -6.87,
        "geometric_albedo": 0.41
      },
      "ring": {
        "inner_radius_r": 1.5,
        "outer_radius_r": 2.2,
        "opacity": 0.2,
        "color": "#88aaff"
      },
      "textureMap": "/textures/neptune.png"
    },
    {
      "id": "ceres",
      "name": { "ja": "ケレス", "en": "Ceres" },
      "category": "dwarf_planet",
      "parent_id": "sun",
      "description_ja": "ケレスは火星と木星の間の小惑星帯に位置する最大の天体で, 岩石と水氷の混合物から成る準惑星です。密度や重力場の解析から, 岩石質の核と水を含むマントル層を持つ部分的に分化した内部構造が示唆されています。表面には塩類が露出した明るい模様や多数のクレーターが見られ, 過去の氷火山活動の痕跡と考えられる地形も存在します。",
      "orbit": {
        "reference_body_id": "sun",
        "coordinate_frame": "heliocentric ecliptic J2000",
        "epoch_julian_date": 2460200.5,
        "epoch_iso": null,
        "elements": {
          "semi_major_axis_au": 2.767,
          "eccentricity": 0.0789,
          "inclination_deg": 10.59,
          "longitude_of_ascending_node_deg": 80.25,
          "argument_of_periapsis_deg": 73.42,
          "mean_anomaly_deg": 60.08
        },
        "sidereal_orbital_period_years": 4.61
      },
      "physical": {
        "equatorial_radius_km": 482.1,
        "mean_radius_km": 469.7,
        "mass_kg": 9.38416e20,
        "bulk_density_kg_m3": 2162.0,
        "equatorial_gravity_m_s2": 0.27,
        "escape_velocity_km_s": 0.51,
        "sidereal_rotation_period_hours": 9.07417008,
        "sidereal_rotation_period_days": 0.37809042,
        "axial_tilt_deg": 4.0
      },
      "temperature": {
        "mean_surface_temp_K": 172.5,
        "min_surface_temp_K": 110.0,
        "max_surface_temp_K": 235.0
      },
      "photometry": {
        "visual_magnitude_V10": 3.34,
        "geometric_albedo": 0.09
      },
      "textureMap": "/textures/ceres.png"
    },
    {
      "id": "pluto",
      "name": { "ja": "冥王星", "en": "Pluto" },
      "category": "dwarf_planet",
      "parent_id": "sun",
      "description_ja": "冥王星は主に窒素・メタン・一酸化炭素の氷と岩石から構成される外縁部の準惑星で, 非常に希薄な窒素主体の大気を持ちます。表面には明るい窒素氷のスプートニク平原や暗い高地など地質的に多様な地形があり, 氷の対流や昇華・凝結による現在進行形の地形変化が見られます。大きな衛星カロンとほぼ共通重心を回る二重惑星に近い系で, 軌道は偏心率と傾きが大きいのが特徴です。",
      "orbit": {
        "reference_body_id": "sun",
        "coordinate_frame": "heliocentric ecliptic J2000",
        "epoch_julian_date": 2451545.0,
        "epoch_iso": "2000-01-01T12:00:00 TT",
        "elements": {
          "semi_major_axis_au": 39.48168677,
          "eccentricity": 0.24880766,
          "inclination_deg": 17.14175,
          "longitude_of_ascending_node_deg": 110.30347,
          "argument_of_periapsis_deg": 113.76329,
          "mean_anomaly_deg": 14.86205
        },
        "sidereal_orbital_period_years": 247.92065
      },
      "physical": {
        "equatorial_radius_km": 1188.3,
        "mean_radius_km": 1188.3,
        "mass_kg": 1.30246e22,
        "bulk_density_kg_m3": 1853.0,
        "equatorial_gravity_m_s2": 0.62,
        "escape_velocity_km_s": 1.21,
        "sidereal_rotation_period_hours": -153.2928,
        "sidereal_rotation_period_days": -6.3872,
        "axial_tilt_deg": 119.61
      },
      "temperature": {
        "mean_surface_temp_K": 44.0,
        "min_surface_temp_K": 33.0,
        "max_surface_temp_K": 55.0
      },
      "photometry": {
        "visual_magnitude_V10": -1.0,
        "geometric_albedo": 0.3
      },
      "textureMap": "/textures/pluto.png"
    },
    {
      "id": "haumea",
      "name": { "ja": "ハウメア", "en": "Haumea" },
      "category": "dwarf_planet",
      "parent_id": "sun",
      "description_ja": "ハウメアは海王星の外側を公転する準惑星で, 非常に速い自転のためラグビーボールのように伸びた三軸楕円体と考えられています。表面は主に水氷で覆われ高い反射率を示し, その周囲には細いリングと2つの衛星が存在します。同じ起源を持つと考えられる小天体の集団が知られており, かつての巨大衝突で形成された天体であると考えられています。",
      "orbit": {
        "reference_body_id": "sun",
        "coordinate_frame": "heliocentric ecliptic J2000",
        "epoch_julian_date": 2460200.5,
        "epoch_iso": null,
        "elements": {
          "semi_major_axis_au": 42.89,
          "eccentricity": 0.1999,
          "inclination_deg": 28.21,
          "longitude_of_ascending_node_deg": 121.97,
          "argument_of_periapsis_deg": 240.7,
          "mean_anomaly_deg": 219.87
        },
        "sidereal_orbital_period_years": 284.81
      },
      "physical": {
        "equatorial_radius_km": 870.0,
        "mean_radius_km": 715.0,
        "mass_kg": 4.006e21,
        "bulk_density_kg_m3": 2600.0,
        "equatorial_gravity_m_s2": 0.35,
        "escape_velocity_km_s": 0.78,
        "sidereal_rotation_period_hours": 3.9144,
        "sidereal_rotation_period_days": 0.1631,
        "axial_tilt_deg": null
      },
      "temperature": {
        "mean_surface_temp_K": null,
        "min_surface_temp_K": null,
        "max_surface_temp_K": null
      },
      "photometry": {
        "visual_magnitude_V10": 0.2,
        "geometric_albedo": 0.72
      },
      "ring": {
        "inner_radius_r": 1.8,
        "outer_radius_r": 2.0,
        "opacity": 0.5,
        "color": "#ffffff"
      },
      "textureMap": "/textures/haumea.png"
    },
    {
      "id": "makemake",
      "name": { "ja": "マケマケ", "en": "Makemake" },
      "category": "dwarf_planet",
      "parent_id": "sun",
      "description_ja": "マケマケはカイパーベルトに属する明るい準惑星で, メタンなどの揮発性氷と水氷, 岩石から構成されていると考えられます。表面は高いアルベドと赤みを帯びた色を示し, 太陽からの距離に応じて昇華と凝結を繰り返す薄い季節的大気を持つ可能性があります。小さな衛星が1つ知られており, 外縁天体の物理状態や進化を探る重要な対象です。",
      "orbit": {
        "reference_body_id": "sun",
        "coordinate_frame": "heliocentric ecliptic J2000",
        "epoch_julian_date": 2451545.0,
        "epoch_iso": "2000-01-01T12:00:00 TT",
        "elements": {
          "semi_major_axis_au": 45.5,
          "eccentricity": 0.16,
          "inclination_deg": 29.0,
          "longitude_of_ascending_node_deg": null,
          "argument_of_periapsis_deg": null,
          "mean_anomaly_deg": null
        },
        "sidereal_orbital_period_years": 307.54
      },
      "physical": {
        "equatorial_radius_km": 717.0,
        "mean_radius_km": 714.0,
        "mass_kg": 3.1e21,
        "bulk_density_kg_m3": 2100.0,
        "equatorial_gravity_m_s2": 0.4,
        "escape_velocity_km_s": 0.76,
        "sidereal_rotation_period_hours": 22.488,
        "sidereal_rotation_period_days": 0.937,
        "axial_tilt_deg": null
      },
      "temperature": {
        "mean_surface_temp_K": null,
        "min_surface_temp_K": null,
        "max_surface_temp_K": null
      },
      "photometry": {
        "visual_magnitude_V10": -0.2,
        "geometric_albedo": 0.81
      },
      "textureMap": "/textures/makemake.png"
    },
    {
      "id": "eris",
      "name": { "ja": "エリス", "en": "Eris" },
      "category": "dwarf_planet",
      "parent_id": "sun",
      "description_ja": "エリスは太陽系で最も質量の大きい準惑星で, 散乱円盤と呼ばれる領域を非常に離心率の大きい軌道で公転しています。表面は主にメタンや窒素の氷で覆われ, 非常に高い反射率と数十ケルビンという極低温の環境を持ちます。冥王星よりやや小さいものの質量は大きく, 衛星ディスノミアとともに外縁天体の性質や太陽系形成史を理解する上で重要な対象です。",
      "orbit": {
        "reference_body_id": "sun",
        "coordinate_frame": "heliocentric ecliptic J2000",
        "epoch_julian_date": 2451545.0,
        "epoch_iso": "2000-01-01T12:00:00 TT",
        "elements": {
          "semi_major_axis_au": 68.05,
          "eccentricity": 0.437,
          "inclination_deg": 44.0,
          "longitude_of_ascending_node_deg": null,
          "argument_of_periapsis_deg": null,
          "mean_anomaly_deg": null
        },
        "sidereal_orbital_period_years": 557.56
      },
      "physical": {
        "equatorial_radius_km": 1200.0,
        "mean_radius_km": 1200.0,
        "mass_kg": 1.66e22,
        "bulk_density_kg_m3": 2300.0,
        "equatorial_gravity_m_s2": 0.77,
        "escape_velocity_km_s": 1.36,
        "sidereal_rotation_period_hours": 25.896,
        "sidereal_rotation_period_days": 1.079,
        "axial_tilt_deg": null
      },
      "temperature": {
        "mean_surface_temp_K": 43.15,
        "min_surface_temp_K": 30.15,
        "max_surface_temp_K": 56.15
      },
      "photometry": {
        "visual_magnitude_V10": -1.1,
        "geometric_albedo": 0.84
      },
      "textureMap": "/textures/eris.png"
    }
  ]
};
