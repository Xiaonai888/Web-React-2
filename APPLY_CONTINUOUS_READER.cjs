const fs = require('fs')
const path = require('path')

const root = process.cwd()
const pagePath = path.join(root, 'src', 'pages', 'ReaderPage.jsx')
const hookPath = path.join(
  root,
  'src',
  'hooks',
  'useContinuousEpisodeReader.js'
)

if (!fs.existsSync(pagePath)) {
  throw new Error(`Missing file: ${pagePath}`)
}

if (!fs.existsSync(hookPath)) {
  throw new Error(`Missing file: ${hookPath}`)
}

let source = fs.readFileSync(pagePath, 'utf8')

if (source.includes("useContinuousEpisodeReader from '../hooks/useContinuousEpisodeReader'")) {
  throw new Error('Continuous Reader update is already applied.')
}

function replaceOnce(oldValue, newValue, label) {
  const index = source.indexOf(oldValue)

  if (index < 0) {
    throw new Error(`Cannot find ${label}`)
  }

  source =
    source.slice(0, index) +
    newValue +
    source.slice(index + oldValue.length)
}

function replaceRegex(pattern, replacement, label) {
  if (!pattern.test(source)) {
    throw new Error(`Cannot find ${label}`)
  }

  source = source.replace(pattern, replacement)
}

replaceOnce(
  "import useReadingProgressSync from '../hooks/useReadingProgressSync'",
  "import useReadingProgressSync from '../hooks/useReadingProgressSync'\nimport useContinuousEpisodeReader from '../hooks/useContinuousEpisodeReader'",
  'Reader hook import'
)

replaceOnce(
  "\nexport default function ReaderPage() {",
  "\nfunction ContinuousEpisodeBlock({\n  entry,\n  index,\n  active,\n  theme,\n  story,\n  fontSizePx,\n  fontFamily,\n  lineSpacing,\n  onRegister,\n  onOpenComments,\n  onOpenGift,\n  onOpenLocked,\n  adultAccepted,\n}) {\n  const episode = entry?.episode || {}\n  const adultBlocked = Boolean(\n    episode?.is_adult && !adultAccepted\n  )\n  const adBlocked = Boolean(\n    entry?.gate?.ad_policy?.show_read_ad &&\n      entry?.gate?.advertisement?.image_url &&\n      !entry?.adFinished\n  )\n\n  return (\n    <section\n      ref={(node) => onRegister(entry.id, node)}\n      data-episode-id={entry.id}\n      className={index > 0 ? `border-t ${theme.border}` : ''}\n      style={{\n        contentVisibility: 'auto',\n        containIntrinsicSize: '900px',\n      }}\n    >\n      {index > 0 ? (\n        <div className={`${theme.card} px-4 pb-1 pt-8 sm:px-8`}>\n          <span className={`${theme.muted} text-[12px] font-semibold`}>\n            Episode {episode.episode_number || index + 1}\n          </span>\n        </div>\n      ) : null}\n\n      {adultBlocked ? (\n        <div className={`${theme.card} flex min-h-[58vh] items-center justify-center px-4 py-10`}>\n          <div className=\"text-center\">\n            <i className={`fa-solid fa-triangle-exclamation text-[26px] ${theme.muted}`} />\n            <p className={`mt-3 text-[13px] font-semibold ${theme.muted}`}>\n              Confirm the adult-content warning to continue.\n            </p>\n          </div>\n        </div>\n      ) : entry.locked ? (\n        <div className={`${theme.card} px-4 py-10 sm:px-8`}>\n          <div className={`mx-auto max-w-[430px] rounded-[24px] border ${theme.border} p-6 text-center`}>\n            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${theme.soft}`}>\n              <i className={`fa-solid fa-lock text-[20px] ${theme.text}`} />\n            </div>\n\n            <div className={`mt-4 text-[12px] font-semibold ${theme.muted}`}>\n              Episode {episode.episode_number || ''}\n            </div>\n\n            <h2 className={`mt-1 text-[22px] font-bold leading-8 ${theme.text}`}>\n              {episode.title || 'Locked Episode'}\n            </h2>\n\n            <p className={`mt-3 text-[13px] font-medium leading-6 ${theme.muted}`}>\n              This episode is locked. Open the unlock options to continue reading.\n            </p>\n\n            <button\n              type=\"button\"\n              onClick={() => onOpenLocked(entry)}\n              className={`mt-5 h-12 w-full rounded-full ${theme.button} text-[13px] font-bold active:scale-[0.99]`}\n            >\n              View unlock options\n            </button>\n          </div>\n        </div>\n      ) : adBlocked ? (\n        <div className={`${theme.card} flex min-h-[58vh] items-center justify-center px-4 py-10`}>\n          <div className=\"text-center\">\n            <i className={`fa-solid fa-play-circle text-[26px] ${theme.muted}`} />\n            <p className={`mt-3 text-[13px] font-semibold ${theme.muted}`}>\n              Advertisement required before this episode.\n            </p>\n          </div>\n        </div>\n      ) : (\n        <>\n          <section className={`overflow-hidden rounded-none ${theme.card} shadow-none ring-0 sm:rounded-[28px] sm:shadow-sm sm:ring-1 sm:ring-black/5`}>\n            <div className=\"px-4 py-5 sm:p-8\">\n              <div className=\"mb-7\">\n                <h1\n                  className={`text-[30px] font-bold leading-[1.35] tracking-[-0.01em] ${theme.text} sm:text-[34px]`}\n                  style={{ fontFamily }}\n                >\n                  {episode.title || 'Untitled Episode'}\n                </h1>\n              </div>\n\n              <article>\n                <ReadingText\n                  content={episode.content}\n                  fontSizePx={fontSizePx}\n                  fontFamily={fontFamily}\n                  lineSpacing={lineSpacing}\n                  theme={theme}\n                />\n              </article>\n            </div>\n          </section>\n\n          <ReaderEndPanel\n            story={story}\n            episode={episode}\n            onOpenComments={() => onOpenComments(episode)}\n            onOpenGift={onOpenGift}\n          />\n        </>\n      )}\n\n      <div\n        className={`h-px w-full ${active ? 'opacity-100' : 'opacity-0'}`}\n        aria-hidden=\"true\"\n      />\n    </section>\n  )\n}\n\nexport default function ReaderPage() {",
  'ReaderPage component marker'
)

replaceOnce(
  "  const { storyId, episodeId } = useParams()",
  "  const { storyId, episodeId: routeEpisodeId } = useParams()\n  const [activeEpisodeId, setActiveEpisodeId] = useState(routeEpisodeId)\n  const episodeId = activeEpisodeId || routeEpisodeId",
  'route episode parameters'
)

replaceOnce(
  "  const [adultAccepted, setAdultAccepted] = useState(false)",
  "  const [adultAccepted, setAdultAccepted] = useState(false)\n  const [adultConsentGranted, setAdultConsentGranted] = useState(false)",
  'adult consent state'
)

replaceOnce(
  "  const [commentsOpen, setCommentsOpen] = useState(false)\n  const [giftPopupOpen, setGiftPopupOpen] = useState(false)",
  "  const [commentsOpen, setCommentsOpen] = useState(false)\n  const [commentEpisode, setCommentEpisode] = useState(null)\n  const [giftPopupOpen, setGiftPopupOpen] = useState(false)",
  'comment episode state'
)

replaceOnce(
  "  useEffect(() => {\n    activeReadingTargetRef.current = activeReadingTarget\n  }, [activeReadingTarget])",
  "  useEffect(() => {\n    activeReadingTargetRef.current = activeReadingTarget\n  }, [activeReadingTarget])\n\n  useEffect(() => {\n    setAdultConsentGranted(false)\n  }, [storyId])",
  'adult consent reset'
)

replaceRegex(
  /async function loadReaderAdStatus\(\) \{[\s\S]*?\n\}\s*\n\s*useEffect\(\(\) => \{\n\s*let ignore = false/,
  "async function loadReaderAdStatus(targetEpisodeId = episodeId) {\n  if (!isUsableRouteId(storyId) || !isUsableRouteId(targetEpisodeId)) {\n    return { ad_policy: null, advertisement: null }\n  }\n\n  const response = await fetch(\n    `${API_BASE_URL}/api/unlocks/stories/${storyId}/episodes/${targetEpisodeId}/status`,\n    {\n      headers: readerAuthHeaders(),\n    }\n  )\n\n  const data = await response.json().catch(() => ({}))\n\n  if (!response.ok || data.ok === false) {\n    return {\n      ad_policy: null,\n      advertisement: null,\n    }\n  }\n\n  return {\n    ad_policy: data.ad_policy || null,\n    advertisement: data.advertisement || null,\n  }\n}\n\nasync function loadContinuousEpisode(targetEpisode) {\n  const targetId = String(\n    targetEpisode?.id || targetEpisode?.episode_id || ''\n  ).trim()\n\n  if (!targetId) return null\n\n  const response = await fetch(\n    `${API_BASE_URL}/api/public/stories/${storyId}/episodes/${targetId}`,\n    {\n      headers: readerAuthHeaders(),\n      cache: 'no-store',\n    }\n  )\n\n  const data = await response.json().catch(() => ({}))\n\n  if (response.status === 423 || data.code === 'EPISODE_LOCKED') {\n    return {\n      id: targetId,\n      episode: data.episode || targetEpisode,\n      locked: true,\n      gate: null,\n      adFinished: true,\n    }\n  }\n\n  if (!response.ok || data.ok === false) {\n    throw new Error(data.message || 'Failed to load episode')\n  }\n\n  const gate = await loadReaderAdStatus(targetId).catch(() => ({\n    ad_policy: null,\n    advertisement: null,\n  }))\n  const requiresAd = Boolean(\n    gate?.ad_policy?.show_read_ad &&\n      gate?.advertisement?.image_url\n  )\n\n  return {\n    id: targetId,\n    episode: data.episode || targetEpisode,\n    locked: false,\n    gate,\n    adFinished: !requiresAd,\n  }\n}\n\nconst continuousReader = useContinuousEpisodeReader({\n  enabled: readingMode === 'scroll',\n  storyId,\n  activeEpisodeId: episodeId,\n  episodes,\n  loadEpisode: loadContinuousEpisode,\n  onActiveEntry: (entry) => {\n    if (!entry?.episode) return\n\n    setActiveEpisodeId(String(entry.id))\n    setEpisode(entry.episode)\n    setLockedEpisode(Boolean(entry.locked))\n    setReadingProgress(0)\n    readingProgressRef.current = 0\n    qualifiedViewSentRef.current = false\n    setReviewProgressSaved(false)\n    setReaderAdPolicy(entry.gate?.ad_policy || null)\n    setReaderAdvertisement(entry.gate?.advertisement || null)\n    setReaderAdFinished(Boolean(entry.adFinished))\n    setReaderGateReady(true)\n    setReaderMoreOpen(false)\n    setCommentEpisode(null)\n\n    if (entry.episode.is_adult && !adultConsentGranted) {\n      setAdultAccepted(false)\n      setAdultWarningOpen(true)\n    } else {\n      setAdultAccepted(true)\n      setAdultWarningOpen(false)\n    }\n  },\n})\n\nuseEffect(() => {\n    let ignore = false",
  'continuous reader core'
)

replaceRegex(
  /useEffect\(\(\) => \{\n\s*let ignore = false\n\n\s*async function loadReader\(\) \{[\s\S]*?\n\s*\}, \[episodeId, expectedEpisode, expectedStory, hasExpectedLockedPreview, navigate, storyId\]\)/,
  "useEffect(() => {\n    let ignore = false\n\n    async function loadReader() {\n      setActiveEpisodeId(routeEpisodeId)\n      setLoading(!hasExpectedLockedPreview)\n      setMessage('')\n      setAutoScrollEnabled(false)\n      setReaderAdvertisement(null)\n      setReaderAdFinished(false)\n      setReaderGateReady(hasExpectedLockedPreview)\n      setLockedEpisode(hasExpectedLockedPreview)\n\n      if (hasExpectedLockedPreview) {\n        setStory(expectedStory)\n        setEpisode(expectedEpisode)\n      }\n\n      if (!isUsableRouteId(storyId) || !isUsableRouteId(routeEpisodeId)) {\n        setLoading(false)\n        setReaderGateReady(true)\n        setMessage('Invalid reading link. Please open the episode from its story page.')\n        return\n      }\n\n      if (!getReaderToken()) {\n        navigate('/login', {\n          state: {\n            returnTo: `/story/${storyId}/episode/${routeEpisodeId}`,\n          },\n        })\n        return\n      }\n\n      try {\n        const [episodeResponse, episodesResponse] = await Promise.all([\n          fetch(\n            `${API_BASE_URL}/api/public/stories/${storyId}/episodes/${routeEpisodeId}`,\n            {\n              headers: readerAuthHeaders(),\n              cache: 'no-store',\n            }\n          ),\n          fetch(`${API_BASE_URL}/api/public/stories/${storyId}/episodes`, {\n            cache: 'no-store',\n          }),\n        ])\n\n        const episodeData = await episodeResponse.json().catch(() => ({}))\n        const episodesData = await episodesResponse.json().catch(() => ({}))\n\n        if (!episodesResponse.ok || episodesData.ok === false) {\n          throw new Error(episodesData.message || 'Episode list not found')\n        }\n\n        const nextEpisodes = episodesData.episodes || []\n\n        if (\n          episodeResponse.status === 423 ||\n          episodeData.code === 'EPISODE_LOCKED'\n        ) {\n          if (ignore) return\n\n          setStory(episodeData.story || null)\n          setEpisode(episodeData.episode || null)\n          setEpisodes(nextEpisodes)\n          setLockedEpisode(true)\n          setReaderAdPolicy(null)\n          setReaderAdvertisement(null)\n          setReaderAdFinished(true)\n          setReadingProgress(0)\n          setReaderGateReady(true)\n\n          try {\n            await loadLockedUnlockStatus(routeEpisodeId)\n          } catch {\n            setUnlockWallet(null)\n            setUnlockCoinAccess(null)\n            setUnlockVoucherAccess(null)\n            setUnlockPackageOptions([])\n          }\n\n          continuousReader.setInitialEntry({\n            id: routeEpisodeId,\n            episode: episodeData.episode,\n            locked: true,\n            gate: null,\n            adFinished: true,\n          })\n\n          window.scrollTo({ top: 0, behavior: 'auto' })\n          return\n        }\n\n        if (!episodeResponse.ok || episodeData.ok === false) {\n          throw new Error(episodeData.message || 'Episode not found')\n        }\n\n        const nextReaderAdStatus = await loadReaderAdStatus(\n          routeEpisodeId\n        ).catch(() => ({\n          ad_policy: null,\n          advertisement: null,\n        }))\n\n        if (ignore) return\n\n        const requiresAd = Boolean(\n          nextReaderAdStatus.ad_policy?.show_read_ad &&\n            nextReaderAdStatus.advertisement?.image_url\n        )\n\n        setStory(episodeData.story || null)\n        setEpisode(episodeData.episode || null)\n        setEpisodes(nextEpisodes)\n        setLockedEpisode(false)\n        setReaderAdPolicy(nextReaderAdStatus.ad_policy)\n        setReaderAdvertisement(nextReaderAdStatus.advertisement)\n        setReaderAdFinished(!requiresAd)\n        setReadingProgress(0)\n        setReaderGateReady(true)\n\n        continuousReader.setInitialEntry({\n          id: routeEpisodeId,\n          episode: episodeData.episode,\n          locked: false,\n          gate: nextReaderAdStatus,\n          adFinished: !requiresAd,\n        })\n\n        if (episodeData.episode?.is_adult && !adultConsentGranted) {\n          setAdultAccepted(false)\n          setAdultWarningOpen(true)\n        } else {\n          setAdultAccepted(true)\n          setAdultWarningOpen(false)\n        }\n\n        window.scrollTo({ top: 0, behavior: 'auto' })\n      } catch (error) {\n        if (ignore) return\n\n        setMessage(\n          error.message === 'Failed to fetch'\n            ? 'Cannot connect to server. Please try again later.'\n            : error.message || 'Failed to load episode'\n        )\n      } finally {\n        if (!ignore) setLoading(false)\n      }\n    }\n\n    loadReader()\n\n    return () => {\n      ignore = true\n    }\n  }, [\n    continuousReader.setInitialEntry,\n    expectedEpisode,\n    expectedStory,\n    hasExpectedLockedPreview,\n    navigate,\n    routeEpisodeId,\n    storyId,\n  ])",
  'reader loading effect'
)

replaceRegex(
  /useEffect\(\(\) => \{\n\s*if \(readingMode === 'paging'\) return undefined\n\n\s*const updateProgress = \(\) => \{[\s\S]*?\n\s*\}, \[episodeId, readingMode\]\)/,
  "useEffect(() => {\n    if (readingMode === 'paging') return undefined\n\n    const updateProgress = () => {\n      const section = continuousReader.getSectionNode(episodeId)\n\n      if (section) {\n        const rect = section.getBoundingClientRect()\n        const sectionTop = window.scrollY + rect.top\n        const sectionHeight = Math.max(1, section.offsetHeight)\n        const visibleOffset =\n          window.scrollY + window.innerHeight * 0.35 - sectionTop\n        const progress = Math.min(\n          100,\n          Math.max(0, (visibleOffset / sectionHeight) * 100)\n        )\n\n        setReadingProgress(progress)\n        readingProgressRef.current = progress\n        return\n      }\n\n      const scrollTop =\n        window.scrollY || document.documentElement.scrollTop\n      const scrollHeight =\n        document.documentElement.scrollHeight - window.innerHeight\n      const progress =\n        scrollHeight > 0\n          ? Math.min(\n              100,\n              Math.max(0, (scrollTop / scrollHeight) * 100)\n            )\n          : 100\n\n      setReadingProgress(progress)\n      readingProgressRef.current = progress\n    }\n\n    updateProgress()\n    window.addEventListener('scroll', updateProgress, {\n      passive: true,\n    })\n    window.addEventListener('resize', updateProgress)\n\n    return () => {\n      window.removeEventListener('scroll', updateProgress)\n      window.removeEventListener('resize', updateProgress)\n    }\n  }, [\n    continuousReader.entries.length,\n    continuousReader.getSectionNode,\n    episodeId,\n    readingMode,\n  ])",
  'scroll reading progress'
)

replaceRegex(
  /const sortedReaderEpisodes = useMemo\(\(\) => \{[\s\S]*?\n\]\)\s*\n\s*const handleOpenPurchasePage/,
  "const sortedReaderEpisodes = useMemo(() => {\n    return [...episodes].sort(\n      (a, b) =>\n        Number(a.episode_number || 0) -\n        Number(b.episode_number || 0)\n    )\n  }, [episodes])\n\n  const currentReaderEpisodeIndex = sortedReaderEpisodes.findIndex(\n    (item) => String(item.id) === String(episodeId)\n  )\n\n  const previousEpisode =\n    currentReaderEpisodeIndex > 0\n      ? sortedReaderEpisodes[currentReaderEpisodeIndex - 1]\n      : null\n\n  const nextEpisode =\n    currentReaderEpisodeIndex >= 0 &&\n    currentReaderEpisodeIndex < sortedReaderEpisodes.length - 1\n      ? sortedReaderEpisodes[currentReaderEpisodeIndex + 1]\n      : null\n\n  const openReaderEpisode = async (targetEpisode) => {\n    if (!targetEpisode) return\n\n    if (readingMode === 'scroll') {\n      await continuousReader.scrollToEpisode(targetEpisode)\n      return\n    }\n\n    navigate(`/story/${storyId}/episode/${targetEpisode.id}`, {\n      replace: true,\n      state: {\n        storyPreview: story,\n        episodePreview: targetEpisode,\n        returnSource: location.state?.returnSource,\n      },\n    })\n  }\n\n  const cover = episode?.cover_url || story?.cover_url || ''\n  const publishedDate = formatDate(episode?.published_at)\n  const characterCount = Number(\n    episode?.character_count || episode?.content?.length || 0\n  )\n  const isLastReadingPage =\n    readingMode !== 'paging' ||\n    currentPageIndex >= Math.max(0, pagingPages.length - 1)\n\nconst handleReaderCopyLink = async () => {\n  const link = window.location.href\n\n  try {\n    await navigator.clipboard.writeText(link)\n  } catch {\n    window.prompt('Copy this link:', link)\n  }\n\n  setReaderMoreOpen(false)\n}\n\nconst handleReaderReport = () => {\n  setReaderMoreOpen(false)\n  window.alert('Report is coming soon.')\n}\n\nconst handleReaderEcho = () => {\n  setReaderMoreOpen(false)\n  setEchoShareOpen(true)\n}\n\n  const handlePrevious = () => {\n    openReaderEpisode(previousEpisode)\n  }\n\n  const handleNext = () => {\n    openReaderEpisode(nextEpisode)\n  }\n\nconst handleOpenPurchasePage",
  'episode navigation block'
)

replaceRegex(
  /async function loadLockedUnlockStatus\(\) \{[\s\S]*?\n\}\nasync function handleLockedCoinUnlock/,
  "async function loadLockedUnlockStatus(\n  targetEpisodeId = episodeId\n) {\n  if (!storyId || !targetEpisodeId) return null\n\n  const response = await fetch(\n    `${API_BASE_URL}/api/unlocks/stories/${storyId}/episodes/${targetEpisodeId}/status`,\n    {\n      headers: readerAuthHeaders(),\n    }\n  )\n\n  const data = await response.json().catch(() => ({}))\n\n  if (!response.ok || data.ok === false) {\n    throw new Error(data.message || 'Failed to check unlock status')\n  }\n\n  setUnlockWallet(data.wallet || null)\n  setUnlockCoinAccess(data.coin_access || data.gem_access || null)\n  setUnlockVoucherAccess(data.voucher_access || null)\n  setUnlockAutoUnlock(Boolean(data.wallet?.auto_unlock))\n  setUnlockPackageOptions(\n    Array.isArray(data.package_options) ? data.package_options : []\n  )\n\n  return data\n}\nasync function handleLockedCoinUnlock",
  'locked episode status loader'
)

replaceOnce(
  "const shouldBlockReaderContent = shouldShowReaderAd && !readerAdFinished",
  "const shouldBlockReaderContent = shouldShowReaderAd && !readerAdFinished\nconst showFullLockedEpisode = Boolean(\n  lockedEpisode &&\n    episode &&\n    String(episodeId) === String(routeEpisodeId) &&\n    continuousReader.entries.length <= 1\n)\nconst activeCommentsEpisode = commentEpisode || episode",
  'reader render state'
)

replaceOnce(
  "  navigate={navigate}",
  "  navigate={(to, options = {}) =>\n    navigate(to, {\n      ...options,\n      replace: true,\n    })\n  }",
  'episode list navigation'
)

replaceRegex(
  /<CommentsModal\n[\s\S]*?key=\{`\$\{storyId\}-\$\{episodeId\}`\}\n\/>/,
  "<CommentsModal\n  open={commentsOpen}\n  story={story}\n  targetType=\"episode\"\n  targetId={activeCommentsEpisode?.id || episodeId}\n  episodes={episodes}\n  title={\n    activeCommentsEpisode?.title ||\n    story?.title ||\n    'Comments'\n  }\n  onClose={() => {\n    setCommentsOpen(false)\n    setCommentEpisode(null)\n  }}\n  onCommentChanged={handleCommentChanged}\n  key={`${storyId}-${activeCommentsEpisode?.id || episodeId}`}\n/>",
  'comments modal'
)

replaceOnce(
  "  onFinish={() => setReaderAdFinished(true)}",
  "  onFinish={() => {\n    setReaderAdFinished(true)\n    continuousReader.markAdFinished(episodeId)\n  }}",
  'advertisement completion'
)

replaceOnce(
  "        {!loading && lockedEpisode && episode ? (",
  "        {!loading && showFullLockedEpisode ? (",
  'full locked episode condition'
)

replaceOnce(
  ") : null}\n\n        {!loading && episode && adultAccepted && !lockedEpisode && !shouldBlockReaderContent ? (",
  ") : null}\n\n        {!loading &&\n        !showFullLockedEpisode &&\n        readingMode === 'scroll' ? (\n          <div>\n            {continuousReader.entries.map((entry, index) => (\n              <ContinuousEpisodeBlock\n                key={entry.id}\n                entry={entry}\n                index={index}\n                active={String(entry.id) === String(episodeId)}\n                theme={theme}\n                story={story}\n                fontSizePx={fontSizePx}\n                fontFamily={activeFont.family}\n                lineSpacing={lineSpacing}\n                onRegister={continuousReader.registerSection}\n                onOpenComments={(targetEpisode) => {\n                  setCommentEpisode(targetEpisode)\n                  setCommentsOpen(true)\n                }}\n                onOpenGift={() => setGiftPopupOpen(true)}\n                adultAccepted={adultConsentGranted}\n                onOpenLocked={(lockedEntry) => {\n                  navigate(\n                    `/story/${storyId}/episode/${lockedEntry.id}`,\n                    {\n                      replace: true,\n                      state: {\n                        expectedLocked: true,\n                        storyPreview: story,\n                        episodePreview: lockedEntry.episode,\n                        returnSource:\n                          location.state?.returnSource ||\n                          'continuousReader',\n                      },\n                    }\n                  )\n                }}\n              />\n            ))}\n          </div>\n        ) : null}\n\n        {!loading && readingMode === 'paging' && episode && adultAccepted && !lockedEpisode && !shouldBlockReaderContent ? (",
  'continuous episode render'
)

source = source.replace(
  "    <div ref={readerEndSentinelRef} className=\"h-px w-full\" aria-hidden=\"true\" />\n",
  ""
)

source = source.replaceAll(
  "onOpenComments={() => setCommentsOpen(true)}",
  "onOpenComments={() => {\n    setCommentEpisode(episode)\n    setCommentsOpen(true)\n  }}"
)

replaceOnce(
  "        onContinue={() => {\n          setAdultAccepted(true)\n          setAdultWarningOpen(false)\n        }}",
  "        onContinue={() => {\n          setAdultConsentGranted(true)\n          setAdultAccepted(true)\n          setAdultWarningOpen(false)\n        }}",
  'adult warning confirmation'
)

replaceOnce(
  "onCancel={() => navigate(`/story/${storyId}`)}",
  "onCancel={() => navigate(`/story/${storyId}`, { replace: true })}",
  'adult warning back action'
)

replaceOnce(
  "  navigate(`/story/${storyId}`, {\n    state: {",
  "  navigate(`/story/${storyId}`, {\n    replace: true,\n    state: {",
  'reader header back action'
)

fs.writeFileSync(pagePath, source, 'utf8')

console.log('UPDATED src/pages/ReaderPage.jsx')
console.log('ADDED src/hooks/useContinuousEpisodeReader.js')
console.log('NEXT run: npm run build')
