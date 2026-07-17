const fs = require('fs')
const path = require('path')

const root = process.cwd()
const appPath = path.join(
  root,
  'src',
  'App.jsx'
)
const authorPagePath = path.join(
  root,
  'src',
  'pages',
  'Author',
  'CreateAuthorStoryPage.jsx'
)
const readerPagePath = path.join(
  root,
  'src',
  'pages',
  'ReaderStories',
  'CreateReaderStoryPage.jsx'
)

function fail(message) {
  console.error(`ERROR: ${message}`)
  process.exit(1)
}

if (!fs.existsSync(appPath)) {
  fail('src/App.jsx was not found.')
}

if (!fs.existsSync(authorPagePath)) {
  fail(
    'CreateAuthorStoryPage.jsx was not found.'
  )
}

let readerPage = fs.readFileSync(
  authorPagePath,
  'utf8'
)

readerPage = readerPage
  .replace(
    /function uploadAuthorStory/g,
    'function uploadReaderStory'
  )
  .replace(
    /uploadAuthorStory\(\{/g,
    'uploadReaderStory({'
  )
  .replace(
    /\/api\/author-stories\/me/g,
    '/api/reader-stories/me'
  )
  .replace(
    /CreateAuthorStoryPage/g,
    'CreateReaderStoryPage'
  )
  .replace(
    /navigate\('\/author\/page'\)/g,
    "navigate('/discover')"
  )
  .replace(
    'Share a moment with your readers.',
    'Share a moment with your community.'
  )
  .replace(
    'Readers can reply to your story',
    'People can reply to your story'
  )
  .replace(
    'Shadow Story',
    'Reader Story'
  )

fs.mkdirSync(
  path.dirname(readerPagePath),
  {
    recursive: true,
  }
)

if (
  fs.existsSync(readerPagePath)
) {
  const backupPath =
    `${readerPagePath}.before-sync.bak`

  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(
      readerPagePath,
      backupPath
    )
  }
}

fs.writeFileSync(
  readerPagePath,
  readerPage,
  'utf8'
)

let app = fs.readFileSync(
  appPath,
  'utf8'
)
const originalApp = app

const importLine =
  "const CreateReaderStoryPage = lazy(() => import('./pages/ReaderStories/CreateReaderStoryPage'))"

if (!app.includes(importLine)) {
  const marker =
    "const CreateAuthorStoryPage = lazy(() => import('./pages/Author/CreateAuthorStoryPage'))"

  if (!app.includes(marker)) {
    fail(
      'CreateAuthorStoryPage import marker was not found.'
    )
  }

  app = app.replace(
    marker,
    `${marker}\n${importLine}`
  )
}

if (
  !app.includes(
    "'/reader/story/create',"
  )
) {
  const marker =
    "    '/author/stories',"

  if (!app.includes(marker)) {
    fail(
      'Footer hide marker was not found.'
    )
  }

  app = app.replace(
    marker,
    `${marker}\n    '/reader/story/create',`
  )
}

if (
  !app.includes(
    'path="/reader/story/create"'
  )
) {
  const marker = `
<Route
  path="/author/page/story/create"
`

  const index = app.indexOf(marker)

  if (index < 0) {
    fail(
      'Author Story create route marker was not found.'
    )
  }

  const route = `
<Route
  path="/reader/story/create"
  element={
    <LazyPage>
      <CreateReaderStoryPage />
    </LazyPage>
  }
/>

`

  app =
    app.slice(0, index) +
    route +
    app.slice(index)
}

if (app !== originalApp) {
  const backupPath = path.join(
    root,
    'src',
    'App.jsx.before-reader-stories.bak'
  )

  if (!fs.existsSync(backupPath)) {
    fs.writeFileSync(
      backupPath,
      originalApp,
      'utf8'
    )
  }

  fs.writeFileSync(
    appPath,
    app,
    'utf8'
  )
}

console.log(
  'Reader Story page and App routes installed.'
)
