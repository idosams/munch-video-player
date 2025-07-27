import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { UploadPage } from '../pages/UploadPage';
import { videoLibraryReducer } from '../store/slices/videoLibrarySlice';
import { videoDataReducer } from '../store/slices/videoDataSlice';
import { viewStateReducer } from '../store/slices/viewStateSlice';

const meta: Meta<typeof UploadPage> = {
  title: 'Pages/UploadPage',
  component: UploadPage,
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
          <Story />
        </Provider>
      );
    },
  ],
};

export { meta as default };
type Story = StoryObj<typeof UploadPage>;

export const Default: Story = {};