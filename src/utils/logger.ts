export const logger = {
  error: (message: string, error?: unknown) => {
    console.error(`[VideoPlayer Error]: ${message}`, error)
  },
  
  warn: (message: string, data?: unknown) => {
    console.warn(`[VideoPlayer Warning]: ${message}`, data)
  },
  
  info: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[VideoPlayer Info]: ${message}`, data)
    }
  },
  
  debug: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[VideoPlayer Debug]: ${message}`, data)
    }
  }
}