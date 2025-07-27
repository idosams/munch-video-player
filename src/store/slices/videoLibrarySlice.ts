import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface VideoProject {
  id: string
  name: string
  originalName: string
  duration: number
  createdAt: string
  lastModified: string
  thumbnailUrl?: string
  trimStart: number
  trimEnd: number
  currentTime: number
  isLoaded: boolean
}

interface VideoLibraryState {
  projects: VideoProject[]
  currentProjectId: string | null
}

const initialState: VideoLibraryState = {
  projects: [],
  currentProjectId: null,
}

const videoLibrarySlice = createSlice({
  name: 'videoLibrary',
  initialState,
  reducers: {
    addProject: (state, action: PayloadAction<VideoProject>) => {
      state.projects.push(action.payload)
    },
    removeProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(p => p.id !== action.payload)
      if (state.currentProjectId === action.payload) {
        state.currentProjectId = null
      }
    },
    updateProject: (state, action: PayloadAction<Partial<VideoProject> & { id: string }>) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.projects[index] = { ...state.projects[index], ...action.payload }
      }
    },
    setCurrentProject: (state, action: PayloadAction<string | null>) => {
      state.currentProjectId = action.payload
    },
    loadProjects: (state, action: PayloadAction<VideoProject[]>) => {
      state.projects = action.payload
    },
  },
})

export const {
  addProject,
  removeProject,
  updateProject,
  setCurrentProject,
  loadProjects,
} = videoLibrarySlice.actions

export const videoLibraryReducer = videoLibrarySlice.reducer