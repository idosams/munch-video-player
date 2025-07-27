import styles from './VideoPlayer.module.scss'

interface VideoUploadProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const VideoUpload = ({ onFileUpload }: VideoUploadProps) => {
  return (
    <div className={styles.uploadArea}>
      <input
        type="file"
        accept="video/*"
        onChange={onFileUpload}
        className={styles.fileInput}
        id="video-upload"
      />
      <label htmlFor="video-upload" className={styles.uploadLabel}>
        Choose Video File
      </label>
    </div>
  )
}