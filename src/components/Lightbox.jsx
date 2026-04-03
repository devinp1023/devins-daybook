import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Lightbox({ isOpen, onClose, photoUrl, caption }) {
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(10, 20, 18, 0.95)' }}
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center z-10"
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
            }}
          >
            &times;
          </button>

          {/* Photo */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-[90vw] max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {photoUrl && (
              <img
                src={photoUrl}
                alt=""
                className="max-w-full max-h-[80vh] rounded-lg object-contain"
              />
            )}
            {caption && (
              <div
                className="absolute bottom-0 left-0 right-0 p-4 rounded-b-lg"
                style={{
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  color: '#fff',
                }}
              >
                <p className="text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
                  {caption}
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
