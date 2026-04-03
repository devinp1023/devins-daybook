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
        className="flex items-center justify-center min-h-screen"
        style={{ color: 'var(--text-secondary)', background: 'var(--bg-page)' }}
      >
        <div className="text-center">
          <p className="text-lg italic" style={{ fontFamily: 'var(--font-display)' }}>
            Entry not found
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-sm underline"
            style={{ color: 'var(--teal-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
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
      className="min-h-screen"
      style={{ background: 'var(--bg-page)' }}
    >
      {/* Header with city illustration */}
      <div
        className="relative h-56 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, var(--bg-header) 0%, var(--teal-dark) 100%)`,
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
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(26,58,53,0.8) 0%, transparent 60%)',
          }}
        />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center z-10 active:scale-90 transition-transform"
          style={{
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(4px)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          &larr;
        </button>

        {/* Edit button */}
        <Link
          to={`/edit/${entry.id}`}
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center z-10 active:scale-90 transition-transform no-underline"
          style={{
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(4px)',
            color: '#fff',
            fontSize: '16px',
          }}
        >
          &#9998;
        </Link>

        {/* Metadata on header */}
        <div className="absolute bottom-4 left-5 right-5 z-10">
          <div
            className="inline-block px-2.5 py-1 rounded text-[10px] uppercase tracking-wider mb-2"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--teal-bright)',
              border: '1px solid rgba(77,196,168,0.3)',
              background: 'rgba(26,58,53,0.6)',
              backdropFilter: 'blur(4px)',
            }}
          >
            {entry.city}, {entry.country}
          </div>
          <p
            className="text-xs"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--teal-muted)' }}
          >
            Day {dayNum} &middot; {formatDate(entry.date)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 pb-12">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="text-2xl font-semibold italic mb-8 leading-snug"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          {entry.title}
        </motion.h1>

        {/* Sections */}
        {filledSections.map(([key, section], i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
            className="mb-8"
          >
            {/* Section heading */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm">{SECTION_ICONS[key]}</span>
              <h2
                className="text-xs uppercase tracking-widest"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--teal-primary)',
                  letterSpacing: '1.5px',
                }}
              >
                {SECTION_LABELS[key]}
              </h2>
            </div>

            {/* Section divider */}
            <div
              className="w-8 h-px mb-4"
              style={{ background: 'var(--border-card)' }}
            />

            {/* Section text */}
            {section.text && (
              <p
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--text-primary)',
                  fontSize: '18px',
                  lineHeight: 1.8,
                }}
              >
                {section.text}
              </p>
            )}

            {/* Photo grid */}
            {section.photoIds.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
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
                    className="aspect-square rounded-lg overflow-hidden border-0 p-0 cursor-pointer"
                    style={{ background: 'var(--border-card)' }}
                  >
                    {photoUrls[photoId] ? (
                      <img
                        src={photoUrls[photoId]}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span
                          className="text-xs"
                          style={{ color: 'var(--text-meta)', fontFamily: 'var(--font-mono)' }}
                        >
                          ...
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

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
