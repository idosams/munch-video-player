import React, { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setIsDragging } from '../store/slices/viewStateSlice'
import { useVideoControls } from '../hooks/useVideoControls'
import { formatTime, generateRulerMarks } from '../utils/videoUtils'
import { RootState } from '../types'
import styles from './Timeline.module.scss'

const Timeline: React.FC = () => {
  const dispatch = useDispatch()
  const timelineRef = useRef<HTMLDivElement>(null)
  const { handleSeek, handleTrimChange } = useVideoControls()
  
  const { currentTime, duration, trimStart, trimEnd } = useSelector(
    (state: RootState) => state.videoData
  )
  const { isDragging } = useSelector((state: RootState) => state.viewState)

  const handleTimelineClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const timeline = timelineRef.current
    if (!timeline || !duration) return

    const rect = timeline.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const timelineWidth = rect.width
    const clickRatio = clickX / timelineWidth
    const newTime = clickRatio * duration

    handleSeek(Math.max(0, Math.min(duration, newTime)))
  }

  const handleTrimHandleMouseDown = (event: React.MouseEvent<HTMLDivElement>, handle: 'start' | 'end') => {
    event.preventDefault()
    event.stopPropagation()
    dispatch(setIsDragging(handle))
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!timelineRef.current || !duration) return

      const rect = timelineRef.current.getBoundingClientRect()
      const moveX = moveEvent.clientX - rect.left
      const percentage = Math.max(0, Math.min(100, (moveX / rect.width) * 100))
      const newTime = (percentage / 100) * duration

      if (handle === 'start') {
        const clampedStart = Math.max(0, Math.min(newTime, trimEnd - 0.1))
        handleTrimChange(clampedStart, trimEnd)
      } else if (handle === 'end') {
        const clampedEnd = Math.max(trimStart + 0.1, Math.min(newTime, duration))
        handleTrimChange(trimStart, clampedEnd)
      }
    }

    const handleMouseUp = () => {
      dispatch(setIsDragging(null))
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }


  const progressPercentage: number = duration ? (currentTime / duration) * 100 : 0
  const trimStartPercentage: number = duration ? (trimStart / duration) * 100 : 0
  const trimEndPercentage: number = duration ? (trimEnd / duration) * 100 : 0

  const rulerMarks = generateRulerMarks(duration)

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timelineHeader}>
        <span className={styles.timelineDuration}>
          {formatTime(duration)}
        </span>
      </div>
      
      <div
        ref={timelineRef}
        className={styles.timeline}
        onClick={handleTimelineClick}
      >
        <div className={styles.timelineTrack}>
          <div className={styles.timelineBackground} />
          
          <div
            className={styles.trimSelection}
            style={{
              left: `${trimStartPercentage}%`,
              width: `${trimEndPercentage - trimStartPercentage}%`
            }}
          />
          
          <div
            className={styles.playhead}
            style={{ left: `${progressPercentage}%` }}
          />
          
          <div
            className={`${styles.trimHandle} ${styles.left} ${
              isDragging === 'start' ? styles.dragging : ''
            }`}
            style={{ left: `${trimStartPercentage}%` }}
            onMouseDown={(e) => handleTrimHandleMouseDown(e, 'start')}
          >
            <div className={styles.handleLine} />
            <div className={styles.handleGrip} />
          </div>
          
          <div
            className={`${styles.trimHandle} ${styles.right} ${
              isDragging === 'end' ? styles.dragging : ''
            }`}
            style={{ left: `${trimEndPercentage}%` }}
            onMouseDown={(e) => handleTrimHandleMouseDown(e, 'end')}
          >
            <div className={styles.handleLine} />
            <div className={styles.handleGrip} />
          </div>
          
          <div className={styles.timeRuler}>
            {rulerMarks.map(({ time, position, key }) => (
              <div
                key={key}
                className={styles.rulerMark}
                style={{ left: `${position}%` }}
              >
                <div className={styles.rulerLine} />
                <span className={styles.rulerTime}>{time}s</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Timeline