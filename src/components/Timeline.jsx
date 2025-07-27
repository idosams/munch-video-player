import { useRef, useState } from 'react'
import './Timeline.css'

const Timeline = ({ currentTime, duration, onSeek, trimStart, trimEnd, onTrimChange }) => {
  const timelineRef = useRef(null)
  const [isDragging, setIsDragging] = useState(null)

  const handleClick = (event) => {
    const timeline = timelineRef.current
    if (!timeline || !duration) return

    const rect = timeline.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const timelineWidth = rect.width
    const clickRatio = clickX / timelineWidth
    const newTime = clickRatio * duration

    onSeek(Math.max(0, Math.min(duration, newTime)))
  }

  const handleTrimHandleMouseDown = (event, handle) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(handle)
    
    const handleMouseMove = (moveEvent) => {
      if (!timelineRef.current || !duration) return

      const rect = timelineRef.current.getBoundingClientRect()
      const moveX = moveEvent.clientX - rect.left
      const percentage = Math.max(0, Math.min(100, (moveX / rect.width) * 100))
      const newTime = (percentage / 100) * duration

      if (handle === 'start') {
        const clampedStart = Math.max(0, Math.min(newTime, trimEnd - 0.1))
        onTrimChange(clampedStart, trimEnd)
      } else if (handle === 'end') {
        const clampedEnd = Math.max(trimStart + 0.1, Math.min(newTime, duration))
        onTrimChange(trimStart, clampedEnd)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(null)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0
  const trimStartPercentage = duration ? (trimStart / duration) * 100 : 0
  const trimEndPercentage = duration ? (trimEnd / duration) * 100 : 0

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <span className="timeline-duration">
          {Math.floor(duration / 60).toString().padStart(2, '0')}:{Math.floor(duration % 60).toString().padStart(2, '0')}
        </span>
      </div>
      
      <div
        ref={timelineRef}
        className="timeline"
        onClick={handleClick}
      >
        <div className="timeline-track">
          <div className="timeline-background" />
          
          <div
            className="trim-selection"
            style={{
              left: `${trimStartPercentage}%`,
              width: `${trimEndPercentage - trimStartPercentage}%`
            }}
          />
          
          <div
            className="playhead"
            style={{ left: `${progressPercentage}%` }}
          />
          
          <div
            className={`trim-handle trim-handle-left ${isDragging === 'start' ? 'dragging' : ''}`}
            style={{ left: `${trimStartPercentage}%` }}
            onMouseDown={(e) => handleTrimHandleMouseDown(e, 'start')}
          >
            <div className="handle-line" />
            <div className="handle-grip" />
          </div>
          
          <div
            className={`trim-handle trim-handle-right ${isDragging === 'end' ? 'dragging' : ''}`}
            style={{ left: `${trimEndPercentage}%` }}
            onMouseDown={(e) => handleTrimHandleMouseDown(e, 'end')}
          >
            <div className="handle-line" />
            <div className="handle-grip" />
          </div>
          
          <div className="time-ruler">
            {Array.from({ length: Math.ceil(duration / 10) + 1 }, (_, i) => {
              const time = i * 10
              if (time > duration) return null
              const position = (time / duration) * 100
              return (
                <div
                  key={i}
                  className="ruler-mark"
                  style={{ left: `${position}%` }}
                >
                  <div className="ruler-line" />
                  <span className="ruler-time">{time}s</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Timeline