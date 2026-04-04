import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { CITY_OPTIONS } from '../data/tripConstants'
import { getCountryForCity } from '../data/tripHelpers'
import { createEntry, updateEntry, getEntry, deleteEntry } from '../data/entries'
import { savePhoto, getPhoto, deletePhoto, deletePhotosByEntry, createObjectURL } from '../data/photos'

const SECTIONS = [
  { key: 'activities', label: 'Activities', icon: '\u{1F3AF}' },
  { key: 'food', label: 'Food & Drinks', icon: '\u{1F37D}\uFE0F' },
  { key: 'people', label: 'People I Met', icon: '\u{1F465}' },
  { key: 'other', label: 'Other Notes', icon: '\u{1F4DD}' },
]

function scrollIntoViewOnFocus(e) {
  setTimeout(() => {
    e.target.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, 300)
}

function AutoGrowTextarea({ value, onChange, placeholder }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = ref.current.scrollHeight + 'px'
    }
  }, [value])

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      onFocus={scrollIntoViewOnFocus}
      placeholder={placeholder}
      rows={3}
      style={{
        width: '100%',
        resize: 'none',
        borderRadius: '10px',
        padding: '12px 14px',
        fontFamily: 'var(--font-body)',
        fontSize: '16px',
        lineHeight: 1.7,
        color: 'var(--text-primary)',
        background: 'var(--bg-page)',
        border: '1px solid var(--border-card)',
        outline: 'none',
        boxSizing: 'border-box',
      }}
    />
  )
}

function PhotoUploadGrid({ photos, onAdd, onRemove, maxPhotos = 3 }) {
  const inputRef = useRef(null)

  return (
    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
      {photos.map((photo, i) => (
        <div
          key={photo.id || i}
          style={{
            position: 'relative',
            width: '72px',
            height: '72px',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid var(--border-card)',
          }}
        >
          <img src={photo.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button
            onClick={() => onRemove(i)}
            style={{
              position: 'absolute',
              top: '0px',
              right: '0px',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.6)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            &times;
          </button>
        </div>
      ))}
      {photos.length < maxPhotos && (
        <button
          onClick={() => inputRef.current?.click()}
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '10px',
            border: '2px dashed var(--border-card)',
            background: 'transparent',
            color: 'var(--teal-muted)',
            cursor: 'pointer',
            fontSize: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          +
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onAdd(e.target.files[0])
            e.target.value = ''
          }
        }}
      />
    </div>
  )
}

function CollapsibleSection({ section, text, photos, onTextChange, onPhotoAdd, onPhotoRemove }) {
  const [isOpen, setIsOpen] = useState(false)
  const hasFill = text.length > 0 || photos.length > 0

  useEffect(() => {
    if (hasFill) setIsOpen(true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{
        borderRadius: '14px',
        overflow: 'hidden',
        border: '1px solid var(--border-card)',
        background: 'var(--bg-card)',
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>{section.icon}</span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}
          >
            {section.label}
          </span>
          {hasFill && (
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--teal-bright)',
              }}
            />
          )}
        </div>
        <span
          style={{
            fontSize: '12px',
            color: 'var(--text-meta)',
            transition: 'transform 0.2s',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          &#9662;
        </span>
      </button>

      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{ padding: '0 16px 16px' }}
        >
          <AutoGrowTextarea
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder={`Write about ${section.label.toLowerCase()}...`}
          />
          <PhotoUploadGrid
            photos={photos}
            onAdd={onPhotoAdd}
            onRemove={onPhotoRemove}
          />
        </motion.div>
      )}
    </div>
  )
}

export default function NewEntry() {
  const navigate = useNavigate()
  const { id: editId } = useParams()
  const isEditing = !!editId

  const [city, setCity] = useState('')
  const [customCity, setCustomCity] = useState('')
  const [customCountry, setCustomCountry] = useState('')
  const [showCustomCity, setShowCustomCity] = useState(false)
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [title, setTitle] = useState('')
  const [sections, setSections] = useState({
    activities: { text: '', photos: [] },
    food: { text: '', photos: [] },
    people: { text: '', photos: [] },
    other: { text: '', photos: [] },
  })
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (!editId) return
    const entry = getEntry(editId)
    if (!entry) return navigate('/')

    setCity(entry.city)
    setDate(entry.date)
    setTitle(entry.title)

    const isKnownCity = CITY_OPTIONS.some((c) => c.label === entry.city)
    if (!isKnownCity) {
      setShowCustomCity(true)
      setCustomCity(entry.city)
      setCustomCountry(entry.country || '')
      setCity('__custom__')
    }

    async function loadPhotos() {
      const loaded = {}
      for (const [key, section] of Object.entries(entry.sections)) {
        const photos = []
        for (const photoId of section.photoIds) {
          const photo = await getPhoto(photoId)
          if (photo) {
            photos.push({ id: photoId, url: createObjectURL(photo.blob), file: null, existing: true })
          }
        }
        loaded[key] = { text: section.text, photos }
      }
      setSections(loaded)
    }
    loadPhotos()
  }, [editId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSectionText = (key, text) => {
    setSections((prev) => ({ ...prev, [key]: { ...prev[key], text } }))
  }

  const handlePhotoAdd = async (key, file) => {
    const url = URL.createObjectURL(file)
    setSections((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        photos: [...prev[key].photos, { id: null, url, file, existing: false }],
      },
    }))
  }

  const handlePhotoRemove = (key, index) => {
    setSections((prev) => {
      const photo = prev[key].photos[index]
      if (photo.url && !photo.existing) URL.revokeObjectURL(photo.url)
      return {
        ...prev,
        [key]: { ...prev[key], photos: prev[key].photos.filter((_, i) => i !== index) },
      }
    })
  }

  const handleSave = async () => {
    const resolvedCity = city === '__custom__' ? customCity.trim() : city
    if (!resolvedCity || !title.trim()) return

    setSaving(true)

    try {
      const country = getCountryForCity(resolvedCity) ||
        CITY_OPTIONS.find((c) => c.label === resolvedCity)?.country ||
        customCountry || ''

      if (isEditing) {
        const existingEntry = getEntry(editId)
        const sectionData = {}

        for (const [key, section] of Object.entries(sections)) {
          const photoIds = []
          for (const photo of section.photos) {
            if (photo.existing && photo.id) photoIds.push(photo.id)
          }
          for (const photo of section.photos) {
            if (!photo.existing && photo.file) {
              const newId = await savePhoto(editId, photo.file)
              photoIds.push(newId)
            }
          }
          const oldPhotoIds = existingEntry.sections[key]?.photoIds || []
          for (const oldId of oldPhotoIds) {
            if (!photoIds.includes(oldId)) await deletePhoto(oldId)
          }
          sectionData[key] = { text: section.text, photoIds }
        }

        updateEntry(editId, { city: resolvedCity, country, date, title: title.trim(), sections: sectionData })
        navigate(`/entry/${editId}`)
      } else {
        const entry = createEntry({ city: resolvedCity, country, date, title: title.trim(), sections: {} })
        const sectionData = {}
        for (const [key, section] of Object.entries(sections)) {
          const photoIds = []
          for (const photo of section.photos) {
            if (photo.file) {
              const photoId = await savePhoto(entry.id, photo.file)
              photoIds.push(photoId)
            }
          }
          sectionData[key] = { text: section.text, photoIds }
        }
        updateEntry(entry.id, { sections: sectionData })
        navigate('/')
      }
    } catch (err) {
      console.error('Save failed:', err)
      alert('Save failed: ' + (err?.message || 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!editId) return
    await deletePhotosByEntry(editId)
    deleteEntry(editId)
    navigate('/')
  }

  const resolvedCity = city === '__custom__' ? customCity.trim() : city
  const canSave = resolvedCity.length > 0 && title.trim().length > 0

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    fontFamily: 'var(--font-body)',
    fontSize: '16px',
    color: 'var(--text-primary)',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-card)',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{ minHeight: '100dvh', background: 'var(--bg-page)' }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-card)',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '8px 14px',
            borderRadius: '10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            background: 'none',
            border: '1px solid var(--border-card)',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: '17px',
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          {isEditing ? 'Edit Entry' : 'New Entry'}
        </h1>
        <button
          onClick={handleSave}
          disabled={!canSave || saving}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            fontWeight: 600,
            color: canSave ? '#fff' : 'var(--text-meta)',
            background: canSave ? 'var(--teal-primary)' : 'var(--border-card)',
            border: 'none',
            cursor: canSave ? 'pointer' : 'default',
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* City */}
        <div>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: 'var(--teal-primary)',
              marginBottom: '6px',
              fontWeight: 600,
            }}
          >
            City
          </label>
          <select
            value={city}
            onChange={(e) => {
              setCity(e.target.value)
              setShowCustomCity(e.target.value === '__custom__')
            }}
            style={{
              ...inputStyle,
              appearance: 'none',
              color: city ? 'var(--text-primary)' : 'var(--text-meta)',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23a0c8c0' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 14px center',
              paddingRight: '36px',
            }}
          >
            <option value="">Select a city...</option>
            {CITY_OPTIONS.filter((c) => !c.isDayTrip).map((c) => (
              <option key={c.label} value={c.label}>{c.label}</option>
            ))}
            <optgroup label="Day Trips">
              {CITY_OPTIONS.filter((c) => c.isDayTrip).map((c) => (
                <option key={c.label} value={c.label}>{c.label}</option>
              ))}
            </optgroup>
            <option value="__custom__">+ Add city</option>
          </select>
          {showCustomCity && (
            <>
              <input
                type="text"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                placeholder="Enter city name..."
                style={{ ...inputStyle, marginTop: '8px' }}
              />
              <select
                value={customCountry}
                onChange={(e) => setCustomCountry(e.target.value)}
                style={{
                  ...inputStyle,
                  marginTop: '8px',
                  appearance: 'none',
                  color: customCountry ? 'var(--text-primary)' : 'var(--text-meta)',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23a0c8c0' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 14px center',
                  paddingRight: '36px',
                }}
              >
                <option value="">Select country...</option>
                <option value="US">United States</option>
                <optgroup label="Europe">
                  <option value="IT">Italy</option>
                  <option value="FR">France</option>
                  <option value="DE">Germany</option>
                  <option value="NL">Netherlands</option>
                  <option value="BE">Belgium</option>
                  <option value="ES">Spain</option>
                  <option value="PT">Portugal</option>
                  <option value="GB">United Kingdom</option>
                  <option value="IE">Ireland</option>
                  <option value="CH">Switzerland</option>
                  <option value="AT">Austria</option>
                  <option value="GR">Greece</option>
                  <option value="CZ">Czech Republic</option>
                  <option value="PL">Poland</option>
                  <option value="HR">Croatia</option>
                  <option value="DK">Denmark</option>
                  <option value="SE">Sweden</option>
                  <option value="NO">Norway</option>
                </optgroup>
              </select>
            </>
          )}
        </div>

        {/* Date */}
        <div>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: 'var(--teal-primary)',
              marginBottom: '6px',
              fontWeight: 600,
            }}
          >
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onFocus={scrollIntoViewOnFocus}
            style={{ ...inputStyle, fontFamily: 'var(--font-mono)', fontSize: '14px' }}
          />
        </div>

        {/* Title */}
        <div>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: 'var(--teal-primary)',
              marginBottom: '6px',
              fontWeight: 600,
            }}
          >
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={scrollIntoViewOnFocus}
            placeholder="Give this day a title..."
            style={{
              ...inputStyle,
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '20px',
              padding: '14px',
            }}
          />
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border-card)', margin: '4px 0' }} />

        {/* Collapsible sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SECTIONS.map((section) => (
            <CollapsibleSection
              key={section.key}
              section={section}
              text={sections[section.key].text}
              photos={sections[section.key].photos}
              onTextChange={(text) => handleSectionText(section.key, text)}
              onPhotoAdd={(file) => handlePhotoAdd(section.key, file)}
              onPhotoRemove={(index) => handlePhotoRemove(section.key, index)}
            />
          ))}
        </div>

        {/* Delete button (edit mode only) */}
        {isEditing && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-card)' }}>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#dc2626',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  cursor: 'pointer',
                }}
              >
                Delete Entry
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p
                  style={{
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    color: '#dc2626',
                  }}
                >
                  Are you sure? This can't be undone.
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-card)',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#fff',
                      background: '#dc2626',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
