import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { OptionsMenu } from '../components/OptionsMenu';
import { viewStateReducer } from '../store/slices/viewStateSlice';

const meta: Meta<typeof OptionsMenu> = {
  title: 'Components/OptionsMenu',
  component: OptionsMenu,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
    },
  },
  decorators: [
    (Story, { args }) => {
      const store = configureStore({
        reducer: {
          viewState: viewStateReducer,
        },
        preloadedState: {
          viewState: {
            isPlaying: false,
            isDragging: null,
            showControls: true,
            isFullscreen: false,
            volume: 0.8,
            isMuted: false,
            playbackRate: 1,
            error: null,
            loading: false,
            isPreviewMode: false,
            showOptionsMenu: args.isOpen || false,
          },
        },
      });

      return (
        <Provider store={store}>
          <div style={{ position: 'relative', width: '300px', height: '200px' }}>
            <Story />
          </div>
        </Provider>
      );
    },
  ],
};

export { meta as default };
type Story = StoryObj<typeof OptionsMenu>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Close menu'),
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log('Close menu'),
  },
};