import { useEffect } from 'react'
import './ShadowSplashScreen.css'

const ASSET_ROOT = '/assets/Icons/Splash%20Screen'
const assetUrl = (fileName) => `${ASSET_ROOT}/${encodeURIComponent(fileName)}`

const SPLASH_ASSETS = [
  { id: 'moon', file: 'Moon.webp', motion: 'glow', x: 36, y: 8, width: '8vw', mobileX: 20, mobileY: 7, mobileWidth: '18vw', z: 4, duration: '4.8s', delay: '-1.2s' },
  { id: 'smoke', file: 'Purple smoke flying.webp', motion: 'drift', x: 50, y: 36, width: '38vw', mobileX: 50, mobileY: 31, mobileWidth: '82vw', z: 5, duration: '10s', delay: '-3s', opacity: 0.55 },
  { id: 'reaper', file: 'Reaper.webp', motion: 'float', x: 50, y: 30, width: '22vw', mobileX: 50, mobileY: 25, mobileWidth: '52vw', z: 10, duration: '4.2s', delay: '-1s' },
  { id: 'lamp-left', file: 'Lamp.webp', motion: 'swing', x: 15, y: 36, width: '5vw', mobileX: 8, mobileY: 32, mobileWidth: '11vw', z: 8, duration: '4.8s', delay: '-1.4s' },
  { id: 'lamp-right', file: 'Lamp.webp', motion: 'swing', x: 87, y: 44, width: '4.5vw', mobileX: 91, mobileY: 38, mobileWidth: '10vw', z: 8, duration: '5.2s', delay: '-2.6s', flip: -1 },
  { id: 'butterfly-left', file: 'Butterfly.webp', motion: 'fly', x: 36, y: 34, width: '4vw', mobileX: 20, mobileY: 35, mobileWidth: '11vw', z: 12, duration: '5.6s', delay: '-1.2s', flip: -1 },
  { id: 'butterfly-right', file: 'Butterfly.webp', motion: 'fly', x: 70, y: 25, width: '4.5vw', mobileX: 79, mobileY: 24, mobileWidth: '12vw', z: 12, duration: '6.2s', delay: '-3.4s' },
  { id: 'butterfly-small', file: 'Butterfly.webp', motion: 'fly', x: 67, y: 46, width: '2.5vw', mobileX: 78, mobileY: 43, mobileWidth: '7vw', z: 11, duration: '4.9s', delay: '-2.1s', flip: -1 },
  { id: 'wing-left', file: 'Wing.webp', motion: 'fall', x: 29, y: 15, width: '5vw', mobileX: 16, mobileY: 17, mobileWidth: '12vw', z: 7, duration: '7.5s', delay: '-4s' },
  { id: 'wing-right', file: 'Wing.webp', motion: 'fall', x: 68, y: 14, width: '5vw', mobileX: 82, mobileY: 15, mobileWidth: '12vw', z: 7, duration: '8.2s', delay: '-2s', flip: -1 },
  { id: 'paper-one', file: 'Paper1.webp', motion: 'paper', x: 24, y: 28, width: '8vw', mobileX: 10, mobileY: 23, mobileWidth: '18vw', z: 6, duration: '7s', delay: '-1.8s', rotate: '-13deg' },
  { id: 'paper-two', file: 'Papper2.webp', motion: 'paper', x: 81, y: 32, width: '9vw', mobileX: 91, mobileY: 29, mobileWidth: '19vw', z: 6, duration: '8s', delay: '-4.2s', rotate: '12deg' },
  { id: 'paper-three', file: 'Papper3.webp', motion: 'paper', x: 28, y: 47, width: '7vw', mobileX: 12, mobileY: 46, mobileWidth: '17vw', z: 6, duration: '6.5s', delay: '-3.1s', rotate: '-18deg' },
  { id: 'shrubs-left', file: 'Leafy shrubs and shade grasses.webp', motion: 'breathe', x: 18, y: 79, width: '19vw', mobileX: 15, mobileY: 80, mobileWidth: '38vw', z: 16, duration: '5.5s', delay: '-2.4s' },
  { id: 'shrubs-right', file: 'Leafy shrubs and shade grasses.webp', motion: 'breathe', x: 84, y: 80, width: '18vw', mobileX: 87, mobileY: 81, mobileWidth: '37vw', z: 16, duration: '6s', delay: '-1.1s', flip: -1 },
  { id: 'mushroom-left', file: 'glowing purple mushrooms.webp', motion: 'glow', x: 27, y: 75, width: '11vw', mobileX: 24, mobileY: 76, mobileWidth: '24vw', z: 17, duration: '4s', delay: '-1.5s' },
  { id: 'mushroom-right', file: 'glowing purple mushrooms.webp', motion: 'glow', x: 78, y: 82, width: '8vw', mobileX: 79, mobileY: 82, mobileWidth: '20vw', z: 17, duration: '4.6s', delay: '-2.8s', flip: -1 },
  { id: 'spark-one', file: 'Light Spark.webp', motion: 'twinkle', x: 19, y: 18, width: '1.6vw', mobileX: 8, mobileY: 19, mobileWidth: '4vw', z: 18, duration: '2.6s', delay: '-0.5s' },
  { id: 'spark-two', file: 'Light Spark.webp', motion: 'twinkle', x: 61, y: 12, width: '1.2vw', mobileX: 70, mobileY: 10, mobileWidth: '3.5vw', z: 18, duration: '3.1s', delay: '-1.8s' },
  { id: 'spark-three', file: 'Light Spark.webp', motion: 'twinkle', x: 74, y: 43, width: '1.4vw', mobileX: 88, mobileY: 49, mobileWidth: '4vw', z: 18, duration: '2.8s', delay: '-2.1s' },
  { id: 'spark-four', file: 'Light Spark.webp', motion: 'twinkle', x: 39, y: 44, width: '1vw', mobileX: 27, mobileY: 47, mobileWidth: '3vw', z: 18, duration: '3.4s', delay: '-1.2s' }
]

function SplashAsset({ item }) {
  const style = {
    '--asset-x': `${item.x}%`,
    '--asset-y': `${item.y}%`,
    '--asset-width': item.width,
    '--asset-mobile-x': `${item.mobileX}%`,
    '--asset-mobile-y': `${item.mobileY}%`,
    '--asset-mobile-width': item.mobileWidth,
    '--asset-z': item.z,
    '--asset-duration': item.duration,
    '--asset-delay': item.delay,
    '--asset-opacity': item.opacity ?? 1,
    '--asset-flip': item.flip ?? 1,
    '--asset-rotate': item.rotate ?? '0deg'
  }

  return (
    <img
      src={assetUrl(item.file)}
      alt=""
      aria-hidden="true"
      className={`shadow-splash__asset shadow-splash__asset--${item.motion}`}
      style={style}
      draggable="false"
    />
  )
}

export default function ShadowSplashScreen({ onFinish, duration = 4200 }) {
  useEffect(() => {
    if (typeof onFinish !== 'function' || duration <= 0) return undefined

    const timer = window.setTimeout(onFinish, duration)
    return () => window.clearTimeout(timer)
  }, [duration, onFinish])

  return (
    <div className="shadow-splash" role="status" aria-label="Loading Shadow">
      <img src={assetUrl('Night.webp')} alt="" aria-hidden="true" className="shadow-splash__night" draggable="false" />
      <div className="shadow-splash__vignette" />
      <img src={assetUrl('Mountain shadow.webp')} alt="" aria-hidden="true" className="shadow-splash__mountain shadow-splash__mountain--back" draggable="false" />
      <img src={assetUrl('Mountain shadow middle.webp')} alt="" aria-hidden="true" className="shadow-splash__mountain shadow-splash__mountain--middle" draggable="false" />

      {SPLASH_ASSETS.map((item) => (
        <SplashAsset key={item.id} item={item} />
      ))}

      <div className="shadow-splash__content">
        <h1 className="shadow-splash__logo">
          SHAD<span className="shadow-splash__logo-o">O</span>W
        </h1>
        <p className="shadow-splash__tagline">Stories live in the shadows. You bring them to light.</p>
        <div className="shadow-splash__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="shadow-splash__loading">LOADING...</p>
      </div>

      <img src={assetUrl('Shadow mountain in front.webp')} alt="" aria-hidden="true" className="shadow-splash__mountain shadow-splash__mountain--front" draggable="false" />
    </div>
  )
}
