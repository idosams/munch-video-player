import { useSelector } from 'react-redux'
import { RootState } from '../types'
import styles from './VideoPlayer.module.scss'

interface VideoActionsProps {
  onRemoveVideo: () => void
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onDownloadTrimmedVideo: () => void
}

export const VideoActions = ({ onRemoveVideo, onFileUpload, onDownloadTrimmedVideo }: VideoActionsProps) => {
  const { loading } = useSelector((state: RootState) => state.viewState)

  return (
    <div className={styles.actionBar}>
      <button 
        onClick={onRemoveVideo}
        className={styles.actionButton}
        aria-label="Remove Video"
      >
        🗑️ Remove
      </button>
      <input
        type="file"
        accept="video/*"
        onChange={onFileUpload}
        className={styles.fileInput}
        id="video-reload"
      />
      <label htmlFor="video-reload" className={styles.actionButton}>
        📁 Load Another
      </label>
      <button 
        onClick={onDownloadTrimmedVideo}
        className={styles.actionButton}
        aria-label="Save Trimmed Video"
        disabled={loading}
      >
        {loading ? '⏳ Processing...' : '💾 Save Trimmed'}
      </button>
    </div>
  )
}