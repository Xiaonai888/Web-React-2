import {
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import {
  clearReaderPostDraft,
  readReaderPostDraft,
  writeReaderPostDraft,
} from '../../features/reader-posts/readerPostDraft'


registerTranslationNamespace('readerPostReviewPage', {
  en: {
    failedPublishPost: 'Failed to publish post',
    public: 'Public',
    publicDescription: 'Anyone on Shadow can see this post.',
    friends: 'Friends',
    friendsDescription: 'Only readers who follow each other.',
    followers: 'Followers',
    followersDescription: 'Readers who follow your profile.',
    friendsAndFollowers: 'Friends and followers',
    friendsAndFollowersDescription: 'People connected to your profile.',
    onlyMe: 'Only me',
    onlyMeDescription: 'Only you can see this post.',
    closeFriends: 'Close friends',
    specificPeople: 'Specific people',
    friendsExcept: 'Friends except...',
    futureAudienceDescription: 'This audience option will be available in a future update.',
    everyone: 'Everyone',
    noOne: 'No one',
    comingSoon: 'Coming soon',
    whoCanSeeThis: 'Who can see this',
    readerComments: 'Reader comments',
    back: 'Back',
    reviewPost: 'Review Post',
    publishing: 'Publishing',
    publish: 'Publish',
    photoSelected: '{{count}} photo selected',
    photosSelected: '{{count}} photos selected',
    publishTime: 'Publish time',
    now: 'Now',
    scheduledPublishingComingSoon: 'Scheduled publishing is coming soon.',
    storySharing: 'Story sharing',
    off: 'Off',
    storySharingComingSoon: 'Story sharing is coming soon.',
  },
  km: {
    failedPublishPost: 'មិនអាច Publish Post បានទេ',
    public: 'សាធារណៈ',
    publicDescription: 'អ្នកគ្រប់គ្នានៅលើ Shadow អាចមើល Post នេះបាន។',
    friends: 'មិត្តភក្តិ',
    friendsDescription: 'មានតែអ្នកអានដែល Follow គ្នាទៅវិញទៅមក។',
    followers: 'អ្នក Follow',
    followersDescription: 'អ្នកអានដែល Follow Profile របស់អ្នក។',
    friendsAndFollowers: 'មិត្តភក្តិ និងអ្នក Follow',
    friendsAndFollowersDescription: 'អ្នកដែលមានទំនាក់ទំនងជាមួយ Profile របស់អ្នក។',
    onlyMe: 'ខ្ញុំប៉ុណ្ណោះ',
    onlyMeDescription: 'មានតែអ្នកប៉ុណ្ណោះដែលអាចមើល Post នេះ។',
    closeFriends: 'មិត្តជិតស្និទ្ធ',
    specificPeople: 'មនុស្សជាក់លាក់',
    friendsExcept: 'មិត្តភក្តិ លើកលែងតែ...',
    futureAudienceDescription: 'ជម្រើស Audience នេះនឹងមាននៅការអាប់ដេតពេលក្រោយ។',
    everyone: 'អ្នកគ្រប់គ្នា',
    noOne: 'គ្មាននរណា',
    comingSoon: 'មកដល់ឆាប់ៗនេះ',
    whoCanSeeThis: 'អ្នកណាអាចមើលបាន',
    readerComments: 'មតិយោបល់អ្នកអាន',
    back: 'ត្រឡប់ក្រោយ',
    reviewPost: 'ពិនិត្យ Post',
    publishing: 'កំពុង Publish',
    publish: 'Publish',
    photoSelected: 'បានជ្រើសរូប {{count}} សន្លឹក',
    photosSelected: 'បានជ្រើសរូប {{count}} សន្លឹក',
    publishTime: 'ពេល Publish',
    now: 'ឥឡូវនេះ',
    scheduledPublishingComingSoon: 'ការកំណត់ពេល Publish នឹងមកដល់ឆាប់ៗនេះ។',
    storySharing: 'ចែករំលែកទៅ Story',
    off: 'បិទ',
    storySharingComingSoon: 'ការចែករំលែកទៅ Story នឹងមកដល់ឆាប់ៗនេះ។',
  },
  zh: {
    failedPublishPost: '发布帖子失败',
    public: '公开',
    publicDescription: 'Shadow 上的所有人都可以看到此帖子。',
    friends: '好友',
    friendsDescription: '仅互相关注的读者可见。',
    followers: '关注者',
    followersDescription: '关注你主页的读者可见。',
    friendsAndFollowers: '好友和关注者',
    friendsAndFollowersDescription: '与你主页有联系的人可见。',
    onlyMe: '仅自己',
    onlyMeDescription: '只有你可以看到此帖子。',
    closeFriends: '亲密好友',
    specificPeople: '指定用户',
    friendsExcept: '好友，除外...',
    futureAudienceDescription: '此受众选项将在未来更新中提供。',
    everyone: '所有人',
    noOne: '任何人都不可以',
    comingSoon: '即将推出',
    whoCanSeeThis: '谁可以看到',
    readerComments: '读者评论',
    back: '返回',
    reviewPost: '检查帖子',
    publishing: '发布中',
    publish: '发布',
    photoSelected: '已选择 {{count}} 张图片',
    photosSelected: '已选择 {{count}} 张图片',
    publishTime: '发布时间',
    now: '现在',
    scheduledPublishingComingSoon: '定时发布即将推出。',
    storySharing: '分享到 Story',
    off: '关闭',
    storySharingComingSoon: '分享到 Story 即将推出。',
  },
  ja: {
    failedPublishPost: '投稿を公開できませんでした',
    public: '公開',
    publicDescription: 'Shadow のすべてのユーザーがこの投稿を閲覧できます。',
    friends: '友達',
    friendsDescription: '相互フォローしている読者のみ閲覧できます。',
    followers: 'フォロワー',
    followersDescription: 'あなたのプロフィールをフォローしている読者が閲覧できます。',
    friendsAndFollowers: '友達とフォロワー',
    friendsAndFollowersDescription: 'あなたのプロフィールにつながっているユーザーが閲覧できます。',
    onlyMe: '自分のみ',
    onlyMeDescription: 'この投稿を閲覧できるのは自分だけです。',
    closeFriends: '親しい友達',
    specificPeople: '特定のユーザー',
    friendsExcept: '次を除く友達...',
    futureAudienceDescription: 'この公開範囲は今後のアップデートで利用可能になります。',
    everyone: '全員',
    noOne: '誰も許可しない',
    comingSoon: '近日公開',
    whoCanSeeThis: '公開範囲',
    readerComments: '読者コメント',
    back: '戻る',
    reviewPost: '投稿を確認',
    publishing: '公開中',
    publish: '公開',
    photoSelected: '{{count}}枚の画像を選択',
    photosSelected: '{{count}}枚の画像を選択',
    publishTime: '公開時間',
    now: '今すぐ',
    scheduledPublishingComingSoon: '予約投稿は近日公開予定です。',
    storySharing: 'Story に共有',
    off: 'オフ',
    storySharingComingSoon: 'Story への共有は近日公開予定です。',
  },
  ko: {
    failedPublishPost: '게시물을 게시하지 못했습니다',
    public: '전체 공개',
    publicDescription: 'Shadow의 모든 사용자가 이 게시물을 볼 수 있습니다.',
    friends: '친구',
    friendsDescription: '서로 팔로우하는 독자만 볼 수 있습니다.',
    followers: '팔로워',
    followersDescription: '프로필을 팔로우하는 독자가 볼 수 있습니다.',
    friendsAndFollowers: '친구 및 팔로워',
    friendsAndFollowersDescription: '프로필과 연결된 사용자가 볼 수 있습니다.',
    onlyMe: '나만 보기',
    onlyMeDescription: '나만 이 게시물을 볼 수 있습니다.',
    closeFriends: '친한 친구',
    specificPeople: '특정 사용자',
    friendsExcept: '친구 중 제외...',
    futureAudienceDescription: '이 공개 범위 옵션은 향후 업데이트에서 제공됩니다.',
    everyone: '모두',
    noOne: '아무도 허용하지 않음',
    comingSoon: '출시 예정',
    whoCanSeeThis: '공개 범위',
    readerComments: '독자 댓글',
    back: '뒤로 가기',
    reviewPost: '게시물 검토',
    publishing: '게시 중',
    publish: '게시',
    photoSelected: '사진 {{count}}장 선택됨',
    photosSelected: '사진 {{count}}장 선택됨',
    publishTime: '게시 시간',
    now: '지금',
    scheduledPublishingComingSoon: '예약 게시는 곧 제공될 예정입니다.',
    storySharing: 'Story 공유',
    off: '꺼짐',
    storySharingComingSoon: 'Story 공유는 곧 제공될 예정입니다.',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const MAX_POST_PHOTOS = 5

const AUDIENCES = [
  {
    value: 'public',
    label: 'Public',
    description:
      'Anyone on Shadow can see this post.',
    icon: 'fa-solid fa-earth-americas',
  },
  {
    value: 'friends',
    label: 'Friends',
    description:
      'Only readers who follow each other.',
    icon: 'fa-solid fa-user-group',
  },
  {
    value: 'followers',
    label: 'Followers',
    description:
      'Readers who follow your profile.',
    icon: 'fa-solid fa-users',
  },
  {
    value: 'friends_and_followers',
    label: 'Friends and followers',
    description:
      'People connected to your profile.',
    icon: 'fa-solid fa-people-group',
  },
  {
    value: 'only_me',
    label: 'Only me',
    description:
      'Only you can see this post.',
    icon: 'fa-solid fa-lock',
  },
]

const FUTURE_AUDIENCES = [
  'Close friends',
  'Specific people',
  'Friends except...',
]

const COMMENT_OPTIONS = [
  {
    value: 'everyone',
    label: 'Everyone',
  },
  {
    value: 'friends',
    label: 'Friends',
  },
  {
    value: 'followers',
    label: 'Followers',
  },
  {
    value: 'no_one',
    label: 'No one',
  },
]

const AUDIENCE_TRANSLATION_KEYS = {
  public: ['public', 'publicDescription'],
  friends: ['friends', 'friendsDescription'],
  followers: ['followers', 'followersDescription'],
  friends_and_followers: ['friendsAndFollowers', 'friendsAndFollowersDescription'],
  only_me: ['onlyMe', 'onlyMeDescription'],
}

const FUTURE_AUDIENCE_TRANSLATION_KEYS = {
  'Close friends': 'closeFriends',
  'Specific people': 'specificPeople',
  'Friends except...': 'friendsExcept',
}

const COMMENT_TRANSLATION_KEYS = {
  everyone: 'everyone',
  friends: 'friends',
  followers: 'followers',
  no_one: 'noOne',
}

function getAuthToken() {
  return (
    localStorage.getItem(
      'shadow_reader_token'
    ) ||
    sessionStorage.getItem(
      'shadow_reader_token'
    ) ||
    ''
  )
}

function getImageUrls(draft) {
  if (!Array.isArray(draft?.image_urls)) {
    return []
  }

  return [
    ...new Set(
      draft.image_urls
        .filter(
          (url) =>
            typeof url === 'string'
        )
        .map((url) => url.trim())
        .filter(Boolean)
    ),
  ].slice(0, MAX_POST_PHOTOS)
}

function getAudienceLabel(value, t) {
  const item = AUDIENCES.find(
    (entry) => entry.value === value
  )
  const key =
    AUDIENCE_TRANSLATION_KEYS[value]?.[0]

  return key
    ? t(`readerPostReviewPage.${key}`)
    : item?.label || t('readerPostReviewPage.public')
}

function getCommentLabel(value, t) {
  const item = COMMENT_OPTIONS.find(
    (entry) => entry.value === value
  )
  const key =
    COMMENT_TRANSLATION_KEYS[value]

  return key
    ? t(`readerPostReviewPage.${key}`)
    : item?.label || t('readerPostReviewPage.everyone')
}

function ReviewImagePreview({
  imageUrls,
}) {
  if (!imageUrls.length) {
    return null
  }

  if (imageUrls.length === 1) {
    return (
      <div className="mb-5 overflow-hidden rounded-[18px] bg-[var(--shadow-bg-soft)]">
        <img
          src={imageUrls[0]}
          alt=""
          className="max-h-[560px] w-full object-contain"
        />
      </div>
    )
  }

  return (
    <div className="mb-5 grid grid-cols-2 gap-1 overflow-hidden rounded-[18px]">
      {imageUrls.map(
        (imageUrl, index) => (
          <div
            key={`${imageUrl}-${index}`}
            className="aspect-square bg-[var(--shadow-bg-soft)]"
          >
            <img
              src={imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )
      )}
    </div>
  )
}

function ReviewOption({
  icon,
  imageSrc,
  title,
  value,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[14px] px-1 py-3 text-left active:bg-[var(--shadow-bg-soft)]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt=""
            className="h-5 w-5 object-contain"
          />
        ) : (
          <i
            className={`${icon} text-[15px]`}
          />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-normal text-[var(--shadow-text-primary)]">
          {title}
        </span>
        <span className="mt-0.5 block text-[12px] font-normal text-[var(--shadow-text-secondary)]">
          {value}
        </span>
      </span>

      <i className="fa-solid fa-chevron-right text-[12px] text-[var(--shadow-text-tertiary)]" />
    </button>
  )
}

function SelectionRow({
  icon,
  label,
  description,
  selected,
  onClick,
  disabled = false,
}) {
  const { t } = useDisplayTranslation()

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-[var(--shadow-bg-hover)] disabled:opacity-55"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)]">
        <i
          className={`${icon || 'fa-regular fa-clock'} text-[16px]`}
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-normal text-[var(--shadow-text-primary)]">
          {label}
        </span>

        {description ? (
          <span className="mt-0.5 block text-[11px] font-normal leading-4 text-[var(--shadow-text-secondary)]">
            {description}
          </span>
        ) : null}
      </span>

      {disabled ? (
        <span className="rounded-full bg-[var(--shadow-bg-soft)] px-2 py-1 text-[10px] font-normal text-[var(--shadow-text-secondary)]">
          {t('readerPostReviewPage.comingSoon')}
        </span>
      ) : selected ? (
        <i className="fa-solid fa-check text-[15px] text-[#2563eb]" />
      ) : null}
    </button>
  )
}

export default function ReaderPostReviewPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const initialDraft = useMemo(
    () => readReaderPostDraft(),
    []
  )
  const [draft, setDraft] =
    useState(initialDraft)
  const [screen, setScreen] =
    useState('review')
  const [saving, setSaving] =
    useState(false)
  const [message, setMessage] =
    useState('')

  const imageUrls =
    getImageUrls(draft)
  const hasContent = Boolean(
    draft.content?.trim() ||
      imageUrls.length
  )

  function updateDraft(patch) {
    const next = {
      ...draft,
      ...patch,
    }

    setDraft(next)
    writeReaderPostDraft(next)
  }

  async function publishPost() {
    if (!hasContent) {
      navigate(
        '/reader/post/create',
        {
          replace: true,
        }
      )
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/reader-posts/me`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({
            content:
              draft.content?.trim() ||
              '',
            image_urls: imageUrls,
            visibility:
              draft.visibility,
            comments_permission:
              draft.comments_permission,
            story_sharing: false,
            publish_at:
              new Date().toISOString(),
          }),
        }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            t('readerPostReviewPage.failedPublishPost')
        )
      }

      clearReaderPostDraft()
      navigate('/discover', {
        replace: true,
      })
    } catch (error) {
      setMessage(
        error.message ||
          t('readerPostReviewPage.failedPublishPost')
      )
    } finally {
      setSaving(false)
    }
  }

  if (screen === 'audience') {
    return (
      <div className="app-page min-h-screen text-[var(--shadow-text-primary)]">
        <header className="sticky top-0 z-20 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur">
          <div className="mx-auto flex h-14 max-w-[620px] items-center px-2">
            <button
              type="button"
              onClick={() =>
                setScreen('review')
              }
              className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-soft)]"
            >
              <i className="fa-solid fa-chevron-left text-[18px]" />
            </button>

            <div className="ml-2 text-[16px] font-semibold text-[var(--shadow-text-primary)]">
              {t('readerPostReviewPage.whoCanSeeThis')}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[620px] py-2">
          {AUDIENCES.map((item) => (
            <SelectionRow
              key={item.value}
              icon={item.icon}
              label={t(
                `readerPostReviewPage.${AUDIENCE_TRANSLATION_KEYS[item.value]?.[0]}`,
                { defaultValue: item.label }
              )}
              description={t(
                `readerPostReviewPage.${AUDIENCE_TRANSLATION_KEYS[item.value]?.[1]}`,
                { defaultValue: item.description }
              )}
              selected={
                draft.visibility ===
                item.value
              }
              onClick={() => {
                updateDraft({
                  visibility:
                    item.value,
                })
                setScreen('review')
              }}
            />
          ))}

          <div className="my-2 h-2 bg-[var(--shadow-bg-soft)]" />

          {FUTURE_AUDIENCES.map(
            (label) => (
              <SelectionRow
                key={label}
                icon="fa-regular fa-clock"
                label={t(
                  `readerPostReviewPage.${FUTURE_AUDIENCE_TRANSLATION_KEYS[label]}`,
                  { defaultValue: label }
                )}
                description={t('readerPostReviewPage.futureAudienceDescription')}
                disabled
              />
            )
          )}
        </main>
      </div>
    )
  }

  if (screen === 'comments') {
    return (
      <div className="app-page min-h-screen text-[var(--shadow-text-primary)]">
        <header className="sticky top-0 z-20 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur">
          <div className="mx-auto flex h-14 max-w-[620px] items-center px-2">
            <button
              type="button"
              onClick={() =>
                setScreen('review')
              }
              className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-soft)]"
            >
              <i className="fa-solid fa-chevron-left text-[18px]" />
            </button>

            <div className="ml-2 text-[16px] font-semibold text-[var(--shadow-text-primary)]">
              {t('readerPostReviewPage.readerComments')}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[620px] py-2">
          {COMMENT_OPTIONS.map(
            (item) => (
              <SelectionRow
                key={item.value}
                icon="fa-regular fa-comment"
                label={t(
                  `readerPostReviewPage.${COMMENT_TRANSLATION_KEYS[item.value]}`,
                  { defaultValue: item.label }
                )}
                selected={
                  draft.comments_permission ===
                  item.value
                }
                onClick={() => {
                  updateDraft({
                    comments_permission:
                      item.value,
                  })
                  setScreen('review')
                }}
              />
            )
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="app-page min-h-screen text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-20 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[620px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() =>
              navigate(
                '/reader/post/create'
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-soft)]"
            aria-label={t('readerPostReviewPage.back')}
          >
            <i className="fa-solid fa-chevron-left text-[18px]" />
          </button>

          <div className="text-[16px] font-semibold text-[var(--shadow-text-primary)]">
            {t('readerPostReviewPage.reviewPost')}
          </div>

          <button
            type="button"
            onClick={publishPost}
            disabled={
              saving ||
              !hasContent
            }
            className="h-9 rounded-full bg-[#111827] px-4 text-[13px] font-semibold text-white disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)] dark:bg-white dark:text-[#111827]"
          >
            {saving
              ? t('readerPostReviewPage.publishing')
              : t('readerPostReviewPage.publish')}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[620px] px-4 py-4">
        {message ? (
          <div className="mb-4 rounded-[14px] bg-red-50 px-3 py-2 text-[12px] font-normal leading-5 text-red-600 dark:bg-red-500/10 dark:text-red-300">
            {message}
          </div>
        ) : null}

        <ReviewImagePreview
          imageUrls={imageUrls}
        />

        {imageUrls.length ? (
          <div className="mb-3 text-[12px] font-normal text-[var(--shadow-text-secondary)]">
            {t(
              imageUrls.length === 1
                ? 'readerPostReviewPage.photoSelected'
                : 'readerPostReviewPage.photosSelected',
              { count: imageUrls.length }
            )}
          </div>
        ) : null}

        <div className="space-y-1">
          <ReviewOption
            icon="fa-solid fa-earth-americas"
            title={t('readerPostReviewPage.whoCanSeeThis')}
            value={getAudienceLabel(
              draft.visibility,
              t
            )}
            onClick={() =>
              setScreen('audience')
            }
          />

          <ReviewOption
            icon="fa-regular fa-comment"
            title={t('readerPostReviewPage.readerComments')}
            value={getCommentLabel(
              draft.comments_permission,
              t
            )}
            onClick={() =>
              setScreen('comments')
            }
          />

          <ReviewOption
            icon="fa-regular fa-clock"
            title={t('readerPostReviewPage.publishTime')}
            value={t('readerPostReviewPage.now')}
            onClick={() =>
              setMessage(
                t('readerPostReviewPage.scheduledPublishingComingSoon')
              )
            }
          />

          <ReviewOption
            imageSrc="/assets/Icons/Add Story.svg"
            title={t('readerPostReviewPage.storySharing')}
            value={t('readerPostReviewPage.off')}
            onClick={() =>
              setMessage(
                t('readerPostReviewPage.storySharingComingSoon')
              )
            }
          />
        </div>
      </main>
    </div>
  )
}
