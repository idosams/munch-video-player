import { useSelector, useDispatch } from 'react-redux'
import { formatTime } from '../utils/videoUtils'
import { toggleOptionsMenu } from '../store/slices/viewStateSlice'
import { RootState } from '../types'
import { VolumeControl } from './VolumeControl'
import styles from './VideoPlayer.module.scss'

interface VideoControlsProps {
  onPlay: () => void
}

export const VideoControls = ({ onPlay }: VideoControlsProps) => {
  const dispatch = useDispatch()
  const { currentTime, duration } = useSelector((state: RootState) => state.videoData)
  const { isPlaying } = useSelector((state: RootState) => state.viewState)

  return (
    <div className={styles.videoControls}>
      <button 
        onClick={onPlay} 
        className={styles.playButton}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? '⏸️' : '▶️'}
      </button>
      <div className={styles.timeDisplay}>
        <span className={styles.currentTime}>
          {formatTime(currentTime)}
        </span>
        <span className={styles.separator}>/</span>
        <span className={styles.totalTime}>
          {formatTime(duration)}
        </span>
      </div>
      <VolumeControl />
      <button 
        onClick={() => dispatch(toggleOptionsMenu())}
        className={styles.optionsButton}
        aria-label="Options"
      >
        ⋯
      </button>
    </div>
  )
}