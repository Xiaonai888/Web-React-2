import { useEffect, useRef } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerPostOptions', {
  en: {
    closeOptions: 'Close post options',
    editPost: 'Edit post',
    editDescription: 'Update the text in this post.',
    deletePost: 'Delete post',
    deleteDescription: 'Remove this post from Discover and your profile.',
    removeSaved: 'Remove from saved',
    savePost: 'Save post',
    removeSavedDescription: 'Remove this post from your saved items.',
    saveDescription: 'Add this post to your saved items.',
    hidePost: 'Hide post',
    hideDescription: 'Do not show this post again on this device.',
    viewProfile: 'View reader profile',
    viewProfileDescription: "Open this reader's profile.",
    reportPost: 'Report post',
    reportDescription: 'Tell Shadow about a problem with this post.',
    reportComingSoon: 'Reader Post reporting is coming soon.',
    cancelDelete: 'Cancel delete',
    deleteConfirmTitle: 'Delete this post?',
    deleteConfirmDescription: 'This post will be removed from Discover and your profile.',
    cancel: 'Cancel',
    deleting: 'Deleting...',
    delete: 'Delete',
  },
  km: {
    closeOptions: 'បិទជម្រើស Post',
    editPost: 'កែ Post',
    editDescription: 'កែប្រែអត្ថបទនៅក្នុង Post នេះ។',
    deletePost: 'លុប Post',
    deleteDescription: 'ដក Post នេះចេញពី Discover និងប្រវត្តិរូបរបស់អ្នក។',
    removeSaved: 'ដកចេញពី Saved',
    savePost: 'រក្សាទុក Post',
    removeSavedDescription: 'ដក Post នេះចេញពីបញ្ជីដែលអ្នកបានរក្សាទុក។',
    saveDescription: 'បន្ថែម Post នេះទៅបញ្ជីដែលអ្នកបានរក្សាទុក។',
    hidePost: 'លាក់ Post',
    hideDescription: 'កុំបង្ហាញ Post នេះម្តងទៀតនៅលើឧបករណ៍នេះ។',
    viewProfile: 'មើលប្រវត្តិរូបអ្នកអាន',
    viewProfileDescription: 'បើកប្រវត្តិរូបរបស់អ្នកអាននេះ។',
    reportPost: 'រាយការណ៍ Post',
    reportDescription: 'ប្រាប់ Shadow អំពីបញ្ហាជាមួយ Post នេះ។',
    reportComingSoon: 'មុខងាររាយការណ៍ Reader Post នឹងមកដល់ឆាប់ៗនេះ។',
    cancelDelete: 'បោះបង់ការលុប',
    deleteConfirmTitle: 'លុប Post នេះ?',
    deleteConfirmDescription: 'Post នេះនឹងត្រូវដកចេញពី Discover និងប្រវត្តិរូបរបស់អ្នក។',
    cancel: 'បោះបង់',
    deleting: 'កំពុងលុប...',
    delete: 'លុប',
  },
  zh: {
    closeOptions: '关闭帖子选项',
    editPost: '编辑帖子',
    editDescription: '更新此帖子的文字内容。',
    deletePost: '删除帖子',
    deleteDescription: '从 Discover 和你的个人资料中移除此帖子。',
    removeSaved: '从已保存中移除',
    savePost: '保存帖子',
    removeSavedDescription: '从已保存项目中移除此帖子。',
    saveDescription: '将此帖子添加到已保存项目。',
    hidePost: '隐藏帖子',
    hideDescription: '不要在此设备上再次显示此帖子。',
    viewProfile: '查看读者资料',
    viewProfileDescription: '打开此读者的个人资料。',
    reportPost: '举报帖子',
    reportDescription: '向 Shadow 报告此帖子的问题。',
    reportComingSoon: '读者帖子举报功能即将推出。',
    cancelDelete: '取消删除',
    deleteConfirmTitle: '删除此帖子？',
    deleteConfirmDescription: '此帖子将从 Discover 和你的个人资料中移除。',
    cancel: '取消',
    deleting: '删除中...',
    delete: '删除',
  },
  ja: {
    closeOptions: '投稿オプションを閉じる',
    editPost: '投稿を編集',
    editDescription: 'この投稿のテキストを更新します。',
    deletePost: '投稿を削除',
    deleteDescription: 'この投稿を Discover とプロフィールから削除します。',
    removeSaved: '保存済みから削除',
    savePost: '投稿を保存',
    removeSavedDescription: '保存済みアイテムからこの投稿を削除します。',
    saveDescription: 'この投稿を保存済みアイテムに追加します。',
    hidePost: '投稿を非表示',
    hideDescription: 'この端末でこの投稿を今後表示しません。',
    viewProfile: '読者プロフィールを見る',
    viewProfileDescription: 'この読者のプロフィールを開きます。',
    reportPost: '投稿を報告',
    reportDescription: 'この投稿の問題を Shadow に報告します。',
    reportComingSoon: '読者投稿の報告機能は近日公開予定です。',
    cancelDelete: '削除をキャンセル',
    deleteConfirmTitle: 'この投稿を削除しますか？',
    deleteConfirmDescription: 'この投稿は Discover とプロフィールから削除されます。',
    cancel: 'キャンセル',
    deleting: '削除中...',
    delete: '削除',
  },
  ko: {
    closeOptions: '게시물 옵션 닫기',
    editPost: '게시물 수정',
    editDescription: '이 게시물의 텍스트를 수정합니다.',
    deletePost: '게시물 삭제',
    deleteDescription: 'Discover와 내 프로필에서 이 게시물을 삭제합니다.',
    removeSaved: '저장됨에서 삭제',
    savePost: '게시물 저장',
    removeSavedDescription: '저장한 항목에서 이 게시물을 삭제합니다.',
    saveDescription: '이 게시물을 저장한 항목에 추가합니다.',
    hidePost: '게시물 숨기기',
    hideDescription: '이 기기에서 이 게시물을 다시 표시하지 않습니다.',
    viewProfile: '독자 프로필 보기',
    viewProfileDescription: '이 독자의 프로필을 엽니다.',
    reportPost: '게시물 신고',
    reportDescription: '이 게시물의 문제를 Shadow에 알립니다.',
    reportComingSoon: '독자 게시물 신고 기능은 곧 제공됩니다.',
    cancelDelete: '삭제 취소',
    deleteConfirmTitle: '이 게시물을 삭제할까요?',
    deleteConfirmDescription: '이 게시물은 Discover와 내 프로필에서 삭제됩니다.',
    cancel: '취소',
    deleting: '삭제 중...',
    delete: '삭제',
  },
})

function EditPostIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M13.5 6.5 17.5 10.5" />
      <path d="M5 19h4l9.5-9.5a1.4 1.4 0 0 0 0-2l-2-2a1.4 1.4 0 0 0-2 0L5 15v4Z" />
      <path d="M12.5 7.5 16.5 11.5" />
    </svg>
  )
}

function DeletePostIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M9 4h6" />
      <path d="M6.5 7 7.2 20h9.6l.7-13" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  )
}

function SheetItem({
  icon,
  iconNode,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left active:bg-[var(--shadow-bg-hover)]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--shadow-text-primary)]">
        {iconNode || (
          <i className={`${icon} text-[17px] font-normal`} />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-normal text-[var(--shadow-text-primary)]">
          {title}
        </span>

        {description ? (
          <span className="mt-0.5 block text-[10px] font-normal leading-4 text-[var(--shadow-text-tertiary)]">
            {description}
          </span>
        ) : null}
      </span>
    </button>
  )
}

export default function ReaderPostOptionsSheet({
  open,
  post,
  isOwner,
  onClose,
  onEdit,
  onDelete,
  onHide,
  onViewProfile,
  onMessage,
  isSaved,
  onSave,
}) {
  const { t } = useDisplayTranslation()
  const startYRef = useRef(0)
  const currentYRef = useRef(0)

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow =
        previousOverflow
    }
  }, [open])

  if (!open || !post) return null

  function handleTouchStart(event) {
    const point = event.touches?.[0]
    startYRef.current = point?.clientY || 0
    currentYRef.current = startYRef.current
  }

  function handleTouchMove(event) {
    const point = event.touches?.[0]
    currentYRef.current =
      point?.clientY || startYRef.current
  }

  function handleTouchEnd() {
    if (
      currentYRef.current -
        startYRef.current >
      70
    ) {
      onClose?.()
    }
  }

  function reportPost() {
    onMessage?.(
      t('readerPostOptions.reportComingSoon')
    )
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-[210000]">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
        aria-label={t('readerPostOptions.closeOptions')}
      />

      <section
        className="absolute bottom-0 left-0 right-0 mx-auto w-full max-w-[560px] rounded-t-[24px] bg-[var(--shadow-bg-elevated)] px-2 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 shadow-2xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-[var(--shadow-text-tertiary)]" />

        <div className="rounded-[16px] bg-[var(--shadow-bg-soft)] px-1 py-1">
          {isOwner ? (
            <>
              <SheetItem
                iconNode={<EditPostIcon />}
                title={t('readerPostOptions.editPost')}
                description={t('readerPostOptions.editDescription')}
                onClick={onEdit}
              />

              <SheetItem
                iconNode={<DeletePostIcon />}
                title={t('readerPostOptions.deletePost')}
                description={t('readerPostOptions.deleteDescription')}
                onClick={onDelete}
              />
            </>
          ) : (
            <>
              <SheetItem
                icon={
                  isSaved
                    ? 'fa-solid fa-bookmark'
                    : 'fa-regular fa-bookmark'
                }
                title={
                  isSaved
                    ? t('readerPostOptions.removeSaved')
                    : t('readerPostOptions.savePost')
                }
                description={
                  isSaved
                    ? t('readerPostOptions.removeSavedDescription')
                    : t('readerPostOptions.saveDescription')
                }
                onClick={onSave}
              />

              <SheetItem
                icon="fa-regular fa-eye-slash"
                title={t('readerPostOptions.hidePost')}
                description={t('readerPostOptions.hideDescription')}
                onClick={onHide}
              />

              <SheetItem
                icon="fa-regular fa-user"
                title={t('readerPostOptions.viewProfile')}
                description={t('readerPostOptions.viewProfileDescription')}
                onClick={onViewProfile}
              />

              <SheetItem
                icon="fa-regular fa-flag"
                title={t('readerPostOptions.reportPost')}
                description={t('readerPostOptions.reportDescription')}
                onClick={reportPost}
              />
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export function ReaderPostDeleteConfirmSheet({
  open,
  deleting,
  onCancel,
  onConfirm,
}) {
  const { t } = useDisplayTranslation()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[210010]">
      <button
        type="button"
        onClick={onCancel}
        className="absolute inset-0 bg-black/45"
        aria-label={t('readerPostOptions.cancelDelete')}
      />

      <section className="absolute bottom-0 left-0 right-0 mx-auto w-full max-w-[560px] rounded-t-[24px] bg-[var(--shadow-bg-elevated)] px-4 pb-[max(22px,env(safe-area-inset-bottom))] pt-3 shadow-2xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--shadow-text-tertiary)]" />

        <h2 className="text-[16px] font-semibold text-[var(--shadow-text-primary)]">
          {t('readerPostOptions.deleteConfirmTitle')}
        </h2>

        <p className="mt-2 text-[12px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
          {t('readerPostOptions.deleteConfirmDescription')}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="h-11 rounded-full border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-soft)] text-[13px] font-normal text-[var(--shadow-text-primary)] disabled:opacity-50"
          >
            {t('readerPostOptions.cancel')}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="h-11 rounded-full bg-[#e5484d] text-[13px] font-normal text-white disabled:opacity-60"
          >
            {deleting
              ? t('readerPostOptions.deleting')
              : t('readerPostOptions.delete')}
          </button>
        </div>
      </section>
    </div>
  )
}
