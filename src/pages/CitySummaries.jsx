import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { differenceInDays, parseISO } from 'date-fns'
import { getAllEntries, getEntriesByCity } from '../data/entries'
import { getPhoto, createObjectURL } from '../data/photos'
import { CITIES, COUNTRY_NAMES } from '../data/tripConstants'
import { formatDateShort } from '../data/tripHelpers'
import CityIllustration from '../components/CityIllustration'
import { drawLandmarkOnCanvas } from '../data/cityLandmarks'
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
          padding: 'calc(14px + env(safe-area-inset-top, 0px)) 16px 14px',
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-card)',
        }}
      >
        <button
          onClick={onMenuOpen}
          aria-label="Open menu"
          style={{
            width: '44px',
            height: '44px',
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

// Draw city landmark as a large watermark (uses shared landmark data)
function drawCityLandmark(ctx, city, cw, ch) {
  // Position: landmark fills bottom portion of postcard as watermark
  const targetW = cw * 0.8
  const targetH = targetW * (160 / 400) // preserve 400:160 aspect ratio
  const targetX = (cw - targetW) / 2
  const targetY = ch - targetH - ch * 0.02
  ctx.save()
  ctx.globalAlpha = 0.15
  drawLandmarkOnCanvas(ctx, city, targetX, targetY, targetW, targetH)
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
