import SharedBottomSheet from '../common/SharedBottomSheet'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../utils/displayLanguage'

registerTranslationNamespace('readerProfilePhotoSheet', {
  en: {
    title: 'Profile picture',
    upload: 'Upload Profile',
    view: 'See profile picture',
    choose: 'Choose profile picture',
  },
  km: {
    title: 'រូបប្រវត្តិរូប',
    upload: 'បង្ហោះរូប Profile',
    view: 'មើលរូបប្រវត្តិរូប',
    choose: 'ជ្រើសរូបប្រវត្តិរូប',
  },
  zh: {
    title: '头像',
    upload: '上传头像',
    view: '查看头像',
    choose: '选择头像',
  },
  ja: {
    title: 'プロフィール写真',
    upload: 'プロフィール写真をアップロード',
    view: 'プロフィール写真を見る',
    choose: 'プロフィール写真を選ぶ',
  },
  ko: {
    title: '프로필 사진',
    upload: '프로필 사진 업로드',
    view: '프로필 사진 보기',
    choose: '프로필 사진 선택',
  },
})

const ACTIONS = [
  { key: 'upload', icon: 'fa-solid fa-cloud-arrow-up' },
  { key: 'view', icon: 'fa-solid fa-circle-user' },
  { key: 'choose', icon: 'fa-regular fa-image' },
]

export default function ReaderProfilePhotoSheet({ open, onClose, onSelect, enabledActions = ['upload', 'view', 'choose'] }) {
  const { t } = useDisplayTranslation()

  return (
    <SharedBottomSheet
      open={open}
      onClose={onClose}
      swipeAnywhere
      title={t('readerProfilePhotoSheet.title')}
      contentClassName="px-4 pb-4"
    >
      {ACTIONS.map(({ key, icon }) => (
        <button
          key={key}
          type="button"
          disabled={!onSelect || !enabledActions.includes(key)}
          onClick={() => onSelect?.(key)}
          className="flex min-h-[64px] w-full items-center gap-4 rounded-xl px-1 text-left text-[16px] text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)]">
            <i className={`${icon} text-[18px]`} aria-hidden="true" />
          </span>
          <span>{t(`readerProfilePhotoSheet.${key}`)}</span>
        </button>
      ))}
    </SharedBottomSheet>
  )
}
