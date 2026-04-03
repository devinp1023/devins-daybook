export const TRIP_START = '2025-05-27'
export const TRIP_END = '2025-07-06'
export const TRIP_DAYS = 41

export const CITIES = [
  { name: 'Venice', country: 'IT', arrival: '2025-05-27', departure: '2025-05-29', dayTrips: [] },
  { name: 'Florence', country: 'IT', arrival: '2025-05-29', departure: '2025-06-01', dayTrips: [] },
  { name: 'Rome', country: 'IT', arrival: '2025-06-01', departure: '2025-06-03', dayTrips: [] },
  { name: 'Amalfi', country: 'IT', arrival: '2025-06-03', departure: '2025-06-05', dayTrips: [] },
  { name: 'Nice', country: 'FR', arrival: '2025-06-05', departure: '2025-06-09', dayTrips: ['Eze', 'Monaco'] },
  { name: 'Lyon', country: 'FR', arrival: '2025-06-09', departure: '2025-06-12', dayTrips: ['Geneva'] },
  { name: 'Paris', country: 'FR', arrival: '2025-06-12', departure: '2025-06-17', dayTrips: [] },
  { name: 'Brussels', country: 'BE', arrival: '2025-06-17', departure: '2025-06-20', dayTrips: ['Antwerp'] },
  { name: 'Amsterdam', country: 'NL', arrival: '2025-06-20', departure: '2025-06-25', dayTrips: ['Rotterdam'] },
  { name: 'Berlin', country: 'DE', arrival: '2025-06-25', departure: '2025-06-30', dayTrips: ['Hamburg'] },
  { name: 'Munich', country: 'DE', arrival: '2025-06-30', departure: '2025-07-06', dayTrips: [] },
]

export const ALL_DAY_TRIPS = ['Eze', 'Monaco', 'Geneva', 'Antwerp', 'Rotterdam', 'Hamburg']

export const COUNTRY_NAMES = {
  IT: 'Italy',
  FR: 'France',
  BE: 'Belgium',
  NL: 'Netherlands',
  DE: 'Germany',
}

// City dropdown options for the composer
export const CITY_OPTIONS = [
  ...CITIES.map((c) => ({ label: c.name, country: c.country, isDayTrip: false })),
  ...ALL_DAY_TRIPS.map((name) => {
    const parent = CITIES.find((c) => c.dayTrips.includes(name))
    return { label: name, country: parent?.country || '', isDayTrip: true }
  }),
]

// SVG map coordinates for each city (approximate positions on a Europe SVG)
export const CITY_COORDINATES = {
  Venice: { x: 330, y: 295 },
  Florence: { x: 310, y: 310 },
  Rome: { x: 320, y: 350 },
  Amalfi: { x: 335, y: 370 },
  Nice: { x: 270, y: 310 },
  Lyon: { x: 250, y: 285 },
  Paris: { x: 230, y: 235 },
  Brussels: { x: 250, y: 200 },
  Amsterdam: { x: 260, y: 180 },
  Berlin: { x: 340, y: 180 },
  Munich: { x: 320, y: 230 },
  Eze: { x: 275, y: 315 },
  Monaco: { x: 278, y: 318 },
  Geneva: { x: 260, y: 275 },
  Antwerp: { x: 255, y: 195 },
  Rotterdam: { x: 255, y: 185 },
  Hamburg: { x: 320, y: 155 },
}
