import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getAllEntries } from '../data/entries'
import { getAllPhotos, createObjectURL } from '../data/photos'
import { formatDateShort } from '../data/tripHelpers'
import Lightbox from '../components/Lightbox'

const SECTION_LABELS = {
  activities: 'Activities',
  food: 'Food & Drinks',
  people: 'People I Met',
  other: 'Other Notes',
}

export default function PhotoRoll({ onMenuOpen }) {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState({ isOpen: false, url: '', caption: '' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      const allPhotos = await getAllPhotos()
      if (cancelled) return

      const entries = getAllEntries()
      const entryMap = {}
      for (const entry of entries) {
        entryMap[entry.id] = entry
      }

      // Build photo list with metadata
      const photoList = []
      for (const photo of allPhotos) {
        const entry = entryMap[photo.entryId]
        if (!entry) continue

        // Find which section this photo belongs to
        let sectionKey = null
        for (const [key, section] of Object.entries(entry.sections)) {
          if (section.photoIds.includes(photo.id)) {
            sectionKey = key
            break
          }
        }

        const url = createObjectURL(photo.blob)
        photoList.push({
          id: photo.id,
          url,
          entryId: entry.id,
          entryTitle: entry.title,
          entryDate: entry.date,
          city: entry.city,
          sectionLabel: sectionKey ? SECTION_LABELS[sectionKey] : '',
          createdAt: photo.createdAt,
        })
      }

      // Sort chronologically (newest first)
      photoList.sort((a, b) => b.createdAt - a.createdAt)

      if (!cancelled) {
        setPhotos(photoList)
        setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-page)' }}>
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
            Photo Roll
          </h1>
          {!loading && (
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-meta)',
                margin: '2px 0 0',
              }}
            >
              {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 20px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--text-meta)',
            }}
          >
            Loading photos...
          </p>
        </div>
      ) : photos.length === 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 20px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '20px',
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}
          >
            No photos yet
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: 'var(--text-secondary)',
            }}
          >
            Photos you add to entries will appear here
          </p>
        </div>
      ) : (
        <div style={{ padding: '16px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '4px',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            {photos.map((photo, i) => (
              <motion.button
                key={photo.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                onClick={() =>
                  setLightbox({
                    isOpen: true,
                    url: photo.url,
                    caption: `${photo.entryTitle} \u00b7 ${formatDateShort(photo.entryDate)}${photo.sectionLabel ? ` \u00b7 ${photo.sectionLabel}` : ''}`,
                  })
                }
                style={{
                  aspectRatio: '1',
                  padding: 0,
                  border: 'none',
                  cursor: 'pointer',
                  background: 'var(--border-card)',
                  display: 'block',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={photo.url}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        isOpen={lightbox.isOpen}
        onClose={() => setLightbox({ isOpen: false, url: '', caption: '' })}
        photoUrl={lightbox.url}
        caption={lightbox.caption}
      />
    </div>
  )
}
