const fs = require('fs')
const path = require('path')

const root = process.cwd()
const profilePath = path.join(
  root,
  'src',
  'pages',
  'ProfilePage.jsx'
)
const backupPath = path.join(
  root,
  'src',
  'pages',
  'ProfilePage.jsx.before-real-reader-posts.bak'
)

function fail(message) {
  console.error(`ERROR: ${message}`)
  process.exit(1)
}

if (!fs.existsSync(profilePath)) {
  fail('src/pages/ProfilePage.jsx was not found.')
}

let content = fs.readFileSync(
  profilePath,
  'utf8'
)
const original = content

const importLine =
  "import ReaderProfilePostsPanel from '../components/reader-posts/ReaderProfilePostsPanel'"

if (!content.includes(importLine)) {
  const marker =
    "import Cropper from 'react-easy-crop'"

  if (!content.includes(marker)) {
    fail('Cropper import marker was not found.')
  }

  content = content.replace(
    marker,
    `${marker}\n${importLine}`
  )
}

const countState =
  "  const [readerPostCount, setReaderPostCount] = useState(0)"

if (!content.includes(countState)) {
  const marker =
    "  const [profileMenuOpen, setProfileMenuOpen] = useState(false)"

  if (!content.includes(marker)) {
    fail('Profile state marker was not found.')
  }

  content = content.replace(
    marker,
    `${marker}\n${countState}`
  )
}

const highlightStart =
  content.indexOf(
    'function HighlightCircle('
  )
const highlightEnd =
  content.indexOf(
    'const PROFILE_LINK_OPTIONS',
    highlightStart
  )

if (
  highlightStart >= 0 &&
  highlightEnd > highlightStart
) {
  content =
    content.slice(0, highlightStart) +
    content.slice(highlightEnd)
}

const postCardStart =
  content.indexOf('function PostCard(')
const profileStart =
  content.indexOf(
    'export default function ProfilePage()',
    postCardStart
  )

if (
  postCardStart >= 0 &&
  profileStart > postCardStart
) {
  content =
    content.slice(0, postCardStart) +
    content.slice(profileStart)
}

content = content.replace(
  "      posts: '0',",
  "      posts: String(readerPostCount),"
)

content = content.replace(
  "  }, [avatarPreview, user])",
  "  }, [avatarPreview, readerPostCount, user])"
)

content = content.replace(
  "  const postMenuItems = isOwnProfile ? ['Edit', 'Delete', 'Hide'] : ['Report', 'Block', 'Hide']\n",
  ''
)

const demoStart =
  content.indexOf(
    '  const demoPosts = ['
  )
const cropMarker =
  content.indexOf(
    '  const handleCropComplete',
    demoStart
  )

if (
  demoStart >= 0 &&
  cropMarker > demoStart
) {
  content =
    content.slice(0, demoStart) +
    content.slice(cropMarker)
}

const highlightSectionStart =
  content.indexOf(
    '          <section className="border-t border-[#f0eef6] px-4 py-4">'
  )
const tabsSectionStart =
  content.indexOf(
    '          <section className="sticky top-[58px]',
    highlightSectionStart
  )

if (
  highlightSectionStart >= 0 &&
  tabsSectionStart > highlightSectionStart
) {
  content =
    content.slice(
      0,
      highlightSectionStart
    ) +
    content.slice(tabsSectionStart)
}

const oldPostSectionStart =
  content.indexOf(
    '        <section className="mt-2 space-y-2 md:mt-3 md:space-y-3">'
  )
const mainCloseMarker =
  content.indexOf(
    '      </main>',
    oldPostSectionStart
  )

if (
  oldPostSectionStart >= 0 &&
  mainCloseMarker >
    oldPostSectionStart
) {
  const newSection = `        <ReaderProfilePostsPanel
          onCountChange={setReaderPostCount}
        />
`

  content =
    content.slice(
      0,
      oldPostSectionStart
    ) +
    newSection +
    content.slice(mainCloseMarker)
}

if (
  !content.includes(
    '<ReaderProfilePostsPanel'
  )
) {
  fail('Could not install the real Reader Posts panel.')
}

if (
  content.includes('demoPosts.map(') ||
  content.includes('Hello everyone!') ||
  content.includes('Today I started planning')
) {
  fail('Demo Reader Posts still remain.')
}

if (content === original) {
  console.log(
    'Real Reader Profile Posts are already installed.'
  )
  process.exit(0)
}

if (!fs.existsSync(backupPath)) {
  fs.writeFileSync(
    backupPath,
    original,
    'utf8'
  )
  console.log(
    'Backup created: src/pages/ProfilePage.jsx.before-real-reader-posts.bak'
  )
}

fs.writeFileSync(
  profilePath,
  content,
  'utf8'
)

console.log(
  'Reader Profile demo content removed.'
)
console.log(
  'Real Reader Posts panel installed.'
)
console.log(
  'Reader Posts count connected.'
)
