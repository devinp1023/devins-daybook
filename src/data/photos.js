import { openDB } from 'idb'
import { v4 as uuidv4 } from 'uuid'

const DB_NAME = 'daybook-photos'
const DB_VERSION = 1
const STORE_NAME = 'photos'

function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('entryId', 'entryId')
      }
    },
  })
}

// Compress and resize an image file to JPEG blob
export async function compressImage(file, maxSize = 1200, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      let { width, height } = img
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = (height / width) * maxSize
          width = maxSize
        } else {
          width = (width / height) * maxSize
          height = maxSize
        }
      }

      // Ensure integer dimensions (iOS requires this)
      width = Math.round(width)
      height = Math.round(height)

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        // Fallback: return original file as blob
        resolve(file.slice(0, file.size, 'image/jpeg'))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)

      try {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob)
            else {
              // toBlob returned null — fallback to original file
              resolve(file.slice(0, file.size, file.type || 'image/jpeg'))
            }
          },
          'image/jpeg',
          quality
        )
      } catch {
        // toBlob threw — fallback to original file
        resolve(file.slice(0, file.size, file.type || 'image/jpeg'))
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      // Can't load image — store original file as-is
      resolve(file.slice(0, file.size, file.type || 'image/jpeg'))
    }

    img.src = url
  })
}

export async function savePhoto(entryId, file) {
  let blob
  try {
    const compressed = await compressImage(file)
    const arrayBuffer = await compressed.arrayBuffer()
    blob = new Blob([arrayBuffer], { type: 'image/jpeg' })
  } catch (compressErr) {
    // Fallback: read original file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    blob = new Blob([arrayBuffer], { type: 'image/jpeg' })
  }

  const photo = {
    id: uuidv4(),
    entryId,
    blob,
    createdAt: Date.now(),
  }

  try {
    const db = await getDB()
    await db.put(STORE_NAME, photo)
  } catch (dbErr) {
    // Try storing as Uint8Array instead of Blob (iOS fallback)
    const arrayBuffer = await blob.arrayBuffer()
    const photo2 = {
      id: photo.id,
      entryId,
      blob: new Uint8Array(arrayBuffer),
      blobType: 'image/jpeg',
      createdAt: Date.now(),
    }
    const db = await getDB()
    await db.put(STORE_NAME, photo2)
  }

  return photo.id
}

export async function getPhoto(id) {
  const db = await getDB()
  return db.get(STORE_NAME, id)
}

export async function getPhotosByEntry(entryId) {
  const db = await getDB()
  return db.getAllFromIndex(STORE_NAME, 'entryId', entryId)
}

export async function deletePhoto(id) {
  const db = await getDB()
  await db.delete(STORE_NAME, id)
}

export async function deletePhotosByEntry(entryId) {
  const db = await getDB()
  const photos = await db.getAllFromIndex(STORE_NAME, 'entryId', entryId)
  const tx = db.transaction(STORE_NAME, 'readwrite')
  for (const photo of photos) {
    tx.store.delete(photo.id)
  }
  await tx.done
}

export async function getAllPhotos() {
  const db = await getDB()
  return db.getAll(STORE_NAME)
}

export function createObjectURL(blob) {
  // Handle Uint8Array stored as iOS fallback
  if (blob instanceof Uint8Array) {
    blob = new Blob([blob], { type: 'image/jpeg' })
  }
  return URL.createObjectURL(blob)
}
