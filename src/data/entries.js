import { v4 as uuidv4 } from 'uuid'
import { seedEntries } from './seedData'

const STORAGE_KEY = 'journal_entries'

function readEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function initializeEntries() {
  const existing = readEntries()
  if (!existing) {
    writeEntries(seedEntries)
  }
}

export function getAllEntries() {
  return readEntries() || []
}

export function getEntry(id) {
  const entries = getAllEntries()
  return entries.find((e) => e.id === id) || null
}

export function getEntriesByCity(city) {
  return getAllEntries().filter((e) => e.city === city)
}

export function createEntry({ city, country, date, title, sections }) {
  const entries = getAllEntries()
  const entry = {
    id: uuidv4(),
    city,
    country,
    date,
    title,
    sections: {
      activities: { text: '', photoIds: [], ...(sections?.activities || {}) },
      food: { text: '', photoIds: [], ...(sections?.food || {}) },
      people: { text: '', photoIds: [], ...(sections?.people || {}) },
      other: { text: '', photoIds: [], ...(sections?.other || {}) },
    },
    createdAt: Date.now(),
  }
  entries.push(entry)
  writeEntries(entries)
  return entry
}

export function updateEntry(id, updates) {
  const entries = getAllEntries()
  const idx = entries.findIndex((e) => e.id === id)
  if (idx === -1) return null
  entries[idx] = { ...entries[idx], ...updates }
  writeEntries(entries)
  return entries[idx]
}

export function deleteEntry(id) {
  const entries = getAllEntries()
  const filtered = entries.filter((e) => e.id !== id)
  writeEntries(filtered)
}

export function getCitiesWithEntries() {
  const entries = getAllEntries()
  const citySet = new Set()
  const cities = []
  for (const entry of entries) {
    if (!citySet.has(entry.city)) {
      citySet.add(entry.city)
      cities.push(entry.city)
    }
  }
  return cities
}
