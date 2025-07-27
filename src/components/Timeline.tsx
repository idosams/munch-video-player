import { useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  DndContext,
  DragMoveEvent,
  DragStartEvent,
  useDraggable,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { setIsDragging } from '../store/slices/viewStateSlice'
import { setCurrentTime, setTrimRange } from '../store/slices/videoDataSlice'
import { useVideoThumbnails } from '../hooks/useVideoThumbnails'
import { formatTime } from '../utils/videoUtils'
import { RootState } from '../types'
import styles from './Timeline.module.scss'

interface TrimBarProps {
  startPercentage: number
  endPercentage: number
  isDraggingStart: boolean
  isDraggingEnd: boolean
  onTrimBarClick: (relativePosition: number) => void
}

const TrimBar = ({ startPercentage, endPercentage, isDraggingStart, isDraggingEnd, onTrimBarClick }: TrimBarProps) => {
  const startHandle = useDraggable({ id: 'start' })
  const endHandle = useDraggable({ id: 'end' })
  const trimBarRef = useRef<HTMLDivElement>(null)

  const barStyle = {
    left: `${startPercentage}%`,
    width: `${endPercentage - startPercentage}%`,
  }

  const startHandleStyle = {
    left: '0%',
    transform: 'translateX(-50%)',
  }

  const endHandleStyle = {
    left: '100%',
    transform: 'translateX(-50%)',
  }

  const handleTrimBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!trimBarRef.current) return
    
    const target = event.target as HTMLElement
    if (target.closest(`.${styles.trimHandle}`)) return
    
    event.stopPropagation()
    
    const rect = trimBarRef.current.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const relativePosition = clickX / rect.width
    
    const clampedPosition = Math.max(0, Math.min(1, relativePosition))
    onTrimBarClick(clampedPosition)
  }

  return (
    <div 
      ref={trimBarRef}
      className={styles.trimBarContainer} 
      style={barStyle}
      onClick={handleTrimBarClick}
    >
      {/* Trim selection background */}
      <div className={styles.trimSelection} />
      
      {/* Start handle */}
      <div
        ref={startHandle.setNodeRef}
        style={startHandleStyle}
        className={`${styles.trimHandle} ${styles.left} ${
          isDraggingStart ? styles.dragging : ''
        }`}
        {...startHandle.listeners}
        {...startHandle.attributes}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.handleIcon}>◀</div>
      </div>
      
      {/* End handle */}
      <div
        ref={endHandle.setNodeRef}
        style={endHandleStyle}
        className={`${styles.trimHandle} ${styles.right} ${
          isDraggingEnd ? styles.dragging : ''
        }`}
        {...endHandle.listeners}
        {...endHandle.attributes}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.handleIcon}>▶</div>
      </div>
    </div>
  )
}

interface TimelineProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
}

export const Timeline = ({ videoRef }: TimelineProps) => {
  const dispatch = useDispatch()
  const timelineRef = useRef<HTMLDivElement>(null)
  const [dragStartData, setDragStartData] = useState<{ handle: 'start' | 'end'; initialTime: number } | null>(null)
  
  const { currentTime, duration, trimStart, trimEnd } = useSelector(
    (state: RootState) => state.videoData
  )
  const { isDragging } = useSelector((state: RootState) => state.viewState)

  const directSeek = (time: number) => {
    const video = videoRef.current
    if (!video) return

    if (video.readyState < 1) {
      const handleLoadedMetadata = () => {
        video.currentTime = time
        dispatch(setCurrentTime(time))
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      }
      video.addEventListener('loadedmetadata', handleLoadedMetadata)
      return
    }

    video.currentTime = time
    dispatch(setCurrentTime(time))
  }

  const handleTimelineClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const timeline = timelineRef.current
    if (!timeline || !duration) return

    const target = event.target as HTMLElement
    const trimBarElement = target.closest(`.${styles.trimBarContainer}`)
    const trimHandleElement = target.closest(`.${styles.trimHandle}`)
    
    if (trimBarElement || trimHandleElement) return

    const rect = timeline.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const timelineWidth = rect.width
    const clickRatio = clickX / timelineWidth
    const newTime = clickRatio * duration
    const seekTime = Math.max(0, Math.min(duration, newTime))

    directSeek(seekTime)
  }

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  )

  const handleDragStart = (event: DragStartEvent) => {
    const handleType = event.active.id as 'start' | 'end'
    dispatch(setIsDragging(handleType))
    setDragStartData({
      handle: handleType,
      initialTime: handleType === 'start' ? trimStart : trimEnd,
    })
  }

  const handleDragMove = (event: DragMoveEvent) => {
    if (!timelineRef.current || !duration || !dragStartData) return

    const rect = timelineRef.current.getBoundingClientRect()
    const totalDeltaX = event.delta.x
    const deltaPercentage = (totalDeltaX / rect.width) * 100
    const deltaTime = (deltaPercentage / 100) * duration
    const newTime = dragStartData.initialTime + deltaTime

    if (dragStartData.handle === 'start') {
      const preciseStart = Math.round(newTime * 1000) / 1000
      const clampedStart = Math.max(0, Math.min(preciseStart, trimEnd - 0.001))
      dispatch(setTrimRange({ start: clampedStart, end: trimEnd }))
    } else if (dragStartData.handle === 'end') {
      const preciseEnd = Math.round(newTime * 1000) / 1000
      const clampedEnd = Math.max(trimStart + 0.001, Math.min(preciseEnd, duration))
      dispatch(setTrimRange({ start: trimStart, end: clampedEnd }))
    }
  }

  const handleDragEnd = () => {
    dispatch(setIsDragging(null))
    setDragStartData(null)
  }

  const handleTrimBarClick = (relativePosition: number) => {
    if (!duration) return
    
    const trimDuration = trimEnd - trimStart
    const clickTime = trimStart + (relativePosition * trimDuration)
    
    const preciseTime = Math.round(clickTime * 1000) / 1000
    const clampedTime = Math.max(0, Math.min(duration, preciseTime))
    
    directSeek(clampedTime)
  }

  const progressPercentage: number = duration ? (currentTime / duration) * 100 : 0
  const trimStartPercentage: number = duration ? (trimStart / duration) * 100 : 0
  const trimEndPercentage: number = duration ? (trimEnd / duration) * 100 : 0

  const { thumbnails, isGenerating } = useVideoThumbnails(8)

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timelineHeader}>
        <span className={styles.timelineDuration}>
          {formatTime(trimEnd - trimStart)}
        </span>
      </div>
      
      <DndContext
        sensors={sensors}
        modifiers={[restrictToHorizontalAxis]}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <div
          ref={timelineRef}
          className={styles.timeline}
          onClick={handleTimelineClick}
        >
          <div className={styles.thumbnailTrackContainer}>
            <div className={styles.thumbnailTrack}>
            {isGenerating ? (
              <div className={styles.thumbnailLoading}>
                <div className={styles.loadingSpinner} />
                Generating thumbnails...
              </div>
            ) : (
              thumbnails.map((thumbnail, index) => (
                <div
                  key={index}
                  className={styles.thumbnail}
                  style={{
                    left: `${thumbnail.position}%`,
                    width: `${100 / thumbnails.length}%`
                  }}
                >
                  <img
                    src={thumbnail.dataUrl}
                    alt={`Frame at ${thumbnail.time.toFixed(1)}s`}
                    className={styles.thumbnailImage}
                    draggable={false}
                  />
                </div>
              ))
            )}
            </div>
            
            <div
              className={styles.playhead}
              style={{ left: `${progressPercentage}%` }}
            />
          </div>
          
          <TrimBar
            startPercentage={trimStartPercentage}
            endPercentage={trimEndPercentage}
            isDraggingStart={isDragging === 'start'}
            isDraggingEnd={isDragging === 'end'}
            onTrimBarClick={handleTrimBarClick}
          />
        </div>
      </DndContext>
    </div>
  )
}

