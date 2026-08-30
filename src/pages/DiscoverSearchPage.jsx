import { recordAuthorHashtagInterest } from '../services/authorHashtagsApi'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  cancelDiscoverSearchAnalytics,
  requestImmediateDiscoverSearchAnalytics,
  scheduleDiscoverSearchAnalytics,
  trackDiscoverSearchResultClick,
} from '../services/discoverSearchAnalytics'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('discoverSearchPage', {
  en: {
    all: 'All',
    readers: 'Readers',
    pages: 'Pages',
    stories: 'Stories',
    pdfBooks: 'PDF Books',
    posts: 'Posts',
    profile: 'Profile',
    reader: 'Reader',
    shadowReader: 'Shadow reader',
    authorPage: 'Author Page',
    followers: '{{count}} followers',
    works: '{{count}} works',
    author: 'Author',
    storyCover: 'Story cover',
    untitledStory: 'Untitled Story',
    byAuthor: 'by {{author}}',
    pdfCover: 'PDF cover',
    untitledPdf: 'Untitled PDF',
    pageCount: '{{count}} pages',
    pagePost: 'Page Post',
    readerPost: 'Reader Post',
    postImage: '{{owner}} post',
    seeAll: 'See all',
    noResults: 'No results found',
    searchEverything: 'Search everything on Shadow',
    tryAnother: 'Try another name, username, story title, PDF book, or post keyword.',
    findEverything: 'Find readers, author pages, stories, PDF books, and posts in one place.',
    searchFailed: 'Failed to search Shadow',
    goBack: 'Go back',
    searchPlaceholder: 'Search Shadow...',
    clearSearch: 'Clear search',
    resultsFor: 'Results for “{{query}}”',
    shown: '{{count}} shown',
  },
  km: {
    all: 'ទាំងអស់',
    readers: 'អ្នកអាន',
    pages: 'ទំព័រ',
    stories: 'រឿង',
    pdfBooks: 'សៀវភៅ PDF',
    posts: 'Post',
    profile: 'ប្រវត្តិរូប',
    reader: 'អ្នកអាន',
    shadowReader: 'អ្នកអាន Shadow',
    authorPage: 'ទំព័រអ្នកនិពន្ធ',
    followers: 'អ្នកតាមដាន {{count}}',
    works: 'ស្នាដៃ {{count}}',
    author: 'អ្នកនិពន្ធ',
    storyCover: 'គម្របរឿង',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    byAuthor: 'ដោយ {{author}}',
    pdfCover: 'គម្រប PDF',
    untitledPdf: 'PDF គ្មានចំណងជើង',
    pageCount: '{{count}} ទំព័រ',
    pagePost: 'Post ទំព័រ',
    readerPost: 'Post អ្នកអាន',
    postImage: 'Post របស់ {{owner}}',
    seeAll: 'មើលទាំងអស់',
    noResults: 'រកមិនឃើញលទ្ធផល',
    searchEverything: 'ស្វែងរកអ្វីគ្រប់យ៉ាងនៅលើ Shadow',
    tryAnother: 'សាកឈ្មោះ Username ចំណងជើងរឿង សៀវភៅ PDF ឬពាក្យគន្លឹះ Post ផ្សេងទៀត។',
    findEverything: 'ស្វែងរកអ្នកអាន ទំព័រអ្នកនិពន្ធ រឿង សៀវភៅ PDF និង Post នៅកន្លែងតែមួយ។',
    searchFailed: 'មិនអាចស្វែងរកលើ Shadow បានទេ',
    goBack: 'ត្រឡប់ក្រោយ',
    searchPlaceholder: 'ស្វែងរកលើ Shadow...',
    clearSearch: 'លុបពាក្យស្វែងរក',
    resultsFor: 'លទ្ធផលសម្រាប់ “{{query}}”',
    shown: 'បង្ហាញ {{count}}',
  },
  zh: {
    all: '全部',
    readers: '读者',
    pages: '主页',
    stories: '故事',
    pdfBooks: 'PDF 书籍',
    posts: '帖子',
    profile: '个人资料',
    reader: '读者',
    shadowReader: 'Shadow 读者',
    authorPage: '作者主页',
    followers: '{{count}} 位关注者',
    works: '{{count}} 部作品',
    author: '作者',
    storyCover: '故事封面',
    untitledStory: '无标题故事',
    byAuthor: '作者：{{author}}',
    pdfCover: 'PDF 封面',
    untitledPdf: '无标题 PDF',
    pageCount: '{{count}} 页',
    pagePost: '主页帖子',
    readerPost: '读者帖子',
    postImage: '{{owner}} 的帖子',
    seeAll: '查看全部',
    noResults: '未找到结果',
    searchEverything: '搜索 Shadow 上的所有内容',
    tryAnother: '尝试其他姓名、用户名、故事标题、PDF 书籍或帖子关键词。',
    findEverything: '在一个地方查找读者、作者主页、故事、PDF 书籍和帖子。',
    searchFailed: '无法搜索 Shadow',
    goBack: '返回',
    searchPlaceholder: '搜索 Shadow...',
    clearSearch: '清除搜索',
    resultsFor: '“{{query}}”的搜索结果',
    shown: '显示 {{count}} 条',
  },
  ja: {
    all: 'すべて',
    readers: '読者',
    pages: 'ページ',
    stories: 'ストーリー',
    pdfBooks: 'PDF 書籍',
    posts: '投稿',
    profile: 'プロフィール',
    reader: '読者',
    shadowReader: 'Shadow 読者',
    authorPage: '作者ページ',
    followers: 'フォロワー {{count}}人',
    works: '作品 {{count}}件',
    author: '作者',
    storyCover: 'ストーリー表紙',
    untitledStory: '無題のストーリー',
    byAuthor: '作者：{{author}}',
    pdfCover: 'PDF 表紙',
    untitledPdf: '無題の PDF',
    pageCount: '{{count}}ページ',
    pagePost: 'ページ投稿',
    readerPost: '読者投稿',
    postImage: '{{owner}}の投稿',
    seeAll: 'すべて見る',
    noResults: '結果が見つかりません',
    searchEverything: 'Shadow のすべてを検索',
    tryAnother: '別の名前、ユーザー名、ストーリー名、PDF 書籍、投稿キーワードをお試しください。',
    findEverything: '読者、作者ページ、ストーリー、PDF 書籍、投稿をまとめて検索できます。',
    searchFailed: 'Shadow を検索できませんでした',
    goBack: '戻る',
    searchPlaceholder: 'Shadow を検索...',
    clearSearch: '検索をクリア',
    resultsFor: '「{{query}}」の検索結果',
    shown: '{{count}}件表示',
  },
  ko: {
    all: '전체',
    readers: '독자',
    pages: '페이지',
    stories: '스토리',
    pdfBooks: 'PDF 도서',
    posts: '게시물',
    profile: '프로필',
    reader: '독자',
    shadowReader: 'Shadow 독자',
    authorPage: '작가 페이지',
    followers: '팔로워 {{count}}명',
    works: '작품 {{count}}개',
    author: '작가',
    storyCover: '스토리 표지',
    untitledStory: '제목 없는 스토리',
    byAuthor: '작가: {{author}}',
    pdfCover: 'PDF 표지',
    untitledPdf: '제목 없는 PDF',
    pageCount: '{{count}}페이지',
    pagePost: '페이지 게시물',
    readerPost: '독자 게시물',
    postImage: '{{owner}} 게시물',
    seeAll: '모두 보기',
    noResults: '검색 결과가 없습니다',
    searchEverything: 'Shadow 전체 검색',
    tryAnother: '다른 이름, 사용자 이름, 스토리 제목, PDF 도서 또는 게시물 키워드를 검색해 보세요.',
    findEverything: '독자, 작가 페이지, 스토리, PDF 도서 및 게시물을 한곳에서 찾을 수 있습니다.',
    searchFailed: 'Shadow를 검색하지 못했습니다',
    goBack: '뒤로 가기',
    searchPlaceholder: 'Shadow 검색...',
    clearSearch: '검색어 지우기',
    resultsFor: '“{{query}}” 검색 결과',
    shown: '{{count}}개 표시',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const SEARCH_TYPES = [
  { key: 'all', labelKey: 'all' },
  { key: 'readers', labelKey: 'readers' },
  { key: 'pages', labelKey: 'pages' },
  { key: 'stories', labelKey: 'stories' },
  { key: 'pdfs', labelKey: 'pdfBooks' },
  { key: 'posts', labelKey: 'posts' },
]

const EMPTY_SECTIONS = {
  readers: [],
  pages: [],
  stories: [],
  pdfs: [],
  posts: [],
}

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatCount(value) {
  const number = Number(value || 0)

  if (number >= 1000000) {
    return `${(number / 1000000)
      .toFixed(number >= 10000000 ? 0 : 1)
      .replace(/\.0$/, '')}M`
  }

  if (number >= 1000) {
    return `${(number / 1000)
      .toFixed(number >= 10000 ? 0 : 1)
      .replace(/\.0$/, '')}K`
  }

  return String(number)
}

function formatPrice(value) {
  const number = Number(value || 0)
  return `$${number.toFixed(2)}`
}

function getInitial(value, fallback = 'S') {
  return (
    String(value || fallback)
      .trim()
      .slice(0, 1)
      .toUpperCase() || fallback
  )
}

function Avatar({
  src,
  name,
  size = 48,
  rounded = true,
}) {
  const { t } = useDisplayTranslation()

  return (
    <div
      className={`shrink-0 overflow-hidden bg-[#eceef2] text-[#5f6673] ring-1 ring-black/5 dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-secondary)] dark:ring-white/10 ${
        rounded
          ? 'rounded-full'
          : 'rounded-[12px]'
      } flex items-center justify-center font-extrabold`}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img
          src={src}
          alt={
            name ||
            t('discoverSearchPage.profile')
          }
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={(event) => {
            event.currentTarget.style.display =
              'none'
          }}
        />
      ) : (
        getInitial(name)
      )}
    </div>
  )
}

function SearchTabs({
  activeType,
  onChange,
}) {
  const { t } = useDisplayTranslation()

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-[#eceef2] bg-white dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-surface)] px-4 py-3">
      {SEARCH_TYPES.map((item) => {
        const active =
          activeType === item.key

        return (
          <button
            key={item.key}
            type="button"
            onClick={() =>
              onChange(item.key)
            }
            className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-extrabold transition active:scale-[0.97] ${
              active
                ? 'bg-[#25262b] text-white shadow-sm dark:bg-[var(--shadow-text-primary)] dark:text-[var(--shadow-bg-page)]'
                : 'bg-[#f3f4f6] text-[#6b7280] dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-secondary)]'
            }`}
          >
            {t(
              `discoverSearchPage.${item.labelKey}`
            )}
          </button>
        )
      })}
    </div>
  )
}

function ReaderResult({
  reader,
  onOpen,
}) {
  const { t } = useDisplayTranslation()
  const name =
    reader.name ||
    reader.username ||
    t('discoverSearchPage.reader')
  const meta =
    reader.bio ||
    reader.work ||
    reader.location ||
    t('discoverSearchPage.shadowReader')

  return (
    <button
      type="button"
      onClick={() => onOpen(reader)}
      className="flex w-full items-center gap-3 bg-white px-4 py-3 text-left transition active:bg-[#f7f7f8] dark:bg-[var(--shadow-bg-surface)] dark:active:bg-[var(--shadow-bg-hover)]"
    >
      <Avatar
        src={reader.avatar_url}
        name={name}
        size={52}
      />

      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-extrabold text-[#16181d] dark:text-[var(--shadow-text-primary)]">
          {name}
        </div>
        <div className="mt-0.5 truncate text-[12px] font-semibold text-[#8a909c] dark:text-[var(--shadow-text-secondary)]">
          @{reader.username || 'reader'}
        </div>
        <div className="mt-1 line-clamp-1 text-[12px] leading-5 text-[#68707d] dark:text-[var(--shadow-text-secondary)]">
          {meta}
        </div>
      </div>

      <i className="fa-solid fa-chevron-right text-[12px] text-[#c0c4cc] dark:text-[var(--shadow-text-tertiary)]" />
    </button>
  )
}

function PageResult({
  page,
  onOpen,
}) {
  const { t } = useDisplayTranslation()
  const name =
    page.page_name ||
    page.page_username ||
    t('discoverSearchPage.authorPage')

  return (
    <button
      type="button"
      onClick={() => onOpen(page)}
      className="flex w-full items-center gap-3 bg-white px-4 py-3 text-left transition active:bg-[#f7f7f8] dark:bg-[var(--shadow-bg-surface)] dark:active:bg-[var(--shadow-bg-hover)]"
    >
      <Avatar
        src={page.avatar_url}
        name={name}
        size={52}
      />

      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-extrabold text-[#16181d] dark:text-[var(--shadow-text-primary)]">
          {name}
        </div>
        <div className="mt-0.5 truncate text-[12px] font-semibold text-[#8a909c] dark:text-[var(--shadow-text-secondary)]">
          @{page.page_username || 'author'}
        </div>
        <div className="mt-1 flex items-center gap-3 text-[11px] font-bold text-[#68707d] dark:text-[var(--shadow-text-secondary)]">
          <span>
            {t(
              'discoverSearchPage.followers',
              {
                count: formatCount(
                  page.total_followers
                ),
              }
            )}
          </span>
          <span>
            {t('discoverSearchPage.works', {
              count: formatCount(
                page.total_stories
              ),
            })}
          </span>
        </div>
      </div>

      <i className="fa-solid fa-chevron-right text-[12px] text-[#c0c4cc] dark:text-[var(--shadow-text-tertiary)]" />
    </button>
  )
}

function StoryResult({
  story,
  onOpen,
}) {
  const { t } = useDisplayTranslation()
  const authorName =
    story.author_page?.page_name ||
    story.author_page?.page_username ||
    t('discoverSearchPage.author')
  const storyTitle =
    story.title ||
    t('discoverSearchPage.untitledStory')

  return (
    <button
      type="button"
      onClick={() => onOpen(story)}
      className="flex w-full gap-3 bg-white px-4 py-3 text-left transition active:bg-[#f7f7f8] dark:bg-[var(--shadow-bg-surface)] dark:active:bg-[var(--shadow-bg-hover)]"
    >
      <div className="h-[92px] w-[64px] shrink-0 overflow-hidden rounded-[10px] bg-[#eceef2] ring-1 ring-black/5 dark:bg-[var(--shadow-bg-elevated)] dark:ring-white/10">
        {story.cover_url ? (
          <img
            src={story.cover_url}
            alt={
              story.title ||
              t(
                'discoverSearchPage.storyCover'
              )
            }
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1 py-0.5">
        <div className="line-clamp-2 text-[15px] font-extrabold leading-5 text-[#16181d] dark:text-[var(--shadow-text-primary)]">
          {storyTitle}
        </div>
        <div className="mt-1 truncate text-[12px] font-semibold text-[#8a909c] dark:text-[var(--shadow-text-secondary)]">
          {t(
            'discoverSearchPage.byAuthor',
            { author: authorName }
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#68707d] dark:text-[var(--shadow-text-secondary)]">
          {story.main_genre ? (
            <span className="rounded-full bg-[#f3f4f6] px-2 py-1 dark:bg-[var(--shadow-bg-elevated)]">
              {story.main_genre}
            </span>
          ) : null}
          <span>
            <i className="fa-solid fa-eye mr-1 text-[#8a909c] dark:text-[var(--shadow-text-secondary)]" />
            {formatCount(
              story.total_views
            )}
          </span>
          <span>
            <i className="fa-solid fa-heart mr-1 text-[#ef476f]" />
            {formatCount(
              story.total_likes
            )}
          </span>
        </div>
      </div>

      <i className="fa-solid fa-chevron-right mt-10 text-[12px] text-[#c0c4cc] dark:text-[var(--shadow-text-tertiary)]" />
    </button>
  )
}

function PdfResult({
  product,
  onOpen,
}) {
  const { t } = useDisplayTranslation()
  const authorName =
    product.author_page?.page_name ||
    product.author_name ||
    product.author_page?.page_username ||
    t('discoverSearchPage.author')
  const title =
    product.title ||
    t('discoverSearchPage.untitledPdf')
  const price = Number(
    product.sale_price || 0
  )
  const originalPrice = Number(
    product.original_price || 0
  )

  return (
    <button
      type="button"
      onClick={() => onOpen(product)}
      className="flex w-full gap-3 bg-white px-4 py-3 text-left transition active:bg-[#f7f7f8] dark:bg-[var(--shadow-bg-surface)] dark:active:bg-[var(--shadow-bg-hover)]"
    >
      <div className="h-[92px] w-[64px] shrink-0 overflow-hidden rounded-[10px] bg-[#eceef2] ring-1 ring-black/5 dark:bg-[var(--shadow-bg-elevated)] dark:ring-white/10">
        {product.cover_url ? (
          <img
            src={product.cover_url}
            alt={
              product.title ||
              t(
                'discoverSearchPage.pdfCover'
              )
            }
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1 py-0.5">
        <div className="line-clamp-2 text-[15px] font-extrabold leading-5 text-[#16181d] dark:text-[var(--shadow-text-primary)]">
          {title}
        </div>
        <div className="mt-1 truncate text-[12px] font-semibold text-[#8a909c] dark:text-[var(--shadow-text-secondary)]">
          {t(
            'discoverSearchPage.byAuthor',
            { author: authorName }
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#25262b] px-2.5 py-1 text-[11px] font-extrabold text-white dark:bg-[var(--shadow-text-primary)] dark:text-[var(--shadow-bg-page)]">
            PDF
          </span>
          <span className="text-[13px] font-black text-[#16181d] dark:text-[var(--shadow-text-primary)]">
            {formatPrice(price)}
          </span>
          {originalPrice > price &&
          originalPrice > 0 ? (
            <span className="text-[11px] font-semibold text-[#a0a5af] dark:text-[var(--shadow-text-tertiary)] line-through">
              {formatPrice(
                originalPrice
              )}
            </span>
          ) : null}
          {product.page_count ? (
            <span className="text-[11px] font-bold text-[#68707d] dark:text-[var(--shadow-text-secondary)]">
              {t(
                'discoverSearchPage.pageCount',
                {
                  count:
                    product.page_count,
                }
              )}
            </span>
          ) : null}
        </div>
      </div>

      <i className="fa-solid fa-chevron-right mt-10 text-[12px] text-[#c0c4cc] dark:text-[var(--shadow-text-tertiary)]" />
    </button>
  )
}

function PostResult({
  post,
  onOpen,
}) {
  const { t } = useDisplayTranslation()
  const owner = post.owner || {}
  const isAuthor =
    post.post_source === 'author'
  const ownerName = isAuthor
    ? owner.page_name ||
      owner.page_username ||
      t('discoverSearchPage.author')
    : owner.name ||
      owner.username ||
      t('discoverSearchPage.reader')
  const ownerUsername = isAuthor
    ? owner.page_username
    : owner.username
  const avatarUrl =
    owner.avatar_url || null
  const firstImage = Array.isArray(
    post.image_urls
  )
    ? post.image_urls.find(Boolean)
    : null

  return (
    <button
      type="button"
      onClick={() => onOpen(post)}
      className="w-full bg-white px-4 py-3 text-left transition active:bg-[#f7f7f8] dark:bg-[var(--shadow-bg-surface)] dark:active:bg-[var(--shadow-bg-hover)]"
    >
      <div className="flex items-center gap-3">
        <Avatar
          src={avatarUrl}
          name={ownerName}
          size={44}
        />

        <div className="min-w-0 flex-1">
          <div className="truncate text-[14px] font-extrabold text-[#16181d] dark:text-[var(--shadow-text-primary)]">
            {ownerName}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] font-semibold text-[#8a909c] dark:text-[var(--shadow-text-secondary)]">
            <span className="truncate">
              @{ownerUsername || 'shadow'}
            </span>
            <span className="rounded-full bg-[#f3f4f6] px-2 py-0.5 text-[10px] font-extrabold text-[#68707d] dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-secondary)]">
              {isAuthor
                ? t(
                    'discoverSearchPage.pagePost'
                  )
                : t(
                    'discoverSearchPage.readerPost'
                  )}
            </span>
          </div>
        </div>

        <i className="fa-solid fa-chevron-right text-[12px] text-[#c0c4cc] dark:text-[var(--shadow-text-tertiary)]" />
      </div>

      {post.content ? (
        <div className="mt-3 line-clamp-3 whitespace-pre-line text-[13px] leading-5 text-[#343942] dark:text-[var(--shadow-text-primary)]">
          {post.content}
        </div>
      ) : null}

      {firstImage ? (
        <div className="mt-3 h-[150px] overflow-hidden rounded-[12px] bg-[#eceef2] dark:bg-[var(--shadow-bg-elevated)]">
          <img
            src={firstImage}
            alt={t(
              'discoverSearchPage.postImage',
              { owner: ownerName }
            )}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}

      <div className="mt-3 flex items-center gap-4 text-[11px] font-bold text-[#7b828e] dark:text-[var(--shadow-text-secondary)]">
        <span>
          <i className="fa-solid fa-heart mr-1 text-[#ef476f]" />
          {formatCount(
            post.like_count
          )}
        </span>
        <span>
          <i className="fa-regular fa-comment mr-1" />
          {formatCount(
            post.comment_count
          )}
        </span>
        <span>
          <i className="fa-solid fa-retweet mr-1" />
          {formatCount(
            post.echo_count
          )}
        </span>
      </div>
    </button>
  )
}

function SectionShell({
  title,
  count,
  showAll,
  onShowAll,
  children,
}) {
  const { t } = useDisplayTranslation()

  return (
    <section className="overflow-hidden border-y border-[#eceef2] bg-white sm:rounded-[16px] sm:border dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-surface)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#f0f1f3] dark:border-[var(--shadow-border)] px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate text-[15px] font-extrabold text-[#16181d] dark:text-[var(--shadow-text-primary)]">
            {title}
          </h2>
          <span className="rounded-full bg-[#f3f4f6] px-2 py-0.5 text-[10px] font-extrabold text-[#7b828e] dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-secondary)]">
            {count}
          </span>
        </div>

        {showAll ? (
          <button
            type="button"
            onClick={onShowAll}
            className="shrink-0 text-[12px] font-extrabold text-[#25262b] dark:text-[var(--shadow-text-primary)] active:opacity-60"
          >
            {t(
              'discoverSearchPage.seeAll'
            )}
          </button>
        ) : null}
      </div>

      <div className="divide-y divide-[#f0f1f3] dark:divide-[var(--shadow-border)]">
        {children}
      </div>
    </section>
  )
}

function LoadingState() {
  return (
    <div className="space-y-3 px-4 py-5">
      {Array.from({ length: 6 }).map(
        (_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-[16px] bg-white p-3 ring-1 ring-black/5 dark:bg-[var(--shadow-bg-surface)] dark:ring-white/10"
          >
            <div className="h-14 w-14 animate-pulse rounded-full bg-[#eceef2] dark:bg-[var(--shadow-bg-elevated)]" />
            <div className="flex-1">
              <div className="h-4 w-2/3 animate-pulse rounded-full bg-[#eceef2] dark:bg-[var(--shadow-bg-elevated)]" />
              <div className="mt-2 h-3 w-1/3 animate-pulse rounded-full bg-[#f1f2f4] dark:bg-[var(--shadow-bg-elevated)]" />
              <div className="mt-2 h-3 w-4/5 animate-pulse rounded-full bg-[#f1f2f4] dark:bg-[var(--shadow-bg-elevated)]" />
            </div>
          </div>
        )
      )}
    </div>
  )
}

function EmptyState({
  searched,
  message,
}) {
  const { t } = useDisplayTranslation()

  return (
    <div className="px-4 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#8a909c] shadow-sm ring-1 ring-black/5 dark:bg-[var(--shadow-bg-surface)] dark:text-[var(--shadow-text-secondary)] dark:ring-white/10">
        <i
          className={`fa-solid ${
            searched
              ? 'fa-face-frown'
              : 'fa-magnifying-glass'
          } text-[22px]`}
        />
      </div>
      <h2 className="mt-4 text-[16px] font-extrabold text-[#16181d] dark:text-[var(--shadow-text-primary)]">
        {searched
          ? t(
              'discoverSearchPage.noResults'
            )
          : t(
              'discoverSearchPage.searchEverything'
            )}
      </h2>
      <p className="mx-auto mt-2 max-w-[320px] text-[12px] leading-5 text-[#7b828e] dark:text-[var(--shadow-text-secondary)]">
        {message ||
          (searched
            ? t(
                'discoverSearchPage.tryAnother'
              )
            : t(
                'discoverSearchPage.findEverything'
              ))}
      </p>
    </div>
  )
}

export default function DiscoverSearchPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const initialParams =
    new URLSearchParams(
      window.location.search
    )
  const initialQuery = String(
    initialParams.get('q') || ''
  ).trim()
  const requestedType = String(
    initialParams.get('type') || 'all'
  )
    .trim()
    .toLowerCase()
  const initialType = SEARCH_TYPES.some(
    (item) =>
      item.key === requestedType
  )
    ? requestedType
    : 'all'
  const [searchText, setSearchText] =
    useState(initialQuery)
  const [activeQuery, setActiveQuery] =
    useState(initialQuery)
  const [activeType, setActiveType] =
    useState(initialType)
  const [sections, setSections] =
    useState(EMPTY_SECTIONS)
  const [shownCounts, setShownCounts] =
    useState({})
  const [loading, setLoading] =
    useState(false)
  const [message, setMessage] =
    useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveQuery(searchText.trim())
    }, 420)

    return () =>
      window.clearTimeout(timer)
  }, [searchText])

  useEffect(() => {
    const keyword = activeQuery.trim()

    if (!keyword) {
      setSections(EMPTY_SECTIONS)
      setShownCounts({})
      setLoading(false)
      setMessage('')
      return undefined
    }

    const controller =
      new AbortController()

    async function runSearch() {
      try {
        setLoading(true)
        setMessage('')

        const params =
          new URLSearchParams({
            q: keyword,
            type: activeType,
            limit:
              activeType === 'all'
                ? '20'
                : '30',
          })
        const token = getReaderToken()
        const response = await fetch(
          `${API_BASE_URL}/api/discover-search?${params.toString()}`,
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {},
            cache: 'no-store',
            signal: controller.signal,
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
              t(
                'discoverSearchPage.searchFailed'
              )
          )
        }

        setSections({
          ...EMPTY_SECTIONS,
          ...(data.sections || {}),
        })
        const responseCounts =
          data.shown_counts || {}

        setShownCounts(responseCounts)

        scheduleDiscoverSearchAnalytics({
          apiBaseUrl: API_BASE_URL,
          query: keyword,
          type: activeType,
          resultCount:
            activeType === 'all'
              ? Number(
                  responseCounts.all || 0
                )
              : Number(
                  responseCounts[
                    activeType
                  ] || 0
                ),
          token,
        })
      } catch (error) {
        if (
          error.name === 'AbortError'
        ) {
          return
        }

        setSections(EMPTY_SECTIONS)
        setShownCounts({})
        setMessage(
          error.message ||
            t(
              'discoverSearchPage.searchFailed'
            )
        )
      } finally {
        if (
          !controller.signal.aborted
        ) {
          setLoading(false)
        }
      }
    }

    runSearch()

    return () => controller.abort()
  }, [activeQuery, activeType, t])

  const totalShown = useMemo(() => {
    return Object.values(
      sections
    ).reduce(
      (sum, items) =>
        sum +
        (Array.isArray(items)
          ? items.length
          : 0),
      0
    )
  }, [sections])

  function submitSearch(event) {
    event.preventDefault()

    const keyword =
      searchText.trim()

    requestImmediateDiscoverSearchAnalytics(
      keyword,
      activeType
    )

    void recordAuthorHashtagInterest(
  keyword,
  'search'
)

    setActiveQuery(keyword)
  }

  function changeType(type) {
    cancelDiscoverSearchAnalytics()
    setActiveType(type)
    setActiveQuery(searchText.trim())
  }

  function trackSearchClick(
    resultType,
    resultId
  ) {

    void recordAuthorHashtagInterest(
  activeQuery,
  'search'
)
    
    trackDiscoverSearchResultClick({
      apiBaseUrl: API_BASE_URL,
      query: activeQuery,
      type: activeType,
      resultType,
      resultId,
      token: getReaderToken(),
    })
  }

  function openReader(
    reader,
    shouldTrack = true
  ) {
    if (!reader?.username) return

    if (shouldTrack) {
      trackSearchClick(
        'readers',
        reader.id || reader.username
      )
    }

    navigate(
      `/profile?username=${encodeURIComponent(
        reader.username
      )}`
    )
  }

  function openPage(
    page,
    shouldTrack = true
  ) {
    if (!page?.page_username) return

    if (shouldTrack) {
      trackSearchClick(
        'pages',
        page.id ||
          page.page_username
      )
    }

    navigate(
      `/author/page/${encodeURIComponent(
        page.page_username
      )}`
    )
  }

  function openStory(story) {
    if (!story?.id) return

    trackSearchClick(
      'stories',
      story.id
    )
    navigate(
      `/story/${encodeURIComponent(
        story.id
      )}`
    )
  }

  function openPdf(product) {
    const pageUsername =
      product?.author_page
        ?.page_username

    if (
      !pageUsername ||
      !product?.id
    ) {
      return
    }

    trackSearchClick(
      'pdfs',
      product.id
    )

    navigate(
      `/author/page/${encodeURIComponent(
        pageUsername
      )}/store/product/${encodeURIComponent(
        product.id
      )}`
    )
  }

  function openPost(post) {
    if (!post?.id) return

    trackSearchClick(
      'posts',
      post.id
    )

   if (post?.post_source === 'author') {
  navigate(
    `/author/post/${encodeURIComponent(post.id)}?source=search`
  )
  return
}
    openReader(post.owner, false)
  }

  const sectionConfig = [
    {
      key: 'readers',
      title: t(
        'discoverSearchPage.readers'
      ),
      items: sections.readers,
      render: (item) => (
        <ReaderResult
          key={item.id}
          reader={item}
          onOpen={openReader}
        />
      ),
    },
    {
      key: 'pages',
      title: t(
        'discoverSearchPage.pages'
      ),
      items: sections.pages,
      render: (item) => (
        <PageResult
          key={item.id}
          page={item}
          onOpen={openPage}
        />
      ),
    },
    {
      key: 'stories',
      title: t(
        'discoverSearchPage.stories'
      ),
      items: sections.stories,
      render: (item) => (
        <StoryResult
          key={item.id}
          story={item}
          onOpen={openStory}
        />
      ),
    },
    {
      key: 'pdfs',
      title: t(
        'discoverSearchPage.pdfBooks'
      ),
      items: sections.pdfs,
      render: (item) => (
        <PdfResult
          key={item.id}
          product={item}
          onOpen={openPdf}
        />
      ),
    },
    {
      key: 'posts',
      title: t(
        'discoverSearchPage.posts'
      ),
      items: sections.posts,
      render: (item) => (
        <PostResult
          key={`${item.post_source}-${item.id}`}
          post={item}
          onOpen={openPost}
        />
      ),
    },
  ]

  const visibleSections =
    activeType === 'all'
      ? sectionConfig.filter(
          (section) =>
            section.items.length
        )
      : sectionConfig.filter(
          (section) =>
            section.key ===
            activeType
        )

  return (
    <div className="min-h-screen bg-[#f6f7f8] pb-10 text-[#16181d] dark:bg-[var(--shadow-bg-page)] dark:text-[var(--shadow-text-primary)]">
      <style>{`
        body { background:#f6f7f8; font-family:'Plus Jakarta Sans','Kantumruy Pro',sans-serif; }
        html.dark body { background:var(--shadow-bg-page); }
        .no-scrollbar::-webkit-scrollbar { display:none; }
        .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>

      <header className="sticky top-0 z-[1000] bg-white shadow-[0_1px_0_rgba(17,24,39,0.08)] dark:bg-[var(--shadow-nav-bg)] dark:shadow-[0_1px_0_var(--shadow-border)]">
        <form
          onSubmit={submitSearch}
          className="mx-auto flex h-[62px] w-full max-w-[620px] items-center gap-3 px-4"
        >
          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#25262b] active:bg-[#f3f4f6] dark:text-[var(--shadow-text-primary)] dark:active:bg-[var(--shadow-bg-hover)]"
            aria-label={t(
              'discoverSearchPage.goBack'
            )}
          >
            <i className="fa-solid fa-chevron-left text-[16px]" />
          </button>

          <div className="relative min-w-0 flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-[#9298a3] dark:text-[var(--shadow-text-secondary)]" />
            <input
              type="search"
              value={searchText}
              onChange={(event) => {
                cancelDiscoverSearchAnalytics()
                setSearchText(
                  event.target.value
                )
              }}
              autoFocus
              placeholder={t(
                'discoverSearchPage.searchPlaceholder'
              )}
              className="h-11 w-full rounded-full border border-[#e2e4e8] bg-[#f7f7f8] pl-11 pr-11 text-[14px] font-semibold text-[#16181d] dark:text-[var(--shadow-text-primary)] outline-none transition placeholder:font-medium placeholder:text-[#9aa0aa] focus:border-[#25262b] focus:bg-white"
            />
            {searchText ? (
              <button
                type="button"
                onClick={() => {
                  cancelDiscoverSearchAnalytics()
                  setSearchText('')
                  setActiveQuery('')
                }}
                className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#e5e7eb] text-[#68707d] dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-secondary)] active:scale-95"
                aria-label={t(
                  'discoverSearchPage.clearSearch'
                )}
              >
                <i className="fa-solid fa-xmark text-[12px]" />
              </button>
            ) : null}
          </div>
        </form>

        <div className="mx-auto w-full max-w-[620px]">
          <SearchTabs
            activeType={activeType}
            onChange={changeType}
          />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[620px]">
        {activeQuery ? (
          <div className="flex items-center justify-between gap-3 px-4 py-3 text-[11px] font-bold text-[#7b828e] dark:text-[var(--shadow-text-secondary)]">
            <span className="truncate">
              {t(
                'discoverSearchPage.resultsFor',
                { query: activeQuery }
              )}
            </span>
            {!loading &&
            totalShown > 0 ? (
              <span className="shrink-0">
                {t(
                  'discoverSearchPage.shown',
                  {
                    count:
                      shownCounts.all ??
                      totalShown,
                  }
                )}
              </span>
            ) : null}
          </div>
        ) : null}

        {loading ? (
          <LoadingState />
        ) : message ? (
          <EmptyState
            searched
            message={message}
          />
        ) : !activeQuery ? (
          <EmptyState searched={false} />
        ) : totalShown === 0 ? (
          <EmptyState searched />
        ) : (
          <div className="space-y-3 pb-6 sm:px-4">
            {visibleSections.map(
              (section) => (
                <SectionShell
                  key={section.key}
                  title={section.title}
                  count={
                    section.items.length
                  }
                  showAll={
                    activeType === 'all'
                  }
                  onShowAll={() =>
                    changeType(
                      section.key
                    )
                  }
                >
                  {section.items.map(
                    section.render
                  )}
                </SectionShell>
              )
            )}
          </div>
        )}
      </main>
    </div>
  )
}
