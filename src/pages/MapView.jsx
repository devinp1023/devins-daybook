import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllEntries } from '../data/entries'
import { CITIES, CITY_COORDINATES, ALL_DAY_TRIPS } from '../data/tripConstants'
import { formatDateShort } from '../data/tripHelpers'

// Remap city positions for a clean transit-map layout
// Spread out to avoid label collisions, roughly geographic
const MAP_POSITIONS = {
  Venice:    { x: 245, y: 185 },
  Florence:  { x: 215, y: 228 },
  Rome:      { x: 205, y: 290 },
  Amalfi:    { x: 235, y: 340 },
  Nice:      { x: 135, y: 250 },
  Lyon:      { x: 95, y: 200 },
  Paris:     { x: 70, y: 132 },
  Brussels:  { x: 120, y: 82 },
  Amsterdam: { x: 130, y: 30 },
  Berlin:    { x: 265, y: 45 },
  Munich:    { x: 235, y: 122 },
  // Day trips near their parent
  Eze:       { x: 155, y: 265 },
  Monaco:    { x: 160, y: 280 },
  Geneva:    { x: 108, y: 228 },
  Antwerp:   { x: 103, y: 60 },
  Rotterdam: { x: 112, y: 44 },
  Hamburg:   { x: 285, y: 18 },
}

const VB_W = 320
const VB_H = 380

// Label placement per city: anchor + offset
const LABEL_CONFIG = {
  Venice:    { anchor: 'start',  dx: 14, dy: 4 },
  Florence:  { anchor: 'start',  dx: 14, dy: 4 },
  Rome:      { anchor: 'end',    dx: -14, dy: 4 },
  Amalfi:    { anchor: 'start',  dx: 14, dy: 4 },
  Nice:      { anchor: 'end',    dx: -14, dy: 4 },
  Lyon:      { anchor: 'end',    dx: -14, dy: 4 },
  Paris:     { anchor: 'end',    dx: -14, dy: 4 },
  Brussels:  { anchor: 'end',    dx: -14, dy: 4 },
  Amsterdam: { anchor: 'end',    dx: -14, dy: 4 },
  Berlin:    { anchor: 'start',  dx: 14, dy: 4 },
  Munich:    { anchor: 'start',  dx: 14, dy: 4 },
}

// Build smooth route path with quadratic curves
function getRoutePath() {
  const cityOrder = CITIES.map((c) => MAP_POSITIONS[c.name]).filter(Boolean)
  if (cityOrder.length < 2) return ''
  let d = `M ${cityOrder[0].x},${cityOrder[0].y}`
  for (let i = 1; i < cityOrder.length; i++) {
    const prev = cityOrder[i - 1]
    const curr = cityOrder[i]
    const cx = (prev.x + curr.x) / 2
    const cy = (prev.y + curr.y) / 2
    d += ` Q ${cx + (prev.y - curr.y) * 0.15},${cy + (curr.x - prev.x) * 0.15} ${curr.x},${curr.y}`
  }
  return d
}

export default function MapView({ onMenuOpen }) {
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)

  useEffect(() => {
    setEntries(getAllEntries())
  }, [])

  const entryCounts = {}
  for (const entry of entries) {
    entryCounts[entry.city] = (entryCounts[entry.city] || 0) + 1
  }

  const handleDotClick = (cityName) => {
    setSelectedCity(selectedCity === cityName ? null : cityName)
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-page)' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 16px',
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-card)',
        }}
      >
        <button
          onClick={onMenuOpen}
          aria-label="Open menu"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            border: '1px solid var(--border-card)',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          &#9776;
        </button>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: '22px',
            color: 'var(--text-primary)',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Map View
        </h1>
      </div>

      {/* Map card */}
      <div style={{ padding: '16px' }}>
        <div
          style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-card)',
            boxShadow: '0 2px 8px rgba(15,37,32,0.06), 0 1px 2px rgba(15,37,32,0.04)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            style={{ width: '100%', height: 'auto', display: 'block', padding: '12px 8px' }}
            onClick={() => setSelectedCity(null)}
          >
            {/* Route line — smooth curves */}
            <path
              d={getRoutePath()}
              fill="none"
              stroke="#d0e8e2"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Route direction dots along the path */}
            <path
              d={getRoutePath()}
              fill="none"
              stroke="#b8d8ce"
              strokeWidth="0"
              strokeDasharray="0,24"
              strokeLinecap="round"
              markerMid="url(#routeDot)"
            />

            {/* Day trip connector lines */}
            {ALL_DAY_TRIPS.map((name) => {
              const pos = MAP_POSITIONS[name]
              if (!pos) return null
              const parent = CITIES.find((c) => c.dayTrips.includes(name))
              if (!parent) return null
              const parentPos = MAP_POSITIONS[parent.name]
              if (!parentPos) return null
              return (
                <line
                  key={`line-${name}`}
                  x1={parentPos.x}
                  y1={parentPos.y}
                  x2={pos.x}
                  y2={pos.y}
                  stroke="#d0e8e2"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
              )
            })}

            {/* Day trip dots */}
            {ALL_DAY_TRIPS.map((name) => {
              const pos = MAP_POSITIONS[name]
              if (!pos) return null
              const count = entryCounts[name] || 0
              return (
                <g
                  key={name}
                  onClick={(e) => { e.stopPropagation(); handleDotClick(name) }}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={4}
                    fill={count > 0 ? '#7ec4b0' : '#d0e8e2'}
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                </g>
              )
            })}

            {/* Main city dots + labels */}
            {CITIES.map((city) => {
              const pos = MAP_POSITIONS[city.name]
              if (!pos) return null
              const count = entryCounts[city.name] || 0
              const r = count > 0 ? 8 : 6
              const isSelected = selectedCity === city.name
              const label = LABEL_CONFIG[city.name] || { anchor: 'start', dx: 14, dy: 4 }

              return (
                <g
                  key={city.name}
                  onClick={(e) => { e.stopPropagation(); handleDotClick(city.name) }}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Pulse for cities with entries */}
                  {count > 0 && (
                    <circle cx={pos.x} cy={pos.y} r={r} fill="#4dc4a8" opacity="0.2">
                      <animate attributeName="r" values={`${r};${r + 10};${r}`} dur="3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.2;0;0.2" dur="3s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Outer ring */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={r}
                    fill={count > 0 ? '#4dc4a8' : '#d0e8e2'}
                    stroke={isSelected ? '#1a6a58' : '#fff'}
                    strokeWidth={isSelected ? 2.5 : 2}
                  />

                  {/* Count number inside dot */}
                  {count > 0 && (
                    <text
                      x={pos.x}
                      y={pos.y + 3.5}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="9"
                      fontFamily="'DM Mono', monospace"
                      fontWeight="700"
                    >
                      {count}
                    </text>
                  )}

                  {/* City name label */}
                  <text
                    x={pos.x + label.dx}
                    y={pos.y + label.dy}
                    textAnchor={label.anchor}
                    fill="#0f2520"
                    fontSize="11"
                    fontFamily="'DM Mono', monospace"
                    fontWeight="500"
                  >
                    {city.name}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Popover */}
          <AnimatePresence>
            {selectedCity && (
              <CityPopover
                cityName={selectedCity}
                entries={entries}
                entryCounts={entryCounts}
                onClose={() => setSelectedCity(null)}
                onNavigate={(path) => navigate(path)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function CityPopover({ cityName, entries, entryCounts, onClose, onNavigate }) {
  const cityData = CITIES.find((c) => c.name === cityName)
  const isDayTrip = ALL_DAY_TRIPS.includes(cityName)
  const count = entryCounts[cityName] || 0
  const cityEntries = entries.filter((e) => e.city === cityName).sort((a, b) => b.createdAt - a.createdAt)
  const parentCity = isDayTrip ? CITIES.find((c) => c.dayTrips.includes(cityName)) : null

  const dateRange = cityData
    ? `${formatDateShort(cityData.arrival)} – ${formatDateShort(cityData.departure)}`
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        right: '16px',
        background: 'var(--bg-card)',
        borderRadius: '14px',
        border: '1px solid var(--border-card)',
        boxShadow: '0 4px 20px rgba(15,37,32,0.12), 0 2px 6px rgba(15,37,32,0.06)',
        padding: '16px',
        zIndex: 20,
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '12px',
          width: '28px',
          height: '28px',
          borderRadius: '8px',
          border: '1px solid var(--border-card)',
          background: 'var(--bg-page)',
          color: 'var(--text-secondary)',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        &times;
      </button>

      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontWeight: 600,
          fontSize: '20px',
          color: 'var(--text-primary)',
          margin: '0 0 4px',
        }}
      >
        {cityName}
      </h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
        {dateRange && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-meta)' }}>
            {dateRange}
          </span>
        )}
        {isDayTrip && parentCity && (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--teal-primary)',
              background: 'var(--bg-tag)',
              border: '1px solid var(--border-tag)',
            }}
          >
            Day trip from {parentCity.name}
          </span>
        )}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>
          {count} {count === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {cityEntries.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {cityEntries.slice(0, 3).map((entry) => (
            <button
              key={entry.id}
              onClick={() => onNavigate(`/entry/${entry.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '10px',
                background: 'var(--bg-page)',
                border: '1px solid var(--border-card)',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {entry.title}
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-meta)', margin: '2px 0 0' }}>
                  {formatDateShort(entry.date)}
                </p>
              </div>
              <span style={{ color: 'var(--text-meta)', fontSize: '14px' }}>&rsaquo;</span>
            </button>
          ))}
        </div>
      )}

      {count === 0 && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
          No entries written here yet
        </p>
      )}
    </motion.div>
  )
}
