import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setVideoFile } from '../store/slices/videoDataSlice'
import { addProject } from '../store/slices/videoLibrarySlice'
import { videoStorage } from '../utils/storage'
import { logger } from '../utils/logger'
import { v4 as uuidv4 } from 'uuid'
import styles from './UploadPage.module.scss'

export const UploadPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const projectId = uuidv4()
      
      const url = URL.createObjectURL(file)
      
      await videoStorage.storeVideo(projectId, file, file.name)
      
      const video = document.createElement('video')
      video.src = url
      
      video.onloadedmetadata = async () => {
        const duration = video.duration * 1000
        
        const newProject = {
          id: projectId,
          name: file.name,
          originalName: file.name,
          duration,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          trimStart: 0,
          trimEnd: duration,
          currentTime: 0,
          isLoaded: false,
        }
        
        await videoStorage.storeProject(newProject)
        
        dispatch(addProject(newProject))
        
        dispatch(setVideoFile({ file, url }))
        
        navigate(`/video/${projectId}`)
        
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      logger.error('Error uploading video', error)
      alert('Failed to upload video. Please try again.')
    }
  }

  return (
    <div className={styles.uploadPage}>
      <div className={styles.uploadContainer}>
        <div className={styles.uploadArea}>
          <div className={styles.uploadIcon}>📹</div>
          <h2>Upload Video to Edit</h2>
          <p>Choose a video file to start editing</p>
          
          <input
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            className={styles.fileInput}
            id="video-upload"
          />
          <label htmlFor="video-upload" className={styles.uploadButton}>
            Choose Video File
          </label>
          
          <div className={styles.supportedFormats}>
            <p>Supported formats: MP4, WebM, OGV, MOV</p>
          </div>
        </div>
      </div>
    </div>
  )
}

