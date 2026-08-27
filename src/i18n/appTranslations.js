import { registerTranslationNamespace } from './registerTranslations'

const translations = {
  en: {
    loading: 'Loading...',
    comingSoonDescription: 'This page is ready for a future update.',
    routes: {
      fastReels: 'Fast / Reels',
      checkIn: 'Check-in',
      settings: 'Settings',
    },
  },
  km: {
    loading: 'កំពុងផ្ទុក...',
    comingSoonDescription: 'ទំព័រនេះបានត្រៀមរួចសម្រាប់ការអាប់ដេតនាពេលអនាគត។',
    routes: {
      fastReels: 'Fast / Reels',
      checkIn: 'ចូលប្រចាំថ្ងៃ',
      settings: 'ការកំណត់',
    },
  },
  zh: {
    loading: '加载中...',
    comingSoonDescription: '此页面已准备好在未来更新。',
    routes: {
      fastReels: 'Fast / Reels',
      checkIn: '签到',
      settings: '设置',
    },
  },
  ja: {
    loading: '読み込み中...',
    comingSoonDescription: 'このページは今後のアップデートに向けて準備されています。',
    routes: {
      fastReels: 'Fast / Reels',
      checkIn: 'チェックイン',
      settings: '設定',
    },
  },
  ko: {
    loading: '불러오는 중...',
    comingSoonDescription: '이 페이지는 향후 업데이트를 위해 준비되어 있습니다.',
    routes: {
      fastReels: 'Fast / Reels',
      checkIn: '체크인',
      settings: '설정',
    },
  },
}

registerTranslationNamespace('app', translations)

export default translations
