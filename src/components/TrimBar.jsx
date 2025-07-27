import { useState, useRef } from 'react'
import './TrimBar.css'

const TrimBar = ({ duration, trimStart, trimEnd, onTrimChange }) => {
  const [isDragging, setIsDragging] = useState(null)
  const trimBarRef = useRef(null)

  const handleMouseDown = (event, handle) => {
    event.preventDefault()
    setIsDragging(handle)
    
    const handleMouseMove = (moveEvent) => {
      if (!trimBarRef.current || !duration) return

      const rect = trimBarRef.current.getBoundingClientRect()
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

  const startPercentage = duration ? (trimStart / duration) * 100 : 0
  const endPercentage = duration ? (trimEnd / duration) * 100 : 100

  return (
    <div className="trim-bar-container">
      <div className="trim-bar-label">Trim Selection</div>
      <div
        ref={trimBarRef}
        className="trim-bar"
      >
        <div className="trim-bar-background" />
        
        <div
          className="trim-bar-selected"
          style={{
            left: `${startPercentage}%`,
            width: `${endPercentage - startPercentage}%`
          }}
        />
        
        <div
          className={`trim-handle trim-handle-start ${isDragging === 'start' ? 'dragging' : ''}`}
          style={{ left: `${startPercentage}%` }}
          onMouseDown={(e) => handleMouseDown(e, 'start')}
        >
          <div className="handle-grip" />
          <div className="handle-tooltip">
            {trimStart.toFixed(1)}s
          </div>
        </div>
        
        <div
          className={`trim-handle trim-handle-end ${isDragging === 'end' ? 'dragging' : ''}`}
          style={{ left: `${endPercentage}%` }}
          onMouseDown={(e) => handleMouseDown(e, 'end')}
        >
          <div className="handle-grip" />
          <div className="handle-tooltip">
            {trimEnd.toFixed(1)}s
          </div>
        </div>
        
        <div className="trim-bar-labels">
          <span className="label-start">Start</span>
          <span className="label-end">End</span>
        </div>
      </div>
    </div>
  )
}

export default TrimBar