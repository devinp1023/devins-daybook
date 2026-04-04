import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { differenceInDays, parseISO } from 'date-fns'
import { getAllEntries, getEntriesByCity } from '../data/entries'
import { getPhoto, createObjectURL } from '../data/photos'
import { CITIES, COUNTRY_NAMES } from '../data/tripConstants'
import { formatDateShort } from '../data/tripHelpers'
import CityIllustration from '../components/CityIllustration'
import Lightbox from '../components/Lightbox'

// ─── City Index Page ───────────────────────────────────────

export default function CitySummaries({ onMenuOpen }) {
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])

  useEffect(() => {
    setEntries(getAllEntries())
  }, [])

  // Build city data: trip cities first, then any custom cities from entries
  const tripCityData = CITIES.map((city) => {
    const cityEntries = entries.filter((e) => e.city === city.name)
    if (cityEntries.length === 0) return null

    let photoCount = 0
    for (const entry of cityEntries) {
      for (const section of Object.values(entry.sections)) {
        photoCount += section.photoIds.length
      }
    }

    const days = differenceInDays(parseISO(city.departure), parseISO(city.arrival))
    return {
      ...city,
      entryCount: cityEntries.length,
      photoCount,
      days,
    }
  }).filter(Boolean)

  // Find cities in entries that aren't in the CITIES trip list
  const tripCityNames = new Set(CITIES.map((c) => c.name))
  const customCityNames = []
  const customCitySet = new Set()
  for (const entry of entries) {
    if (!tripCityNames.has(entry.city) && !customCitySet.has(entry.city)) {
      customCitySet.add(entry.city)
      customCityNames.push(entry.city)
    }
  }

  const customCityData = customCityNames.map((cityName) => {
    const cityEntries = entries.filter((e) => e.city === cityName)
    let photoCount = 0
    for (const entry of cityEntries) {
      for (const section of Object.values(entry.sections)) {
        photoCount += section.photoIds.length
      }
    }
    return {
      name: cityName,
      country: cityEntries[0]?.country || '',
      arrival: null,
      departure: null,
      dayTrips: [],
      entryCount: cityEntries.length,
      photoCount,
      days: null,
    }
  })

  const cityData = [...tripCityData, ...customCityData]

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
          City Summaries
        </h1>
      </div>

      {/* City cards */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {cityData.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '20px', marginBottom: '8px' }}>
              No cities yet
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px' }}>
              Start writing entries to see your cities here
            </p>
          </div>
        )}

        {cityData.map((city, i) => (
          <motion.div
            key={city.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
          >
            <button
              onClick={() => navigate(`/cities/${encodeURIComponent(city.name)}`)}
              style={{
                display: 'block',
                width: '100%',
                borderRadius: '16px',
                overflow: 'hidden',
                textDecoration: 'none',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                boxShadow: '0 2px 8px rgba(15,37,32,0.06), 0 1px 2px rgba(15,37,32,0.04)',
                cursor: 'pointer',
                textAlign: 'left',
                padding: 0,
              }}
            >
              {/* Illustration header */}
              <div
                style={{
                  position: 'relative',
                  height: '100px',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #1a3a35 0%, #2a5a50 50%, #1a3a35 100%)',
                }}
              >
                <CityIllustration
                  city={city.name}
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    width: '100%', height: '100%',
                    opacity: 0.9,
                  }}
                />
                {/* Country pill */}
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 500,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: 'var(--teal-bright)',
                    background: 'rgba(26,58,53,0.75)',
                    border: '1px solid rgba(77,196,168,0.25)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                  }}
                >
                  {city.name}, {city.country}
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: '14px 16px 16px' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontWeight: 500,
                    fontSize: '18px',
                    lineHeight: 1.3,
                    color: 'var(--text-primary)',
                    margin: '0 0 6px',
                  }}
                >
                  {city.name}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-meta)',
                    marginBottom: '8px',
                    letterSpacing: '0.3px',
                  }}
                >
                  {city.arrival ? `${formatDateShort(city.arrival)} – ${formatDateShort(city.departure)} \u00b7 ${city.days} days` : `${city.entryCount} ${city.entryCount === 1 ? 'entry' : 'entries'}`}
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <StatPill label="entries" value={city.entryCount} />
                  <StatPill label="photos" value={city.photoCount} />
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function StatPill({ label, value }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 10px',
        borderRadius: '8px',
        fontSize: '11px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--teal-primary)',
        background: 'var(--bg-tag)',
        border: '1px solid var(--border-tag)',
      }}
    >
      <strong>{value}</strong> {label}
    </span>
  )
}

// ─── City Detail Page ──────────────────────────────────────

export function CityDetail() {
  const { cityName } = useParams()
  const navigate = useNavigate()
  const decodedCity = decodeURIComponent(cityName)
  const cityInfo = CITIES.find((c) => c.name === decodedCity)

  const [entries, setEntries] = useState([])
  const [photoData, setPhotoData] = useState([])
  const [lightbox, setLightbox] = useState({ isOpen: false, url: '', caption: '' })
  const [hasEntries, setHasEntries] = useState(true)
  const [showPostcard, setShowPostcard] = useState(false)

  useEffect(() => {
    const cityEntries = getEntriesByCity(decodedCity).sort((a, b) => a.date.localeCompare(b.date))
    setEntries(cityEntries)
    if (cityEntries.length === 0) setHasEntries(false)

    let cancelled = false
    async function loadPhotos() {
      const photos = []
      for (const entry of cityEntries) {
        for (const [, section] of Object.entries(entry.sections)) {
          for (const photoId of section.photoIds) {
            const photo = await getPhoto(photoId)
            if (photo && !cancelled) {
              photos.push({
                id: photoId,
                url: createObjectURL(photo.blob),
                entryTitle: entry.title,
                entryDate: entry.date,
              })
            }
          }
        }
      }
      if (!cancelled) setPhotoData(photos)
    }
    loadPhotos()
    return () => { cancelled = true }
  }, [decodedCity])

  if (!cityInfo && !hasEntries) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', background: 'var(--bg-page)' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '20px', color: 'var(--text-primary)' }}>
            City not found
          </p>
          <button
            onClick={() => navigate('/cities')}
            style={{ marginTop: '16px', fontSize: '14px', textDecoration: 'underline', color: 'var(--teal-primary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
          >
            Back to cities
          </button>
        </div>
      </div>
    )
  }

  const days = cityInfo ? differenceInDays(parseISO(cityInfo.departure), parseISO(cityInfo.arrival)) : null
  const countryName = cityInfo ? (COUNTRY_NAMES[cityInfo.country] || cityInfo.country) : (entries[0]?.country || '')
  const dateRange = cityInfo ? `${formatDateShort(cityInfo.arrival)} – ${formatDateShort(cityInfo.departure)}` : ''

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{ minHeight: '100dvh', background: 'var(--bg-page)' }}
    >
      {/* Header illustration */}
      <div
        style={{
          position: 'relative',
          height: '200px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--bg-header) 0%, var(--teal-dark) 100%)',
        }}
      >
        <CityIllustration
          city={decodedCity}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', opacity: 0.8 }}
        />
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(26,58,53,0.85) 0%, rgba(26,58,53,0.2) 50%, transparent 100%)',
          }}
        />

        {/* Back button */}
        <button
          onClick={() => navigate('/cities')}
          style={{
            position: 'absolute', top: '14px', left: '14px',
            width: '40px', height: '40px', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
            background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            color: '#fff', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: '18px',
          }}
        >
          &larr;
        </button>

        {/* City info overlay */}
        <div style={{ position: 'absolute', bottom: '18px', left: '20px', right: '20px', zIndex: 10 }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 600,
              fontSize: '28px', color: '#fff', margin: '0 0 6px',
            }}
          >
            {decodedCity}
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--teal-muted)', margin: 0 }}>
            {[countryName, dateRange, days ? `${days} days` : null].filter(Boolean).join(' \u00b7 ')}
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        {/* Stats row */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <StatPill label="entries" value={entries.length} />
          <StatPill label="photos" value={photoData.length} />
          {days != null && <StatPill label="days" value={days} />}
        </div>

        {/* Photos section */}
        {photoData.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <SectionHeading label="Photos" />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '4px',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              {photoData.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => setLightbox({
                    isOpen: true,
                    url: photo.url,
                    caption: `${photo.entryTitle} \u00b7 ${formatDateShort(photo.entryDate)}`,
                  })}
                  style={{
                    aspectRatio: '1', padding: 0, border: 'none',
                    cursor: 'pointer', background: 'var(--border-card)',
                    display: 'block', overflow: 'hidden',
                  }}
                >
                  <img src={photo.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Entries section */}
        {entries.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <SectionHeading label="Entries" />
            <div
              style={{
                background: 'var(--bg-card)',
                borderRadius: '14px',
                border: '1px solid var(--border-card)',
                boxShadow: '0 2px 8px rgba(15,37,32,0.06)',
                overflow: 'hidden',
              }}
            >
              {entries.map((entry, i) => (
                <button
                  key={entry.id}
                  onClick={() => navigate(`/entry/${entry.id}`)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 16px', width: '100%', textAlign: 'left',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    borderTop: i > 0 ? '1px solid var(--border-card)' : 'none',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-display)', fontStyle: 'italic',
                        fontSize: '15px', color: 'var(--text-primary)', margin: 0,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}
                    >
                      {entry.title}
                    </p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-meta)', margin: '3px 0 0' }}>
                      {formatDateShort(entry.date)}
                    </p>
                  </div>
                  <span style={{ color: 'var(--text-meta)', fontSize: '16px', flexShrink: 0 }}>&rsaquo;</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Create Postcard button */}
        <button
          onClick={() => setShowPostcard(true)}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '14px',
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
            fontWeight: 600,
            color: '#fff',
            background: 'var(--teal-primary)',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '0.5px',
          }}
        >
          Create Postcard
        </button>
      </div>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightbox.isOpen}
        onClose={() => setLightbox({ isOpen: false, url: '', caption: '' })}
        photoUrl={lightbox.url}
        caption={lightbox.caption}
      />

      {/* Postcard Generator Modal */}
      <AnimatePresence>
        {showPostcard && (
          <PostcardGenerator
            city={decodedCity}
            country={countryName}
            dateRange={dateRange}
            photos={photoData}
            onClose={() => setShowPostcard(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function SectionHeading({ label }) {
  return (
    <h2
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: 'var(--teal-primary)',
        margin: '0 0 10px',
      }}
    >
      {label}
    </h2>
  )
}

// ─── Postcard Helpers ──────────────────────────────────────

// Logical drawing coordinates (all drawing code uses these)
const CANVAS_W = 1080
const CANVAS_H = 1350
// CSS display size for the preview
const DISPLAY_W = 340
const DISPLAY_H = Math.round(DISPLAY_W * (CANVAS_H / CANVAS_W))

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// Draw country flag inside the postage stamp
function drawFlag(ctx, city, x, y, w, h) {
  // Map cities to countries
  const cityCountry = {
    Venice: 'IT', Florence: 'IT', Rome: 'IT', Amalfi: 'IT',
    Nice: 'FR', Lyon: 'FR', Paris: 'FR',
    Brussels: 'BE',
    Amsterdam: 'NL',
    Berlin: 'DE', Munich: 'DE',
    Chicago: 'US',
  }
  const country = cityCountry[city] || 'EU'

  switch (country) {
    case 'IT': {
      // Italy: green white red (vertical)
      const third = w / 3
      ctx.fillStyle = '#008C45'
      ctx.fillRect(x, y, third, h)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(x + third, y, third, h)
      ctx.fillStyle = '#CD212A'
      ctx.fillRect(x + third * 2, y, third, h)
      break
    }
    case 'FR': {
      // France: blue white red (vertical)
      const third = w / 3
      ctx.fillStyle = '#002395'
      ctx.fillRect(x, y, third, h)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(x + third, y, third, h)
      ctx.fillStyle = '#ED2939'
      ctx.fillRect(x + third * 2, y, third, h)
      break
    }
    case 'BE': {
      // Belgium: black yellow red (vertical)
      const third = w / 3
      ctx.fillStyle = '#2D2926'
      ctx.fillRect(x, y, third, h)
      ctx.fillStyle = '#FFD100'
      ctx.fillRect(x + third, y, third, h)
      ctx.fillStyle = '#C8102E'
      ctx.fillRect(x + third * 2, y, third, h)
      break
    }
    case 'NL': {
      // Netherlands: red white blue (horizontal)
      const third = h / 3
      ctx.fillStyle = '#AE1C28'
      ctx.fillRect(x, y, w, third)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(x, y + third, w, third)
      ctx.fillStyle = '#21468B'
      ctx.fillRect(x, y + third * 2, w, third)
      break
    }
    case 'DE': {
      // Germany: black red gold (horizontal)
      const third = h / 3
      ctx.fillStyle = '#000000'
      ctx.fillRect(x, y, w, third)
      ctx.fillStyle = '#DD0000'
      ctx.fillRect(x, y + third, w, third)
      ctx.fillStyle = '#FFCC00'
      ctx.fillRect(x, y + third * 2, w, third)
      break
    }
    case 'US': {
      // USA: stripes + blue canton with stars
      const stripeH = h / 13
      for (let i = 0; i < 13; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#B22234' : '#ffffff'
        ctx.fillRect(x, y + i * stripeH, w, stripeH)
      }
      // Blue canton
      const cantonW = w * 0.4
      const cantonH = stripeH * 7
      ctx.fillStyle = '#3C3B6E'
      ctx.fillRect(x, y, cantonW, cantonH)
      // Stars (simplified 5x4 grid)
      ctx.fillStyle = '#ffffff'
      const starR2 = Math.min(cantonW, cantonH) * 0.04
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 5; col++) {
          const starX = x + cantonW * 0.12 + col * (cantonW * 0.19)
          const starY = y + cantonH * 0.15 + row * (cantonH * 0.22)
          drawStar(ctx, starX, starY, starR2)
        }
      }
      break
    }
    default: {
      // EU blue with stars
      ctx.fillStyle = '#003399'
      ctx.fillRect(x, y, w, h)
      ctx.fillStyle = '#FFCC00'
      const starR = 8
      const cx = x + w / 2
      const cy = y + h / 2
      const ringR = Math.min(w, h) * 0.32
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30 - 90) * Math.PI / 180
        const sx = cx + ringR * Math.cos(angle)
        const sy = cy + ringR * Math.sin(angle)
        drawStar(ctx, sx, sy, starR)
      }
    }
  }

  // Subtle overlay to make it look more like a printed stamp (slightly faded)
  ctx.fillStyle = 'rgba(255,255,255,0.1)'
  ctx.fillRect(x, y, w, h)
}

function drawStar(ctx, cx, cy, r) {
  ctx.beginPath()
  for (let i = 0; i < 5; i++) {
    const outerAngle = (i * 72 - 90) * Math.PI / 180
    const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180
    const ox = cx + r * Math.cos(outerAngle)
    const oy = cy + r * Math.sin(outerAngle)
    const ix = cx + r * 0.4 * Math.cos(innerAngle)
    const iy = cy + r * 0.4 * Math.sin(innerAngle)
    if (i === 0) ctx.moveTo(ox, oy)
    else ctx.lineTo(ox, oy)
    ctx.lineTo(ix, iy)
  }
  ctx.closePath()
  ctx.fill()
}

// Draw city landmark as a large watermark
function drawCityLandmark(ctx, city, cw, ch) {
  ctx.save()
  ctx.globalAlpha = 0.15
  ctx.strokeStyle = '#1a6a58'
  ctx.fillStyle = '#1a6a58'
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  // Position centered horizontally, peeking up from the bottom
  const cx = cw * 0.5
  const cy = ch * 0.88

  switch (city) {
    case 'Paris': {
      // Eiffel Tower
      const bw = 200, h = 500
      const top = cy - h / 2, bot = cy + h / 2
      ctx.beginPath()
      ctx.moveTo(cx, top)
      ctx.lineTo(cx - bw * 0.12, top + h * 0.35)
      ctx.lineTo(cx - bw * 0.25, top + h * 0.6)
      ctx.lineTo(cx - bw * 0.5, bot)
      ctx.moveTo(cx, top)
      ctx.lineTo(cx + bw * 0.12, top + h * 0.35)
      ctx.lineTo(cx + bw * 0.25, top + h * 0.6)
      ctx.lineTo(cx + bw * 0.5, bot)
      // Cross beams
      ctx.moveTo(cx - bw * 0.08, top + h * 0.28)
      ctx.lineTo(cx + bw * 0.08, top + h * 0.28)
      ctx.moveTo(cx - bw * 0.18, top + h * 0.5)
      ctx.lineTo(cx + bw * 0.18, top + h * 0.5)
      ctx.moveTo(cx - bw * 0.35, top + h * 0.78)
      ctx.lineTo(cx + bw * 0.35, top + h * 0.78)
      // Arch
      ctx.moveTo(cx - bw * 0.22, top + h * 0.55)
      ctx.quadraticCurveTo(cx, top + h * 0.48, cx + bw * 0.22, top + h * 0.55)
      ctx.stroke()
      break
    }
    case 'Rome': {
      // Colosseum arches
      const w = 400, h = 300
      const left = cx - w / 2, top = cy - h / 2
      // Outer ellipse
      ctx.beginPath()
      ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2)
      ctx.stroke()
      // Inner ellipse
      ctx.beginPath()
      ctx.ellipse(cx, cy, w / 2 - 40, h / 2 - 30, 0, 0, Math.PI * 2)
      ctx.stroke()
      // Arches row
      for (let i = 0; i < 7; i++) {
        const ax = left + 60 + i * 46
        ctx.beginPath()
        ctx.arc(ax, cy, 18, Math.PI, 0)
        ctx.stroke()
      }
      // Arches row 2
      for (let i = 0; i < 7; i++) {
        const ax = left + 60 + i * 46
        ctx.beginPath()
        ctx.arc(ax, cy - 55, 16, Math.PI, 0)
        ctx.stroke()
      }
      break
    }
    case 'Amsterdam': {
      // Canal houses
      const houseW = 60, gap = 10, startX = cx - 3.5 * (houseW + gap)
      for (let i = 0; i < 7; i++) {
        const hx = startX + i * (houseW + gap)
        const hh = 180 + (i % 3) * 40
        const top = cy + 100 - hh
        // House body
        ctx.strokeRect(hx, top + 40, houseW, hh - 40)
        // Gable (stepped or triangular)
        if (i % 3 === 0) {
          ctx.beginPath()
          ctx.moveTo(hx, top + 40)
          ctx.lineTo(hx + houseW / 2, top)
          ctx.lineTo(hx + houseW, top + 40)
          ctx.stroke()
        } else if (i % 3 === 1) {
          ctx.beginPath()
          ctx.moveTo(hx, top + 40)
          ctx.lineTo(hx, top + 20)
          ctx.lineTo(hx + 10, top + 10)
          ctx.lineTo(hx + houseW / 2, top)
          ctx.lineTo(hx + houseW - 10, top + 10)
          ctx.lineTo(hx + houseW, top + 20)
          ctx.lineTo(hx + houseW, top + 40)
          ctx.stroke()
        } else {
          ctx.beginPath()
          ctx.moveTo(hx, top + 40)
          ctx.lineTo(hx + houseW * 0.2, top + 10)
          ctx.lineTo(hx + houseW * 0.8, top + 10)
          ctx.lineTo(hx + houseW, top + 40)
          ctx.stroke()
        }
        // Windows
        ctx.strokeRect(hx + 10, top + 60, 16, 20)
        ctx.strokeRect(hx + houseW - 26, top + 60, 16, 20)
        // Door
        ctx.strokeRect(hx + houseW / 2 - 10, cy + 100 - 50, 20, 50)
      }
      break
    }
    case 'Venice': {
      // Gondola + bridge
      ctx.beginPath()
      // Bridge arch
      ctx.moveTo(cx - 160, cy + 40)
      ctx.quadraticCurveTo(cx, cy - 80, cx + 160, cy + 40)
      ctx.stroke()
      // Bridge railings
      ctx.moveTo(cx - 130, cy + 10)
      ctx.quadraticCurveTo(cx, cy - 50, cx + 130, cy + 10)
      ctx.stroke()
      // Gondola
      ctx.beginPath()
      ctx.moveTo(cx - 100, cy + 80)
      ctx.quadraticCurveTo(cx - 120, cy + 60, cx - 80, cy + 70)
      ctx.lineTo(cx + 80, cy + 70)
      ctx.quadraticCurveTo(cx + 120, cy + 60, cx + 100, cy + 80)
      ctx.quadraticCurveTo(cx, cy + 90, cx - 100, cy + 80)
      ctx.stroke()
      // Ferro (gondola prow)
      ctx.beginPath()
      ctx.moveTo(cx - 90, cy + 65)
      ctx.lineTo(cx - 110, cy + 30)
      ctx.stroke()
      break
    }
    case 'Florence': {
      // Duomo dome
      ctx.beginPath()
      ctx.moveTo(cx - 120, cy + 60)
      ctx.quadraticCurveTo(cx - 120, cy - 100, cx, cy - 140)
      ctx.quadraticCurveTo(cx + 120, cy - 100, cx + 120, cy + 60)
      ctx.stroke()
      // Lantern on top
      ctx.strokeRect(cx - 15, cy - 170, 30, 30)
      ctx.beginPath()
      ctx.moveTo(cx - 15, cy - 170)
      ctx.lineTo(cx, cy - 195)
      ctx.lineTo(cx + 15, cy - 170)
      ctx.stroke()
      // Base
      ctx.strokeRect(cx - 140, cy + 60, 280, 80)
      // Ribs on dome
      ctx.beginPath()
      ctx.moveTo(cx, cy - 140)
      ctx.lineTo(cx, cy + 60)
      ctx.stroke()
      break
    }
    case 'Berlin': {
      // Brandenburg Gate
      const gw = 300, gh = 200
      const left = cx - gw / 2, top = cy - gh / 2
      // Columns
      for (let i = 0; i < 6; i++) {
        const colX = left + 20 + i * 52
        ctx.strokeRect(colX, top + 40, 16, gh - 40)
      }
      // Top beam
      ctx.strokeRect(left, top + 20, gw, 25)
      // Triangular pediment
      ctx.beginPath()
      ctx.moveTo(left, top + 20)
      ctx.lineTo(cx, top - 20)
      ctx.lineTo(left + gw, top + 20)
      ctx.stroke()
      // Quadriga hint on top
      ctx.beginPath()
      ctx.moveTo(cx - 20, top - 20)
      ctx.lineTo(cx, top - 50)
      ctx.lineTo(cx + 20, top - 20)
      ctx.stroke()
      break
    }
    case 'Munich': {
      // Beer stein
      ctx.beginPath()
      ctx.strokeRect(cx - 50, cy - 60, 100, 140)
      ctx.moveTo(cx - 50, cy - 30)
      ctx.lineTo(cx + 50, cy - 30)
      ctx.stroke()
      // Handle
      ctx.beginPath()
      ctx.moveTo(cx + 50, cy - 40)
      ctx.quadraticCurveTo(cx + 90, cy, cx + 50, cy + 50)
      ctx.stroke()
      // Lid
      ctx.beginPath()
      ctx.moveTo(cx - 55, cy - 60)
      ctx.lineTo(cx - 55, cy - 75)
      ctx.lineTo(cx + 55, cy - 75)
      ctx.lineTo(cx + 55, cy - 60)
      ctx.stroke()
      // Foam
      ctx.beginPath()
      ctx.moveTo(cx - 45, cy - 60)
      ctx.quadraticCurveTo(cx - 25, cy - 80, cx, cy - 60)
      ctx.quadraticCurveTo(cx + 25, cy - 80, cx + 45, cy - 60)
      ctx.stroke()
      break
    }
    case 'Nice': case 'Amalfi': {
      // Beach umbrella + waves
      ctx.beginPath()
      ctx.moveTo(cx, cy + 80)
      ctx.lineTo(cx, cy - 40)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(cx, cy - 40, 80, Math.PI, 0)
      ctx.stroke()
      // Umbrella ribs
      for (let a = -70; a <= 70; a += 35) {
        ctx.beginPath()
        ctx.moveTo(cx, cy - 40)
        ctx.lineTo(cx + a, cy - 40 - Math.sqrt(6400 - a * a))
        ctx.stroke()
      }
      // Waves
      for (let w = 0; w < 3; w++) {
        ctx.beginPath()
        const wy = cy + 100 + w * 25
        ctx.moveTo(cx - 200, wy)
        for (let x = cx - 200; x < cx + 200; x += 40) {
          ctx.quadraticCurveTo(x + 10, wy - 10, x + 20, wy)
          ctx.quadraticCurveTo(x + 30, wy + 10, x + 40, wy)
        }
        ctx.stroke()
      }
      break
    }
    case 'Brussels': {
      // Atomium (simplified)
      const r = 28
      // Center sphere
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke()
      // Top
      ctx.beginPath(); ctx.arc(cx, cy - 100, r, 0, Math.PI * 2); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy - 100 + r); ctx.stroke()
      // Bottom
      ctx.beginPath(); ctx.arc(cx, cy + 100, r, 0, Math.PI * 2); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx, cy + r); ctx.lineTo(cx, cy + 100 - r); ctx.stroke()
      // Left
      ctx.beginPath(); ctx.arc(cx - 80, cy + 50, r, 0, Math.PI * 2); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx - 80 + r, cy + 50); ctx.stroke()
      // Right
      ctx.beginPath(); ctx.arc(cx + 80, cy + 50, r, 0, Math.PI * 2); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx + r, cy); ctx.lineTo(cx + 80 - r, cy + 50); ctx.stroke()
      break
    }
    case 'Lyon': {
      // Fork and knife (food capital)
      // Fork
      ctx.beginPath()
      ctx.moveTo(cx - 40, cy - 100)
      ctx.lineTo(cx - 40, cy + 100)
      ctx.moveTo(cx - 55, cy - 100)
      ctx.lineTo(cx - 55, cy - 30)
      ctx.moveTo(cx - 25, cy - 100)
      ctx.lineTo(cx - 25, cy - 30)
      ctx.moveTo(cx - 55, cy - 30)
      ctx.quadraticCurveTo(cx - 40, cy - 15, cx - 25, cy - 30)
      ctx.stroke()
      // Knife
      ctx.beginPath()
      ctx.moveTo(cx + 40, cy - 100)
      ctx.lineTo(cx + 40, cy + 100)
      ctx.moveTo(cx + 40, cy - 100)
      ctx.quadraticCurveTo(cx + 70, cy - 50, cx + 40, cy)
      ctx.stroke()
      break
    }
    case 'Eze': {
      // Medieval hilltop village on a cliff
      const hillW = 300, hillH = 250
      // Hill/cliff shape
      ctx.beginPath()
      ctx.moveTo(cx - hillW / 2, cy + hillH / 3)
      ctx.quadraticCurveTo(cx - hillW / 4, cy - hillH / 3, cx, cy - hillH / 2)
      ctx.quadraticCurveTo(cx + hillW / 4, cy - hillH / 3, cx + hillW / 2, cy + hillH / 3)
      ctx.stroke()
      // Stone tower at top
      ctx.strokeRect(cx - 20, cy - hillH / 2 - 60, 40, 60)
      ctx.beginPath()
      ctx.moveTo(cx - 22, cy - hillH / 2 - 60)
      ctx.lineTo(cx, cy - hillH / 2 - 90)
      ctx.lineTo(cx + 22, cy - hillH / 2 - 60)
      ctx.stroke()
      // Tiny clustered buildings
      ctx.strokeRect(cx - 50, cy - hillH / 3, 28, 35)
      ctx.strokeRect(cx - 15, cy - hillH / 3 - 10, 24, 40)
      ctx.strokeRect(cx + 20, cy - hillH / 3 + 5, 30, 30)
      // Winding path down
      ctx.beginPath()
      ctx.moveTo(cx, cy - hillH / 3 + 35)
      ctx.quadraticCurveTo(cx - 30, cy, cx - 10, cy + 30)
      ctx.quadraticCurveTo(cx + 20, cy + 60, cx, cy + hillH / 3)
      ctx.stroke()
      break
    }
    case 'Monaco': {
      // Casino building with dome + race track
      const bw = 200, bh = 140
      // Building
      ctx.strokeRect(cx - bw / 2, cy - bh / 4, bw, bh / 2)
      // Dome
      ctx.beginPath()
      ctx.arc(cx, cy - bh / 4, bw / 4, Math.PI, 0)
      ctx.stroke()
      // Columns
      for (let i = 0; i < 5; i++) {
        const colX = cx - bw / 2 + 25 + i * 38
        ctx.beginPath()
        ctx.moveTo(colX, cy - bh / 4 + 10)
        ctx.lineTo(colX, cy + bh / 4 - 10)
        ctx.stroke()
      }
      // Grand entrance arch
      ctx.beginPath()
      ctx.arc(cx, cy + bh / 4, 25, Math.PI, 0)
      ctx.stroke()
      // Race track curves (dashed)
      ctx.setLineDash([12, 6])
      ctx.beginPath()
      ctx.moveTo(cx - 250, cy + bh / 2 + 40)
      ctx.quadraticCurveTo(cx - 100, cy + bh / 2, cx, cy + bh / 2 + 30)
      ctx.quadraticCurveTo(cx + 100, cy + bh / 2 + 60, cx + 250, cy + bh / 2 + 20)
      ctx.stroke()
      ctx.setLineDash([])
      break
    }
    case 'Geneva': {
      // Jet d'Eau fountain
      // Water base
      ctx.beginPath()
      ctx.ellipse(cx, cy + 60, 80, 20, 0, 0, Math.PI * 2)
      ctx.stroke()
      // Main jet
      ctx.lineWidth = 5
      ctx.beginPath()
      ctx.moveTo(cx, cy + 50)
      ctx.lineTo(cx, cy - 180)
      ctx.stroke()
      ctx.lineWidth = 3
      // Spray at top
      ctx.beginPath()
      ctx.moveTo(cx, cy - 180)
      ctx.quadraticCurveTo(cx - 15, cy - 200, cx - 25, cy - 170)
      ctx.moveTo(cx, cy - 180)
      ctx.quadraticCurveTo(cx + 15, cy - 200, cx + 25, cy - 170)
      ctx.stroke()
      // Falling water curves
      ctx.beginPath()
      ctx.moveTo(cx - 3, cy - 100)
      ctx.quadraticCurveTo(cx - 30, cy - 50, cx - 50, cy + 40)
      ctx.moveTo(cx + 3, cy - 100)
      ctx.quadraticCurveTo(cx + 30, cy - 50, cx + 50, cy + 40)
      ctx.stroke()
      // Lake waves
      for (let w = 0; w < 2; w++) {
        ctx.beginPath()
        const wy = cy + 85 + w * 20
        ctx.moveTo(cx - 200, wy)
        for (let x = cx - 200; x < cx + 200; x += 40) {
          ctx.quadraticCurveTo(x + 10, wy - 8, x + 20, wy)
          ctx.quadraticCurveTo(x + 30, wy + 8, x + 40, wy)
        }
        ctx.stroke()
      }
      break
    }
    case 'Antwerp': {
      // Cathedral spire + diamond
      // Tall Gothic spire
      ctx.strokeRect(cx - 30, cy - 60, 60, 180)
      ctx.beginPath()
      ctx.moveTo(cx - 35, cy - 60)
      ctx.lineTo(cx, cy - 200)
      ctx.lineTo(cx + 35, cy - 60)
      ctx.stroke()
      // Gothic windows
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.arc(cx, cy - 30 + i * 50, 12, Math.PI, 0)
        ctx.stroke()
      }
      // Cross on top
      ctx.beginPath()
      ctx.moveTo(cx, cy - 200)
      ctx.lineTo(cx, cy - 220)
      ctx.moveTo(cx - 10, cy - 210)
      ctx.lineTo(cx + 10, cy - 210)
      ctx.stroke()
      // Diamond shape to the right
      const dx = cx + 140, dy = cy - 20, dr = 50
      ctx.beginPath()
      ctx.moveTo(dx, dy - dr)
      ctx.lineTo(dx + dr * 0.8, dy)
      ctx.lineTo(dx, dy + dr * 0.6)
      ctx.lineTo(dx - dr * 0.8, dy)
      ctx.closePath()
      ctx.stroke()
      // Diamond facets
      ctx.beginPath()
      ctx.moveTo(dx - dr * 0.5, dy - dr * 0.3)
      ctx.lineTo(dx + dr * 0.5, dy - dr * 0.3)
      ctx.moveTo(dx - dr * 0.5, dy - dr * 0.3)
      ctx.lineTo(dx, dy + dr * 0.6)
      ctx.moveTo(dx + dr * 0.5, dy - dr * 0.3)
      ctx.lineTo(dx, dy + dr * 0.6)
      ctx.stroke()
      break
    }
    case 'Rotterdam': {
      // Erasmus Bridge (cable-stayed)
      const bridgeY = cy + 60
      // Bridge deck
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(cx - 250, bridgeY)
      ctx.lineTo(cx + 250, bridgeY)
      ctx.stroke()
      ctx.lineWidth = 3
      // Pylon (asymmetric)
      ctx.beginPath()
      ctx.moveTo(cx - 30, bridgeY)
      ctx.lineTo(cx, cy - 150)
      ctx.lineTo(cx + 20, bridgeY)
      ctx.stroke()
      // Cables from pylon
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath()
        ctx.moveTo(cx, cy - 150 + i * 10)
        ctx.lineTo(cx - 50 - i * 35, bridgeY)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(cx, cy - 150 + i * 10)
        ctx.lineTo(cx + 40 + i * 35, bridgeY)
        ctx.stroke()
      }
      // Cube houses on the right
      ctx.save()
      ctx.translate(cx + 180, cy - 10)
      ctx.rotate(Math.PI / 4)
      ctx.strokeRect(-18, -18, 36, 36)
      ctx.restore()
      ctx.save()
      ctx.translate(cx + 220, cy - 5)
      ctx.rotate(Math.PI / 4)
      ctx.strokeRect(-15, -15, 30, 30)
      ctx.restore()
      break
    }
    case 'Hamburg': {
      // Elbphilharmonie
      const bw2 = 240, bh2 = 120
      // Base warehouse block
      ctx.strokeRect(cx - bw2 / 2, cy, bw2, bh2 / 2)
      // Glass building on top
      ctx.strokeRect(cx - bw2 / 2, cy - bh2 / 2, bw2, bh2 / 2)
      // Wave roof
      ctx.beginPath()
      ctx.moveTo(cx - bw2 / 2, cy - bh2 / 2)
      ctx.quadraticCurveTo(cx - bw2 / 4, cy - bh2, cx, cy - bh2 * 0.7)
      ctx.quadraticCurveTo(cx + bw2 / 4, cy - bh2 * 0.5, cx + bw2 / 2, cy - bh2 * 0.85)
      ctx.stroke()
      // Window grid
      for (let gy = cy - bh2 / 2 + 15; gy < cy; gy += 18) {
        ctx.beginPath()
        ctx.moveTo(cx - bw2 / 2 + 10, gy)
        ctx.lineTo(cx + bw2 / 2 - 10, gy)
        ctx.stroke()
      }
      // Warehouse arches
      for (let i = 0; i < 5; i++) {
        const ax = cx - bw2 / 2 + 30 + i * 46
        ctx.beginPath()
        ctx.arc(ax, cy + bh2 / 2, 16, Math.PI, 0)
        ctx.stroke()
      }
      break
    }
    case 'Chicago': {
      // Chicago skyline — Willis/Sears Tower + buildings + Bean
      // Willis Tower (tall center)
      const towerW = 50, towerH = 320
      ctx.strokeRect(cx - towerW / 2, cy - towerH / 2, towerW, towerH)
      // Twin antennas
      ctx.beginPath()
      ctx.moveTo(cx - 12, cy - towerH / 2)
      ctx.lineTo(cx - 12, cy - towerH / 2 - 60)
      ctx.moveTo(cx + 12, cy - towerH / 2)
      ctx.lineTo(cx + 12, cy - towerH / 2 - 60)
      ctx.stroke()
      // Setbacks on tower
      ctx.strokeRect(cx - towerW / 2 - 8, cy - towerH / 2 + 80, towerW + 16, towerH - 80)
      ctx.strokeRect(cx - towerW / 2 - 16, cy - towerH / 2 + 160, towerW + 32, towerH - 160)
      // Neighboring buildings (left)
      ctx.strokeRect(cx - 110, cy + towerH / 2 - 180, 45, 180)
      ctx.strokeRect(cx - 155, cy + towerH / 2 - 130, 40, 130)
      // Neighboring buildings (right)
      ctx.strokeRect(cx + 60, cy + towerH / 2 - 200, 50, 200)
      ctx.strokeRect(cx + 115, cy + towerH / 2 - 140, 35, 140)
      // Windows on tower
      for (let wy = cy - towerH / 2 + 20; wy < cy + towerH / 2 - 20; wy += 30) {
        ctx.beginPath()
        ctx.moveTo(cx - towerW / 2 + 8, wy)
        ctx.lineTo(cx + towerW / 2 - 8, wy)
        ctx.stroke()
      }
      // The Bean (Cloud Gate) in front
      const beanY = cy + towerH / 2 + 30
      ctx.beginPath()
      ctx.moveTo(cx - 60, beanY + 20)
      ctx.quadraticCurveTo(cx - 65, beanY - 25, cx, beanY - 30)
      ctx.quadraticCurveTo(cx + 65, beanY - 25, cx + 60, beanY + 20)
      ctx.quadraticCurveTo(cx + 30, beanY + 10, cx, beanY + 15)
      ctx.quadraticCurveTo(cx - 30, beanY + 10, cx - 60, beanY + 20)
      ctx.stroke()
      break
    }
    default: {
      // Generic compass rose
      const r2 = 80
      ctx.beginPath()
      ctx.arc(cx, cy, r2, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(cx, cy - r2 - 15); ctx.lineTo(cx, cy + r2 + 15)
      ctx.moveTo(cx - r2 - 15, cy); ctx.lineTo(cx + r2 + 15, cy)
      ctx.stroke()
      // N arrow
      ctx.font = '36px "DM Mono", monospace'
      ctx.textAlign = 'center'
      ctx.fillText('N', cx, cy - r2 - 25)
    }
  }
  ctx.restore()
}

// Draw postmark stamp (circular, top-right area)
function drawPostmark(ctx, city, dateStr) {
  const cx = CANVAS_W - 200
  const cy = 190
  const r = 120

  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(12 * Math.PI / 180)
  ctx.globalAlpha = 0.6
  ctx.strokeStyle = '#6b2020'
  ctx.fillStyle = '#6b2020'

  // Double circle
  ctx.lineWidth = 4
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke()
  ctx.lineWidth = 3
  ctx.beginPath(); ctx.arc(0, 0, r - 14, 0, Math.PI * 2); ctx.stroke()

  // City name
  ctx.font = '700 32px "DM Mono", monospace'
  ctx.textAlign = 'center'
  ctx.fillText(city.toUpperCase(), 0, -25)

  // Date
  ctx.font = '26px "DM Mono", monospace'
  ctx.fillText(dateStr, 0, 12)

  // Horizontal lines through circle (cancellation lines)
  ctx.lineWidth = 3
  for (let i = -1; i <= 1; i++) {
    const ly = 45 + i * 16
    ctx.beginPath()
    ctx.moveTo(-r - 40, ly)
    ctx.lineTo(r + 40, ly)
    ctx.stroke()
  }

  ctx.restore()
}

// Draw postage stamp (top-right corner)
function drawPostageStamp(ctx, city) {
  const sx = 55
  const sy = 50
  const sw = 200
  const sh = 240

  ctx.save()
  ctx.translate(sx + sw / 2, sy + sh / 2)
  ctx.rotate(3 * Math.PI / 180)
  ctx.translate(-(sx + sw / 2), -(sy + sh / 2))

  // Perforated edge (zigzag)
  ctx.fillStyle = '#ffffff'
  ctx.shadowColor = 'rgba(0,0,0,0.12)'
  ctx.shadowBlur = 12
  ctx.shadowOffsetY = 4
  ctx.beginPath()
  const perfR = 7
  const perfStep = perfR * 2.2
  // Top edge
  for (let x = sx; x < sx + sw; x += perfStep) {
    ctx.arc(x + perfStep / 2, sy, perfR, 0, Math.PI * 2)
  }
  // Bottom edge
  for (let x = sx; x < sx + sw; x += perfStep) {
    ctx.arc(x + perfStep / 2, sy + sh, perfR, 0, Math.PI * 2)
  }
  // Left edge
  for (let y = sy; y < sy + sh; y += perfStep) {
    ctx.arc(sx, y + perfStep / 2, perfR, 0, Math.PI * 2)
  }
  // Right edge
  for (let y = sy; y < sy + sh; y += perfStep) {
    ctx.arc(sx + sw, y + perfStep / 2, perfR, 0, Math.PI * 2)
  }
  ctx.fill()

  // Stamp background
  ctx.shadowColor = 'transparent'
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(sx + 8, sy + 8, sw - 16, sh - 16)

  const innerPad = 18

  // Flag in stamp
  const stampCenterX = sx + sw / 2
  const flagX = sx + innerPad
  const flagY = sy + innerPad
  const flagW = sw - innerPad * 2
  const flagH = sh - innerPad * 2 - 40
  drawFlag(ctx, city, flagX, flagY, flagW, flagH)

  // Stamp denomination
  ctx.fillStyle = '#8a4a2a'
  ctx.font = '700 28px "DM Mono", monospace'
  ctx.textAlign = 'center'
  ctx.fillText('EUROPE 2026', stampCenterX, sy + sh - 28)

  ctx.restore()
}

// ─── Postcard Generator ────────────────────────────────────

function PostcardGenerator({ city, country, dateRange, photos, onClose }) {
  const canvasRef = useRef(null)
  const [caption, setCaption] = useState('')
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState(null)
  const [loadedImg, setLoadedImg] = useState(null)
  const [generated, setGenerated] = useState(false)
  const [blobUrl, setBlobUrl] = useState(null)

  // Load selected photo as Image object
  useEffect(() => {
    if (!selectedPhotoUrl) { setLoadedImg(null); return }
    const img = new Image()
    img.onload = () => setLoadedImg(img)
    img.src = selectedPhotoUrl
  }, [selectedPhotoUrl])

  // Get city arrival date for the postmark
  const cityInfo = CITIES.find((c) => c.name === city)
  const today = new Date()
  const postmarkDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()

  const drawPostcard = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas buffer to match CSS size * devicePixelRatio for 1:1 pixel mapping
    const dpr = window.devicePixelRatio || 1
    canvas.width = DISPLAY_W * dpr
    canvas.height = DISPLAY_H * dpr

    const ctx = canvas.getContext('2d')
    // Scale so we can draw in logical CANVAS_W x CANVAS_H coordinates
    const scale = (DISPLAY_W * dpr) / CANVAS_W
    ctx.setTransform(scale, 0, 0, scale, 0, 0)

    const hasPhoto = !!loadedImg

    // ─── Background: warm vintage paper ───
    const paperGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_H)
    paperGrad.addColorStop(0, '#faf6f0')
    paperGrad.addColorStop(0.5, '#f5efe6')
    paperGrad.addColorStop(1, '#ede5d8')
    ctx.fillStyle = paperGrad
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    // Subtle paper noise (small dots)
    ctx.globalAlpha = 0.03
    for (let i = 0; i < 800; i++) {
      const nx = Math.random() * CANVAS_W
      const ny = Math.random() * CANVAS_H
      ctx.fillStyle = Math.random() > 0.5 ? '#8a7a60' : '#c0b090'
      ctx.fillRect(nx, ny, 2, 2)
    }
    ctx.globalAlpha = 1

    // ─── City landmark watermark (behind everything) ───
    // Landmark peeking up from the bottom
    drawCityLandmark(ctx, city, CANVAS_W, CANVAS_H)

    // ─── Postage stamp (top-right) ───
    drawPostageStamp(ctx, city)

    // ─── Postmark stamp (overlapping postage, top-right) ───
    drawPostmark(ctx, city, postmarkDate)

    // ─── Decorative border ───
    const borderInset = 36
    ctx.strokeStyle = 'rgba(26,106,88,0.2)'
    ctx.lineWidth = 2
    ctx.setLineDash([])
    ctx.strokeRect(borderInset, borderInset, CANVAS_W - borderInset * 2, CANVAS_H - borderInset * 2)

    // ─── Angled "Greetings from" text ───
    const greetingsY = hasPhoto ? CANVAS_H * 0.14 : CANVAS_H * 0.24
    ctx.save()
    ctx.translate(CANVAS_W / 2, greetingsY)
    ctx.rotate(-6 * Math.PI / 180)
    ctx.fillStyle = '#1a6a58'
    ctx.font = 'italic 68px "Cormorant Garamond", Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText('Greetings from', 0, 0)
    ctx.restore()

    // ─── City name (large, slight angle) ───
    const cityFontSize = city.length > 9 ? 130 : 160
    ctx.save()
    ctx.translate(CANVAS_W / 2, greetingsY + 150)
    ctx.rotate(-3 * Math.PI / 180)
    ctx.fillStyle = '#0f2520'
    ctx.font = `italic 700 ${cityFontSize}px "Playfair Display", Georgia, serif`
    ctx.textAlign = 'center'
    ctx.fillText(city, 0, 0)
    ctx.restore()

    // ─── Decorative swoosh under city name ───
    const swooshY = greetingsY + 195
    ctx.strokeStyle = '#1a6a58'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(CANVAS_W / 2 - 100, swooshY)
    ctx.quadraticCurveTo(CANVAS_W / 2, swooshY + 12, CANVAS_W / 2 + 100, swooshY)
    ctx.stroke()


    // ─── Photo (if selected) ───
    if (hasPhoto) {
      const photoW = 700
      const photoH = 480
      const photoX = (CANVAS_W - photoW) / 2
      const photoY = swooshY + 100
      const radius = 16

      // White photo border (like a polaroid edge)
      const border = 12
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = 'rgba(0,0,0,0.15)'
      ctx.shadowBlur = 20
      ctx.shadowOffsetY = 6
      roundedRect(ctx, photoX - border, photoY - border, photoW + border * 2, photoH + border * 2, radius + 4)
      ctx.fill()
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetY = 0

      // Clip and draw photo
      ctx.save()
      roundedRect(ctx, photoX, photoY, photoW, photoH, radius)
      ctx.clip()
      const imgAspect = loadedImg.width / loadedImg.height
      const areaAspect = photoW / photoH
      let sx, sy, sw, sh
      if (imgAspect > areaAspect) {
        sh = loadedImg.height
        sw = sh * areaAspect
        sx = (loadedImg.width - sw) / 2
        sy = 0
      } else {
        sw = loadedImg.width
        sh = sw / areaAspect
        sx = 0
        sy = (loadedImg.height - sh) / 2
      }
      ctx.drawImage(loadedImg, sx, sy, sw, sh, photoX, photoY, photoW, photoH)
      ctx.restore()
    }

    // ─── Caption ───
    if (caption.trim()) {
      ctx.fillStyle = '#0f2520'
      ctx.font = 'italic 60px "Cormorant Garamond", Georgia, serif'
      ctx.textAlign = 'center'

      const words = caption.trim().split(' ')
      const maxWidth = CANVAS_W - 180
      const lines = []
      let currentLine = ''
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        if (ctx.measureText(testLine).width > maxWidth) {
          lines.push(currentLine)
          currentLine = word
        } else {
          currentLine = testLine
        }
      }
      if (currentLine) lines.push(currentLine)

      const captionStartY = hasPhoto ? CANVAS_H * 0.82 : CANVAS_H * 0.62
      for (let i = 0; i < Math.min(lines.length, 3); i++) {
        ctx.fillText(lines[i], CANVAS_W / 2, captionStartY + i * 76)
      }
    }

    // ─── Footer ───
    ctx.fillStyle = '#4a7068'
    ctx.font = '32px "DM Mono", monospace'
    ctx.textAlign = 'center'
    ctx.fillText("Devin's Daybook \u00b7 Europe 2026", CANVAS_W / 2, CANVAS_H - 60)
  }, [city, country, dateRange, caption, loadedImg])

  useEffect(() => {
    drawPostcard()
  }, [drawPostcard])

  // Render at full resolution to an offscreen canvas for export
  const exportToBlob = (callback) => {
    const offscreen = document.createElement('canvas')
    offscreen.width = CANVAS_W * 2
    offscreen.height = CANVAS_H * 2
    const offCtx = offscreen.getContext('2d')
    // Temporarily swap canvasRef to the offscreen canvas, draw, then swap back
    const realCanvas = canvasRef.current
    canvasRef.current = offscreen
    drawPostcard()
    canvasRef.current = realCanvas
    // Re-draw preview
    drawPostcard()
    offscreen.toBlob(callback, 'image/png')
  }

  const handleGenerate = () => {
    exportToBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      setBlobUrl(url)
      setGenerated(true)
    })
  }

  const handleShare = async () => {
    exportToBlob(async (blob) => {
      if (!blob) return
      const file = new File([blob], `postcard-${city.toLowerCase()}.png`, { type: 'image/png' })
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `Postcard from ${city}` })
      }
    })
  }

  const canShare = typeof navigator !== 'undefined' && !!navigator.share

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(15,37,32,0.95)',
        display: 'flex', flexDirection: 'column',
        overflow: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', flexShrink: 0,
        }}
      >
        <button
          onClick={onClose}
          style={{
            padding: '8px 14px', borderRadius: '10px',
            fontFamily: 'var(--font-mono)', fontSize: '13px',
            color: 'var(--teal-muted)', background: 'none',
            border: '1px solid rgba(77,196,168,0.3)', cursor: 'pointer',
          }}
        >
          Close
        </button>
        <h2
          style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontWeight: 600, fontSize: '17px', color: '#fff', margin: 0,
          }}
        >
          Postcard
        </h2>
        <div style={{ width: '65px' }} />
      </div>

      {/* Canvas preview */}
      <div style={{ padding: '0 24px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <canvas
          ref={canvasRef}
          style={{
            width: `${DISPLAY_W}px`,
            height: `${DISPLAY_H}px`,
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        />

        {/* Caption input */}
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption..."
          maxLength={100}
          style={{
            width: '100%',
            maxWidth: '340px',
            marginTop: '16px',
            padding: '12px 14px',
            borderRadius: '10px',
            fontFamily: 'var(--font-body)',
            fontStyle: 'italic',
            fontSize: '16px',
            color: '#fff',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(77,196,168,0.3)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />

        {/* Photo picker */}
        <div style={{ width: '100%', maxWidth: '340px', marginTop: '16px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px' }}>
            Add a photo
          </p>
          {photos && photos.length > 0 ? (
            <div
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '4px',
                scrollbarWidth: 'none',
              }}
            >
              {photos.map((photo) => {
                const isSelected = selectedPhotoUrl === photo.url
                return (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedPhotoUrl(isSelected ? null : photo.url)}
                    style={{
                      width: '60px',
                      height: '60px',
                      flexShrink: 0,
                      borderRadius: '10px',
                      overflow: 'hidden',
                      padding: 0,
                      border: isSelected ? '2px solid var(--teal-bright)' : '2px solid transparent',
                      cursor: 'pointer',
                      opacity: isSelected ? 1 : 0.6,
                      background: 'transparent',
                    }}
                  >
                    <img
                      src={photo.url}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </button>
                )
              })}
            </div>
          ) : (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', margin: 0 }}>
              No photos in this city's entries yet
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px', width: '100%', maxWidth: '340px' }}>
          {!generated ? (
            <button
              onClick={handleGenerate}
              style={{
                flex: 1, padding: '14px',
                borderRadius: '12px', fontFamily: 'var(--font-mono)',
                fontSize: '14px', fontWeight: 600,
                color: '#fff', background: 'var(--teal-primary)',
                border: 'none', cursor: 'pointer',
              }}
            >
              Generate Image
            </button>
          ) : (
            <>
              {canShare && (
                <button
                  onClick={handleShare}
                  style={{
                    flex: 1, padding: '14px',
                    borderRadius: '12px', fontFamily: 'var(--font-mono)',
                    fontSize: '14px', fontWeight: 600,
                    color: '#fff', background: 'var(--teal-primary)',
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  Share
                </button>
              )}
              {blobUrl && (
                <a
                  href={blobUrl}
                  download={`postcard-${city.toLowerCase()}.png`}
                  style={{
                    flex: 1, padding: '14px',
                    borderRadius: '12px', fontFamily: 'var(--font-mono)',
                    fontSize: '14px', fontWeight: 600, textAlign: 'center',
                    color: 'var(--teal-bright)',
                    background: 'rgba(77,196,168,0.15)',
                    border: '1px solid rgba(77,196,168,0.3)',
                    textDecoration: 'none',
                  }}
                >
                  Save Image
                </a>
              )}
            </>
          )}
        </div>

        {/* Spacer for bottom */}
        <div style={{ height: '32px' }} />
      </div>
    </motion.div>
  )
}
