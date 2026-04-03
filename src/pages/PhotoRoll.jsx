export default function PhotoRoll() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
      <div className="text-center">
        <h1 className="text-2xl font-semibold italic mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Photo Roll
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
          Coming in Sprint 4
        </p>
      </div>
    </div>
  )
}
