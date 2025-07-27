window.ffmpegConfig = {
  coreURL: new URL('./ffmpeg-core.js', import.meta.url).href,
  wasmURL: new URL('./ffmpeg-core.wasm', import.meta.url).href,
}