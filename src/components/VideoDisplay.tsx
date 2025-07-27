import { useSelector } from 'react-redux'
import { formatTime } from '../utils/videoUtils'
import { RootState } from '../types'
import { VideoControls } from './VideoControls'
import styles from './VideoPlayer.module.scss'

interface VideoDisplayProps {
  videoRef: React.RefObject<HTMLVideoElement>
  videoSrc: string
  onPlay: () => void
}

export const VideoDisplay = ({ videoRef, videoSrc, onPlay }: VideoDisplayProps) => {
  const { duration } = useSelector((state: RootState) => state.videoData)

  return (
    <>
      <video
        ref={videoRef}
        className={styles.videoElement}
        src={videoSrc}
        onClick={onPlay}
      />
      <div className={styles.videoDurationBadge}>
        {formatTime(duration)}
      </div>
      <div className={styles.videoOverlay}>
        <VideoControls onPlay={onPlay} />
      </div>
    </>
  )
}