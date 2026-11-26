import { Input, MP4, QTFF, BlobSource, Output, Mp4OutputFormat, BufferTarget, Conversion, Quality } from 'mediabunny'

const MAX_BYTES = 30 * 1024 * 1024
const MAX_DURATION = 60
const MAX_PIXELS = 3840 * 2160

async function compress(file) {
  if (!(file instanceof Blob) || file.size < 1024 || file.size > MAX_BYTES) return null
  if (typeof VideoEncoder === 'undefined' || typeof VideoDecoder === 'undefined' || typeof OffscreenCanvas === 'undefined') return null
  const input = new Input({ source: new BlobSource(file), formats: [MP4, QTFF] })
  let check
  try {
    const videoTracks = await input.getVideoTracks()
    const audioTracks = await input.getAudioTracks()
    if (videoTracks.length !== 1 || audioTracks.length > 1) return null
    const track = videoTracks[0]
    const duration = await input.computeDuration()
    const width = await track.getDisplayWidth()
    const height = await track.getDisplayHeight()
    if (!Number.isFinite(duration) || duration <= 0 || duration > MAX_DURATION || !Number.isFinite(width) || !Number.isFinite(height) || width < 2 || height < 2 || width * height > MAX_PIXELS) return null
    const audioBitrate = audioTracks.length ? 128000 : 0
    const sourceBitrate = file.size * 8 / duration
    if (sourceBitrate < 600000) return null
    const videoBitrate = Math.floor(Math.min(1500000, sourceBitrate * 0.75 - audioBitrate))
    if (videoBitrate < 400000) return null
    const landscape = width >= height
    const scale = Math.min(1, (landscape ? 1280 : 720) / width, (landscape ? 720 : 1280) / height)
    const outWidth = Math.max(2, Math.floor(width * scale / 2) * 2)
    const outHeight = Math.max(2, Math.floor(height * scale / 2) * 2)
    const target = new BufferTarget()
    const output = new Output({ format: new Mp4OutputFormat({ fastStart: 'in-memory' }), target })
    const conversion = await Conversion.init({
      input,
      output,
      video: { width: outWidth, height: outHeight, fit: 'contain', codec: 'avc', quality: new Quality({ bitrate: videoBitrate }), hardwareAcceleration: 'prefer-hardware' },
      audio: { codec: 'aac' },
    })
    if (!conversion.isValid || conversion.discardedTracks.length) return null
    let lastProgress = -1
    conversion.onProgress = value => {
      const progress = Math.floor(value * 100)
      if (progress > lastProgress) {
        lastProgress = progress
        self.postMessage({ type: 'progress', value: progress / 100 })
      }
    }
    await conversion.execute()
    const buffer = target.buffer
    if (!(buffer instanceof ArrayBuffer) || buffer.byteLength < 1024 || buffer.byteLength > file.size * 0.9) return null
    const header = new Uint8Array(buffer, 4, 4)
    if (String.fromCharCode(...header) !== 'ftyp') return null
    check = new Input({ source: new BlobSource(new Blob([buffer], { type: 'video/mp4' })), formats: [MP4] })
    const outputDuration = await check.getDurationFromMetadata()
    if (!Number.isFinite(outputDuration) || outputDuration <= 0 || outputDuration > MAX_DURATION || Math.abs(outputDuration - duration) > Math.min(0.5, duration * 0.05)) return null
    const outputVideo = await check.getVideoTracks()
    const outputAudio = await check.getAudioTracks()
    if (outputVideo.length !== 1 || outputAudio.length !== audioTracks.length) return null
    return buffer
  } finally {
    check?.dispose()
    input.dispose()
  }
}

self.onmessage = async ({ data }) => {
  try {
    const buffer = await compress(data)
    if (!buffer) return self.postMessage({ type: 'skip' })
    self.postMessage({ type: 'done', buffer }, [buffer])
  } catch {
    self.postMessage({ type: 'skip' })
  }
}
