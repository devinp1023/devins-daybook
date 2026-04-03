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

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Failed to compress image'))
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

export async function savePhoto(entryId, file) {
  const blob = await compressImage(file)
  const photo = {
    id: uuidv4(),
    entryId,
    blob,
    createdAt: Date.now(),
  }
  const db = await getDB()
  await db.put(STORE_NAME, photo)
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
  return URL.createObjectURL(blob)
}
