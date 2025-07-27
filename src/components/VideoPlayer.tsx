import { useSelector, useDispatch } from 'react-redux'
import { useVideoControls } from '../hooks/useVideoControls'
import { setShowOptionsMenu } from '../store/slices/viewStateSlice'
import { RootState } from '../types'
import { Timeline } from './Timeline'
import { OptionsMenu } from './OptionsMenu'
import { VideoUpload } from './VideoUpload'
import { VideoDisplay } from './VideoDisplay'
import { TrimControls } from './TrimControls'
import { VideoActions } from './VideoActions'
import styles from './VideoPlayer.module.scss'

export const VideoPlayer = () => {
  const dispatch = useDispatch()
  const { videoRef, handlePlay, handleFileUpload, playTrimmedSection, exitPreviewMode, removeVideo, downloadTrimmedVideo } = useVideoControls()
  
  const { videoSrc } = useSelector((state: RootState) => state.videoData)
  const { showOptionsMenu } = useSelector((state: RootState) => state.viewState)

  return (
    <div className={styles.videoPlayer}>
      <div className={styles.videoContainer}>
        {!videoSrc ? (
          <VideoUpload onFileUpload={handleFileUpload} />
        ) : (
          <VideoDisplay 
            videoRef={videoRef}
            videoSrc={videoSrc}
            onPlay={handlePlay}
          />
        )}
      </div>

      {videoSrc && (
        <>
          <Timeline videoRef={videoRef} />
          <TrimControls 
            onPlayTrimmedSection={playTrimmedSection}
            onExitPreviewMode={exitPreviewMode}
          />
          <VideoActions 
            onRemoveVideo={removeVideo}
            onFileUpload={handleFileUpload}
            onDownloadTrimmedVideo={downloadTrimmedVideo}
          />
        </>
      )}
      
      <OptionsMenu 
        isOpen={showOptionsMenu} 
        onClose={() => dispatch(setShowOptionsMenu(false))} 
      />
    </div>
  )
}

