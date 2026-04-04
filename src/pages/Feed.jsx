import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getAllEntries } from '../data/entries'
import { getDayNumber, formatDate, getBannerMessage } from '../data/tripHelpers'
import CityIllustration from '../components/CityIllustration'

const SECTION_ICONS = {
  activities: '\u{1F3AF}',
  food: '\u{1F37D}\uFE0F',
  people: '\u{1F465}',
  other: '\u{1F4DD}',
}

const SECTION_LABELS = {
  activities: 'Activities',
  food: 'Food & Drinks',
  people: 'People I Met',
  other: 'Other Notes',
}

function getPreviewText(entry) {
  for (const key of ['activities', 'food', 'people', 'other']) {
    if (entry.sections[key]?.text) {
      const text = entry.sections[key].text
      return text.length > 100 ? text.slice(0, 100) + '\u2026' : text
    }
  }
  return ''
}

function getFilledSections(entry) {
  return Object.entries(entry.sections)
    .filter(([, val]) => val.text || val.photoIds.length > 0)
    .map(([key]) => key)
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

export default function Feed({ onMenuOpen }) {
  const [entries, setEntries] = useState([])
  const [cityFilter, setCityFilter] = useState(null)
  const banner = getBannerMessage()

  useEffect(() => {
    setEntries(getAllEntries())
  }, [])

  const citiesInOrder = []
  const citySet = new Set()
  for (const e of entries) {
    if (!citySet.has(e.city)) {
      citySet.add(e.city)
      citiesInOrder.push(e.city)
    }
  }

  const filtered = cityFilter
    ? entries.filter((e) => e.city === cityFilter)
    : entries

  const sorted = [...filtered].sort((a, b) => b.createdAt - a.createdAt)

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-page)' }}>
      {/* Trip banner */}
      {banner && (
        <div
          style={{
            padding: '10px 16px',
            textAlign: 'center',
            background: 'var(--bg-header)',
            color: 'var(--teal-bright)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            letterSpacing: '0.5px',
          }}
        >
          {banner}
        </div>
      )}

      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: 'calc(14px + var(--sat, 0px)) 16px 14px',
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-card)',
        }}
      >
        {/* Hamburger */}
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

        {/* Title */}
        <div style={{ flex: 1, minWidth: 0 }}>
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
            Devin's Daybook
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-meta)',
              margin: '2px 0 0',
            }}
          >
            {new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* New Entry button */}
        <Link
          to="/new"
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: 'var(--font-mono)',
            background: 'var(--teal-primary)',
            color: '#fff',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          + New Entry
        </Link>
      </div>

      {/* City filter pills */}
      {citiesInOrder.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '12px 16px',
            overflowX: 'auto',
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-card)',
            scrollbarWidth: 'none',
          }}
        >
          {['All', ...citiesInOrder].map((label) => {
            const isActive = label === 'All' ? !cityFilter : cityFilter === label
            return (
              <button
                key={label}
                onClick={() => setCityFilter(label === 'All' ? null : label)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  whiteSpace: 'nowrap',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--teal-primary)' : 'var(--border-tag)',
                  background: isActive ? 'var(--teal-primary)' : 'var(--bg-tag)',
                  color: isActive ? '#fff' : 'var(--teal-primary)',
                  cursor: 'pointer',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}

      {/* Entry cards */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sorted.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '20px', marginBottom: '8px' }}>
              No entries yet
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px' }}>
              Tap "+ New Entry" to start writing
            </p>
          </div>
        )}

        {sorted.map((entry, i) => {
          const dayNum = getDayNumber(entry.date)
          const preview = getPreviewText(entry)
          const filled = getFilledSections(entry)

          return (
            <motion.div
              key={entry.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Link
                to={`/entry/${entry.id}`}
                style={{
                  display: 'block',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  boxShadow: '0 2px 8px rgba(15,37,32,0.06), 0 1px 2px rgba(15,37,32,0.04)',
                }}
              >
                {/* Card header with city illustration */}
                <div
                  style={{
                    position: 'relative',
                    height: '120px',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #1a3a35 0%, #2a5a50 50%, #1a3a35 100%)',
                  }}
                >
                  <CityIllustration
                    city={entry.city}
                    className=""
                    style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      width: '100%', height: '100%',
                      opacity: 0.9,
                    }}
                  />
                  {/* Location stamp */}
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
                    }}
                  >
                    {entry.city}, {entry.country}
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: '14px 16px 16px' }}>
                  {/* Metadata row */}
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--text-meta)',
                      marginBottom: '6px',
                      letterSpacing: '0.3px',
                    }}
                  >
                    {entry.city} &middot; Day {dayNum} &middot; {formatDate(entry.date)}
                  </p>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontStyle: 'italic',
                      fontWeight: 500,
                      fontSize: '18px',
                      lineHeight: 1.3,
                      color: 'var(--text-primary)',
                      margin: '0 0 8px',
                    }}
                  >
                    {entry.title}
                  </h3>

                  {/* Preview text */}
                  {preview && (
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        lineHeight: 1.6,
                        color: 'var(--text-secondary)',
                        margin: '0 0 12px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {preview}
                    </p>
                  )}

                  {/* Section pills */}
                  {filled.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {filled.map((key) => (
                        <span
                          key={key}
                          title={SECTION_LABELS[key]}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            background: 'var(--bg-tag)',
                            border: '1px solid var(--border-tag)',
                          }}
                        >
                          {SECTION_ICONS[key]}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
