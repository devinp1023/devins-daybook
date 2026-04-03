import { Link, useLocation } from 'react-router-dom'
import { getCitiesWithEntries } from '../data/entries'
import { getTripProgress } from '../data/tripHelpers'

const NAV_LINKS = [
  { to: '/', label: 'All Entries', icon: '\u{1F4D6}' },
  { to: '/map', label: 'Map View', icon: '\u{1F5FA}\uFE0F' },
  { to: '/photos', label: 'Photo Roll', icon: '\u{1F4F7}' },
  { to: '/cities', label: 'City Summaries', icon: '\u{1F3D9}\uFE0F' },
]

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const cities = getCitiesWithEntries()
  const progress = getTripProgress()

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: '280px',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-sidebar)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '28px 24px 20px',
            borderBottom: '1px solid var(--teal-dark)',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid var(--teal-dark)',
              background: 'transparent',
              color: 'var(--teal-muted)',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            &times;
          </button>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 600,
              fontSize: '22px',
              color: 'var(--text-sidebar)',
              margin: 0,
            }}
          >
            Devin's Daybook
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--teal-muted)',
              margin: '4px 0 0',
            }}
          >
            Europe 2025
          </p>
        </div>

        {/* Nav links */}
        <nav style={{ padding: '12px' }}>
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  color: isActive ? 'var(--teal-bright)' : 'var(--text-sidebar)',
                  background: isActive ? 'rgba(77,196,168,0.12)' : 'transparent',
                  marginBottom: '2px',
                }}
              >
                <span style={{ fontSize: '16px' }}>{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Divider */}
        <div style={{ margin: '4px 24px', height: '1px', background: 'var(--teal-dark)' }} />

        {/* City filter */}
        {cities.length > 0 && (
          <div style={{ padding: '12px 24px' }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                color: 'var(--teal-dim)',
                marginBottom: '8px',
              }}
            >
              Cities
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {cities.map((city) => (
                <Link
                  key={city}
                  to={`/?city=${city}`}
                  onClick={onClose}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    color: 'var(--teal-muted)',
                  }}
                >
                  {city}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Trip progress */}
        <div
          style={{
            marginTop: 'auto',
            padding: '20px 24px',
            borderTop: '1px solid var(--teal-dark)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: 'var(--teal-dim)',
              marginBottom: '10px',
            }}
          >
            Trip Progress
          </p>
          <div
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '3px',
              background: 'var(--teal-dark)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: '3px',
                width: `${progress.percentage}%`,
                background: 'var(--teal-bright)',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '8px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--teal-muted)',
              }}
            >
              {progress.elapsed} of {progress.total} days
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--teal-bright)',
              }}
            >
              {Math.round(progress.percentage)}%
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
