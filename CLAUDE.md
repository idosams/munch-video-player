# Munch Video Player - Development Documentation

## Project Overview

This is a professional video player with trimming functionality and comprehensive video library management system built as a candidate assignment for Munch. The application allows users to upload videos, trim them with precision, and manage a library of video projects with persistent storage.

## Architecture & Technology Stack

### Core Technologies
- **React 19** with **Vite** for fast development and build
- **TypeScript** with strict type checking for robust code
- **Redux Toolkit** for predictable state management
- **React Router** for client-side routing
- **SCSS Modules** for component-scoped styling
- **IndexedDB** for persistent video and project storage

### Key Libraries
- **@dnd-kit** for drag-and-drop trim handles
- **@ffmpeg/ffmpeg** for video processing and trimming
- **uuid** for unique project identifiers

### Development Tools
- **Storybook** for component development and documentation
- **Playwright** for E2E testing
- **ESLint** for code quality

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── VideoPlayer.tsx   # Main video player with controls
│   ├── Timeline.tsx      # Draggable timeline with trim handles
│   ├── VideoLibrary.tsx  # Sidebar video project management
│   └── OptionsMenu.tsx   # Playback speed and settings
├── pages/               # Route-level components
│   ├── UploadPage.tsx   # Video upload interface
│   └── VideoEditPage.tsx # Individual video editing interface
├── store/               # Redux state management
│   ├── slices/
│   │   ├── videoDataSlice.ts    # Video file and playback data
│   │   ├── viewStateSlice.ts    # UI state and controls
│   │   └── videoLibrarySlice.ts # Video project management
│   └── index.ts         # Store configuration
├── hooks/               # Custom React hooks
│   ├── useVideoControls.ts    # Video playback and trimming logic
│   └── useVideoThumbnails.ts  # Timeline thumbnail generation
├── utils/               # Utility functions
│   ├── storage.ts       # IndexedDB video storage
│   ├── videoUtils.ts    # Video formatting and processing
│   └── logger.ts        # Centralized logging utility
├── types/               # TypeScript type definitions
│   ├── index.ts         # Main types and re-exports
│   ├── storage.ts       # Storage-related types
│   ├── video.ts         # Video processing types
│   └── ui.ts           # UI component types
└── stories/             # Storybook component stories
```

## Key Features

### 1. Video Library Management
- **Persistent Storage**: Videos and projects stored in IndexedDB
- **Grid Display**: Clean sidebar showing video thumbnails and metadata
- **Project State**: Each video maintains its own editing state (trim points, current time)
- **Session Persistence**: Data survives browser refreshes and sessions

### 2. Professional Video Player
- **HTML5 Video**: Native video element with custom controls
- **Trim Preview**: Play only the trimmed section without looping
- **Playback Controls**: Play/pause, seek, volume, speed control
- **Timeline Navigation**: Click-to-seek functionality
- **Duration Display**: Shows total duration and trimmed section length

### 3. Advanced Trimming System
- **Drag & Drop Handles**: Precise trim point adjustment using @dnd-kit
- **Visual Feedback**: Yellow trim handles with position indicators
- **Millisecond Precision**: Accurate time display and trimming
- **Live Preview**: Real-time preview of trimmed section
- **Video Export**: Download actual trimmed video files using FFmpeg

### 4. Responsive Design
- **Full-Width Layout**: Utilizes entire screen width
- **Grid-Based Layout**: Sidebar + main content responsive design
- **Mobile-Friendly**: Works across different screen sizes
- **Dark Theme**: Professional dark UI throughout

## State Management

### Redux Store Structure
```typescript
interface RootState {
  videoData: {
    videoSrc: string
    videoFile: File | null
    duration: number        // in seconds
    currentTime: number     // in seconds
    trimStart: number      // in seconds
    trimEnd: number        // in seconds
    isLoaded: boolean
  }
  viewState: {
    isPlaying: boolean
    isDragging: 'start' | 'end' | null
    showControls: boolean
    isFullscreen: boolean
    volume: number
    isMuted: boolean
    playbackRate: number
    error: string | null
    loading: boolean
    isPreviewMode: boolean
    showOptionsMenu: boolean
  }
  videoLibrary: {
    projects: VideoProject[]
    currentProjectId: string | null
  }
}
```

### Video Project Schema
```typescript
interface VideoProject {
  id: string                // UUID
  name: string             // Display name
  originalName: string     // Original filename
  duration: number         // Total duration in milliseconds
  createdAt: string       // ISO timestamp
  lastModified: string    // ISO timestamp
  thumbnailUrl?: string   // Optional thumbnail
  // Editing state
  trimStart: number       // In milliseconds
  trimEnd: number         // In milliseconds
  currentTime: number     // In milliseconds
  isLoaded: boolean
}
```

## Storage System

### IndexedDB Implementation
- **Database**: `MunchVideoPlayer` with version 1
- **Object Stores**: 
  - `videos`: Stores video blobs with metadata
  - `projects`: Stores project metadata and editing state
- **Blob Storage**: Videos stored as blobs for offline access
- **Metadata Storage**: Project information stored separately for quick access

### Storage Utilities
```typescript
class VideoStorage {
  async storeVideo(id: string, blob: Blob, filename: string): Promise<void>
  async getVideo(id: string): Promise<Blob | null>
  async storeProject(project: VideoProject): Promise<void>
  async getAllProjects(): Promise<VideoProject[]>
  async deleteVideo(id: string): Promise<void>
  async deleteProject(id: string): Promise<void>
  async getStorageInfo(): Promise<StorageInfo>
}
```

## Component Architecture

### VideoPlayer (Main Component)
- Handles video rendering and basic controls
- Integrates Timeline and OptionsMenu
- Manages video events and state updates
- Displays trim information and action buttons

### Timeline (Drag & Drop Interface)
- Renders video timeline with thumbnail previews
- Implements draggable trim handles using @dnd-kit
- Supports click-to-seek functionality
- Shows visual trim range indicators

### VideoLibrary (Sidebar Management)
- Displays all video projects in grid layout
- Handles project selection and deletion
- Implements direct file upload via "New" button
- Shows project metadata and editing status

### Custom Hooks

#### useVideoControls
- Manages video playback state and events
- Handles video seeking and timeline updates
- Implements trim preview functionality
- Processes video trimming with FFmpeg
- Provides file upload and project management

#### useVideoThumbnails
- Generates thumbnail previews for timeline
- Uses HTML5 Canvas for frame extraction
- Caches thumbnails for performance
- Handles thumbnail regeneration

## Testing Strategy

### E2E Tests (Playwright)
- **Upload Page**: Tests upload interface and file handling
- **Video Library**: Tests project management and navigation
- **Navigation**: Tests routing and state persistence
- **Responsive Design**: Tests across different viewport sizes
- **Accessibility**: Tests keyboard navigation and screen readers

### Component Stories (Storybook)
- **VideoLibrary**: Different states (empty, populated, selected)
- **UploadPage**: Default upload interface
- **OptionsMenu**: Open/closed states with different configurations

### Test Scripts
```bash
npm run test:e2e          # Run E2E tests headless
npm run test:e2e:ui       # Run with Playwright UI
npm run test:e2e:headed   # Run in headed mode
npm run storybook         # Start Storybook dev server
```

## Performance Optimizations

### Video Handling
- **Object URLs**: Efficient blob URL management with cleanup
- **Canvas Rendering**: Optimized thumbnail generation
- **Memory Management**: Proper cleanup of video resources
- **Lazy Loading**: Components load video data on demand

### State Management
- **Normalized State**: Efficient Redux state structure
- **Selective Updates**: Only update changed state properties
- **Debounced Saves**: Prevent excessive storage writes
- **Memoization**: React.useCallback for expensive operations

### Storage Optimization
- **Compressed Thumbnails**: JPEG thumbnails at 70% quality
- **Selective Loading**: Load project metadata without video blobs
- **Batch Operations**: Efficient IndexedDB transactions
- **Storage Monitoring**: Track usage and available space

## Build and Development

### Development Commands
```bash
npm run dev               # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run storybook        # Start Storybook
```

### Build Configuration
- **Vite**: Fast development and optimized production builds
- **TypeScript**: Strict type checking with comprehensive types
- **SCSS**: Component-scoped styling with CSS modules
- **ESLint**: Code quality and consistency enforcement

## Error Handling

### Centralized Logging
```typescript
import { logger } from '../utils/logger'

logger.error('Error message', errorObject)
logger.warn('Warning message', data)
logger.info('Info message', data)     // Development only
logger.debug('Debug message', data)   // Development only
```

### Error Boundaries
- **Storage Errors**: Graceful handling of IndexedDB failures
- **Video Errors**: Fallback for unsupported video formats
- **Network Errors**: Handling for external resource loading
- **FFmpeg Errors**: Timeout and fallback for video processing

## Browser Compatibility

### Supported Features
- **HTML5 Video**: All modern browsers
- **IndexedDB**: Chrome 24+, Firefox 16+, Safari 10+
- **File API**: All modern browsers
- **Canvas API**: All modern browsers
- **ES2020+**: Modern JavaScript features

### Progressive Enhancement
- **Core Functionality**: Works without advanced features
- **Storage Fallback**: Graceful degradation if IndexedDB unavailable
- **Video Format Support**: Multiple format support with fallbacks

## Security Considerations

### File Upload Security
- **Client-side Validation**: File type and size restrictions
- **Content Type Checking**: Verify video MIME types
- **No Server Upload**: All processing happens client-side
- **Secure Blob Handling**: Proper URL cleanup and memory management

### Data Privacy
- **Local Storage Only**: No data sent to external servers
- **User Control**: Users can delete their data anytime
- **No Tracking**: No analytics or external tracking
- **Offline Capable**: Works completely offline

## Future Enhancements

### Planned Features
1. **Advanced Editing**: Multiple trim ranges, video effects
2. **Export Options**: Different quality settings and formats
3. **Batch Processing**: Process multiple videos simultaneously
4. **Cloud Sync**: Optional cloud storage integration
5. **Collaborative Editing**: Share projects with team members
6. **Advanced Timeline**: Zoom, snap-to-grid, keyboard shortcuts

### Technical Improvements
1. **Web Workers**: Offload heavy processing
2. **WebAssembly**: Faster video processing
3. **Service Workers**: Better offline support
4. **WebRTC**: Real-time collaboration features
5. **WebCodecs**: Native browser video processing

## Troubleshooting

### Common Issues
1. **FFmpeg Loading**: If FFmpeg fails to load, check CORS settings
2. **Storage Quota**: Monitor IndexedDB storage usage
3. **Video Playback**: Ensure supported video formats
4. **Performance**: Check for memory leaks in video handling

### Debug Tools
- **Redux DevTools**: Monitor state changes
- **Browser DevTools**: Network, Performance, Application tabs
- **Storybook**: Isolated component testing
- **Playwright**: E2E test debugging

## License and Credits

Built as a candidate assignment for Munch using open-source technologies:
- React, Redux, TypeScript
- FFmpeg for video processing
- @dnd-kit for drag and drop
- Playwright for testing
- Storybook for component development