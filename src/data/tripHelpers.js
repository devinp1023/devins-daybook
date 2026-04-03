import { differenceInDays, parseISO, isWithinInterval, format } from 'date-fns'
import { TRIP_START, TRIP_END, TRIP_DAYS, CITIES } from './tripConstants'

export function getDayNumber(dateStr) {
  return differenceInDays(parseISO(dateStr), parseISO(TRIP_START)) + 1
}

export function getCityForDate(dateStr) {
  const date = parseISO(dateStr)
  for (const city of CITIES) {
    const arrival = parseISO(city.arrival)
    const departure = parseISO(city.departure)
    if (isWithinInterval(date, { start: arrival, end: departure })) {
      return city
    }
  }
  return null
}

export function getCountryForCity(cityName) {
  const city = CITIES.find((c) => c.name === cityName)
  return city?.country || ''
}

export function getTripProgress() {
  const today = new Date()
  const start = parseISO(TRIP_START)
  const end = parseISO(TRIP_END)
  const elapsed = differenceInDays(today, start) + 1
  return {
    elapsed: Math.max(0, Math.min(elapsed, TRIP_DAYS)),
    total: TRIP_DAYS,
    percentage: Math.max(0, Math.min((elapsed / TRIP_DAYS) * 100, 100)),
    hasStarted: today >= start,
    hasEnded: today > end,
  }
}

export function getBannerMessage() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const dayNum = getDayNumber(today)
  const city = getCityForDate(today)

  if (dayNum < 1 || dayNum > TRIP_DAYS) return null

  if (dayNum === 1) return 'Day 1 \u00b7 The adventure begins'
  if (dayNum === TRIP_DAYS) return `Day ${TRIP_DAYS} \u00b7 Last day`
  if (dayNum === 21) return 'Halfway there \u00b7 21 days in'

  if (city) {
    const arrivalDay = getDayNumber(city.arrival)
    const departureDay = getDayNumber(city.departure)

    if (dayNum === arrivalDay) return `Welcome to ${city.name}`
    if (dayNum === departureDay) return `Last day in ${city.name}`
    return `Day ${dayNum} \u00b7 ${city.name}`
  }

  return `Day ${dayNum}`
}

export function formatDate(dateStr) {
  return format(parseISO(dateStr), 'MMMM d, yyyy')
}

export function formatDateShort(dateStr) {
  return format(parseISO(dateStr), 'MMM d')
}
