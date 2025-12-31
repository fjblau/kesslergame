// Satellite metadata imported from satellites.csv
// Total: 794 satellites
// Weather: 234, Comms: 322, GPS: 238

export interface SatelliteMetadata {
  name: string;
  country: string;
  type: 'Weather' | 'Comms' | 'GPS';
  weight_kg: number;
  launch_vehicle: string;
  launch_site: string;
}

export const SATELLITE_METADATA: SatelliteMetadata[] = [
  {
    "name": "Meteosat-11",
    "country": "Germany",
    "type": "Weather",
    "weight_kg": 2100,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Meteosat-12",
    "country": "Germany",
    "type": "Weather",
    "weight_kg": 2150,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Meteosat-13",
    "country": "Germany",
    "type": "Weather",
    "weight_kg": 2200,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "GOES-16",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 2857,
    "launch_vehicle": "Atlas V",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GOES-17",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 2857,
    "launch_vehicle": "Atlas V",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GOES-18",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 2857,
    "launch_vehicle": "Atlas V",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GOES-19",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 2900,
    "launch_vehicle": "Atlas V",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GOES-T",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 2861,
    "launch_vehicle": "Atlas V",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Himawari-8",
    "country": "Japan",
    "type": "Weather",
    "weight_kg": 3500,
    "launch_vehicle": "H-IIA",
    "launch_site": "Tanegashima"
  },
  {
    "name": "Himawari-9",
    "country": "Japan",
    "type": "Weather",
    "weight_kg": 3500,
    "launch_vehicle": "H-IIA",
    "launch_site": "Tanegashima"
  },
  {
    "name": "Himawari-10",
    "country": "Japan",
    "type": "Weather",
    "weight_kg": 3550,
    "launch_vehicle": "H3",
    "launch_site": "Tanegashima"
  },
  {
    "name": "Himawari-11",
    "country": "Japan",
    "type": "Weather",
    "weight_kg": 3600,
    "launch_vehicle": "H3",
    "launch_site": "Tanegashima"
  },
  {
    "name": "FengYun-2G",
    "country": "China",
    "type": "Weather",
    "weight_kg": 1380,
    "launch_vehicle": "Long March 3A",
    "launch_site": "Xichang"
  },
  {
    "name": "FengYun-2H",
    "country": "China",
    "type": "Weather",
    "weight_kg": 1380,
    "launch_vehicle": "Long March 3A",
    "launch_site": "Xichang"
  },
  {
    "name": "FengYun-3A",
    "country": "China",
    "type": "Weather",
    "weight_kg": 2295,
    "launch_vehicle": "Long March 4C",
    "launch_site": "Taiyuan"
  },
  {
    "name": "FengYun-3B",
    "country": "China",
    "type": "Weather",
    "weight_kg": 2295,
    "launch_vehicle": "Long March 4C",
    "launch_site": "Taiyuan"
  },
  {
    "name": "FengYun-3C",
    "country": "China",
    "type": "Weather",
    "weight_kg": 2405,
    "launch_vehicle": "Long March 4C",
    "launch_site": "Taiyuan"
  },
  {
    "name": "FengYun-3D",
    "country": "China",
    "type": "Weather",
    "weight_kg": 2450,
    "launch_vehicle": "Long March 4C",
    "launch_site": "Taiyuan"
  },
  {
    "name": "FengYun-3E",
    "country": "China",
    "type": "Weather",
    "weight_kg": 2450,
    "launch_vehicle": "Long March 4C",
    "launch_site": "Jiuquan"
  },
  {
    "name": "FengYun-3F",
    "country": "China",
    "type": "Weather",
    "weight_kg": 2500,
    "launch_vehicle": "Long March 4C",
    "launch_site": "Jiuquan"
  },
  {
    "name": "FengYun-3G",
    "country": "China",
    "type": "Weather",
    "weight_kg": 2500,
    "launch_vehicle": "Long March 4C",
    "launch_site": "Jiuquan"
  },
  {
    "name": "FengYun-4A",
    "country": "China",
    "type": "Weather",
    "weight_kg": 5400,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "FengYun-4B",
    "country": "China",
    "type": "Weather",
    "weight_kg": 5450,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "FengYun-4C",
    "country": "China",
    "type": "Weather",
    "weight_kg": 5500,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "INSAT-3D",
    "country": "India",
    "type": "Weather",
    "weight_kg": 2060,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "INSAT-3DR",
    "country": "India",
    "type": "Weather",
    "weight_kg": 2211,
    "launch_vehicle": "GSLV Mk II",
    "launch_site": "Sriharikota"
  },
  {
    "name": "INSAT-3DS",
    "country": "India",
    "type": "Weather",
    "weight_kg": 2275,
    "launch_vehicle": "GSLV Mk II",
    "launch_site": "Sriharikota"
  },
  {
    "name": "INSAT-3E",
    "country": "India",
    "type": "Weather",
    "weight_kg": 2300,
    "launch_vehicle": "GSLV Mk III",
    "launch_site": "Sriharikota"
  },
  {
    "name": "Elektro-L N1",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 1780,
    "launch_vehicle": "Zenit-3F",
    "launch_site": "Baikonur"
  },
  {
    "name": "Elektro-L N2",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 1780,
    "launch_vehicle": "Zenit-3F",
    "launch_site": "Baikonur"
  },
  {
    "name": "Elektro-L N3",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 1780,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Elektro-L N4",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 1820,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Elektro-L N5",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 1850,
    "launch_vehicle": "Angara A5",
    "launch_site": "Vostochny"
  },
  {
    "name": "GEO-KOMPSAT-2A",
    "country": "South Korea",
    "type": "Weather",
    "weight_kg": 3500,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "GEO-KOMPSAT-2B",
    "country": "South Korea",
    "type": "Weather",
    "weight_kg": 3400,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "GEO-KOMPSAT-3A",
    "country": "South Korea",
    "type": "Weather",
    "weight_kg": 3600,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "Metop-A",
    "country": "Europe",
    "type": "Weather",
    "weight_kg": 4085,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Baikonur"
  },
  {
    "name": "Metop-B",
    "country": "Europe",
    "type": "Weather",
    "weight_kg": 4085,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Baikonur"
  },
  {
    "name": "Metop-C",
    "country": "Europe",
    "type": "Weather",
    "weight_kg": 4085,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Kourou"
  },
  {
    "name": "Metop-SG A1",
    "country": "Europe",
    "type": "Weather",
    "weight_kg": 4200,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "Metop-SG A2",
    "country": "Europe",
    "type": "Weather",
    "weight_kg": 4200,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "Metop-SG B1",
    "country": "Europe",
    "type": "Weather",
    "weight_kg": 4100,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "NOAA-18",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 1457,
    "launch_vehicle": "Delta II",
    "launch_site": "Vandenberg"
  },
  {
    "name": "NOAA-19",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 1440,
    "launch_vehicle": "Delta II",
    "launch_site": "Vandenberg"
  },
  {
    "name": "NOAA-20",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 2294,
    "launch_vehicle": "Delta II",
    "launch_site": "Vandenberg"
  },
  {
    "name": "NOAA-21",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 2350,
    "launch_vehicle": "Atlas V",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Suomi NPP",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 2127,
    "launch_vehicle": "Delta II",
    "launch_site": "Vandenberg"
  },
  {
    "name": "JPSS-1",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 2540,
    "launch_vehicle": "Delta II",
    "launch_site": "Vandenberg"
  },
  {
    "name": "JPSS-2",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 2540,
    "launch_vehicle": "Atlas V",
    "launch_site": "Vandenberg"
  },
  {
    "name": "JPSS-3",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 2600,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "JPSS-4",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 2600,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Meteor-M N1",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 2700,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Baikonur"
  },
  {
    "name": "Meteor-M N2",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 2900,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Baikonur"
  },
  {
    "name": "Meteor-M N2-2",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 2900,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Vostochny"
  },
  {
    "name": "Meteor-M N2-3",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 2900,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Vostochny"
  },
  {
    "name": "Meteor-M N2-4",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 2950,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Vostochny"
  },
  {
    "name": "Arktika-M N1",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 2100,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Baikonur"
  },
  {
    "name": "Arktika-M N2",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 2100,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Baikonur"
  },
  {
    "name": "Arktika-M N3",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 2150,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Vostochny"
  },
  {
    "name": "COMS-1",
    "country": "South Korea",
    "type": "Weather",
    "weight_kg": 2460,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "MTG-I1",
    "country": "Europe",
    "type": "Weather",
    "weight_kg": 3800,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "MTG-I2",
    "country": "Europe",
    "type": "Weather",
    "weight_kg": 3850,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "MTG-S1",
    "country": "Europe",
    "type": "Weather",
    "weight_kg": 3700,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "Sentinel-3A",
    "country": "Europe",
    "type": "Weather",
    "weight_kg": 1250,
    "launch_vehicle": "Rockot",
    "launch_site": "Plesetsk"
  },
  {
    "name": "Sentinel-3B",
    "country": "Europe",
    "type": "Weather",
    "weight_kg": 1250,
    "launch_vehicle": "Rockot",
    "launch_site": "Plesetsk"
  },
  {
    "name": "Sentinel-3C",
    "country": "Europe",
    "type": "Weather",
    "weight_kg": 1300,
    "launch_vehicle": "Vega-C",
    "launch_site": "Kourou"
  },
  {
    "name": "Sentinel-3D",
    "country": "Europe",
    "type": "Weather",
    "weight_kg": 1300,
    "launch_vehicle": "Vega-C",
    "launch_site": "Kourou"
  },
  {
    "name": "Sentinel-6A",
    "country": "Europe",
    "type": "Weather",
    "weight_kg": 1440,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Sentinel-6B",
    "country": "Europe",
    "type": "Weather",
    "weight_kg": 1440,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Jason-3",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 525,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "SWOT",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 2000,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "ICESat-2",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 1514,
    "launch_vehicle": "Delta II",
    "launch_site": "Vandenberg"
  },
  {
    "name": "GRACE-FO-1",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 580,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "GRACE-FO-2",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 580,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Terra",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 5190,
    "launch_vehicle": "Atlas IIAS",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Aqua",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 2934,
    "launch_vehicle": "Delta II",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Aura",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 2967,
    "launch_vehicle": "Delta II",
    "launch_site": "Vandenberg"
  },
  {
    "name": "CloudSat",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 848,
    "launch_vehicle": "Delta II",
    "launch_site": "Vandenberg"
  },
  {
    "name": "CALIPSO",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 587,
    "launch_vehicle": "Delta II",
    "launch_site": "Vandenberg"
  },
  {
    "name": "OCO-2",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 454,
    "launch_vehicle": "Delta II",
    "launch_site": "Vandenberg"
  },
  {
    "name": "OCO-3",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 500,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPM-Core",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 3850,
    "launch_vehicle": "H-IIA",
    "launch_site": "Tanegashima"
  },
  {
    "name": "TRMM",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 3624,
    "launch_vehicle": "H-II",
    "launch_site": "Tanegashima"
  },
  {
    "name": "Landsat-7",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 2200,
    "launch_vehicle": "Delta II",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Landsat-8",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 2623,
    "launch_vehicle": "Atlas V",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Landsat-9",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 2711,
    "launch_vehicle": "Atlas V",
    "launch_site": "Vandenberg"
  },
  {
    "name": "WorldView-1",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 2500,
    "launch_vehicle": "Delta II",
    "launch_site": "Vandenberg"
  },
  {
    "name": "WorldView-2",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 2615,
    "launch_vehicle": "Delta II",
    "launch_site": "Vandenberg"
  },
  {
    "name": "WorldView-3",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 2800,
    "launch_vehicle": "Atlas V",
    "launch_site": "Vandenberg"
  },
  {
    "name": "WorldView-4",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 2485,
    "launch_vehicle": "Atlas V",
    "launch_site": "Vandenberg"
  },
  {
    "name": "WorldView-Legion-1",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 700,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "WorldView-Legion-2",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 700,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "GeoEye-1",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 1955,
    "launch_vehicle": "Delta II",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Pleiades-1A",
    "country": "France",
    "type": "Weather",
    "weight_kg": 970,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Kourou"
  },
  {
    "name": "Pleiades-1B",
    "country": "France",
    "type": "Weather",
    "weight_kg": 970,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Kourou"
  },
  {
    "name": "Pleiades-Neo-3",
    "country": "France",
    "type": "Weather",
    "weight_kg": 920,
    "launch_vehicle": "Vega",
    "launch_site": "Kourou"
  },
  {
    "name": "Pleiades-Neo-4",
    "country": "France",
    "type": "Weather",
    "weight_kg": 920,
    "launch_vehicle": "Vega",
    "launch_site": "Kourou"
  },
  {
    "name": "Pleiades-Neo-5",
    "country": "France",
    "type": "Weather",
    "weight_kg": 950,
    "launch_vehicle": "Vega-C",
    "launch_site": "Kourou"
  },
  {
    "name": "Pleiades-Neo-6",
    "country": "France",
    "type": "Weather",
    "weight_kg": 950,
    "launch_vehicle": "Vega-C",
    "launch_site": "Kourou"
  },
  {
    "name": "SPOT-6",
    "country": "France",
    "type": "Weather",
    "weight_kg": 714,
    "launch_vehicle": "PSLV",
    "launch_site": "Sriharikota"
  },
  {
    "name": "SPOT-7",
    "country": "France",
    "type": "Weather",
    "weight_kg": 714,
    "launch_vehicle": "PSLV",
    "launch_site": "Sriharikota"
  },
  {
    "name": "TerraSAR-X",
    "country": "Germany",
    "type": "Weather",
    "weight_kg": 1230,
    "launch_vehicle": "Dnepr",
    "launch_site": "Baikonur"
  },
  {
    "name": "TanDEM-X",
    "country": "Germany",
    "type": "Weather",
    "weight_kg": 1340,
    "launch_vehicle": "Dnepr",
    "launch_site": "Baikonur"
  },
  {
    "name": "TerraSAR-X NG",
    "country": "Germany",
    "type": "Weather",
    "weight_kg": 1350,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "TanDEM-L",
    "country": "Germany",
    "type": "Weather",
    "weight_kg": 3700,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "EnMAP",
    "country": "Germany",
    "type": "Weather",
    "weight_kg": 980,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "PAZ",
    "country": "Spain",
    "type": "Weather",
    "weight_kg": 1400,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "COSMO-SkyMed-1",
    "country": "Italy",
    "type": "Weather",
    "weight_kg": 1700,
    "launch_vehicle": "Delta II",
    "launch_site": "Vandenberg"
  },
  {
    "name": "COSMO-SkyMed-2",
    "country": "Italy",
    "type": "Weather",
    "weight_kg": 1700,
    "launch_vehicle": "Delta II",
    "launch_site": "Vandenberg"
  },
  {
    "name": "COSMO-SkyMed-3",
    "country": "Italy",
    "type": "Weather",
    "weight_kg": 1700,
    "launch_vehicle": "Delta II",
    "launch_site": "Vandenberg"
  },
  {
    "name": "COSMO-SkyMed-4",
    "country": "Italy",
    "type": "Weather",
    "weight_kg": 1700,
    "launch_vehicle": "Delta II",
    "launch_site": "Vandenberg"
  },
  {
    "name": "CSG-1",
    "country": "Italy",
    "type": "Weather",
    "weight_kg": 2205,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Kourou"
  },
  {
    "name": "CSG-2",
    "country": "Italy",
    "type": "Weather",
    "weight_kg": 2205,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Kourou"
  },
  {
    "name": "SAOCOM-1A",
    "country": "Argentina",
    "type": "Weather",
    "weight_kg": 3000,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "SAOCOM-1B",
    "country": "Argentina",
    "type": "Weather",
    "weight_kg": 3000,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "NuSat-1",
    "country": "Argentina",
    "type": "Weather",
    "weight_kg": 37,
    "launch_vehicle": "PSLV",
    "launch_site": "Sriharikota"
  },
  {
    "name": "NuSat-2",
    "country": "Argentina",
    "type": "Weather",
    "weight_kg": 37,
    "launch_vehicle": "PSLV",
    "launch_site": "Sriharikota"
  },
  {
    "name": "NuSat-3",
    "country": "Argentina",
    "type": "Weather",
    "weight_kg": 43,
    "launch_vehicle": "PSLV",
    "launch_site": "Sriharikota"
  },
  {
    "name": "NuSat-4",
    "country": "Argentina",
    "type": "Weather",
    "weight_kg": 43,
    "launch_vehicle": "PSLV",
    "launch_site": "Sriharikota"
  },
  {
    "name": "NuSat-5",
    "country": "Argentina",
    "type": "Weather",
    "weight_kg": 43,
    "launch_vehicle": "Electron",
    "launch_site": "Mahia"
  },
  {
    "name": "NuSat-6",
    "country": "Argentina",
    "type": "Weather",
    "weight_kg": 43,
    "launch_vehicle": "Electron",
    "launch_site": "Mahia"
  },
  {
    "name": "PeruSat-1",
    "country": "Peru",
    "type": "Weather",
    "weight_kg": 430,
    "launch_vehicle": "Vega",
    "launch_site": "Kourou"
  },
  {
    "name": "VNREDSat-1",
    "country": "Vietnam",
    "type": "Weather",
    "weight_kg": 115,
    "launch_vehicle": "Vega",
    "launch_site": "Kourou"
  },
  {
    "name": "KhalifaSat",
    "country": "UAE",
    "type": "Weather",
    "weight_kg": 330,
    "launch_vehicle": "H-IIA",
    "launch_site": "Tanegashima"
  },
  {
    "name": "DubaiSat-1",
    "country": "UAE",
    "type": "Weather",
    "weight_kg": 190,
    "launch_vehicle": "Dnepr",
    "launch_site": "Baikonur"
  },
  {
    "name": "DubaiSat-2",
    "country": "UAE",
    "type": "Weather",
    "weight_kg": 300,
    "launch_vehicle": "Dnepr",
    "launch_site": "Baikonur"
  },
  {
    "name": "MN35-01",
    "country": "UAE",
    "type": "Weather",
    "weight_kg": 280,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "RASAT",
    "country": "Turkey",
    "type": "Weather",
    "weight_kg": 93,
    "launch_vehicle": "PSLV",
    "launch_site": "Sriharikota"
  },
  {
    "name": "Gokturk-1",
    "country": "Turkey",
    "type": "Weather",
    "weight_kg": 1060,
    "launch_vehicle": "Vega",
    "launch_site": "Kourou"
  },
  {
    "name": "Gokturk-2",
    "country": "Turkey",
    "type": "Weather",
    "weight_kg": 400,
    "launch_vehicle": "Long March 2D",
    "launch_site": "Jiuquan"
  },
  {
    "name": "EROS-B",
    "country": "Israel",
    "type": "Weather",
    "weight_kg": 350,
    "launch_vehicle": "Start-1",
    "launch_site": "Svobodny"
  },
  {
    "name": "EROS-C",
    "country": "Israel",
    "type": "Weather",
    "weight_kg": 400,
    "launch_vehicle": "PSLV",
    "launch_site": "Sriharikota"
  },
  {
    "name": "EROS-C2",
    "country": "Israel",
    "type": "Weather",
    "weight_kg": 400,
    "launch_vehicle": "Shavit",
    "launch_site": "Palmachim"
  },
  {
    "name": "TecSAR",
    "country": "Israel",
    "type": "Weather",
    "weight_kg": 260,
    "launch_vehicle": "PSLV",
    "launch_site": "Sriharikota"
  },
  {
    "name": "Ofeq-16",
    "country": "Israel",
    "type": "Weather",
    "weight_kg": 400,
    "launch_vehicle": "Shavit",
    "launch_site": "Palmachim"
  },
  {
    "name": "KOMPSAT-3",
    "country": "South Korea",
    "type": "Weather",
    "weight_kg": 800,
    "launch_vehicle": "H-IIA",
    "launch_site": "Tanegashima"
  },
  {
    "name": "KOMPSAT-3A",
    "country": "South Korea",
    "type": "Weather",
    "weight_kg": 1100,
    "launch_vehicle": "Dnepr",
    "launch_site": "Yasny"
  },
  {
    "name": "KOMPSAT-5",
    "country": "South Korea",
    "type": "Weather",
    "weight_kg": 1400,
    "launch_vehicle": "Dnepr",
    "launch_site": "Yasny"
  },
  {
    "name": "KOMPSAT-6",
    "country": "South Korea",
    "type": "Weather",
    "weight_kg": 1750,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "KOMPSAT-7",
    "country": "South Korea",
    "type": "Weather",
    "weight_kg": 2000,
    "launch_vehicle": "Nuri",
    "launch_site": "Naro"
  },
  {
    "name": "ALOS",
    "country": "Japan",
    "type": "Weather",
    "weight_kg": 4000,
    "launch_vehicle": "H-IIA",
    "launch_site": "Tanegashima"
  },
  {
    "name": "ALOS-2",
    "country": "Japan",
    "type": "Weather",
    "weight_kg": 2120,
    "launch_vehicle": "H-IIA",
    "launch_site": "Tanegashima"
  },
  {
    "name": "ALOS-3",
    "country": "Japan",
    "type": "Weather",
    "weight_kg": 2800,
    "launch_vehicle": "H3",
    "launch_site": "Tanegashima"
  },
  {
    "name": "ALOS-4",
    "country": "Japan",
    "type": "Weather",
    "weight_kg": 2600,
    "launch_vehicle": "H3",
    "launch_site": "Tanegashima"
  },
  {
    "name": "GOSAT",
    "country": "Japan",
    "type": "Weather",
    "weight_kg": 1750,
    "launch_vehicle": "H-IIA",
    "launch_site": "Tanegashima"
  },
  {
    "name": "GOSAT-2",
    "country": "Japan",
    "type": "Weather",
    "weight_kg": 1800,
    "launch_vehicle": "H-IIA",
    "launch_site": "Tanegashima"
  },
  {
    "name": "GOSAT-GW",
    "country": "Japan",
    "type": "Weather",
    "weight_kg": 3400,
    "launch_vehicle": "H3",
    "launch_site": "Tanegashima"
  },
  {
    "name": "Resourcesat-2",
    "country": "India",
    "type": "Weather",
    "weight_kg": 1206,
    "launch_vehicle": "PSLV",
    "launch_site": "Sriharikota"
  },
  {
    "name": "Resourcesat-2A",
    "country": "India",
    "type": "Weather",
    "weight_kg": 1235,
    "launch_vehicle": "PSLV",
    "launch_site": "Sriharikota"
  },
  {
    "name": "Resourcesat-3",
    "country": "India",
    "type": "Weather",
    "weight_kg": 1800,
    "launch_vehicle": "PSLV-XL",
    "launch_site": "Sriharikota"
  },
  {
    "name": "Cartosat-2",
    "country": "India",
    "type": "Weather",
    "weight_kg": 680,
    "launch_vehicle": "PSLV",
    "launch_site": "Sriharikota"
  },
  {
    "name": "Cartosat-2A",
    "country": "India",
    "type": "Weather",
    "weight_kg": 690,
    "launch_vehicle": "PSLV",
    "launch_site": "Sriharikota"
  },
  {
    "name": "Cartosat-2B",
    "country": "India",
    "type": "Weather",
    "weight_kg": 694,
    "launch_vehicle": "PSLV",
    "launch_site": "Sriharikota"
  },
  {
    "name": "Cartosat-2C",
    "country": "India",
    "type": "Weather",
    "weight_kg": 727,
    "launch_vehicle": "PSLV",
    "launch_site": "Sriharikota"
  },
  {
    "name": "Cartosat-2D",
    "country": "India",
    "type": "Weather",
    "weight_kg": 730,
    "launch_vehicle": "PSLV",
    "launch_site": "Sriharikota"
  },
  {
    "name": "Cartosat-2E",
    "country": "India",
    "type": "Weather",
    "weight_kg": 712,
    "launch_vehicle": "PSLV",
    "launch_site": "Sriharikota"
  },
  {
    "name": "Cartosat-3",
    "country": "India",
    "type": "Weather",
    "weight_kg": 1625,
    "launch_vehicle": "PSLV-XL",
    "launch_site": "Sriharikota"
  },
  {
    "name": "EOS-01",
    "country": "India",
    "type": "Weather",
    "weight_kg": 615,
    "launch_vehicle": "PSLV",
    "launch_site": "Sriharikota"
  },
  {
    "name": "EOS-02",
    "country": "India",
    "type": "Weather",
    "weight_kg": 145,
    "launch_vehicle": "SSLV",
    "launch_site": "Sriharikota"
  },
  {
    "name": "EOS-03",
    "country": "India",
    "type": "Weather",
    "weight_kg": 2268,
    "launch_vehicle": "GSLV Mk II",
    "launch_site": "Sriharikota"
  },
  {
    "name": "EOS-04",
    "country": "India",
    "type": "Weather",
    "weight_kg": 1710,
    "launch_vehicle": "PSLV-XL",
    "launch_site": "Sriharikota"
  },
  {
    "name": "EOS-05",
    "country": "India",
    "type": "Weather",
    "weight_kg": 2000,
    "launch_vehicle": "GSLV Mk III",
    "launch_site": "Sriharikota"
  },
  {
    "name": "EOS-06",
    "country": "India",
    "type": "Weather",
    "weight_kg": 1117,
    "launch_vehicle": "PSLV-XL",
    "launch_site": "Sriharikota"
  },
  {
    "name": "HY-1C",
    "country": "China",
    "type": "Weather",
    "weight_kg": 442,
    "launch_vehicle": "Long March 2C",
    "launch_site": "Taiyuan"
  },
  {
    "name": "HY-1D",
    "country": "China",
    "type": "Weather",
    "weight_kg": 450,
    "launch_vehicle": "Long March 2C",
    "launch_site": "Taiyuan"
  },
  {
    "name": "HY-2A",
    "country": "China",
    "type": "Weather",
    "weight_kg": 1580,
    "launch_vehicle": "Long March 4B",
    "launch_site": "Taiyuan"
  },
  {
    "name": "HY-2B",
    "country": "China",
    "type": "Weather",
    "weight_kg": 1600,
    "launch_vehicle": "Long March 4B",
    "launch_site": "Taiyuan"
  },
  {
    "name": "HY-2C",
    "country": "China",
    "type": "Weather",
    "weight_kg": 1620,
    "launch_vehicle": "Long March 4B",
    "launch_site": "Jiuquan"
  },
  {
    "name": "HY-2D",
    "country": "China",
    "type": "Weather",
    "weight_kg": 1640,
    "launch_vehicle": "Long March 4B",
    "launch_site": "Jiuquan"
  },
  {
    "name": "GF-1",
    "country": "China",
    "type": "Weather",
    "weight_kg": 1080,
    "launch_vehicle": "Long March 2D",
    "launch_site": "Jiuquan"
  },
  {
    "name": "GF-2",
    "country": "China",
    "type": "Weather",
    "weight_kg": 1900,
    "launch_vehicle": "Long March 4B",
    "launch_site": "Taiyuan"
  },
  {
    "name": "GF-3",
    "country": "China",
    "type": "Weather",
    "weight_kg": 2750,
    "launch_vehicle": "Long March 4C",
    "launch_site": "Taiyuan"
  },
  {
    "name": "GF-4",
    "country": "China",
    "type": "Weather",
    "weight_kg": 4600,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "GF-5",
    "country": "China",
    "type": "Weather",
    "weight_kg": 2800,
    "launch_vehicle": "Long March 4C",
    "launch_site": "Taiyuan"
  },
  {
    "name": "GF-6",
    "country": "China",
    "type": "Weather",
    "weight_kg": 1035,
    "launch_vehicle": "Long March 2D",
    "launch_site": "Jiuquan"
  },
  {
    "name": "GF-7",
    "country": "China",
    "type": "Weather",
    "weight_kg": 2450,
    "launch_vehicle": "Long March 4B",
    "launch_site": "Taiyuan"
  },
  {
    "name": "GF-8",
    "country": "China",
    "type": "Weather",
    "weight_kg": 2000,
    "launch_vehicle": "Long March 4B",
    "launch_site": "Taiyuan"
  },
  {
    "name": "GF-9",
    "country": "China",
    "type": "Weather",
    "weight_kg": 1200,
    "launch_vehicle": "Long March 2D",
    "launch_site": "Jiuquan"
  },
  {
    "name": "GF-10",
    "country": "China",
    "type": "Weather",
    "weight_kg": 2500,
    "launch_vehicle": "Long March 4C",
    "launch_site": "Taiyuan"
  },
  {
    "name": "GF-11",
    "country": "China",
    "type": "Weather",
    "weight_kg": 2200,
    "launch_vehicle": "Long March 4B",
    "launch_site": "Taiyuan"
  },
  {
    "name": "GF-12",
    "country": "China",
    "type": "Weather",
    "weight_kg": 2100,
    "launch_vehicle": "Long March 4C",
    "launch_site": "Taiyuan"
  },
  {
    "name": "GF-13",
    "country": "China",
    "type": "Weather",
    "weight_kg": 4800,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "GF-14",
    "country": "China",
    "type": "Weather",
    "weight_kg": 3200,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "ZY-1-02C",
    "country": "China",
    "type": "Weather",
    "weight_kg": 2060,
    "launch_vehicle": "Long March 4B",
    "launch_site": "Taiyuan"
  },
  {
    "name": "ZY-1-02D",
    "country": "China",
    "type": "Weather",
    "weight_kg": 2100,
    "launch_vehicle": "Long March 4B",
    "launch_site": "Taiyuan"
  },
  {
    "name": "ZY-1-02E",
    "country": "China",
    "type": "Weather",
    "weight_kg": 2150,
    "launch_vehicle": "Long March 4C",
    "launch_site": "Taiyuan"
  },
  {
    "name": "ZY-3",
    "country": "China",
    "type": "Weather",
    "weight_kg": 2630,
    "launch_vehicle": "Long March 4B",
    "launch_site": "Taiyuan"
  },
  {
    "name": "ZY-3-02",
    "country": "China",
    "type": "Weather",
    "weight_kg": 2700,
    "launch_vehicle": "Long March 4B",
    "launch_site": "Taiyuan"
  },
  {
    "name": "ZY-3-03",
    "country": "China",
    "type": "Weather",
    "weight_kg": 2750,
    "launch_vehicle": "Long March 4C",
    "launch_site": "Taiyuan"
  },
  {
    "name": "CBERS-4",
    "country": "Brazil",
    "type": "Weather",
    "weight_kg": 1980,
    "launch_vehicle": "Long March 4B",
    "launch_site": "Taiyuan"
  },
  {
    "name": "CBERS-4A",
    "country": "Brazil",
    "type": "Weather",
    "weight_kg": 1980,
    "launch_vehicle": "Long March 4B",
    "launch_site": "Taiyuan"
  },
  {
    "name": "Amazonia-1",
    "country": "Brazil",
    "type": "Weather",
    "weight_kg": 640,
    "launch_vehicle": "PSLV",
    "launch_site": "Sriharikota"
  },
  {
    "name": "Kanopus-V-1",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 465,
    "launch_vehicle": "Soyuz-FG",
    "launch_site": "Baikonur"
  },
  {
    "name": "Kanopus-V-2",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 465,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Vostochny"
  },
  {
    "name": "Kanopus-V-3",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 473,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Vostochny"
  },
  {
    "name": "Kanopus-V-4",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 473,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Vostochny"
  },
  {
    "name": "Kanopus-V-5",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 475,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Vostochny"
  },
  {
    "name": "Kanopus-V-6",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 475,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Vostochny"
  },
  {
    "name": "Kanopus-V-IK",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 600,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Baikonur"
  },
  {
    "name": "Resurs-P N1",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 5920,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Baikonur"
  },
  {
    "name": "Resurs-P N2",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 5920,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Baikonur"
  },
  {
    "name": "Resurs-P N3",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 5920,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Baikonur"
  },
  {
    "name": "Resurs-P N4",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 6000,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Baikonur"
  },
  {
    "name": "Kondor-FKA N1",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 1150,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Vostochny"
  },
  {
    "name": "Kondor-FKA N2",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 1150,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Vostochny"
  },
  {
    "name": "Obzor-R N1",
    "country": "Russia",
    "type": "Weather",
    "weight_kg": 1150,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "ICEYE-X1",
    "country": "Finland",
    "type": "Weather",
    "weight_kg": 85,
    "launch_vehicle": "PSLV",
    "launch_site": "Sriharikota"
  },
  {
    "name": "ICEYE-X2",
    "country": "Finland",
    "type": "Weather",
    "weight_kg": 85,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "ICEYE-X4",
    "country": "Finland",
    "type": "Weather",
    "weight_kg": 85,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "ICEYE-X5",
    "country": "Finland",
    "type": "Weather",
    "weight_kg": 85,
    "launch_vehicle": "Electron",
    "launch_site": "Mahia"
  },
  {
    "name": "ICEYE-X6",
    "country": "Finland",
    "type": "Weather",
    "weight_kg": 87,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "ICEYE-X7",
    "country": "Finland",
    "type": "Weather",
    "weight_kg": 87,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "ICEYE-X8",
    "country": "Finland",
    "type": "Weather",
    "weight_kg": 87,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "ICEYE-X9",
    "country": "Finland",
    "type": "Weather",
    "weight_kg": 87,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "ICEYE-X10",
    "country": "Finland",
    "type": "Weather",
    "weight_kg": 90,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "ICEYE-X11",
    "country": "Finland",
    "type": "Weather",
    "weight_kg": 90,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "ICEYE-X12",
    "country": "Finland",
    "type": "Weather",
    "weight_kg": 90,
    "launch_vehicle": "Electron",
    "launch_site": "Mahia"
  },
  {
    "name": "ICEYE-X13",
    "country": "Finland",
    "type": "Weather",
    "weight_kg": 90,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "ICEYE-X14",
    "country": "Finland",
    "type": "Weather",
    "weight_kg": 90,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "ICEYE-X15",
    "country": "Finland",
    "type": "Weather",
    "weight_kg": 92,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "ICEYE-X16",
    "country": "Finland",
    "type": "Weather",
    "weight_kg": 92,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Capella-1",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 107,
    "launch_vehicle": "Electron",
    "launch_site": "Mahia"
  },
  {
    "name": "Capella-2",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 107,
    "launch_vehicle": "Electron",
    "launch_site": "Mahia"
  },
  {
    "name": "Capella-3",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 107,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Capella-4",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 107,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Capella-5",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 110,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Capella-6",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 110,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Capella-7",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 110,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Capella-8",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 112,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Umbra-01",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 65,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Umbra-02",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 65,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Umbra-03",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 65,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Umbra-04",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 65,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Umbra-05",
    "country": "USA",
    "type": "Weather",
    "weight_kg": 68,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Starlink-1001",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 260,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Starlink-1002",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 260,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Starlink-1003",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 260,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Starlink-1004",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 260,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Starlink-1005",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 260,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Starlink-1234",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 260,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Starlink-1567",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 260,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Kennedy Space Center"
  },
  {
    "name": "Starlink-1890",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 260,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Kennedy Space Center"
  },
  {
    "name": "Starlink-2001",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 295,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Starlink-2234",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 295,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Starlink-2456",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 295,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Starlink-2789",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 295,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Starlink-3001",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 295,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Starlink-3234",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 295,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Starlink-3567",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 295,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Starlink-3789",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 295,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Starlink-4001",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 295,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Starlink-4234",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 295,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Kennedy Space Center"
  },
  {
    "name": "Starlink-4521",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 295,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Starlink-4789",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 295,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Starlink-5001",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 295,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Starlink-5234",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 295,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Starlink-5567",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 295,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Kennedy Space Center"
  },
  {
    "name": "Starlink-5678",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 295,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Kennedy Space Center"
  },
  {
    "name": "Starlink-6001",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 295,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Starlink-6012",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 295,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Starlink-6234",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 295,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Starlink-6543",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 295,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Starlink-6789",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 295,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Kennedy Space Center"
  },
  {
    "name": "Starlink-7001",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 295,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Starlink-7089",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 295,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Starlink-7234",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 295,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Starlink-7567",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 800,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Starlink-7890",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 800,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Starlink-8001",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 800,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Kennedy Space Center"
  },
  {
    "name": "Starlink-8234",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 800,
    "launch_vehicle": "Starship",
    "launch_site": "Boca Chica"
  },
  {
    "name": "Starlink-8567",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 800,
    "launch_vehicle": "Starship",
    "launch_site": "Boca Chica"
  },
  {
    "name": "Starlink-8901",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 800,
    "launch_vehicle": "Starship",
    "launch_site": "Boca Chica"
  },
  {
    "name": "OneWeb-0001",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Baikonur"
  },
  {
    "name": "OneWeb-0025",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Baikonur"
  },
  {
    "name": "OneWeb-0050",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Baikonur"
  },
  {
    "name": "OneWeb-0075",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Vostochny"
  },
  {
    "name": "OneWeb-0100",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Vostochny"
  },
  {
    "name": "OneWeb-0125",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Kourou"
  },
  {
    "name": "OneWeb-0150",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "OneWeb-0175",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "OneWeb-0200",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "OneWeb-0225",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "OneWeb-0250",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "GSLV Mk III",
    "launch_site": "Sriharikota"
  },
  {
    "name": "OneWeb-0267",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "GSLV Mk III",
    "launch_site": "Sriharikota"
  },
  {
    "name": "OneWeb-0300",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "OneWeb-0325",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "OneWeb-0350",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "OneWeb-0375",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "OneWeb-0398",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "OneWeb-0412",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "OneWeb-0450",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Kennedy Space Center"
  },
  {
    "name": "OneWeb-0475",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Kennedy Space Center"
  },
  {
    "name": "OneWeb-0500",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "OneWeb-0524",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "OneWeb-0550",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "OneWeb-0575",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "OneWeb-0600",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "OneWeb-0618",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 150,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Iridium-NEXT-101",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 860,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Iridium-NEXT-102",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 860,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Iridium-NEXT-103",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 860,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Iridium-NEXT-104",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 860,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Iridium-NEXT-105",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 860,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Iridium-NEXT-106",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 860,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Iridium-NEXT-107",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 860,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Iridium-NEXT-108",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 860,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Iridium-NEXT-109",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 860,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Iridium-NEXT-110",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 860,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Iridium-NEXT-115",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 860,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Iridium-NEXT-120",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 860,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Iridium-NEXT-125",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 860,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Iridium-NEXT-128",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 860,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Iridium-NEXT-130",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 860,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Iridium-NEXT-135",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 860,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Iridium-NEXT-140",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 860,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Iridium-NEXT-142",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 860,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Iridium-NEXT-145",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 860,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Iridium-NEXT-150",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 860,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Intelsat-33e",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 6600,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Intelsat-35e",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 6761,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Intelsat-37e",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 6440,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Intelsat-39",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 6600,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Intelsat-40e",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 5900,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Intelsat-41",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 6200,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "Intelsat-42",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 6300,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Intelsat-43",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 6400,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "SES-12",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 5300,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "SES-14",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 4423,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "SES-15",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 2302,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Kourou"
  },
  {
    "name": "SES-17",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 6400,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "SES-18",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 3500,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "SES-19",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 3500,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "SES-20",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 3600,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "SES-21",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 3100,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "SES-22",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 3500,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "SES-23",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 3600,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "SES-24",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 3700,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "Eutelsat-7C",
    "country": "France",
    "type": "Comms",
    "weight_kg": 3400,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Eutelsat-10B",
    "country": "France",
    "type": "Comms",
    "weight_kg": 5500,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Eutelsat-33E",
    "country": "France",
    "type": "Comms",
    "weight_kg": 3400,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Eutelsat-36D",
    "country": "France",
    "type": "Comms",
    "weight_kg": 4500,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "Eutelsat-Hotbird-13F",
    "country": "France",
    "type": "Comms",
    "weight_kg": 4500,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Eutelsat-Hotbird-13G",
    "country": "France",
    "type": "Comms",
    "weight_kg": 4500,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Eutelsat-Konnect",
    "country": "France",
    "type": "Comms",
    "weight_kg": 3619,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Eutelsat-Konnect-VHTS",
    "country": "France",
    "type": "Comms",
    "weight_kg": 6400,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Eutelsat-Quantum",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 3500,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Astra-2E",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 6140,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Astra-2F",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 6000,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Astra-2G",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 6000,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Astra-3B",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 5470,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Astra-5B",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 4500,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Astra-6A",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 4600,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "Türksat-4A",
    "country": "Turkey",
    "type": "Comms",
    "weight_kg": 4850,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Türksat-4B",
    "country": "Turkey",
    "type": "Comms",
    "weight_kg": 4924,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Türksat-5A",
    "country": "Turkey",
    "type": "Comms",
    "weight_kg": 3500,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Türksat-5B",
    "country": "Turkey",
    "type": "Comms",
    "weight_kg": 4500,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Türksat-6A",
    "country": "Turkey",
    "type": "Comms",
    "weight_kg": 4250,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Türksat-6B",
    "country": "Turkey",
    "type": "Comms",
    "weight_kg": 4300,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "Yahsat-1A",
    "country": "UAE",
    "type": "Comms",
    "weight_kg": 5900,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Yahsat-1B",
    "country": "UAE",
    "type": "Comms",
    "weight_kg": 5900,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Al-Yah-3",
    "country": "UAE",
    "type": "Comms",
    "weight_kg": 3795,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Thuraya-2",
    "country": "UAE",
    "type": "Comms",
    "weight_kg": 5177,
    "launch_vehicle": "Zenit-3SL",
    "launch_site": "Sea Launch"
  },
  {
    "name": "Thuraya-3",
    "country": "UAE",
    "type": "Comms",
    "weight_kg": 5177,
    "launch_vehicle": "Zenit-3SL",
    "launch_site": "Sea Launch"
  },
  {
    "name": "Thuraya-4",
    "country": "UAE",
    "type": "Comms",
    "weight_kg": 5200,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Thor-7",
    "country": "Norway",
    "type": "Comms",
    "weight_kg": 4600,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Thor-8",
    "country": "Norway",
    "type": "Comms",
    "weight_kg": 4200,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Arabsat-6A",
    "country": "Saudi Arabia",
    "type": "Comms",
    "weight_kg": 6465,
    "launch_vehicle": "Falcon Heavy",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Arabsat-6B",
    "country": "Saudi Arabia",
    "type": "Comms",
    "weight_kg": 4955,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Badr-7",
    "country": "Saudi Arabia",
    "type": "Comms",
    "weight_kg": 5200,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Badr-8",
    "country": "Saudi Arabia",
    "type": "Comms",
    "weight_kg": 5500,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "AsiaSat-7",
    "country": "Hong Kong",
    "type": "Comms",
    "weight_kg": 3812,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "AsiaSat-8",
    "country": "Hong Kong",
    "type": "Comms",
    "weight_kg": 4900,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "AsiaSat-9",
    "country": "Hong Kong",
    "type": "Comms",
    "weight_kg": 6140,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "AsiaSat-10",
    "country": "Hong Kong",
    "type": "Comms",
    "weight_kg": 6500,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "JCSAT-14",
    "country": "Japan",
    "type": "Comms",
    "weight_kg": 4696,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "JCSAT-15",
    "country": "Japan",
    "type": "Comms",
    "weight_kg": 3400,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "JCSAT-16",
    "country": "Japan",
    "type": "Comms",
    "weight_kg": 4600,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "JCSAT-17",
    "country": "Japan",
    "type": "Comms",
    "weight_kg": 4900,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "JCSAT-18",
    "country": "Japan",
    "type": "Comms",
    "weight_kg": 6800,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "JCSAT-110A",
    "country": "Japan",
    "type": "Comms",
    "weight_kg": 3500,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Superbird-8",
    "country": "Japan",
    "type": "Comms",
    "weight_kg": 4900,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Superbird-9",
    "country": "Japan",
    "type": "Comms",
    "weight_kg": 5300,
    "launch_vehicle": "H3",
    "launch_site": "Tanegashima"
  },
  {
    "name": "Koreasat-5A",
    "country": "South Korea",
    "type": "Comms",
    "weight_kg": 3500,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Koreasat-6",
    "country": "South Korea",
    "type": "Comms",
    "weight_kg": 2900,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Koreasat-6A",
    "country": "South Korea",
    "type": "Comms",
    "weight_kg": 3500,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Koreasat-7",
    "country": "South Korea",
    "type": "Comms",
    "weight_kg": 3680,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Koreasat-8",
    "country": "South Korea",
    "type": "Comms",
    "weight_kg": 3500,
    "launch_vehicle": "Nuri",
    "launch_site": "Naro"
  },
  {
    "name": "Chinasat-9A",
    "country": "China",
    "type": "Comms",
    "weight_kg": 5050,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "Chinasat-9B",
    "country": "China",
    "type": "Comms",
    "weight_kg": 5200,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "Chinasat-16",
    "country": "China",
    "type": "Comms",
    "weight_kg": 4600,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "Chinasat-18",
    "country": "China",
    "type": "Comms",
    "weight_kg": 5400,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "Chinasat-19",
    "country": "China",
    "type": "Comms",
    "weight_kg": 5500,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "Chinasat-20",
    "country": "China",
    "type": "Comms",
    "weight_kg": 5600,
    "launch_vehicle": "Long March 5",
    "launch_site": "Wenchang"
  },
  {
    "name": "Chinasat-26",
    "country": "China",
    "type": "Comms",
    "weight_kg": 5700,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "APStar-5C",
    "country": "China",
    "type": "Comms",
    "weight_kg": 4700,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "APStar-6C",
    "country": "China",
    "type": "Comms",
    "weight_kg": 5500,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "APStar-6D",
    "country": "China",
    "type": "Comms",
    "weight_kg": 5500,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "APStar-6E",
    "country": "China",
    "type": "Comms",
    "weight_kg": 4700,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "APStar-7",
    "country": "China",
    "type": "Comms",
    "weight_kg": 5800,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "APStar-9",
    "country": "China",
    "type": "Comms",
    "weight_kg": 5050,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "SJ-21",
    "country": "China",
    "type": "Comms",
    "weight_kg": 2850,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "TJS-1",
    "country": "China",
    "type": "Comms",
    "weight_kg": 3200,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "TJS-2",
    "country": "China",
    "type": "Comms",
    "weight_kg": 3300,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "TJS-3",
    "country": "China",
    "type": "Comms",
    "weight_kg": 3400,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "TJS-5",
    "country": "China",
    "type": "Comms",
    "weight_kg": 3500,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "TJS-6",
    "country": "China",
    "type": "Comms",
    "weight_kg": 3600,
    "launch_vehicle": "Long March 5",
    "launch_site": "Wenchang"
  },
  {
    "name": "TJS-7",
    "country": "China",
    "type": "Comms",
    "weight_kg": 3700,
    "launch_vehicle": "Long March 5",
    "launch_site": "Wenchang"
  },
  {
    "name": "TJS-9",
    "country": "China",
    "type": "Comms",
    "weight_kg": 3200,
    "launch_vehicle": "Long March 5",
    "launch_site": "Wenchang"
  },
  {
    "name": "Express-AM5",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 3400,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Express-AM6",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 3400,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Express-AM7",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 3340,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Express-AM8",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 2100,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Express-AM44",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 2560,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Express-AT1",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 1799,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Express-AT2",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 1799,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Express-AMU1",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 5700,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Express-AMU3",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 2000,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Express-AMU7",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 2200,
    "launch_vehicle": "Angara A5",
    "launch_site": "Vostochny"
  },
  {
    "name": "Yamal-300K",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 1640,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Yamal-401",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 2976,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Yamal-402",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 2320,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Yamal-601",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 5700,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Yamal-701",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 5900,
    "launch_vehicle": "Angara A5",
    "launch_site": "Vostochny"
  },
  {
    "name": "Amazonas-3",
    "country": "Spain",
    "type": "Comms",
    "weight_kg": 5900,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Amazonas-5",
    "country": "Spain",
    "type": "Comms",
    "weight_kg": 5900,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Amazonas-Nexus",
    "country": "Spain",
    "type": "Comms",
    "weight_kg": 4500,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Hispasat-30W-6",
    "country": "Spain",
    "type": "Comms",
    "weight_kg": 6092,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Hispasat-36W-1",
    "country": "Spain",
    "type": "Comms",
    "weight_kg": 3200,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Kourou"
  },
  {
    "name": "Hispasat-AG1",
    "country": "Spain",
    "type": "Comms",
    "weight_kg": 3000,
    "launch_vehicle": "Vega-C",
    "launch_site": "Kourou"
  },
  {
    "name": "GSAT-7A",
    "country": "India",
    "type": "Comms",
    "weight_kg": 2250,
    "launch_vehicle": "GSLV Mk II",
    "launch_site": "Sriharikota"
  },
  {
    "name": "GSAT-11",
    "country": "India",
    "type": "Comms",
    "weight_kg": 5854,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "GSAT-19",
    "country": "India",
    "type": "Comms",
    "weight_kg": 3136,
    "launch_vehicle": "GSLV Mk III",
    "launch_site": "Sriharikota"
  },
  {
    "name": "GSAT-24",
    "country": "India",
    "type": "Comms",
    "weight_kg": 4180,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "GSAT-29",
    "country": "India",
    "type": "Comms",
    "weight_kg": 3423,
    "launch_vehicle": "GSLV Mk III",
    "launch_site": "Sriharikota"
  },
  {
    "name": "GSAT-30",
    "country": "India",
    "type": "Comms",
    "weight_kg": 3357,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "GSAT-31",
    "country": "India",
    "type": "Comms",
    "weight_kg": 2535,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "GSAT-32",
    "country": "India",
    "type": "Comms",
    "weight_kg": 4700,
    "launch_vehicle": "GSLV Mk III",
    "launch_site": "Sriharikota"
  },
  {
    "name": "GSAT-N2",
    "country": "India",
    "type": "Comms",
    "weight_kg": 4700,
    "launch_vehicle": "GSLV Mk III",
    "launch_site": "Sriharikota"
  },
  {
    "name": "Bangabandhu-1",
    "country": "Bangladesh",
    "type": "Comms",
    "weight_kg": 3700,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Bangabandhu-2",
    "country": "Bangladesh",
    "type": "Comms",
    "weight_kg": 3800,
    "launch_vehicle": "GSLV Mk III",
    "launch_site": "Sriharikota"
  },
  {
    "name": "MEASAT-3",
    "country": "Malaysia",
    "type": "Comms",
    "weight_kg": 4721,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "MEASAT-3a",
    "country": "Malaysia",
    "type": "Comms",
    "weight_kg": 1895,
    "launch_vehicle": "Zenit-3SLB",
    "launch_site": "Baikonur"
  },
  {
    "name": "MEASAT-3b",
    "country": "Malaysia",
    "type": "Comms",
    "weight_kg": 2950,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "MEASAT-3d",
    "country": "Malaysia",
    "type": "Comms",
    "weight_kg": 5800,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Thaicom-6",
    "country": "Thailand",
    "type": "Comms",
    "weight_kg": 3000,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Thaicom-8",
    "country": "Thailand",
    "type": "Comms",
    "weight_kg": 3100,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Thaicom-9",
    "country": "Thailand",
    "type": "Comms",
    "weight_kg": 4200,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "VietSat-1",
    "country": "Vietnam",
    "type": "Comms",
    "weight_kg": 2600,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "VietSat-2",
    "country": "Vietnam",
    "type": "Comms",
    "weight_kg": 2800,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Nusantara-1",
    "country": "Indonesia",
    "type": "Comms",
    "weight_kg": 5800,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Nusantara-2",
    "country": "Indonesia",
    "type": "Comms",
    "weight_kg": 6000,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "PSN-6",
    "country": "Indonesia",
    "type": "Comms",
    "weight_kg": 4100,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Telkom-3S",
    "country": "Indonesia",
    "type": "Comms",
    "weight_kg": 3550,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Telkom-4",
    "country": "Indonesia",
    "type": "Comms",
    "weight_kg": 5900,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Telkom-5",
    "country": "Indonesia",
    "type": "Comms",
    "weight_kg": 6000,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "NigComSat-1R",
    "country": "Nigeria",
    "type": "Comms",
    "weight_kg": 5150,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "NigComSat-2",
    "country": "Nigeria",
    "type": "Comms",
    "weight_kg": 5200,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "Angosat-1",
    "country": "Angola",
    "type": "Comms",
    "weight_kg": 1647,
    "launch_vehicle": "Zenit-3F",
    "launch_site": "Baikonur"
  },
  {
    "name": "Angosat-2",
    "country": "Angola",
    "type": "Comms",
    "weight_kg": 1770,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Angosat-3",
    "country": "Angola",
    "type": "Comms",
    "weight_kg": 1900,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "EgyptSat-A",
    "country": "Egypt",
    "type": "Comms",
    "weight_kg": 1050,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Baikonur"
  },
  {
    "name": "EgyptSat-2",
    "country": "Egypt",
    "type": "Comms",
    "weight_kg": 1900,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Baikonur"
  },
  {
    "name": "Nilesat-201",
    "country": "Egypt",
    "type": "Comms",
    "weight_kg": 3200,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Nilesat-301",
    "country": "Egypt",
    "type": "Comms",
    "weight_kg": 4100,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "TurkmenAlem",
    "country": "Turkmenistan",
    "type": "Comms",
    "weight_kg": 4500,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Rascom-QAF1R",
    "country": "Pan-African",
    "type": "Comms",
    "weight_kg": 3050,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "AMOS-3",
    "country": "Israel",
    "type": "Comms",
    "weight_kg": 1310,
    "launch_vehicle": "Soyuz-FG",
    "launch_site": "Baikonur"
  },
  {
    "name": "AMOS-4",
    "country": "Israel",
    "type": "Comms",
    "weight_kg": 3500,
    "launch_vehicle": "Zenit-3SLB",
    "launch_site": "Baikonur"
  },
  {
    "name": "AMOS-7",
    "country": "Israel",
    "type": "Comms",
    "weight_kg": 2940,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "AMOS-17",
    "country": "Israel",
    "type": "Comms",
    "weight_kg": 5500,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "AMOS-8",
    "country": "Israel",
    "type": "Comms",
    "weight_kg": 4000,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Hellas-Sat-3",
    "country": "Greece",
    "type": "Comms",
    "weight_kg": 6000,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Hellas-Sat-4",
    "country": "Greece",
    "type": "Comms",
    "weight_kg": 6000,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "BulgariaSat-1",
    "country": "Bulgaria",
    "type": "Comms",
    "weight_kg": 3669,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "BulgariaSat-2",
    "country": "Bulgaria",
    "type": "Comms",
    "weight_kg": 3700,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Athena-Fidus",
    "country": "France",
    "type": "Comms",
    "weight_kg": 3081,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Sicral-2",
    "country": "Italy",
    "type": "Comms",
    "weight_kg": 4395,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Sicral-3",
    "country": "Italy",
    "type": "Comms",
    "weight_kg": 4500,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "Syracuse-4A",
    "country": "France",
    "type": "Comms",
    "weight_kg": 3500,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Syracuse-4B",
    "country": "France",
    "type": "Comms",
    "weight_kg": 3650,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "Skynet-5A",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 4749,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Skynet-5B",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 4749,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Skynet-5C",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 4749,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Skynet-5D",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 4749,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Skynet-6A",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 5600,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Skynet-6B",
    "country": "UK",
    "type": "Comms",
    "weight_kg": 5700,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "WGS-7",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 5987,
    "launch_vehicle": "Delta IV",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "WGS-8",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 5987,
    "launch_vehicle": "Delta IV",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "WGS-9",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 5987,
    "launch_vehicle": "Delta IV",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "WGS-10",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 5987,
    "launch_vehicle": "Delta IV",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "WGS-11",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 6168,
    "launch_vehicle": "Delta IV",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "WGS-12",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 6168,
    "launch_vehicle": "Falcon Heavy",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "AEHF-4",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 6168,
    "launch_vehicle": "Atlas V",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "AEHF-5",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 6168,
    "launch_vehicle": "Atlas V",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "AEHF-6",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 6168,
    "launch_vehicle": "Atlas V",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Meridian-M N18",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 2100,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "Meridian-M N19",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 2100,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "Meridian-M N20",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 2100,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "Meridian-M N21",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 2150,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "Luch-5A",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 1148,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Luch-5B",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 1148,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Luch-5V",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 1148,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Luch-5X",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 1200,
    "launch_vehicle": "Angara A5",
    "launch_site": "Vostochny"
  },
  {
    "name": "Viasat-1",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 6700,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "Viasat-2",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 6400,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Viasat-3-Americas",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 6400,
    "launch_vehicle": "Falcon Heavy",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Viasat-3-EMEA",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 6400,
    "launch_vehicle": "Falcon Heavy",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Viasat-3-APAC",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 6400,
    "launch_vehicle": "Falcon Heavy",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Jupiter-1",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 6100,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Jupiter-2",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 6500,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Jupiter-3",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 9200,
    "launch_vehicle": "Falcon Heavy",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "O3b-FM1",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 700,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Kourou"
  },
  {
    "name": "O3b-FM2",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 700,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Kourou"
  },
  {
    "name": "O3b-FM3",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 700,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Kourou"
  },
  {
    "name": "O3b-FM4",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 700,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Kourou"
  },
  {
    "name": "O3b-mPOWER-1",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 2000,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "O3b-mPOWER-2",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 2000,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "O3b-mPOWER-3",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 2000,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "O3b-mPOWER-4",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 2000,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "O3b-mPOWER-5",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 2000,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "O3b-mPOWER-6",
    "country": "Luxembourg",
    "type": "Comms",
    "weight_kg": 2000,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Telesat-LEO-01",
    "country": "Canada",
    "type": "Comms",
    "weight_kg": 700,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Telesat-LEO-02",
    "country": "Canada",
    "type": "Comms",
    "weight_kg": 700,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Telesat-LEO-03",
    "country": "Canada",
    "type": "Comms",
    "weight_kg": 700,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Telesat-LEO-04",
    "country": "Canada",
    "type": "Comms",
    "weight_kg": 700,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "Telesat-LEO-05",
    "country": "Canada",
    "type": "Comms",
    "weight_kg": 700,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Kuiper-Proto-1",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 550,
    "launch_vehicle": "Atlas V",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Kuiper-Proto-2",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 550,
    "launch_vehicle": "Atlas V",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Project-Kuiper-001",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 550,
    "launch_vehicle": "New Glenn",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Project-Kuiper-010",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 550,
    "launch_vehicle": "New Glenn",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Project-Kuiper-020",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 550,
    "launch_vehicle": "Vulcan",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Project-Kuiper-030",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 550,
    "launch_vehicle": "Vulcan",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Project-Kuiper-040",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 550,
    "launch_vehicle": "New Glenn",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Globalstar-FM93",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 700,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Baikonur"
  },
  {
    "name": "Globalstar-FM94",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 700,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Baikonur"
  },
  {
    "name": "Globalstar-FM95",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 700,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Baikonur"
  },
  {
    "name": "Globalstar-FM96",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 700,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Baikonur"
  },
  {
    "name": "Globalstar-FM97",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 700,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Baikonur"
  },
  {
    "name": "Orbcomm-FM115",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 172,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Orbcomm-FM116",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 172,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Orbcomm-FM117",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 172,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Orbcomm-FM118",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 172,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Orbcomm-FM119",
    "country": "USA",
    "type": "Comms",
    "weight_kg": 172,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Gonets-M 25",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 280,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "Gonets-M 26",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 280,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "Gonets-M 27",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 280,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "Gonets-M 28",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 280,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "Gonets-M 29",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 280,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "Gonets-M 30",
    "country": "Russia",
    "type": "Comms",
    "weight_kg": 280,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "SGDC",
    "country": "Brazil",
    "type": "Comms",
    "weight_kg": 5735,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "SGDC-2",
    "country": "Brazil",
    "type": "Comms",
    "weight_kg": 5800,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Arsat-1",
    "country": "Argentina",
    "type": "Comms",
    "weight_kg": 2985,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Arsat-2",
    "country": "Argentina",
    "type": "Comms",
    "weight_kg": 2977,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Arsat-3",
    "country": "Argentina",
    "type": "Comms",
    "weight_kg": 2900,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "Simon-Bolivar",
    "country": "Venezuela",
    "type": "Comms",
    "weight_kg": 5100,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "VRSS-2",
    "country": "Venezuela",
    "type": "Comms",
    "weight_kg": 1000,
    "launch_vehicle": "Long March 2D",
    "launch_site": "Jiuquan"
  },
  {
    "name": "GPS IIF-1",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 1630,
    "launch_vehicle": "Delta IV",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS IIF-2",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 1630,
    "launch_vehicle": "Delta IV",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS IIF-3",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 1630,
    "launch_vehicle": "Delta IV",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS IIF-4",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 1630,
    "launch_vehicle": "Delta IV",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS IIF-5",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 1630,
    "launch_vehicle": "Delta IV",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS IIF-6",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 1630,
    "launch_vehicle": "Delta IV",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS IIF-7",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 1630,
    "launch_vehicle": "Delta IV",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS IIF-8",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 1630,
    "launch_vehicle": "Atlas V",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS IIF-9",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 1630,
    "launch_vehicle": "Atlas V",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS IIF-10",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 1630,
    "launch_vehicle": "Atlas V",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS IIF-11",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 1630,
    "launch_vehicle": "Atlas V",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS IIF-12",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 1630,
    "launch_vehicle": "Atlas V",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS III SV01",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 2269,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS III SV02",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 2269,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS III SV03",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 2269,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS III SV04",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 2269,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS III SV05",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 2269,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS III SV06",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 2269,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS III SV07",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 2269,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS III SV08",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 2269,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS III SV09",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 2269,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS III SV10",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 2269,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS IIIF-1",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 4311,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS IIIF-2",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 4311,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS IIIF-3",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 4311,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS IIIF-4",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 4311,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS IIIF-5",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 4311,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS IIIF-6",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 4311,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS IIIF-7",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 4311,
    "launch_vehicle": "Vulcan",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS IIIF-8",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 4311,
    "launch_vehicle": "Vulcan",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS IIIF-9",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 4311,
    "launch_vehicle": "Vulcan",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GPS IIIF-10",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 4311,
    "launch_vehicle": "Vulcan",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "GLONASS-M 47",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1415,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-M 48",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1415,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-M 49",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1415,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-M 50",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1415,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-M 51",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1415,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-M 52",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1415,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "GLONASS-M 53",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1415,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "GLONASS-M 54",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1415,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "GLONASS-M 55",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1415,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "GLONASS-M 56",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1415,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "GLONASS-M 57",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1415,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-M 58",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1415,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-M 59",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1415,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-M 60",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1415,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-M 61",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1415,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-M 62",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1415,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-M 63",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1415,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-M 64",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1415,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-K 11",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 935,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-K 12",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 935,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-K 13",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 935,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-K 14",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 935,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-K 15",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 935,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-K 16",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 935,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-K 17",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 935,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-K 18",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 935,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-K2 01",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1800,
    "launch_vehicle": "Angara A5",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-K2 02",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1800,
    "launch_vehicle": "Angara A5",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-K2 03",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1800,
    "launch_vehicle": "Angara A5",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-K2 04",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1800,
    "launch_vehicle": "Angara A5",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-K2 05",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1800,
    "launch_vehicle": "Angara A5",
    "launch_site": "Plesetsk"
  },
  {
    "name": "GLONASS-K2 06",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1800,
    "launch_vehicle": "Angara A5",
    "launch_site": "Vostochny"
  },
  {
    "name": "GLONASS-K2 07",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1800,
    "launch_vehicle": "Angara A5",
    "launch_site": "Vostochny"
  },
  {
    "name": "GLONASS-K2 08",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1800,
    "launch_vehicle": "Angara A5",
    "launch_site": "Vostochny"
  },
  {
    "name": "Galileo-IOV-1",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 700,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-IOV-2",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 700,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-IOV-3",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 700,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-IOV-4",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 700,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM01",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM02",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM03",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM04",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM05",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM06",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Soyuz-2",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM07",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM08",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM09",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM10",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM11",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM12",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM13",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM14",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM15",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM16",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM17",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM18",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM19",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM20",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM21",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM22",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM23",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM24",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM25",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM26",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM27",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-FOC FM28",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 733,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-2G-01",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 2400,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-2G-02",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 2400,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-2G-03",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 2400,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-2G-04",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 2400,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-2G-05",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 2400,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "Galileo-2G-06",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 2400,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "BeiDou-2 G1",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4600,
    "launch_vehicle": "Long March 3C",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-2 G2",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4600,
    "launch_vehicle": "Long March 3C",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-2 G3",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4600,
    "launch_vehicle": "Long March 3C",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-2 G4",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4600,
    "launch_vehicle": "Long March 3C",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-2 G5",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4600,
    "launch_vehicle": "Long March 3C",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-2 G6",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4600,
    "launch_vehicle": "Long March 3C",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-2 G7",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4600,
    "launch_vehicle": "Long March 3C",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-2 G8",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4600,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-2 IGSO-1",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4200,
    "launch_vehicle": "Long March 3A",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-2 IGSO-2",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4200,
    "launch_vehicle": "Long March 3A",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-2 IGSO-3",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4200,
    "launch_vehicle": "Long March 3A",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-2 IGSO-4",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4200,
    "launch_vehicle": "Long March 3A",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-2 IGSO-5",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4200,
    "launch_vehicle": "Long March 3A",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-2 IGSO-6",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4200,
    "launch_vehicle": "Long March 3A",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-2 M1",
    "country": "China",
    "type": "GPS",
    "weight_kg": 800,
    "launch_vehicle": "Long March 3C",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-2 M2",
    "country": "China",
    "type": "GPS",
    "weight_kg": 800,
    "launch_vehicle": "Long March 3C",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-2 M3",
    "country": "China",
    "type": "GPS",
    "weight_kg": 800,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-2 M4",
    "country": "China",
    "type": "GPS",
    "weight_kg": 800,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-2 M5",
    "country": "China",
    "type": "GPS",
    "weight_kg": 800,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-2 M6",
    "country": "China",
    "type": "GPS",
    "weight_kg": 800,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M1",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M2",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M3",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M4",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M5",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M6",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M7",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M8",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M9",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M10",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M11",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M12",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M13",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M14",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M15",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M16",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M17",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M18",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M19",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M20",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M21",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M22",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M23",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M24",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M25",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M26",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M27",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M28",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M29",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 M30",
    "country": "China",
    "type": "GPS",
    "weight_kg": 1014,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 G1",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4200,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 G2",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4200,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 G3",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4200,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 G4",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4200,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 IGSO-1",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4200,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 IGSO-2",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4200,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 IGSO-3",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4200,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 IGSO-4",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4200,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 IGSO-5",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4200,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BeiDou-3 IGSO-6",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4200,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "QZSS-1",
    "country": "Japan",
    "type": "GPS",
    "weight_kg": 4000,
    "launch_vehicle": "H-IIA",
    "launch_site": "Tanegashima"
  },
  {
    "name": "QZSS-1R",
    "country": "Japan",
    "type": "GPS",
    "weight_kg": 4000,
    "launch_vehicle": "H-IIA",
    "launch_site": "Tanegashima"
  },
  {
    "name": "QZSS-2",
    "country": "Japan",
    "type": "GPS",
    "weight_kg": 4000,
    "launch_vehicle": "H-IIA",
    "launch_site": "Tanegashima"
  },
  {
    "name": "QZSS-3",
    "country": "Japan",
    "type": "GPS",
    "weight_kg": 4000,
    "launch_vehicle": "H-IIA",
    "launch_site": "Tanegashima"
  },
  {
    "name": "QZSS-4",
    "country": "Japan",
    "type": "GPS",
    "weight_kg": 4000,
    "launch_vehicle": "H-IIA",
    "launch_site": "Tanegashima"
  },
  {
    "name": "QZSS-5",
    "country": "Japan",
    "type": "GPS",
    "weight_kg": 4100,
    "launch_vehicle": "H3",
    "launch_site": "Tanegashima"
  },
  {
    "name": "QZSS-6",
    "country": "Japan",
    "type": "GPS",
    "weight_kg": 4100,
    "launch_vehicle": "H3",
    "launch_site": "Tanegashima"
  },
  {
    "name": "QZSS-7",
    "country": "Japan",
    "type": "GPS",
    "weight_kg": 4100,
    "launch_vehicle": "H3",
    "launch_site": "Tanegashima"
  },
  {
    "name": "NavIC-1A",
    "country": "India",
    "type": "GPS",
    "weight_kg": 1425,
    "launch_vehicle": "PSLV-XL",
    "launch_site": "Sriharikota"
  },
  {
    "name": "NavIC-1B",
    "country": "India",
    "type": "GPS",
    "weight_kg": 1425,
    "launch_vehicle": "PSLV-XL",
    "launch_site": "Sriharikota"
  },
  {
    "name": "NavIC-1C",
    "country": "India",
    "type": "GPS",
    "weight_kg": 1425,
    "launch_vehicle": "PSLV-XL",
    "launch_site": "Sriharikota"
  },
  {
    "name": "NavIC-1D",
    "country": "India",
    "type": "GPS",
    "weight_kg": 1380,
    "launch_vehicle": "PSLV-XL",
    "launch_site": "Sriharikota"
  },
  {
    "name": "NavIC-1E",
    "country": "India",
    "type": "GPS",
    "weight_kg": 1425,
    "launch_vehicle": "PSLV-XL",
    "launch_site": "Sriharikota"
  },
  {
    "name": "NavIC-1F",
    "country": "India",
    "type": "GPS",
    "weight_kg": 1425,
    "launch_vehicle": "PSLV-XL",
    "launch_site": "Sriharikota"
  },
  {
    "name": "NavIC-1G",
    "country": "India",
    "type": "GPS",
    "weight_kg": 2232,
    "launch_vehicle": "GSLV Mk II",
    "launch_site": "Sriharikota"
  },
  {
    "name": "NavIC-2A",
    "country": "India",
    "type": "GPS",
    "weight_kg": 2250,
    "launch_vehicle": "GSLV Mk II",
    "launch_site": "Sriharikota"
  },
  {
    "name": "NavIC-2B",
    "country": "India",
    "type": "GPS",
    "weight_kg": 2250,
    "launch_vehicle": "GSLV Mk II",
    "launch_site": "Sriharikota"
  },
  {
    "name": "NavIC-2C",
    "country": "India",
    "type": "GPS",
    "weight_kg": 2280,
    "launch_vehicle": "GSLV Mk II",
    "launch_site": "Sriharikota"
  },
  {
    "name": "NavIC-2D",
    "country": "India",
    "type": "GPS",
    "weight_kg": 2280,
    "launch_vehicle": "GSLV Mk II",
    "launch_site": "Sriharikota"
  },
  {
    "name": "NavIC-2E",
    "country": "India",
    "type": "GPS",
    "weight_kg": 2300,
    "launch_vehicle": "GSLV Mk III",
    "launch_site": "Sriharikota"
  },
  {
    "name": "NavIC-2F",
    "country": "India",
    "type": "GPS",
    "weight_kg": 2300,
    "launch_vehicle": "GSLV Mk III",
    "launch_site": "Sriharikota"
  },
  {
    "name": "NavIC-2G",
    "country": "India",
    "type": "GPS",
    "weight_kg": 2350,
    "launch_vehicle": "GSLV Mk III",
    "launch_site": "Sriharikota"
  },
  {
    "name": "NavIC-3A",
    "country": "India",
    "type": "GPS",
    "weight_kg": 2400,
    "launch_vehicle": "GSLV Mk III",
    "launch_site": "Sriharikota"
  },
  {
    "name": "NavIC-3B",
    "country": "India",
    "type": "GPS",
    "weight_kg": 2400,
    "launch_vehicle": "GSLV Mk III",
    "launch_site": "Sriharikota"
  },
  {
    "name": "NavIC-3C",
    "country": "India",
    "type": "GPS",
    "weight_kg": 2450,
    "launch_vehicle": "GSLV Mk III",
    "launch_site": "Sriharikota"
  },
  {
    "name": "NavIC-3D",
    "country": "India",
    "type": "GPS",
    "weight_kg": 2450,
    "launch_vehicle": "GSLV Mk III",
    "launch_site": "Sriharikota"
  },
  {
    "name": "KASS-1",
    "country": "South Korea",
    "type": "GPS",
    "weight_kg": 1200,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "KASS-2",
    "country": "South Korea",
    "type": "GPS",
    "weight_kg": 1250,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "KASS-3",
    "country": "South Korea",
    "type": "GPS",
    "weight_kg": 1250,
    "launch_vehicle": "Nuri",
    "launch_site": "Naro"
  },
  {
    "name": "KPS-1",
    "country": "South Korea",
    "type": "GPS",
    "weight_kg": 3200,
    "launch_vehicle": "Nuri",
    "launch_site": "Naro"
  },
  {
    "name": "KPS-2",
    "country": "South Korea",
    "type": "GPS",
    "weight_kg": 3200,
    "launch_vehicle": "Nuri",
    "launch_site": "Naro"
  },
  {
    "name": "KPS-3",
    "country": "South Korea",
    "type": "GPS",
    "weight_kg": 3200,
    "launch_vehicle": "Nuri",
    "launch_site": "Naro"
  },
  {
    "name": "KPS-4",
    "country": "South Korea",
    "type": "GPS",
    "weight_kg": 3250,
    "launch_vehicle": "Nuri",
    "launch_site": "Naro"
  },
  {
    "name": "KPS-5",
    "country": "South Korea",
    "type": "GPS",
    "weight_kg": 3250,
    "launch_vehicle": "Nuri",
    "launch_site": "Naro"
  },
  {
    "name": "KPS-6",
    "country": "South Korea",
    "type": "GPS",
    "weight_kg": 3300,
    "launch_vehicle": "Nuri",
    "launch_site": "Naro"
  },
  {
    "name": "KPS-7",
    "country": "South Korea",
    "type": "GPS",
    "weight_kg": 3300,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "KPS-8",
    "country": "South Korea",
    "type": "GPS",
    "weight_kg": 3350,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "GAGAN-GEO-1",
    "country": "India",
    "type": "GPS",
    "weight_kg": 1050,
    "launch_vehicle": "GSLV Mk II",
    "launch_site": "Sriharikota"
  },
  {
    "name": "GAGAN-GEO-2",
    "country": "India",
    "type": "GPS",
    "weight_kg": 1100,
    "launch_vehicle": "GSLV Mk II",
    "launch_site": "Sriharikota"
  },
  {
    "name": "GAGAN-GEO-3",
    "country": "India",
    "type": "GPS",
    "weight_kg": 1150,
    "launch_vehicle": "GSLV Mk II",
    "launch_site": "Sriharikota"
  },
  {
    "name": "EGNOS-GEO-1",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 3000,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "EGNOS-GEO-2",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 3100,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "EGNOS-GEO-3",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 3200,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "EGNOS-GEO-4",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 3200,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "EGNOS-GEO-5",
    "country": "Europe",
    "type": "GPS",
    "weight_kg": 3300,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "WAAS-GEO-1",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 2000,
    "launch_vehicle": "Atlas V",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "WAAS-GEO-2",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 2100,
    "launch_vehicle": "Atlas V",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "WAAS-GEO-3",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 2200,
    "launch_vehicle": "Atlas V",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "WAAS-PRN131",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 2100,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "WAAS-PRN133",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 2100,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "WAAS-PRN135",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 2200,
    "launch_vehicle": "Atlas V",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "WAAS-PRN138",
    "country": "USA",
    "type": "GPS",
    "weight_kg": 2300,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "MSAS-MTSAT-1R",
    "country": "Japan",
    "type": "GPS",
    "weight_kg": 4500,
    "launch_vehicle": "Atlas IIIA",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "MSAS-MTSAT-2",
    "country": "Japan",
    "type": "GPS",
    "weight_kg": 4650,
    "launch_vehicle": "H-IIA",
    "launch_site": "Tanegashima"
  },
  {
    "name": "MSAS-GEO-3",
    "country": "Japan",
    "type": "GPS",
    "weight_kg": 4700,
    "launch_vehicle": "H3",
    "launch_site": "Tanegashima"
  },
  {
    "name": "SDCM-Luch-1",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1100,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "SDCM-Luch-2",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1100,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "SDCM-Luch-3",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1150,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "SDCM-Luch-4",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1200,
    "launch_vehicle": "Proton-M",
    "launch_site": "Baikonur"
  },
  {
    "name": "SDCM-Luch-5",
    "country": "Russia",
    "type": "GPS",
    "weight_kg": 1200,
    "launch_vehicle": "Angara A5",
    "launch_site": "Vostochny"
  },
  {
    "name": "ASAS-GEO-1",
    "country": "Australia",
    "type": "GPS",
    "weight_kg": 2800,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "ASAS-GEO-2",
    "country": "Australia",
    "type": "GPS",
    "weight_kg": 2850,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "ASAS-GEO-3",
    "country": "Australia",
    "type": "GPS",
    "weight_kg": 2900,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Vandenberg"
  },
  {
    "name": "SNAS-GEO-1",
    "country": "Saudi Arabia",
    "type": "GPS",
    "weight_kg": 3000,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "SNAS-GEO-2",
    "country": "Saudi Arabia",
    "type": "GPS",
    "weight_kg": 3100,
    "launch_vehicle": "Falcon 9",
    "launch_site": "Cape Canaveral"
  },
  {
    "name": "SACCSA-GEO-1",
    "country": "Brazil",
    "type": "GPS",
    "weight_kg": 2500,
    "launch_vehicle": "Ariane 5",
    "launch_site": "Kourou"
  },
  {
    "name": "SACCSA-GEO-2",
    "country": "Brazil",
    "type": "GPS",
    "weight_kg": 2600,
    "launch_vehicle": "Ariane 6",
    "launch_site": "Kourou"
  },
  {
    "name": "BDSBAS-1",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4300,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BDSBAS-2",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4300,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "BDSBAS-3",
    "country": "China",
    "type": "GPS",
    "weight_kg": 4400,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "ASAL-GEO-1",
    "country": "Algeria",
    "type": "GPS",
    "weight_kg": 2000,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "NIGCOMSAT-SBAS-1",
    "country": "Nigeria",
    "type": "GPS",
    "weight_kg": 2200,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "PAKSBAS-1",
    "country": "Pakistan",
    "type": "GPS",
    "weight_kg": 2100,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  },
  {
    "name": "PAKSBAS-2",
    "country": "Pakistan",
    "type": "GPS",
    "weight_kg": 2150,
    "launch_vehicle": "Long March 3B",
    "launch_site": "Xichang"
  }
];
