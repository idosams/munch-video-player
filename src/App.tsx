import { useEffect } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { store } from './store'
import { loadProjects } from './store/slices/videoLibrarySlice'
import { videoStorage } from './utils/storage'
import { logger } from './utils/logger'
import { RootState } from './types'
import { VideoLibrary } from './components/VideoLibrary'
import { UploadPage } from './pages/UploadPage'
import { VideoEditPage } from './pages/VideoEditPage'
import styles from './App.module.scss'

const AppContent = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { projects } = useSelector((state: RootState) => state.videoLibrary)

  useEffect(() => {
    const loadStoredProjects = async () => {
      try {
        await videoStorage.init()
        const projects = await videoStorage.getAllProjects()
        dispatch(loadProjects(projects))
      } catch (error) {
        logger.error('Error loading projects', error)
      }
    }

    loadStoredProjects()
  }, [dispatch])

  const showUploadPage = location.pathname === '/' || (projects.length === 0 && !location.pathname.startsWith('/video/'))

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <VideoLibrary />
      </aside>
      
      <main className={styles.mainContent}>
        {showUploadPage ? (
          <UploadPage />
        ) : (
          <Routes>
            <Route path="/video/:id" element={<VideoEditPage />} />
          </Routes>
        )}
      </main>
    </div>
  )
}

export const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  )
}

