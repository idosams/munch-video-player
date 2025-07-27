import { VideoProject } from '../store/slices/videoLibrarySlice'

const DB_NAME = 'MunchVideoPlayer'
const DB_VERSION = 1
const VIDEO_STORE = 'videos'
const PROJECT_STORE = 'projects'

interface VideoBlob {
  id: string
  blob: Blob
  filename: string
}

class VideoStorage {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains(VIDEO_STORE)) {
          db.createObjectStore(VIDEO_STORE, { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains(PROJECT_STORE)) {
          db.createObjectStore(PROJECT_STORE, { keyPath: 'id' })
        }
      }
    })
  }

  async storeVideo(id: string, blob: Blob, filename: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([VIDEO_STORE], 'readwrite')
      const store = transaction.objectStore(VIDEO_STORE)
      const request = store.put({ id, blob, filename })

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getVideo(id: string): Promise<Blob | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([VIDEO_STORE], 'readonly')
      const store = transaction.objectStore(VIDEO_STORE)
      const request = store.get(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const result = request.result as VideoBlob | undefined
        resolve(result ? result.blob : null)
      }
    })
  }

  async deleteVideo(id: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([VIDEO_STORE], 'readwrite')
      const store = transaction.objectStore(VIDEO_STORE)
      const request = store.delete(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async storeProject(project: VideoProject): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([PROJECT_STORE], 'readwrite')
      const store = transaction.objectStore(PROJECT_STORE)
      const request = store.put(project)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getProject(id: string): Promise<VideoProject | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([PROJECT_STORE], 'readonly')
      const store = transaction.objectStore(PROJECT_STORE)
      const request = store.get(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  }

  async getAllProjects(): Promise<VideoProject[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([PROJECT_STORE], 'readonly')
      const store = transaction.objectStore(PROJECT_STORE)
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || [])
    })
  }

  async deleteProject(id: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([PROJECT_STORE], 'readwrite')
      const store = transaction.objectStore(PROJECT_STORE)
      const request = store.delete(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getStorageInfo(): Promise<{ used: number; available: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      return {
        used: estimate.usage || 0,
        available: estimate.quota || 0,
      }
    }
    return { used: 0, available: 0 }
  }
}

export const videoStorage = new VideoStorage()