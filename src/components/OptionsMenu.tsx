import { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setPlaybackRate } from '../store/slices/viewStateSlice'
import { RootState } from '../types'
import styles from './OptionsMenu.module.scss'

interface OptionsMenuProps {
  isOpen: boolean
  onClose: () => void
}

export const OptionsMenu: React.FC<OptionsMenuProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const menuRef = useRef<HTMLDivElement>(null)
  const { playbackRate } = useSelector((state: RootState) => state.viewState)

  const playbackRates = [
    { value: 0.25, label: '0.25x' },
    { value: 0.5, label: '0.5x' },
    { value: 0.75, label: '0.75x' },
    { value: 1, label: 'Normal' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x' },
    { value: 2, label: '2x' },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handlePlaybackRateChange = (rate: number) => {
    dispatch(setPlaybackRate(rate))
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className={styles.menuOverlay}>
      <div ref={menuRef} className={styles.menu}>
        <div className={styles.menuHeader}>
          <h3>Playback Options</h3>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>
        
        <div className={styles.menuSection}>
          <h4>Playback Speed</h4>
          <div className={styles.rateOptions}>
            {playbackRates.map((rate) => (
              <button
                key={rate.value}
                onClick={() => handlePlaybackRateChange(rate.value)}
                className={`${styles.rateButton} ${
                  playbackRate === rate.value ? styles.active : ''
                }`}
              >
                {rate.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

