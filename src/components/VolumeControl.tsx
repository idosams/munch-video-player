import { useSelector, useDispatch } from 'react-redux'
import { setVolume, toggleMute } from '../store/slices/viewStateSlice'
import { RootState } from '../types'
import styles from './VideoPlayer.module.scss'

export const VolumeControl = () => {
  const dispatch = useDispatch()
  const { volume, isMuted } = useSelector((state: RootState) => state.viewState)

  return (
    <div className={styles.volumeControls}>
      <button 
        onClick={() => dispatch(toggleMute())}
        className={styles.muteButton}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? '🔇' : volume > 0.5 ? '🔊' : volume > 0 ? '🔉' : '🔇'}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={isMuted ? 0 : volume}
        onChange={(e) => dispatch(setVolume(parseFloat(e.target.value)))}
        className={styles.volumeSlider}
        aria-label="Volume"
      />
    </div>
  )
}