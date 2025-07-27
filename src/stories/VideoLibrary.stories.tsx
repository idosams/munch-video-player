import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { VideoLibrary } from '../components/VideoLibrary';
import { videoLibraryReducer } from '../store/slices/videoLibrarySlice';
import { videoDataReducer } from '../store/slices/videoDataSlice';
import { viewStateReducer } from '../store/slices/viewStateSlice';

const meta: Meta<typeof VideoLibrary> = {
  title: 'Components/VideoLibrary',
  component: VideoLibrary,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => {
      const store = configureStore({
        reducer: {
          videoLibrary: videoLibraryReducer,
          videoData: videoDataReducer,
          viewState: viewStateReducer,
        },
        preloadedState: {
          videoLibrary: {
            projects: [
              {
                id: '1',
                name: 'Sample Video 1.mp4',
                originalName: 'Sample Video 1.mp4',
                duration: 120000,
                createdAt: '2024-07-27T10:00:00Z',
                lastModified: '2024-07-27T10:30:00Z',
                trimStart: 0,
                trimEnd: 120000,
                currentTime: 0,
                isLoaded: false,
              },
              {
                id: '2',
                name: 'Demo Footage.mp4',
                originalName: 'Demo Footage.mp4',
                duration: 180000,
                createdAt: '2024-07-27T09:00:00Z',
                lastModified: '2024-07-27T11:00:00Z',
                trimStart: 10000,
                trimEnd: 150000,
                currentTime: 45000,
                isLoaded: true,
              },
              {
                id: '3',
                name: 'Tutorial Recording.mp4',
                originalName: 'Tutorial Recording.mp4',
                duration: 300000,
                createdAt: '2024-07-26T14:00:00Z',
                lastModified: '2024-07-27T16:00:00Z',
                trimStart: 5000,
                trimEnd: 295000,
                currentTime: 150000,
                isLoaded: false,
              },
            ],
            currentProjectId: '2',
          },
          videoData: {
            videoSrc: '',
            videoFile: null,
            duration: 0,
            currentTime: 0,
            trimStart: 0,
            trimEnd: 0,
            isLoaded: false,
          },
          viewState: {
            isPlaying: false,
            isDragging: null,
            showControls: true,
            isFullscreen: false,
            volume: 1,
            isMuted: false,
            playbackRate: 1,
            error: null,
            loading: false,
            isPreviewMode: false,
            showOptionsMenu: false,
          },
        },
      });

      return (
        <Provider store={store}>
          <div style={{ width: '300px', height: '100vh' }}>
            <Story />
          </div>
        </Provider>
      );
    },
  ],
};

export { meta as default };
type Story = StoryObj<typeof VideoLibrary>;

export const Default: Story = {};

export const Empty: Story = {
  decorators: [
    (Story) => {
      const store = configureStore({
        reducer: {
          videoLibrary: videoLibraryReducer,
          videoData: videoDataReducer,
          viewState: viewStateReducer,
        },
        preloadedState: {
          videoLibrary: {
            projects: [],
            currentProjectId: null,
          },
          videoData: {
            videoSrc: '',
            videoFile: null,
            duration: 0,
            currentTime: 0,
            trimStart: 0,
            trimEnd: 0,
            isLoaded: false,
          },
          viewState: {
            isPlaying: false,
            isDragging: null,
            showControls: true,
            isFullscreen: false,
            volume: 1,
            isMuted: false,
            playbackRate: 1,
            error: null,
            loading: false,
            isPreviewMode: false,
            showOptionsMenu: false,
          },
        },
      });

      return (
        <Provider store={store}>
          <div style={{ width: '300px', height: '100vh' }}>
            <Story />
          </div>
        </Provider>
      );
    },
  ],
};