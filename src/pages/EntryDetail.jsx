import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getEntry } from '../data/entries'
import { getPhoto, createObjectURL } from '../data/photos'
import { getDayNumber, formatDate } from '../data/tripHelpers'
import CityIllustration from '../components/CityIllustration'
import Lightbox from '../components/Lightbox'

const SECTION_LABELS = {
  activities: 'Activities',
  food: 'Food & Drinks',
  people: 'People I Met',
  other: 'Other Notes',
}

const SECTION_ICONS = {
  activities: '\u{1F3AF}',
  food: '\u{1F37D}\uFE0F',
  people: '\u{1F465}',
  other: '\u{1F4DD}',
}

export default function EntryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const entry = getEntry(id)
  const [photoUrls, setPhotoUrls] = useState({})
  const [lightbox, setLightbox] = useState({ isOpen: false, url: '', caption: '' })

  useEffect(() => {
    if (!entry) return
    let cancelled = false
    async function loadPhotos() {
      const urls = {}
      for (const [, section] of Object.entries(entry.sections)) {
        for (const photoId of section.photoIds) {
          const photo = await getPhoto(photoId)
          if (photo && !cancelled) {
            urls[photoId] = createObjectURL(photo.blob)
          }
        }
      }
      if (!cancelled) setPhotoUrls(urls)
    }
    loadPhotos()
    return () => { cancelled = true }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!entry) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100dvh',
          color: 'var(--text-secondary)',
          background: 'var(--bg-page)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '20px' }}>
            Entry not found
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              marginTop: '16px',
              fontSize: '14px',
              textDecoration: 'underline',
              color: 'var(--teal-primary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Back to feed
          </button>
        </div>
      </div>
    )
  }

  const dayNum = getDayNumber(entry.date)
  const filledSections = Object.entries(entry.sections).filter(
    ([, val]) => val.text || val.photoIds.length > 0
  )

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{ minHeight: '100dvh', background: 'var(--bg-page)' }}
    >
      {/* Header with city illustration */}
      <div
        style={{
          position: 'relative',
          height: '220px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--bg-header) 0%, var(--teal-dark) 100%)',
        }}
      >
        <CityIllustration
          city={entry.city}
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            width: '100%', height: '100%',
            opacity: 0.8,
          }}
        />

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(26,58,53,0.85) 0%, rgba(26,58,53,0.2) 50%, transparent 100%)',
          }}
        />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          &larr;
        </button>

        {/* Edit button */}
        <Link
          to={`/edit/${entry.id}`}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            textDecoration: 'none',
            fontSize: '16px',
          }}
        >
          &#9998;
        </Link>

        {/* Metadata on header */}
        <div style={{ position: 'absolute', bottom: '18px', left: '20px', right: '20px', zIndex: 10 }}>
          <div
            style={{
              display: 'inline-block',
              padding: '5px 12px',
              borderRadius: '8px',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              color: 'var(--teal-bright)',
              border: '1px solid rgba(77,196,168,0.3)',
              background: 'rgba(26,58,53,0.6)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              marginBottom: '8px',
            }}
          >
            {entry.city}, {entry.country}
          </div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--teal-muted)',
              margin: 0,
            }}
          >
            Day {dayNum} &middot; {formatDate(entry.date)}
          </p>
        </div>
      </div>

      {/* Content card */}
      <div style={{ padding: '16px 16px 0', position: 'relative', zIndex: 5 }}>
        <div
          style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-card)',
            boxShadow: '0 2px 12px rgba(15,37,32,0.08), 0 1px 3px rgba(15,37,32,0.04)',
            overflow: 'hidden',
          }}
        >
          {/* Title area */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            style={{ padding: '22px 20px 18px' }}
          >
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: '24px',
                lineHeight: 1.35,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              {entry.title}
            </h1>

            {/* Section icon pills row */}
            {filledSections.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', marginTop: '14px' }}>
                {filledSections.map(([key]) => (
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
          </motion.div>

          {/* Sections */}
          {filledSections.map(([key, section], i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
            >
              {/* Section divider */}
              <div
                style={{
                  height: '1px',
                  background: 'var(--border-card)',
                  margin: '0 20px',
                }}
              />

              <div style={{ padding: '18px 20px' }}>
                {/* Section heading */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span
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
                      flexShrink: 0,
                    }}
                  >
                    {SECTION_ICONS[key]}
                  </span>
                  <h2
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      color: 'var(--teal-primary)',
                      margin: 0,
                    }}
                  >
                    {SECTION_LABELS[key]}
                  </h2>
                </div>

                {/* Section text */}
                {section.text && (
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--text-primary)',
                      fontSize: '18px',
                      lineHeight: 1.8,
                      margin: 0,
                    }}
                  >
                    {section.text}
                  </p>
                )}

                {/* Photo grid */}
                {section.photoIds.length > 0 && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: section.photoIds.length === 1 ? '1fr' : section.photoIds.length === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
                      gap: '8px',
                      marginTop: section.text ? '14px' : '0',
                    }}
                  >
                    {section.photoIds.map((photoId) => (
                      <button
                        key={photoId}
                        onClick={() =>
                          setLightbox({
                            isOpen: true,
                            url: photoUrls[photoId] || '',
                            caption: `${entry.title} \u2022 ${SECTION_LABELS[key]}`,
                          })
                        }
                        style={{
                          aspectRatio: section.photoIds.length === 1 ? '16/10' : '1',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: '1px solid var(--border-card)',
                          padding: 0,
                          cursor: 'pointer',
                          background: 'var(--bg-tag)',
                          display: 'block',
                          width: '100%',
                        }}
                      >
                        {photoUrls[photoId] ? (
                          <img
                            src={photoUrls[photoId]}
                            alt=""
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '12px',
                                color: 'var(--text-meta)',
                                fontFamily: 'var(--font-mono)',
                              }}
                            >
                              ...
                            </span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom spacing */}
      <div style={{ height: '40px' }} />

      {/* Lightbox */}
      <Lightbox
        isOpen={lightbox.isOpen}
        onClose={() => setLightbox({ isOpen: false, url: '', caption: '' })}
        photoUrl={lightbox.url}
        caption={lightbox.caption}
      />
    </motion.div>
  )
}
