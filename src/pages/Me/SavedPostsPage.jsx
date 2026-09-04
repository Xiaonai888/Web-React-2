import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import {
  ArrowLeft,
  Bookmark,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Folder,
  FolderPlus,
  LoaderCircle,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react'
import SavedPostCard from '../../components/SavedPosts/SavedPostCard'
import SavedPostCollectionEditor from '../../components/SavedPosts/SavedPostCollectionEditor'
import SavedPostCollectionSheet from '../../components/SavedPosts/SavedPostCollectionSheet'
import {
  createSavedPostCollection,
  deleteSavedPost,
  deleteSavedPostCollection,
  fetchSavedPostCollections,
  fetchSavedPosts,
  getReaderToken,
  replaceSavedPostCollections,
  updateSavedPostCollection,
} from '../../services/savedPostsApi'


registerTranslationNamespace('savedPostsPage', {
  en: {
    all: 'All',
    reader: 'Reader',
    author: 'Author',
    promoted: 'Promoted',
    newestSaved: 'Newest Saved',
    oldestSaved: 'Oldest Saved',
    close: 'Close',
    post: 'post',
    posts: 'posts',
    noSavedPreview: 'No saved preview',
    collectionOptions: 'Collection options',
    allSaved: 'All Saved',
    favorites: 'Favorites',
    readLater: 'Read Later',
    failedLoadCollections: 'Failed to load collections',
    failedLoadSavedPosts: 'Failed to load saved posts',
    failedLoadMorePosts: 'Failed to load more posts',
    originalUnavailable: 'Original post is unavailable',
    noLink: 'This saved post has no link',
    linkCopied: 'Link copied',
    unableCopyLink: 'Unable to copy link',
    collectionsUpdated: 'Collections updated',
    failedUpdateCollections: 'Failed to update collections',
    collectionUpdated: 'Collection updated',
    collectionCreatedPostAdded: 'Collection created and post added',
    collectionCreated: 'Collection created',
    failedSaveCollection: 'Failed to save collection',
    removedSavedPosts: 'Removed from Saved Posts',
    failedRemoveSavedPost: 'Failed to remove saved post',
    collectionDeleted: 'Collection deleted',
    failedDeleteCollection: 'Failed to delete collection',
    back: 'Back',
    savedPosts: 'Saved Posts',
    savedCountOne: '{{count}} saved post',
    savedCountMany: '{{count}} saved posts',
    createCollection: 'Create collection',
    searchSavedPosts: 'Search saved posts',
    clearSearch: 'Clear search',
    collections: 'Collections',
    keepRelated: 'Keep related posts together.',
    new: 'New',
    total: '{{count}} total',
    tryAgain: 'Try Again',
    loading: 'Loading...',
    loadMore: 'Load More',
    noSavedPosts: 'No saved posts yet',
    noSavedPostsBody: 'Posts saved from readers, authors, and promoted content will appear here.',
    browsePosts: 'Browse Posts',
    sortSavedPosts: 'Sort Saved Posts',
    sortDescription: 'Choose how your saved posts are ordered.',
    savedPost: 'Saved Post',
    savedPostActionsDescription: 'Open, organize, copy, or remove this saved post.',
    openOriginal: 'Open Original',
    openOriginalSubtitle: 'View the original post or promotion',
    manageCollections: 'Manage Collections',
    manageCollectionsSubtitle: 'Add this post to one or more collections',
    copyLink: 'Copy Link',
    copyLinkSubtitle: 'Copy the original post link',
    removeFromSavedPosts: 'Remove from Saved Posts',
    removeSubtitle: 'This will not delete the original post',
    collection: 'Collection',
    collectionMenuDescription: 'Edit this collection or remove it. Saved posts will remain in All Saved.',
    editCollection: 'Edit Collection',
    editCollectionSubtitle: 'Change the name, description, or color',
    deleteCollection: 'Delete Collection',
    deleteCollectionSubtitle: 'Saved posts inside will not be deleted',
    removeSavedPostQuestion: 'Remove Saved Post?',
    removeSavedPostDescription: 'The original post will not be deleted.',
    cancel: 'Cancel',
    removing: 'Removing...',
    remove: 'Remove',
    deleteCollectionQuestion: 'Delete Collection?',
    deleteCollectionDescription: 'The collection will be deleted, but its saved posts will remain in All Saved.',
    deleting: 'Deleting...',
    delete: 'Delete',
  },
  km: {
    all: 'ទាំងអស់',
    reader: 'អ្នកអាន',
    author: 'អ្នកនិពន្ធ',
    promoted: 'បានផ្សព្វផ្សាយ',
    newestSaved: 'រក្សាទុកថ្មីបំផុត',
    oldestSaved: 'រក្សាទុកចាស់បំផុត',
    close: 'បិទ',
    post: 'Post',
    posts: 'Posts',
    noSavedPreview: 'មិនមាន Preview ដែលបានរក្សាទុក',
    collectionOptions: 'ជម្រើស Collection',
    allSaved: 'បានរក្សាទុកទាំងអស់',
    favorites: 'ចូលចិត្ត',
    readLater: 'អានពេលក្រោយ',
    failedLoadCollections: 'មិនអាចផ្ទុក Collections បានទេ',
    failedLoadSavedPosts: 'មិនអាចផ្ទុក Posts ដែលបានរក្សាទុកបានទេ',
    failedLoadMorePosts: 'មិនអាចផ្ទុក Posts បន្ថែមបានទេ',
    originalUnavailable: 'Post ដើមមិនអាចបើកបានទេ',
    noLink: 'Post ដែលបានរក្សាទុកនេះមិនមាន Link ទេ',
    linkCopied: 'បានចម្លង Link',
    unableCopyLink: 'មិនអាចចម្លង Link បានទេ',
    collectionsUpdated: 'បាន Update Collections',
    failedUpdateCollections: 'មិនអាច Update Collections បានទេ',
    collectionUpdated: 'បាន Update Collection',
    collectionCreatedPostAdded: 'បានបង្កើត Collection និងបន្ថែម Post',
    collectionCreated: 'បានបង្កើត Collection',
    failedSaveCollection: 'មិនអាចរក្សាទុក Collection បានទេ',
    removedSavedPosts: 'បានដកចេញពី Saved Posts',
    failedRemoveSavedPost: 'មិនអាចដក Post ដែលបានរក្សាទុកបានទេ',
    collectionDeleted: 'បានលុប Collection',
    failedDeleteCollection: 'មិនអាចលុប Collection បានទេ',
    back: 'ត្រឡប់ក្រោយ',
    savedPosts: 'Posts ដែលបានរក្សាទុក',
    savedCountOne: 'បានរក្សាទុក {{count}} Post',
    savedCountMany: 'បានរក្សាទុក {{count}} Posts',
    createCollection: 'បង្កើត Collection',
    searchSavedPosts: 'ស្វែងរក Posts ដែលបានរក្សាទុក',
    clearSearch: 'សម្អាតការស្វែងរក',
    collections: 'Collections',
    keepRelated: 'ដាក់ Posts ដែលពាក់ព័ន្ធជាមួយគ្នា។',
    new: 'ថ្មី',
    total: 'សរុប {{count}}',
    tryAgain: 'ព្យាយាមម្តងទៀត',
    loading: 'កំពុងផ្ទុក...',
    loadMore: 'ផ្ទុកបន្ថែម',
    noSavedPosts: 'មិនទាន់មាន Post ដែលបានរក្សាទុក',
    noSavedPostsBody: 'Posts ដែលបានរក្សាទុកពីអ្នកអាន អ្នកនិពន្ធ និងមាតិកាផ្សព្វផ្សាយ នឹងបង្ហាញនៅទីនេះ។',
    browsePosts: 'ស្វែងរក Posts',
    sortSavedPosts: 'តម្រៀប Saved Posts',
    sortDescription: 'ជ្រើសរើសរបៀបតម្រៀប Posts ដែលបានរក្សាទុករបស់អ្នក។',
    savedPost: 'Post ដែលបានរក្សាទុក',
    savedPostActionsDescription: 'បើក រៀបចំ ចម្លង ឬដក Post ដែលបានរក្សាទុកនេះ។',
    openOriginal: 'បើក Post ដើម',
    openOriginalSubtitle: 'មើល Post ឬ Promotion ដើម',
    manageCollections: 'គ្រប់គ្រង Collections',
    manageCollectionsSubtitle: 'បន្ថែម Post នេះទៅ Collection មួយ ឬច្រើន',
    copyLink: 'ចម្លង Link',
    copyLinkSubtitle: 'ចម្លង Link របស់ Post ដើម',
    removeFromSavedPosts: 'ដកចេញពី Saved Posts',
    removeSubtitle: 'វានឹងមិនលុប Post ដើមទេ',
    collection: 'Collection',
    collectionMenuDescription: 'កែ ឬលុប Collection នេះ។ Saved Posts នឹងនៅតែមានក្នុង All Saved។',
    editCollection: 'កែ Collection',
    editCollectionSubtitle: 'ប្តូរឈ្មោះ ពិពណ៌នា ឬពណ៌',
    deleteCollection: 'លុប Collection',
    deleteCollectionSubtitle: 'Saved Posts ខាងក្នុងនឹងមិនត្រូវបានលុបទេ',
    removeSavedPostQuestion: 'ដក Saved Post?',
    removeSavedPostDescription: 'Post ដើមនឹងមិនត្រូវបានលុបទេ។',
    cancel: 'បោះបង់',
    removing: 'កំពុងដក...',
    remove: 'ដកចេញ',
    deleteCollectionQuestion: 'លុប Collection?',
    deleteCollectionDescription: 'Collection នឹងត្រូវបានលុប ប៉ុន្តែ Saved Posts របស់វានឹងនៅក្នុង All Saved។',
    deleting: 'កំពុងលុប...',
    delete: 'លុប',
  },
  zh: {
    all: '全部',
    reader: '读者',
    author: '作者',
    promoted: '推广',
    newestSaved: '最新保存',
    oldestSaved: '最早保存',
    close: '关闭',
    post: '帖子',
    posts: '帖子',
    noSavedPreview: '暂无保存预览',
    collectionOptions: '收藏夹选项',
    allSaved: '全部已保存',
    favorites: '收藏',
    readLater: '稍后阅读',
    failedLoadCollections: '无法加载收藏夹',
    failedLoadSavedPosts: '无法加载已保存帖子',
    failedLoadMorePosts: '无法加载更多帖子',
    originalUnavailable: '原帖不可用',
    noLink: '此已保存帖子没有链接',
    linkCopied: '链接已复制',
    unableCopyLink: '无法复制链接',
    collectionsUpdated: '收藏夹已更新',
    failedUpdateCollections: '无法更新收藏夹',
    collectionUpdated: '收藏夹已更新',
    collectionCreatedPostAdded: '已创建收藏夹并添加帖子',
    collectionCreated: '已创建收藏夹',
    failedSaveCollection: '无法保存收藏夹',
    removedSavedPosts: '已从已保存帖子中移除',
    failedRemoveSavedPost: '无法移除已保存帖子',
    collectionDeleted: '收藏夹已删除',
    failedDeleteCollection: '无法删除收藏夹',
    back: '返回',
    savedPosts: '已保存帖子',
    savedCountOne: '已保存 {{count}} 个帖子',
    savedCountMany: '已保存 {{count}} 个帖子',
    createCollection: '创建收藏夹',
    searchSavedPosts: '搜索已保存帖子',
    clearSearch: '清除搜索',
    collections: '收藏夹',
    keepRelated: '将相关帖子整理在一起。',
    new: '新建',
    total: '共 {{count}}',
    tryAgain: '重试',
    loading: '加载中...',
    loadMore: '加载更多',
    noSavedPosts: '还没有已保存帖子',
    noSavedPostsBody: '从读者、作者和推广内容中保存的帖子会显示在这里。',
    browsePosts: '浏览帖子',
    sortSavedPosts: '排序已保存帖子',
    sortDescription: '选择已保存帖子的排序方式。',
    savedPost: '已保存帖子',
    savedPostActionsDescription: '打开、整理、复制或移除此已保存帖子。',
    openOriginal: '打开原帖',
    openOriginalSubtitle: '查看原始帖子或推广内容',
    manageCollections: '管理收藏夹',
    manageCollectionsSubtitle: '将此帖子添加到一个或多个收藏夹',
    copyLink: '复制链接',
    copyLinkSubtitle: '复制原帖链接',
    removeFromSavedPosts: '从已保存帖子中移除',
    removeSubtitle: '不会删除原帖',
    collection: '收藏夹',
    collectionMenuDescription: '编辑或删除此收藏夹。已保存帖子仍会保留在“全部已保存”中。',
    editCollection: '编辑收藏夹',
    editCollectionSubtitle: '更改名称、描述或颜色',
    deleteCollection: '删除收藏夹',
    deleteCollectionSubtitle: '其中的已保存帖子不会被删除',
    removeSavedPostQuestion: '移除已保存帖子？',
    removeSavedPostDescription: '原帖不会被删除。',
    cancel: '取消',
    removing: '正在移除...',
    remove: '移除',
    deleteCollectionQuestion: '删除收藏夹？',
    deleteCollectionDescription: '收藏夹会被删除，但其中的已保存帖子仍会保留在“全部已保存”中。',
    deleting: '正在删除...',
    delete: '删除',
  },
  ja: {
    all: 'すべて',
    reader: '読者',
    author: '作者',
    promoted: 'プロモーション',
    newestSaved: '新しい保存順',
    oldestSaved: '古い保存順',
    close: '閉じる',
    post: '投稿',
    posts: '投稿',
    noSavedPreview: '保存プレビューはありません',
    collectionOptions: 'コレクションのオプション',
    allSaved: 'すべての保存',
    favorites: 'お気に入り',
    readLater: 'あとで読む',
    failedLoadCollections: 'コレクションを読み込めません',
    failedLoadSavedPosts: '保存した投稿を読み込めません',
    failedLoadMorePosts: '投稿をさらに読み込めません',
    originalUnavailable: '元の投稿は利用できません',
    noLink: 'この保存済み投稿にはリンクがありません',
    linkCopied: 'リンクをコピーしました',
    unableCopyLink: 'リンクをコピーできません',
    collectionsUpdated: 'コレクションを更新しました',
    failedUpdateCollections: 'コレクションを更新できません',
    collectionUpdated: 'コレクションを更新しました',
    collectionCreatedPostAdded: 'コレクションを作成して投稿を追加しました',
    collectionCreated: 'コレクションを作成しました',
    failedSaveCollection: 'コレクションを保存できません',
    removedSavedPosts: '保存済み投稿から削除しました',
    failedRemoveSavedPost: '保存した投稿を削除できません',
    collectionDeleted: 'コレクションを削除しました',
    failedDeleteCollection: 'コレクションを削除できません',
    back: '戻る',
    savedPosts: '保存した投稿',
    savedCountOne: '{{count}}件の保存済み投稿',
    savedCountMany: '{{count}}件の保存済み投稿',
    createCollection: 'コレクションを作成',
    searchSavedPosts: '保存した投稿を検索',
    clearSearch: '検索をクリア',
    collections: 'コレクション',
    keepRelated: '関連する投稿をまとめて整理できます。',
    new: '新規',
    total: '合計 {{count}}',
    tryAgain: 'もう一度試す',
    loading: '読み込み中...',
    loadMore: 'さらに読み込む',
    noSavedPosts: '保存した投稿はまだありません',
    noSavedPostsBody: '読者、作者、プロモーションから保存した投稿がここに表示されます。',
    browsePosts: '投稿を見る',
    sortSavedPosts: '保存した投稿を並べ替え',
    sortDescription: '保存した投稿の並び順を選択してください。',
    savedPost: '保存した投稿',
    savedPostActionsDescription: 'この保存済み投稿を開く、整理する、コピーする、または削除します。',
    openOriginal: '元の投稿を開く',
    openOriginalSubtitle: '元の投稿またはプロモーションを表示',
    manageCollections: 'コレクションを管理',
    manageCollectionsSubtitle: 'この投稿を1つ以上のコレクションに追加',
    copyLink: 'リンクをコピー',
    copyLinkSubtitle: '元の投稿リンクをコピー',
    removeFromSavedPosts: '保存済みから削除',
    removeSubtitle: '元の投稿は削除されません',
    collection: 'コレクション',
    collectionMenuDescription: 'このコレクションを編集または削除します。保存した投稿は「すべての保存」に残ります。',
    editCollection: 'コレクションを編集',
    editCollectionSubtitle: '名前、説明、または色を変更',
    deleteCollection: 'コレクションを削除',
    deleteCollectionSubtitle: '中の保存済み投稿は削除されません',
    removeSavedPostQuestion: '保存した投稿を削除しますか？',
    removeSavedPostDescription: '元の投稿は削除されません。',
    cancel: 'キャンセル',
    removing: '削除中...',
    remove: '削除',
    deleteCollectionQuestion: 'コレクションを削除しますか？',
    deleteCollectionDescription: 'コレクションは削除されますが、保存した投稿は「すべての保存」に残ります。',
    deleting: '削除中...',
    delete: '削除',
  },
  ko: {
    all: '전체',
    reader: '독자',
    author: '작가',
    promoted: '프로모션',
    newestSaved: '최근 저장순',
    oldestSaved: '오래된 저장순',
    close: '닫기',
    post: '게시물',
    posts: '게시물',
    noSavedPreview: '저장된 미리보기가 없습니다',
    collectionOptions: '컬렉션 옵션',
    allSaved: '전체 저장',
    favorites: '즐겨찾기',
    readLater: '나중에 읽기',
    failedLoadCollections: '컬렉션을 불러오지 못했습니다',
    failedLoadSavedPosts: '저장한 게시물을 불러오지 못했습니다',
    failedLoadMorePosts: '게시물을 더 불러오지 못했습니다',
    originalUnavailable: '원본 게시물을 사용할 수 없습니다',
    noLink: '이 저장된 게시물에는 링크가 없습니다',
    linkCopied: '링크를 복사했습니다',
    unableCopyLink: '링크를 복사할 수 없습니다',
    collectionsUpdated: '컬렉션을 업데이트했습니다',
    failedUpdateCollections: '컬렉션을 업데이트하지 못했습니다',
    collectionUpdated: '컬렉션을 업데이트했습니다',
    collectionCreatedPostAdded: '컬렉션을 만들고 게시물을 추가했습니다',
    collectionCreated: '컬렉션을 만들었습니다',
    failedSaveCollection: '컬렉션을 저장하지 못했습니다',
    removedSavedPosts: '저장한 게시물에서 삭제했습니다',
    failedRemoveSavedPost: '저장한 게시물을 삭제하지 못했습니다',
    collectionDeleted: '컬렉션을 삭제했습니다',
    failedDeleteCollection: '컬렉션을 삭제하지 못했습니다',
    back: '뒤로',
    savedPosts: '저장한 게시물',
    savedCountOne: '저장한 게시물 {{count}}개',
    savedCountMany: '저장한 게시물 {{count}}개',
    createCollection: '컬렉션 만들기',
    searchSavedPosts: '저장한 게시물 검색',
    clearSearch: '검색 지우기',
    collections: '컬렉션',
    keepRelated: '관련 게시물을 함께 정리하세요.',
    new: '새로 만들기',
    total: '총 {{count}}개',
    tryAgain: '다시 시도',
    loading: '불러오는 중...',
    loadMore: '더 보기',
    noSavedPosts: '아직 저장한 게시물이 없습니다',
    noSavedPostsBody: '독자, 작가 및 프로모션 콘텐츠에서 저장한 게시물이 여기에 표시됩니다.',
    browsePosts: '게시물 둘러보기',
    sortSavedPosts: '저장한 게시물 정렬',
    sortDescription: '저장한 게시물의 정렬 방식을 선택하세요.',
    savedPost: '저장한 게시물',
    savedPostActionsDescription: '이 저장된 게시물을 열고, 정리하고, 복사하거나 삭제합니다.',
    openOriginal: '원본 열기',
    openOriginalSubtitle: '원본 게시물 또는 프로모션 보기',
    manageCollections: '컬렉션 관리',
    manageCollectionsSubtitle: '이 게시물을 하나 이상의 컬렉션에 추가',
    copyLink: '링크 복사',
    copyLinkSubtitle: '원본 게시물 링크 복사',
    removeFromSavedPosts: '저장한 게시물에서 삭제',
    removeSubtitle: '원본 게시물은 삭제되지 않습니다',
    collection: '컬렉션',
    collectionMenuDescription: '이 컬렉션을 편집하거나 삭제합니다. 저장한 게시물은 전체 저장에 남습니다.',
    editCollection: '컬렉션 편집',
    editCollectionSubtitle: '이름, 설명 또는 색상 변경',
    deleteCollection: '컬렉션 삭제',
    deleteCollectionSubtitle: '안의 저장된 게시물은 삭제되지 않습니다',
    removeSavedPostQuestion: '저장한 게시물을 삭제할까요?',
    removeSavedPostDescription: '원본 게시물은 삭제되지 않습니다.',
    cancel: '취소',
    removing: '삭제 중...',
    remove: '삭제',
    deleteCollectionQuestion: '컬렉션을 삭제할까요?',
    deleteCollectionDescription: '컬렉션은 삭제되지만 저장한 게시물은 전체 저장에 남습니다.',
    deleting: '삭제 중...',
    delete: '삭제',
  },
})

const TYPE_TABS = [
  { key: 'all', labelKey: 'all' },
  { key: 'reader', labelKey: 'reader' },
  { key: 'author', labelKey: 'author' },
  { key: 'promoted', labelKey: 'promoted' },
]

const SORT_OPTIONS = [
  { key: 'newest', labelKey: 'newestSaved' },
  { key: 'oldest', labelKey: 'oldestSaved' },
]

const SAVED_POST_PAGE_SIZE = 30

function getCollectionDisplayName(collection, t) {
  if (collection?.system_key === 'all') return t('savedPostsPage.allSaved')
  if (collection?.system_key === 'favorites') return t('savedPostsPage.favorites')
  if (collection?.system_key === 'read_later') return t('savedPostsPage.readLater')
  return collection?.name || t('savedPostsPage.collection')
}

function useDebouncedValue(value, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay)
    return () => window.clearTimeout(timeout)
  }, [delay, value])

  return debouncedValue
}

function getPreviewImage(item) {
  const snapshot = item?.snapshot_data || {}
  const arrays = [snapshot.image_urls, snapshot.images, snapshot.media_urls, snapshot.photos]

  for (const value of arrays) {
    if (!Array.isArray(value)) continue

    const image = value
      .map((entry) => (typeof entry === 'string' ? entry : entry?.url || entry?.image_url || ''))
      .find(Boolean)

    if (image) return image
  }

  return (
    snapshot.image_url ||
    snapshot.cover_url ||
    snapshot.thumbnail_url ||
    snapshot.banner_url ||
    ''
  )
}

function hexToRgba(hex, alpha) {
  const normalized = String(hex || '#6D4AFF').replace('#', '')
  const safe = /^[0-9a-f]{6}$/i.test(normalized) ? normalized : '6D4AFF'
  const red = parseInt(safe.slice(0, 2), 16)
  const green = parseInt(safe.slice(2, 4), 16)
  const blue = parseInt(safe.slice(4, 6), 16)

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

function openSavedSource(navigate, item) {
  const url = String(item?.source_url || '').trim()

  if (!url || item?.status === 'unavailable') return false

  if (/^https?:\/\//i.test(url)) {
    try {
      const parsed = new URL(url)

      if (parsed.origin === window.location.origin) {
        navigate(`${parsed.pathname}${parsed.search}${parsed.hash}`)
      } else {
        window.open(url, '_blank', 'noopener,noreferrer')
      }
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer')
    }

    return true
  }

  navigate(url.startsWith('/') ? url : `/${url}`)
  return true
}

function BottomSheet({ open, title, description, onClose, children }) {
  const { t } = useDisplayTranslation()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[115] flex items-end justify-center">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
        aria-label={t('savedPostsPage.close')}
      />

      <section className="relative z-10 w-full max-w-[560px] rounded-t-[28px] bg-white px-4 pb-[calc(20px+env(safe-area-inset-bottom))] pt-3 shadow-2xl dark:bg-[#171923]">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-[#d9dce4] dark:bg-white/15" />

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-black text-[#111827] dark:text-white">{title}</h2>
            {description ? (
              <p className="mt-1 text-[12px] leading-5 text-[#8d94a1] dark:text-white/45">{description}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95 dark:bg-white/10 dark:text-white"
            aria-label={t('savedPostsPage.close')}
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </section>
    </div>
  )
}

function SheetAction({ icon: Icon, title, subtitle, danger = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-[18px] px-3.5 py-3 text-left active:scale-[0.99] ${
        danger
          ? 'bg-[#fff1f1] text-[#e5484d] dark:bg-[#e5484d]/10 dark:text-[#ff8d91]'
          : 'bg-[#f8f8fb] text-[#111827] dark:bg-white/5 dark:text-white'
      }`}
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] ${danger ? 'bg-white/70 dark:bg-white/5' : 'bg-white dark:bg-white/10'}`}>
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-extrabold">{title}</span>
        {subtitle ? <span className="mt-0.5 block text-[11px] opacity-60">{subtitle}</span> : null}
      </span>
    </button>
  )
}

function CollectionCard({ collection, active, onSelect, onMenu }) {
  const { t } = useDisplayTranslation()
  const previewItems = collection.preview_items || []
  const color = collection.cover_color || '#6D4AFF'
  const customCollection = !['all', 'favorites', 'read_later'].includes(collection.system_key)

  return (
    <div className="relative w-[43%] min-w-[118px] max-w-[138px] shrink-0 snap-start sm:w-[170px] sm:max-w-none">
      <button
        type="button"
        onClick={onSelect}
        className={`min-h-[124px] w-full overflow-hidden rounded-[18px] border-2 p-2.5 text-left transition active:scale-[0.985] dark:bg-[#171923] ${
          active
            ? 'border-[#6d4aff]'
            : 'border-transparent ring-1 ring-inset ring-black/5 dark:ring-white/10'
        }`}
        style={{
          backgroundImage: `linear-gradient(145deg, ${hexToRgba(color, 0.18)}, ${hexToRgba(color, 0.06)})`,
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <span
  className="relative flex h-8 w-8 items-center justify-center rounded-[11px]"
  style={{ backgroundColor: hexToRgba(color, 0.16), color }}
>
  <Folder className="h-3.5 w-3.5" strokeWidth={1.9} />

  {active ? (
    <span className="absolute -right-1 -top-1 flex h-[17px] w-[17px] items-center justify-center rounded-full bg-white text-[#6d4aff] ring-1 ring-[#dcd6ff] dark:bg-[#171923] dark:text-white dark:ring-white/15">
      <Check className="h-2.5 w-2.5" strokeWidth={2.7} />
    </span>
  ) : null}
</span>
        </div>

        <div className="mt-2 line-clamp-1 text-[12px] font-bold text-[#111827] dark:text-white">
          {getCollectionDisplayName(collection, t)}
        </div>

        <div className="mt-0.5 text-[9.5px] font-medium text-[#777f8d] dark:text-white/45">
          {Number(collection.item_count || 0)}{' '}
          {t(`savedPostsPage.${Number(collection.item_count || 0) === 1 ? 'post' : 'posts'}`)}
        </div>

        <div className="mt-2 flex h-8 items-center">
          {previewItems.length ? (
            <div className="flex -space-x-2">
              {previewItems.slice(0, 3).map((item, index) => {
                const image = getPreviewImage(item)

                return (
                  <span
                    key={item.id || index}
                    className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-[10px] border-2 border-white bg-[#f5f3fa] text-[#6d4aff] dark:border-[#171923] dark:bg-[#242735]"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <Bookmark className="h-3 w-3" strokeWidth={1.8} />
                    )}
                  </span>
                )
              })}
            </div>
          ) : (
            <span className="line-clamp-1 text-[9px] font-medium text-[#9aa1ad] dark:text-white/35">
              {t('savedPostsPage.noSavedPreview')}
            </span>
          )}
        </div>
      </button>

      {customCollection ? (
        <button
          type="button"
          onClick={onMenu}
          className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 text-[#4b5563] shadow-sm active:scale-95 dark:bg-[#242735] dark:text-white"
          aria-label={t('savedPostsPage.collectionOptions')}
        >
          <MoreHorizontal className="h-3.5 w-3.5" strokeWidth={1.8} />
        </button>
      ) : null}
    </div>
  )
}

export default function SavedPostsPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const token = getReaderToken()
  const [query, setQuery] = useState('')
  const searchedQuery = useDebouncedValue(query)
  const [activeType, setActiveType] = useState('all')
  const [sort, setSort] = useState('newest')
  const [selectedCollectionId, setSelectedCollectionId] = useState('all')
  const [allSaved, setAllSaved] = useState(null)
  const [collections, setCollections] = useState([])
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasNext, setHasNext] = useState(false)
  const [nextCursor, setNextCursor] = useState(null)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [sortSheetOpen, setSortSheetOpen] = useState(false)
  const [actionItem, setActionItem] = useState(null)
  const [collectionItem, setCollectionItem] = useState(null)
  const [collectionSaving, setCollectionSaving] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingCollection, setEditingCollection] = useState(null)
  const [editorItemToAdd, setEditorItemToAdd] = useState(null)
  const [editorSubmitting, setEditorSubmitting] = useState(false)
  const [editorError, setEditorError] = useState('')
  const [collectionMenu, setCollectionMenu] = useState(null)
  const [removeTarget, setRemoveTarget] = useState(null)
  const [deleteCollectionTarget, setDeleteCollectionTarget] = useState(null)
  const [destructiveLoading, setDestructiveLoading] = useState(false)

  const anySheetOpen = Boolean(
    sortSheetOpen ||
    actionItem ||
    collectionItem ||
    editorOpen ||
    collectionMenu ||
    removeTarget ||
    deleteCollectionTarget
  )

  const collectionCards = useMemo(() => {
    const fallbackAll = {
      id: 'all',
      name: 'All Saved',
      system_key: 'all',
      cover_color: '#6D4AFF',
      item_count: total,
      preview_items: items.slice(0, 3),
    }

    return [allSaved || fallbackAll, ...collections]
  }, [allSaved, collections, items, total])

  const showToast = useCallback((message) => {
    setToast(message)
  }, [])

  const handleUnauthorized = useCallback((requestError) => {
    if (requestError?.status === 401 || requestError?.status === 403) {
      navigate('/login', { replace: true })
      return true
    }

    return false
  }, [navigate])

  const loadCollections = useCallback(async (signal) => {
    if (!token) return

    try {
      const data = await fetchSavedPostCollections(signal)
      setAllSaved(data.all_saved || null)
      setCollections(data.collections || [])
    } catch (requestError) {
      if (requestError?.name === 'AbortError') return
      if (handleUnauthorized(requestError)) return
      setError(requestError.message || t('savedPostsPage.failedLoadCollections'))
    }
  }, [handleUnauthorized, t, token])

  const replaceItemInList = useCallback((updatedItem) => {
    if (!updatedItem?.id) return

    setItems((current) => current.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
  }, [])

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true })
    }
  }, [navigate, token])

  useEffect(() => {
    if (!anySheetOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [anySheetOpen])

  useEffect(() => {
    if (!token) return undefined

    const controller = new AbortController()
    loadCollections(controller.signal)

    return () => controller.abort()
  }, [loadCollections, token])

  useEffect(() => {
    if (!token) return undefined

    const controller = new AbortController()

    async function loadItems() {
      try {
        setLoading(true)
        setError('')
        setItems([])
        setNextCursor(null)
        setHasNext(false)

        const data = await fetchSavedPosts({
          type: activeType,
          collection_id: selectedCollectionId === 'all' ? '' : selectedCollectionId,
          q: searchedQuery,
          sort,
          limit: SAVED_POST_PAGE_SIZE,
        }, controller.signal)

        setItems(data.items || [])
        setTotal(Number(data.total || 0))
        setHasNext(Boolean(data.has_next))
        setNextCursor(data.next_cursor || null)
      } catch (requestError) {
        if (requestError?.name === 'AbortError') return
        if (handleUnauthorized(requestError)) return
        setError(requestError.message || t('savedPostsPage.failedLoadSavedPosts'))
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadItems()
    return () => controller.abort()
  }, [activeType, handleUnauthorized, searchedQuery, selectedCollectionId, sort, t, token])

  useEffect(() => {
    if (!toast) return undefined

    const timeout = window.setTimeout(() => setToast(''), 2400)
    return () => window.clearTimeout(timeout)
  }, [toast])

  async function handleLoadMore() {
    if (!hasNext || !nextCursor || loadingMore) return

    try {
      setLoadingMore(true)

      const data = await fetchSavedPosts({
        type: activeType,
        collection_id: selectedCollectionId === 'all' ? '' : selectedCollectionId,
        q: searchedQuery,
        sort,
        limit: SAVED_POST_PAGE_SIZE,
        cursor: nextCursor,
      })

      setItems((current) => {
        const knownIds = new Set(current.map((item) => item.id))
        return [...current, ...(data.items || []).filter((item) => !knownIds.has(item.id))]
      })
      setHasNext(Boolean(data.has_next))
      setNextCursor(data.next_cursor || null)
    } catch (requestError) {
      if (!handleUnauthorized(requestError)) {
        showToast(requestError.message || t('savedPostsPage.failedLoadMorePosts'))
      }
    } finally {
      setLoadingMore(false)
    }
  }

  function handleOpenItem(item) {
    const opened = openSavedSource(navigate, item)
    if (!opened) showToast(t('savedPostsPage.originalUnavailable'))
  }

  async function handleCopyLink(item) {
    const url = String(item?.source_url || '').trim()

    if (!url) {
      showToast(t('savedPostsPage.noLink'))
      return
    }

    const absoluteUrl = /^https?:\/\//i.test(url)
      ? url
      : `${window.location.origin}${url.startsWith('/') ? url : `/${url}`}`

    try {
      await navigator.clipboard.writeText(absoluteUrl)
      showToast(t('savedPostsPage.linkCopied'))
    } catch {
      showToast(t('savedPostsPage.unableCopyLink'))
    }

    setActionItem(null)
  }

  async function handleSaveCollections(collectionIds) {
    if (!collectionItem) return

    try {
      setCollectionSaving(true)
      const data = await replaceSavedPostCollections(collectionItem.id, collectionIds)
      replaceItemInList(data.item)
      setCollectionItem(null)
      await loadCollections()
      showToast(t('savedPostsPage.collectionsUpdated'))
    } catch (requestError) {
      if (!handleUnauthorized(requestError)) {
        showToast(requestError.message || t('savedPostsPage.failedUpdateCollections'))
      }
    } finally {
      setCollectionSaving(false)
    }
  }

  function openNewCollection(itemToAdd = null) {
    setCollectionItem(null)
    setEditingCollection(null)
    setEditorItemToAdd(itemToAdd)
    setEditorError('')
    setEditorOpen(true)
  }

  function openEditCollection(collection) {
    setCollectionMenu(null)
    setEditingCollection(collection)
    setEditorItemToAdd(null)
    setEditorError('')
    setEditorOpen(true)
  }

  async function handleCollectionSubmit(payload) {
    try {
      setEditorSubmitting(true)
      setEditorError('')

      if (editingCollection) {
        await updateSavedPostCollection(editingCollection.id, payload)
        showToast(t('savedPostsPage.collectionUpdated'))
      } else {
        const data = await createSavedPostCollection(payload)
        const createdCollection = data.collection

        if (editorItemToAdd && createdCollection?.id) {
          const currentIds = (editorItemToAdd.collections || []).map((collection) => collection.id)
          const updated = await replaceSavedPostCollections(editorItemToAdd.id, [...new Set([...currentIds, createdCollection.id])])
          replaceItemInList(updated.item)
          showToast(t('savedPostsPage.collectionCreatedPostAdded'))
        } else {
          showToast(t('savedPostsPage.collectionCreated'))
        }
      }

      setEditorOpen(false)
      setEditingCollection(null)
      setEditorItemToAdd(null)
      await loadCollections()
    } catch (requestError) {
      if (!handleUnauthorized(requestError)) {
        setEditorError(requestError.message || t('savedPostsPage.failedSaveCollection'))
      }
    } finally {
      setEditorSubmitting(false)
    }
  }

  async function handleRemoveSavedPost() {
    if (!removeTarget) return

    try {
      setDestructiveLoading(true)
      await deleteSavedPost(removeTarget.id)
      setItems((current) => current.filter((item) => item.id !== removeTarget.id))
      setTotal((current) => Math.max(0, current - 1))
      setRemoveTarget(null)
      await loadCollections()
      showToast(t('savedPostsPage.removedSavedPosts'))
    } catch (requestError) {
      if (!handleUnauthorized(requestError)) {
        showToast(requestError.message || t('savedPostsPage.failedRemoveSavedPost'))
      }
    } finally {
      setDestructiveLoading(false)
    }
  }

  async function handleDeleteCollection() {
    if (!deleteCollectionTarget) return

    try {
      setDestructiveLoading(true)
      await deleteSavedPostCollection(deleteCollectionTarget.id)

      if (selectedCollectionId === deleteCollectionTarget.id) {
        setSelectedCollectionId('all')
      }

      setDeleteCollectionTarget(null)
      await loadCollections()
      showToast(t('savedPostsPage.collectionDeleted'))
    } catch (requestError) {
      if (!handleUnauthorized(requestError)) {
        showToast(requestError.message || t('savedPostsPage.failedDeleteCollection'))
      }
    } finally {
      setDestructiveLoading(false)
    }
  }

  const currentSortLabelKey = SORT_OPTIONS.find((option) => option.key === sort)?.labelKey || 'newestSaved'
  const currentSortLabel = t(`savedPostsPage.${currentSortLabelKey}`)

  return (
    <div className="min-h-screen bg-[#fafafa] pb-[96px] dark:bg-[#0d0f16]">
      <header className="sticky top-0 z-40 border-b border-[#eceaf2] bg-white/95 px-4 pb-3 pt-4 backdrop-blur dark:border-white/10 dark:bg-[#171923]/95">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
  <button
    type="button"
    onClick={() => navigate(-1)}
    className="flex h-10 w-7 shrink-0 items-center justify-start text-[#111827] active:scale-95 dark:text-white"
    aria-label={t('savedPostsPage.back')}
  >
    <ArrowLeft className="h-5 w-5" strokeWidth={1.9} />
  </button>

  <div className="min-w-0">
    <h1 className="text-[21px] font-bold leading-tight text-[#111827] dark:text-white">
      {t('savedPostsPage.savedPosts')}
    </h1>
    <p className="mt-0.5 text-[11px] text-[#8d94a1] dark:text-white/40">
       {t(`savedPostsPage.${total === 1 ? 'savedCountOne' : 'savedCountMany'}`, { count: total })}
    </p>
  </div>
</div>

            <button
              type="button"
              onClick={() => openNewCollection()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3f0ff] text-[#6d4aff] active:scale-95 dark:bg-[#6d4aff]/15 dark:text-[#b9a8ff]"
              aria-label={t('savedPostsPage.createCollection')}
            >
              <FolderPlus className="h-[18px] w-[18px]" strokeWidth={1.9} />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <label className="flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-[15px] bg-[#f7f7fa] px-3.5 ring-1 ring-transparent focus-within:ring-[#6d4aff]/30 dark:bg-white/5">
              <Search className="h-[17px] w-[17px] shrink-0 text-[#8d94a1] dark:text-white/40" strokeWidth={1.8} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value.slice(0, 100))}
                placeholder={t('savedPostsPage.searchSavedPosts')}
                className="min-w-0 flex-1 bg-transparent text-[13px] text-[#111827] outline-none placeholder:text-[#9aa1ad] dark:text-white dark:placeholder:text-white/30"
              />
              {query ? (
                <button type="button" onClick={() => setQuery('')} className="text-[#9aa1ad] active:scale-95 dark:text-white/40" aria-label={t('savedPostsPage.clearSearch')}>
                  <X className="h-4 w-4" strokeWidth={1.9} />
                </button>
              ) : null}
            </label>

            <button
              type="button"
              onClick={() => setSortSheetOpen(true)}
              className="flex h-11 shrink-0 items-center gap-2 rounded-[15px] bg-[#f7f7fa] px-3.5 text-[12px] font-extrabold text-[#4b5563] active:scale-[0.98] dark:bg-white/5 dark:text-white/70"
            >
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.8} />
              <span className="hidden sm:inline">{currentSortLabel}</span>
              <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TYPE_TABS.map((tab) => {
              const active = activeType === tab.key

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveType(tab.key)}
                  className={`shrink-0 rounded-full px-4 py-2 text-[11.5px] transition active:scale-[0.97] ${
  active
    ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] font-extrabold text-white shadow-[0_8px_20px_rgba(124,91,255,0.25)]'
    : 'bg-white/80 font-semibold text-[#74759b] shadow-[0_5px_14px_rgba(124,91,255,0.06)] ring-1 ring-[#eeeaff] dark:bg-white/10 dark:text-white/60 dark:ring-white/10'
}`}
                >
                  {t(`savedPostsPage.${tab.labelKey}`)}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-4">
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[14px] font-black text-[#111827] dark:text-white">{t('savedPostsPage.collections')}</h2>
              <p className="mt-0.5 text-[10.5px] text-[#8d94a1] dark:text-white/40">{t('savedPostsPage.keepRelated')}</p>
            </div>
            <button
              type="button"
              onClick={() => openNewCollection()}
              className="inline-flex items-center gap-1.5 text-[11.5px] font-extrabold text-[#6d4aff] active:scale-95 dark:text-[#b9a8ff]"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.1} />
              {t('savedPostsPage.new')}
            </button>
          </div>

          <div className="-mx-4 flex snap-x snap-proximity gap-2 overflow-x-auto px-4 pb-2 pt-1 scroll-pl-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {collectionCards.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                active={selectedCollectionId === collection.id}
                onSelect={() => setSelectedCollectionId(collection.id)}
                onMenu={(event) => {
                  event?.stopPropagation?.()
                  setCollectionMenu(collection)
                }}
              />
            ))}
          </div>
        </section>

        <section className="mt-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-[14px] font-black text-[#111827] dark:text-white">
              {getCollectionDisplayName(collectionCards.find((collection) => collection.id === selectedCollectionId), t)}
            </div>
            {!loading ? (
              <div className="text-[10.5px] font-semibold text-[#9aa1ad] dark:text-white/35">{t('savedPostsPage.total', { count: total })}</div>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-[20px] bg-[#fff1f1] px-4 py-4 text-[12.5px] font-semibold text-[#e5484d] dark:bg-[#e5484d]/10 dark:text-[#ff8d91]">
              <div>{error}</div>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-3 rounded-full bg-white px-4 py-2 text-[11px] font-extrabold text-[#e5484d] active:scale-95 dark:bg-white/10"
              >
                {t('savedPostsPage.tryAgain')}
              </button>
            </div>
          ) : null}

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-48 animate-pulse rounded-[22px] bg-white ring-1 ring-black/5 dark:bg-[#171923] dark:ring-white/10" />
              ))}
            </div>
          ) : items.length ? (
            <div className="space-y-3">
              {items.map((item) => (
                <SavedPostCard
                  key={item.id}
                  item={item}
                  onOpen={handleOpenItem}
                  onMenu={setActionItem}
                />
              ))}

              {hasNext ? (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-white text-[12px] font-extrabold text-[#6d4aff] ring-1 ring-black/5 active:scale-[0.99] disabled:opacity-60 dark:bg-[#171923] dark:text-[#b9a8ff] dark:ring-white/10"
                >
                  {loadingMore ? <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={1.8} /> : null}
                  {loadingMore ? t('savedPostsPage.loading') : t('savedPostsPage.loadMore')}
                </button>
              ) : null}
            </div>
          ) : !error ? (
            <div className="rounded-[24px] bg-white px-6 py-10 text-center ring-1 ring-black/5 dark:bg-[#171923] dark:ring-white/10">
  <img
    src="/assets/Icons/Folder.svg"
    alt=""
    className="mx-auto h-auto w-[130px] object-contain"
  />

  <h2 className="mt-3 text-[17px] font-black text-[#111827] dark:text-white">
    {t('savedPostsPage.noSavedPosts')}
  </h2>

  <p className="mx-auto mt-2 max-w-[300px] text-[12.5px] leading-6 text-[#8d94a1] dark:text-white/45">
    {t('savedPostsPage.noSavedPostsBody')}
  </p>

  <button
    type="button"
    onClick={() => navigate('/discover')}
    className="mx-auto mt-5 flex h-11 items-center justify-center gap-2 rounded-[14px] border border-[#cfc4ff] bg-white px-5 text-[12.5px] font-bold text-[#6d4aff] shadow-[0_6px_18px_rgba(109,74,255,0.08)] active:scale-[0.98] dark:bg-white/5 dark:text-[#b9a8ff]"
  >
    <Bookmark className="h-4 w-4" strokeWidth={1.9} />
    {t('savedPostsPage.browsePosts')}
  </button>
</div>
          ) : null}
        </section>
      </main>

      <BottomSheet
        open={Boolean(sortSheetOpen)}
        title={t('savedPostsPage.sortSavedPosts')}
        description={t('savedPostsPage.sortDescription')}
        onClose={() => setSortSheetOpen(false)}
      >
        <div className="space-y-2">
          {SORT_OPTIONS.map((option) => {
            const active = sort === option.key

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => {
                  setSort(option.key)
                  setSortSheetOpen(false)
                }}
                className={`flex w-full items-center justify-between rounded-[18px] px-4 py-3.5 text-left ${
                  active
                    ? 'bg-[#f3f0ff] text-[#6d4aff] ring-1 ring-[#6d4aff]/25 dark:bg-[#6d4aff]/12 dark:text-[#b9a8ff]'
                    : 'bg-[#f8f8fb] text-[#111827] dark:bg-white/5 dark:text-white'
                }`}
              >
                <span className="text-[13.5px] font-extrabold">{t(`savedPostsPage.${option.labelKey}`)}</span>
                {active ? <Check className="h-4 w-4" strokeWidth={2.4} /> : null}
              </button>
            )
          })}
        </div>
      </BottomSheet>

      <BottomSheet
        open={Boolean(actionItem)}
        title={t('savedPostsPage.savedPost')}
        description={t('savedPostsPage.savedPostActionsDescription')}
        onClose={() => setActionItem(null)}
      >
        <div className="space-y-2">
          <SheetAction
            icon={ExternalLink}
            title={t('savedPostsPage.openOriginal')}
            subtitle={t('savedPostsPage.openOriginalSubtitle')}
            onClick={() => {
              const item = actionItem
              setActionItem(null)
              handleOpenItem(item)
            }}
          />
          <SheetAction
            icon={Folder}
            title={t('savedPostsPage.manageCollections')}
            subtitle={t('savedPostsPage.manageCollectionsSubtitle')}
            onClick={() => {
              setCollectionItem(actionItem)
              setActionItem(null)
            }}
          />
          <SheetAction
            icon={Copy}
            title={t('savedPostsPage.copyLink')}
            subtitle={t('savedPostsPage.copyLinkSubtitle')}
            onClick={() => handleCopyLink(actionItem)}
          />
          <SheetAction
            icon={Trash2}
            title={t('savedPostsPage.removeFromSavedPosts')}
            subtitle={t('savedPostsPage.removeSubtitle')}
            danger
            onClick={() => {
              setRemoveTarget(actionItem)
              setActionItem(null)
            }}
          />
        </div>
      </BottomSheet>

      <SavedPostCollectionSheet
        open={Boolean(collectionItem)}
        item={collectionItem}
        collections={collections}
        saving={collectionSaving}
        onClose={() => setCollectionItem(null)}
        onSave={handleSaveCollections}
        onCreateCollection={() => openNewCollection(collectionItem)}
      />

      <SavedPostCollectionEditor
        open={editorOpen}
        collection={editingCollection}
        submitting={editorSubmitting}
        error={editorError}
        onClose={() => {
          if (editorSubmitting) return
          setEditorOpen(false)
          setEditingCollection(null)
          setEditorItemToAdd(null)
          setEditorError('')
        }}
        onSubmit={handleCollectionSubmit}
      />

      <BottomSheet
        open={Boolean(collectionMenu)}
        title={getCollectionDisplayName(collectionMenu, t)}
        description={t('savedPostsPage.collectionMenuDescription')}
        onClose={() => setCollectionMenu(null)}
      >
        <div className="space-y-2">
          <SheetAction
            icon={Pencil}
            title={t('savedPostsPage.editCollection')}
            subtitle={t('savedPostsPage.editCollectionSubtitle')}
            onClick={() => openEditCollection(collectionMenu)}
          />
          <SheetAction
            icon={Trash2}
            title={t('savedPostsPage.deleteCollection')}
            subtitle={t('savedPostsPage.deleteCollectionSubtitle')}
            danger
            onClick={() => {
              setDeleteCollectionTarget(collectionMenu)
              setCollectionMenu(null)
            }}
          />
        </div>
      </BottomSheet>

      <BottomSheet
        open={Boolean(removeTarget)}
        title={t('savedPostsPage.removeSavedPostQuestion')}
        description={t('savedPostsPage.removeSavedPostDescription')}
        onClose={() => destructiveLoading ? undefined : setRemoveTarget(null)}
      >
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRemoveTarget(null)}
            disabled={destructiveLoading}
            className="h-12 rounded-[16px] bg-[#f5f3fa] text-[13px] font-extrabold text-[#4b5563] disabled:opacity-50 dark:bg-white/10 dark:text-white/70"
          >
            {t('savedPostsPage.cancel')}
          </button>
          <button
            type="button"
            onClick={handleRemoveSavedPost}
            disabled={destructiveLoading}
            className="h-12 rounded-[16px] bg-[#e5484d] text-[13px] font-extrabold text-white disabled:opacity-60"
          >
            {destructiveLoading ? t('savedPostsPage.removing') : t('savedPostsPage.remove')}
          </button>
        </div>
      </BottomSheet>

      <BottomSheet
        open={Boolean(deleteCollectionTarget)}
        title={t('savedPostsPage.deleteCollectionQuestion')}
        description={t('savedPostsPage.deleteCollectionDescription')}
        onClose={() => destructiveLoading ? undefined : setDeleteCollectionTarget(null)}
      >
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setDeleteCollectionTarget(null)}
            disabled={destructiveLoading}
            className="h-12 rounded-[16px] bg-[#f5f3fa] text-[13px] font-extrabold text-[#4b5563] disabled:opacity-50 dark:bg-white/10 dark:text-white/70"
          >
            {t('savedPostsPage.cancel')}
          </button>
          <button
            type="button"
            onClick={handleDeleteCollection}
            disabled={destructiveLoading}
            className="h-12 rounded-[16px] bg-[#e5484d] text-[13px] font-extrabold text-white disabled:opacity-60"
          >
            {destructiveLoading ? t('savedPostsPage.deleting') : t('savedPostsPage.delete')}
          </button>
        </div>
      </BottomSheet>

      {toast ? (
        <div className="fixed bottom-[28px] left-1/2 z-[160] -translate-x-1/2 rounded-full bg-[#111827] px-4 py-2.5 text-[12px] font-bold text-white shadow-xl dark:bg-white dark:text-[#111827]">
          {toast}
        </div>
      ) : null}
    </div>
  )
}
