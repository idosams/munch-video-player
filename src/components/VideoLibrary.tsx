import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../types'
import { setCurrentProject, removeProject, addProject, VideoProject } from '../store/slices/videoLibrarySlice'
import { setVideoFile } from '../store/slices/videoDataSlice'
import { videoStorage } from '../utils/storage'
import { formatTime } from '../utils/videoUtils'
import { logger } from '../utils/logger'
import { v4 as uuidv4 } from 'uuid'
import styles from './VideoLibrary.module.scss'

export const VideoLibrary = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { projects, currentProjectId } = useSelector((state: RootState) => state.videoLibrary)

  const handleProjectSelect = (project: VideoProject) => {
    dispatch(setCurrentProject(project.id))
    navigate(`/video/${project.id}`)
  }

  const handleProjectDelete = async (project: VideoProject, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (confirm(`Delete "${project.name}"? This cannot be undone.`)) {
      try {
        await videoStorage.deleteVideo(project.id)
        await videoStorage.deleteProject(project.id)
        dispatch(removeProject(project.id))
        
        if (currentProjectId === project.id) {
          navigate('/')
        }
      } catch (error) {
        logger.error('Error deleting project', error)
      }
    }
  }

  const handleNewProject = () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'video/*'
    fileInput.style.display = 'none'
    
    fileInput.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
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
    
    fileInput.click()
  }

  return (
    <div className={styles.videoLibrary}>
      <div className={styles.header}>
        <h2>Video Library</h2>
        <button onClick={handleNewProject} className={styles.newButton}>
          + New
        </button>
      </div>

      <div className={styles.projectList}>
        {projects.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No videos yet</p>
            <p>Upload a video to get started</p>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className={`${styles.projectItem} ${
                currentProjectId === project.id ? styles.active : ''
              }`}
              onClick={() => handleProjectSelect(project)}
            >
              <div className={styles.projectThumbnail}>
                {project.thumbnailUrl ? (
                  <img src={project.thumbnailUrl} alt={project.name} />
                ) : (
                  <div className={styles.placeholderThumbnail}>📹</div>
                )}
              </div>
              
              <div className={styles.projectInfo}>
                <h3 className={styles.projectName}>{project.name}</h3>
                <p className={styles.projectDuration}>
                  {formatTime(project.duration / 1000)}
                </p>
                <p className={styles.projectDate}>
                  {new Date(project.lastModified).toLocaleDateString()}
                </p>
                <p className={styles.editStatus}>
                  {(project.trimStart > 0 || Math.abs(project.trimEnd - project.duration) > 100) ? (
                    <>Trimmed: {formatTime(project.trimStart / 1000)} - {formatTime(project.trimEnd / 1000)}</>
                  ) : (
                    <>Full: {formatTime(0)} - {formatTime(project.duration / 1000)}</>
                  )}
                </p>
              </div>

              <button
                className={styles.deleteButton}
                onClick={(e) => handleProjectDelete(project, e)}
                title="Delete project"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

