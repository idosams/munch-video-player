import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../types'
import { setCurrentProject, updateProject, addProject } from '../store/slices/videoLibrarySlice'
import { setVideoFileWithState } from '../store/slices/videoDataSlice'
import { videoStorage } from '../utils/storage'
import { logger } from '../utils/logger'
import { VideoPlayer } from '../components/VideoPlayer'
import styles from './VideoEditPage.module.scss'

export const VideoEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { projects, currentProjectId } = useSelector((state: RootState) => state.videoLibrary)
  const { videoSrc, trimStart, trimEnd, currentTime } = useSelector((state: RootState) => state.videoData)
  
  const currentProject = projects.find(p => p.id === id)

  useEffect(() => {
    if (!id) {
      navigate('/')
      return
    }

    const loadProject = async () => {
      try {
        if (currentProjectId !== id) {
          dispatch(setCurrentProject(id))
        }

        let project = projects.find(p => p.id === id)
        if (!project) {
          project = await videoStorage.getProject(id) ?? undefined;
          if (!project) {
            logger.error('Project not found', id)
            navigate('/')
            return
          }
          dispatch(addProject(project))
        }

        const videoBlob = await videoStorage.getVideo(id)
        if (videoBlob) {
          const url = URL.createObjectURL(videoBlob)
          dispatch(setVideoFileWithState({ 
            file: new File([videoBlob], project.originalName), 
            url,
            trimStart: project.trimStart / 1000,
            trimEnd: project.trimEnd / 1000,
            currentTime: project.currentTime / 1000
          }))
        } else {
          logger.error('Video blob not found for project', id)
          navigate('/')
        }
      } catch (error) {
        logger.error('Error loading project', error)
        navigate('/')
      }
    }

    loadProject()
  }, [id, dispatch, navigate])

  useEffect(() => {
    if (currentProject && videoSrc && currentProject.id) {
      const hasChanged = 
        Math.abs(currentProject.trimStart / 1000 - trimStart) > 0.01 ||
        Math.abs(currentProject.trimEnd / 1000 - trimEnd) > 0.01 ||
        Math.abs(currentProject.currentTime / 1000 - currentTime) > 0.01

      if (hasChanged) {
        const updatedProject = {
          ...currentProject,
          trimStart: trimStart * 1000,
          trimEnd: trimEnd * 1000,
          currentTime: currentTime * 1000,
          lastModified: new Date().toISOString(),
        }
        
        dispatch(updateProject(updatedProject))
        
        videoStorage.storeProject(updatedProject).catch(error => 
          logger.error('Error saving project state', error)
        )
      }
    }
  }, [trimStart, trimEnd, currentTime, dispatch])

  if (!currentProject) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}>⏳</div>
          <p>Loading project...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.videoEditPage}>
      <div className={styles.projectHeader}>
        <button 
          onClick={() => navigate('/')} 
          className={styles.backButton}
          aria-label="Back to Library"
        >
          ← Back
        </button>
        <h1 className={styles.projectTitle}>{currentProject.name}</h1>
      </div>
      
      <VideoPlayer />
    </div>
  )
}

