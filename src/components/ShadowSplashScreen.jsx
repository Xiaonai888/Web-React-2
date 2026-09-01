import { useEffect, useState } from 'react'
import './ShadowSplashScreen.css'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('shadowSplashScreen', {
  "en": {
    "loading": "LOADING..."
  },
  "km": {
    "loading": "កំពុងផ្ទុក..."
  },
  "zh": {
    "loading": "加载中..."
  },
  "ja": {
    "loading": "読み込み中..."
  },
  "ko": {
    "loading": "로딩 중..."
  }
})


const ASSET_ROOT = '/assets/Icons/Splash%20Screen'
const assetUrl = (fileName) => `${ASSET_ROOT}/${encodeURIComponent(fileName)}`

const COMPUTER_LAYOUT = {
  width: 1920,
  height: 1080,
  content: { x: 960, y: 690, width: 820 },
  assets: [
    { id: 'background', file: 'Background.webp', x: 960, y: 540, width: 1920, z: 0, motion: 'still', opacity: 1 },
    { id: 'moon', file: 'Moon.webp', x: 690, y: 120, width: 118, z: 3, motion: 'glow', duration: '5.4s', delay: '-1.2s' },
    { id: 'smoke-back', file: 'Purple smoke flying.webp', x: 960, y: 370, width: 980, z: 4, motion: 'drift', duration: '18s', delay: '-7s', opacity: 0.16 },
    { id: 'reaper', file: 'Reaper.webp', x: 960, y: 340, width: 430, z: 9, motion: 'reaper-travel', duration: '18s', delay: '-4.5s', pathX1: '-1240px', pathY1: '18px', pathX2: '-280px', pathY2: '-18px', pathX3: '1240px', pathY3: '12px', pathX4: '280px', pathY4: '22px' },
    { id: 'lamp-left', file: 'Lamp.webp', x: 225, y: 460, width: 82, z: 8, motion: 'swing', duration: '5.6s', delay: '-1.5s' },
    { id: 'lamp-right', file: 'Lamp.webp', x: 1690, y: 545, width: 76, z: 8, motion: 'swing', duration: '6.2s', delay: '-2.7s', flip: -1 },
    { id: 'butterfly-left', file: 'Butterfly.webp', x: 660, y: 395, width: 92, z: 11, motion: 'butterfly-flight', duration: '5.2s', delay: '-1.1s', flip: -1, pathX1: '-85px', pathY1: '285px', pathX2: '55px', pathY2: '125px', pathX3: '-42px', pathY3: '-55px', pathX4: '92px', pathY4: '-285px', startScale: 0.28, midScale: 0.72, endScale: 1.12 },
    { id: 'butterfly-right', file: 'Butterfly.webp', x: 1280, y: 315, width: 108, z: 11, motion: 'butterfly-flight', duration: '4.7s', delay: '-3.5s', pathX1: '70px', pathY1: '320px', pathX2: '-65px', pathY2: '155px', pathX3: '48px', pathY3: '-85px', pathX4: '-105px', pathY4: '-310px', startScale: 0.22, midScale: 0.68, endScale: 1.08 },
    { id: 'butterfly-small', file: 'Butterfly.webp', x: 1325, y: 505, width: 60, z: 10, motion: 'butterfly-flight', duration: '4.2s', delay: '-2.3s', flip: -1, pathX1: '-45px', pathY1: '235px', pathX2: '80px', pathY2: '95px', pathX3: '-72px', pathY3: '-75px', pathX4: '45px', pathY4: '-245px', startScale: 0.32, midScale: 0.76, endScale: 1.18 },
    { id: 'wing-left', file: 'Wing.webp', x: 420, y: 80, width: 96, z: 7, motion: 'feather-fall', duration: '12.8s', delay: '-4.2s', fallX: '150px', fallY: '940px', fallSpin: '185deg', swayX: '-72px' },
    { id: 'wing-right', file: 'Wing.webp', x: 1430, y: 50, width: 104, z: 7, motion: 'feather-fall', duration: '15.2s', delay: '-9.4s', flip: -1, fallX: '-185px', fallY: '980px', fallSpin: '-220deg', swayX: '88px' },
    { id: 'wing-middle', file: 'Wing.webp', x: 930, y: -20, width: 72, z: 7, motion: 'feather-fall', duration: '11.6s', delay: '-6.7s', fallX: '115px', fallY: '1030px', fallSpin: '260deg', swayX: '-55px' },
    { id: 'wing-far-left', file: 'Wing.webp', x: 150, y: 10, width: 58, z: 6, motion: 'feather-fall', duration: '17.4s', delay: '-12.3s', flip: -1, fallX: '245px', fallY: '990px', fallSpin: '-175deg', swayX: '68px', opacity: 0.72 },
    { id: 'wing-far-right', file: 'Wing.webp', x: 1760, y: 120, width: 66, z: 6, motion: 'feather-fall', duration: '13.9s', delay: '-2.8s', fallX: '-210px', fallY: '900px', fallSpin: '205deg', swayX: '-78px', opacity: 0.78 },
    { id: 'paper-one', file: 'Paper1.webp', x: 405, y: 310, width: 155, z: 6, motion: 'paper-orbit', duration: '13.5s', delay: '-1.9s', rotate: '-12deg', pathX1: '-35px', pathY1: '-20px', pathX2: '105px', pathY2: '75px', pathX3: '35px', pathY3: '155px', pathX4: '-95px', pathY4: '65px', orbitSpin: '22deg' },
    { id: 'paper-two', file: 'Papper2.webp', x: 1530, y: 360, width: 165, z: 6, motion: 'paper-orbit', duration: '15.8s', delay: '-4.3s', rotate: '11deg', pathX1: '45px', pathY1: '-30px', pathX2: '-115px', pathY2: '55px', pathX3: '-30px', pathY3: '170px', pathX4: '100px', pathY4: '70px', orbitSpin: '-26deg' },
    { id: 'paper-three', file: 'Papper3.webp', x: 510, y: 525, width: 128, z: 6, motion: 'paper-orbit', duration: '11.9s', delay: '-3.2s', rotate: '-17deg', pathX1: '-20px', pathY1: '35px', pathX2: '90px', pathY2: '-80px', pathX3: '145px', pathY3: '45px', pathX4: '25px', pathY4: '125px', orbitSpin: '30deg' },
    { id: 'spark-one', file: 'Light Spark.webp', x: 345, y: 205, width: 32, z: 12, motion: 'twinkle', duration: '2.8s', delay: '-0.6s' },
    { id: 'spark-two', file: 'Light Spark.webp', x: 1170, y: 145, width: 25, z: 12, motion: 'twinkle', duration: '3.3s', delay: '-1.9s' },
    { id: 'spark-three', file: 'Light Spark.webp', x: 1450, y: 475, width: 29, z: 12, motion: 'twinkle', duration: '3s', delay: '-2.2s' },
    { id: 'spark-four', file: 'Light Spark.webp', x: 725, y: 500, width: 22, z: 12, motion: 'twinkle', duration: '3.6s', delay: '-1.3s' }
  ],
  fogs: [
    { id: 'fog-back-left', x: 380, y: 350, width: 900, height: 260, z: 2, opacity: 0.1, duration: '20s', delay: '-8s' },
    { id: 'fog-back-right', x: 1510, y: 390, width: 860, height: 250, z: 2, opacity: 0.08, duration: '23s', delay: '-12s' },
    { id: 'fog-middle', x: 960, y: 540, width: 1320, height: 230, z: 5, opacity: 0.06, duration: '18s', delay: '-5s' },
    { id: 'fog-front', x: 960, y: 855, width: 1660, height: 210, z: 18, opacity: 0.08, duration: '16s', delay: '-7s' }
  ],
  glows: [
    { id: 'glow-left-main', x: 225, y: 870, width: 310, height: 170, z: 1, color: 'rgba(177, 123, 255, 0.52)', blur: 34, duration: '4.9s', delay: '-0.8s' },
    { id: 'glow-left-soft', x: 350, y: 905, width: 260, height: 110, z: 1, color: 'rgba(121, 92, 219, 0.34)', blur: 38, duration: '7.1s', delay: '-3.6s' },
    { id: 'glow-center-valley', x: 960, y: 980, width: 460, height: 110, z: 1, color: 'rgba(131, 104, 255, 0.30)', blur: 44, duration: '6.3s', delay: '-1.9s' },
    { id: 'glow-right-main', x: 1690, y: 885, width: 300, height: 165, z: 1, color: 'rgba(169, 120, 255, 0.46)', blur: 34, duration: '5.7s', delay: '-4.7s' },
    { id: 'glow-right-soft', x: 1540, y: 915, width: 260, height: 115, z: 1, color: 'rgba(115, 87, 217, 0.30)', blur: 40, duration: '8.2s', delay: '-2.5s' }
  ]
}

const PHONE_LAYOUT = {
  width: 1080,
  height: 1920,
  content: { x: 540, y: 1010, width: 760 },
  assets: [
    { id: 'background', file: 'Background.webp', x: 540, y: 1330, width: 2060, z: 0, motion: 'still', opacity: 1 },
    { id: 'moon', file: 'Moon.webp', x: 285, y: 160, width: 124, z: 3, motion: 'glow', duration: '5.4s', delay: '-1.2s' },
    { id: 'smoke-back', file: 'Purple smoke flying.webp', x: 540, y: 565, width: 860, z: 4, motion: 'drift', duration: '18s', delay: '-7s', opacity: 0.14 },
    { id: 'reaper', file: 'Reaper.webp', x: 540, y: 430, width: 430, z: 9, motion: 'reaper-travel', duration: '17s', delay: '-4.5s', pathX1: '-820px', pathY1: '16px', pathX2: '-170px', pathY2: '-16px', pathX3: '820px', pathY3: '10px', pathX4: '170px', pathY4: '20px' },
    { id: 'lamp-left', file: 'Lamp.webp', x: 220, y: 1185, width: 68, z: 10, motion: 'swing', duration: '5.6s', delay: '-1.5s' },
    { id: 'lamp-right', file: 'Lamp.webp', x: 850, y: 1260, width: 64, z: 10, motion: 'swing', duration: '6.2s', delay: '-2.7s', flip: -1 },
    { id: 'butterfly-left', file: 'Butterfly.webp', x: 165, y: 560, width: 96, z: 11, motion: 'butterfly-flight', duration: '5.2s', delay: '-1.1s', flip: -1, pathX1: '-55px', pathY1: '310px', pathX2: '62px', pathY2: '145px', pathX3: '-38px', pathY3: '-70px', pathX4: '72px', pathY4: '-300px', startScale: 0.26, midScale: 0.7, endScale: 1.1 },
    { id: 'butterfly-right', file: 'Butterfly.webp', x: 794, y: 452, width: 108, z: 11, motion: 'butterfly-flight', duration: '4.8s', delay: '-3.5s', pathX1: '55px', pathY1: '320px', pathX2: '-62px', pathY2: '135px', pathX3: '46px', pathY3: '-82px', pathX4: '-78px', pathY4: '-305px', startScale: 0.22, midScale: 0.66, endScale: 1.06 },
    { id: 'butterfly-small', file: 'Butterfly.webp', x: 815, y: 714, width: 60, z: 10, motion: 'butterfly-flight', duration: '4.1s', delay: '-2.3s', flip: -1, pathX1: '-40px', pathY1: '245px', pathX2: '68px', pathY2: '100px', pathX3: '-58px', pathY3: '-95px', pathX4: '38px', pathY4: '-255px', startScale: 0.3, midScale: 0.74, endScale: 1.16 },
    { id: 'wing-left', file: 'Wing.webp', x: 115, y: 30, width: 88, z: 7, motion: 'feather-fall', duration: '13.4s', delay: '-4.2s', fallX: '125px', fallY: '1740px', fallSpin: '190deg', swayX: '-58px' },
    { id: 'wing-right', file: 'Wing.webp', x: 930, y: 10, width: 94, z: 7, motion: 'feather-fall', duration: '15.7s', delay: '-9.4s', flip: -1, fallX: '-145px', fallY: '1770px', fallSpin: '-225deg', swayX: '66px' },
    { id: 'wing-middle', file: 'Wing.webp', x: 530, y: -60, width: 62, z: 7, motion: 'feather-fall', duration: '11.9s', delay: '-6.7s', fallX: '95px', fallY: '1840px', fallSpin: '265deg', swayX: '-45px' },
    { id: 'wing-far-left', file: 'Wing.webp', x: 30, y: 190, width: 52, z: 6, motion: 'feather-fall', duration: '17.8s', delay: '-12.3s', flip: -1, fallX: '175px', fallY: '1580px', fallSpin: '-180deg', swayX: '52px', opacity: 0.7 },
    { id: 'wing-far-right', file: 'Wing.webp', x: 1045, y: 140, width: 56, z: 6, motion: 'feather-fall', duration: '14.2s', delay: '-2.8s', fallX: '-160px', fallY: '1640px', fallSpin: '210deg', swayX: '-62px', opacity: 0.76 },
    { id: 'paper-one', file: 'Paper1.webp', x: 85, y: 425, width: 152, z: 6, motion: 'paper-orbit', duration: '13.5s', delay: '-1.9s', rotate: '-12deg', pathX1: '-18px', pathY1: '-20px', pathX2: '88px', pathY2: '68px', pathX3: '35px', pathY3: '145px', pathX4: '-65px', pathY4: '58px', orbitSpin: '22deg' },
    { id: 'paper-two', file: 'Papper2.webp', x: 1000, y: 505, width: 160, z: 6, motion: 'paper-orbit', duration: '15.8s', delay: '-4.3s', rotate: '11deg', pathX1: '20px', pathY1: '-25px', pathX2: '-92px', pathY2: '52px', pathX3: '-28px', pathY3: '152px', pathX4: '72px', pathY4: '62px', orbitSpin: '-26deg' },
    { id: 'paper-three', file: 'Papper3.webp', x: 148, y: 735, width: 126, z: 6, motion: 'paper-orbit', duration: '11.9s', delay: '-3.2s', rotate: '-17deg', pathX1: '-12px', pathY1: '25px', pathX2: '72px', pathY2: '-68px', pathX3: '105px', pathY3: '35px', pathX4: '20px', pathY4: '110px', orbitSpin: '30deg' },
    { id: 'spark-one', file: 'Light Spark.webp', x: 110, y: 282, width: 34, z: 12, motion: 'twinkle', duration: '2.8s', delay: '-0.6s' },
    { id: 'spark-two', file: 'Light Spark.webp', x: 765, y: 176, width: 28, z: 12, motion: 'twinkle', duration: '3.3s', delay: '-1.9s' },
    { id: 'spark-three', file: 'Light Spark.webp', x: 895, y: 770, width: 30, z: 12, motion: 'twinkle', duration: '3s', delay: '-2.2s' },
    { id: 'spark-four', file: 'Light Spark.webp', x: 220, y: 782, width: 24, z: 12, motion: 'twinkle', duration: '3.6s', delay: '-1.3s' }
  ],
  fogs: [
    { id: 'fog-back-left', x: 220, y: 530, width: 760, height: 220, z: 2, opacity: 0.08, duration: '20s', delay: '-8s' },
    { id: 'fog-back-right', x: 860, y: 595, width: 730, height: 230, z: 2, opacity: 0.07, duration: '23s', delay: '-12s' },
    { id: 'fog-middle', x: 540, y: 900, width: 920, height: 220, z: 5, opacity: 0.05, duration: '18s', delay: '-5s' },
    { id: 'fog-bridge', x: 540, y: 1220, width: 980, height: 250, z: 6, opacity: 0.075, duration: '19s', delay: '-6s' },
    { id: 'fog-front', x: 540, y: 1500, width: 1380, height: 220, z: 18, opacity: 0.07, duration: '16s', delay: '-7s' }
  ],
  glows: [
    { id: 'lamp-halo-left', x: 220, y: 1195, width: 150, height: 150, z: 9, color: 'rgba(190, 137, 255, 0.52)', blur: 28, duration: '4.6s', delay: '-0.7s' },
    { id: 'lamp-halo-right', x: 850, y: 1270, width: 145, height: 145, z: 9, color: 'rgba(175, 125, 255, 0.46)', blur: 28, duration: '5.8s', delay: '-3.4s' },
    { id: 'plant-glow-left-edge', x: 90, y: 1530, width: 175, height: 110, z: 2, color: 'rgba(184, 126, 255, 0.58)', blur: 25, duration: '4.9s', delay: '-0.9s' },
    { id: 'plant-glow-left-middle', x: 270, y: 1585, width: 190, height: 105, z: 2, color: 'rgba(131, 98, 232, 0.44)', blur: 28, duration: '7.4s', delay: '-4.1s' },
    { id: 'plant-glow-center-left', x: 430, y: 1665, width: 170, height: 90, z: 2, color: 'rgba(151, 112, 255, 0.4)', blur: 30, duration: '6.2s', delay: '-1.8s' },
    { id: 'plant-glow-center', x: 565, y: 1715, width: 205, height: 90, z: 2, color: 'rgba(126, 105, 255, 0.38)', blur: 32, duration: '8.1s', delay: '-5.7s' },
    { id: 'plant-glow-right-middle', x: 760, y: 1615, width: 185, height: 100, z: 2, color: 'rgba(142, 101, 236, 0.43)', blur: 28, duration: '5.6s', delay: '-2.9s' },
    { id: 'plant-glow-right-edge', x: 970, y: 1550, width: 175, height: 115, z: 2, color: 'rgba(181, 124, 255, 0.54)', blur: 25, duration: '6.8s', delay: '-4.8s' }
  ]
}

function getViewport() {
  return {
    width: Math.max(window.innerWidth, 1),
    height: Math.max(window.innerHeight, 1)
  }
}

function SceneAsset({ item }) {
  const imageStyle = {
    '--asset-duration': item.duration ?? '1s',
    '--asset-delay': item.delay ?? '0s',
    '--asset-flip': item.flip ?? 1,
    '--asset-return-flip': -(item.flip ?? 1),
    '--asset-rotate': item.rotate ?? '0deg',
    '--path-x-1': item.pathX1 ?? '0px',
    '--path-y-1': item.pathY1 ?? '0px',
    '--path-x-2': item.pathX2 ?? '0px',
    '--path-y-2': item.pathY2 ?? '0px',
    '--path-x-3': item.pathX3 ?? '0px',
    '--path-y-3': item.pathY3 ?? '0px',
    '--path-x-4': item.pathX4 ?? '0px',
    '--path-y-4': item.pathY4 ?? '0px',
    '--start-scale': item.startScale ?? 1,
    '--mid-scale': item.midScale ?? 1,
    '--end-scale': item.endScale ?? 1,
    '--fall-x': item.fallX ?? '0px',
    '--fall-y': item.fallY ?? '900px',
    '--fall-spin': item.fallSpin ?? '180deg',
    '--sway-x': item.swayX ?? '50px',
    '--orbit-spin': item.orbitSpin ?? '20deg'
  }

  return (
    <div
      className="shadow-splash__asset-position"
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        zIndex: item.z,
        opacity: item.opacity ?? 1
      }}
    >
      <img
        src={assetUrl(item.file)}
        alt=""
        aria-hidden="true"
        className={`shadow-splash__asset shadow-splash__asset--${item.motion}`}
        style={imageStyle}
        draggable="false"
      />
    </div>
  )
}

function SceneFog({ item }) {
  return (
    <span
      className="shadow-splash__fog"
      aria-hidden="true"
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        zIndex: item.z,
        opacity: item.opacity,
        '--fog-duration': item.duration,
        '--fog-delay': item.delay
      }}
    />
  )
}

function SceneGlow({ item }) {
  return (
    <span
      className="shadow-splash__plant-glow"
      aria-hidden="true"
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        zIndex: item.z,
        '--glow-color': item.color,
        '--glow-blur': `${item.blur}px`,
        '--glow-duration': item.duration,
        '--glow-delay': item.delay
      }}
    />
  )
}

export default function ShadowSplashScreen({ onFinish, duration = 4200 }) {
  const { t } = useDisplayTranslation()
  const [viewport, setViewport] = useState(getViewport)

  useEffect(() => {
    const handleResize = () => setViewport(getViewport())
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  useEffect(() => {
    if (typeof onFinish !== 'function' || duration <= 0) return undefined

    const timer = window.setTimeout(onFinish, duration)
    return () => window.clearTimeout(timer)
  }, [duration, onFinish])

  const phoneMode = viewport.width <= 700 || viewport.height > viewport.width * 1.2
  const scene = phoneMode ? PHONE_LAYOUT : COMPUTER_LAYOUT
  const sceneScale = Math.max(
    viewport.width / scene.width,
    viewport.height / scene.height
  )

  return (
    <div
      className="shadow-splash"
      data-mode={phoneMode ? 'phone' : 'computer'}
      role="status"
      aria-label="Loading Shadow"
    >
      <div
        className={`shadow-splash__canvas shadow-splash__canvas--${phoneMode ? 'phone' : 'computer'}`}
        style={{
          width: scene.width,
          height: scene.height,
          transform: `translate(-50%, -50%) scale(${sceneScale})`
        }}
      >
        {scene.assets.map((item) => (
          <SceneAsset key={item.id} item={item} />
        ))}

        {scene.glows.map((item) => (
          <SceneGlow key={item.id} item={item} />
        ))}

        {scene.fogs.map((item) => (
          <SceneFog key={item.id} item={item} />
        ))}

        <div
          className="shadow-splash__content"
          style={{
            left: scene.content.x,
            top: scene.content.y,
            width: scene.content.width
          }}
        >
          <h1 className="shadow-splash__logo">
            SHAD<span className="shadow-splash__logo-o">O</span>W
          </h1>

          <div className="shadow-splash__tagline">
            <span className="shadow-splash__tagline-star">✦</span>
            <span>STORIES LIVE IN THE SHADOWS.</span>
            <span className="shadow-splash__tagline-star">✦</span>
          </div>

          <div className="shadow-splash__shape">YOU BRING THEM TO LIGHT.</div>

          <div className="shadow-splash__dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <p className="shadow-splash__loading">{t('shadowSplashScreen.loading')}</p>
        </div>
      </div>
    </div>
  )
}
