const fs = require('fs')
const path = require('path')

const root = process.cwd()
const appPath = path.join(
  root,
  'src',
  'App.jsx'
)
const backupPath = path.join(
  root,
  'src',
  'App.jsx.before-reader-post-pages.bak'
)

function fail(message) {
  console.error(`ERROR: ${message}`)
  process.exit(1)
}

if (!fs.existsSync(appPath)) {
  fail('src/App.jsx was not found.')
}

let content = fs.readFileSync(
  appPath,
  'utf8'
)
const original = content

const createImport =
  "const ReaderPostCreatePage = lazy(() => import('./pages/ReaderPosts/ReaderPostCreatePage'))"

const reviewImport =
  "const ReaderPostReviewPage = lazy(() => import('./pages/ReaderPosts/ReaderPostReviewPage'))"

if (!content.includes(createImport)) {
  const marker =
    "const DiscoverPage = lazy(() => import('./pages/DiscoverPage'))"

  if (!content.includes(marker)) {
    fail('DiscoverPage lazy import marker was not found.')
  }

  content = content.replace(
    marker,
    `${marker}\n${createImport}\n${reviewImport}`
  )
}

for (const routePath of [
  "'/reader/post/create',",
  "'/reader/post/review',",
]) {
  if (!content.includes(routePath)) {
    const marker =
      "    '/saved-posts',"

    if (!content.includes(marker)) {
      fail('hideFooterPaths marker was not found.')
    }

    content = content.replace(
      marker,
      `${marker}\n    ${routePath}`
    )
  }
}

const routes = `
        <Route
          path="/reader/post/create"
          element={
            <LazyPage>
              <ReaderPostCreatePage />
            </LazyPage>
          }
        />

        <Route
          path="/reader/post/review"
          element={
            <LazyPage>
              <ReaderPostReviewPage />
            </LazyPage>
          }
        />
`

if (
  !content.includes(
    'path="/reader/post/create"'
  )
) {
  const marker = `
        <Route
  path="/discover"
`

  const index = content.indexOf(marker)

  if (index < 0) {
    fail('Discover route marker was not found.')
  }

  content =
    content.slice(0, index) +
    routes +
    content.slice(index)
}

if (content === original) {
  console.log('Reader Post page routes are already installed.')
  process.exit(0)
}

if (!fs.existsSync(backupPath)) {
  fs.writeFileSync(
    backupPath,
    original,
    'utf8'
  )
  console.log(
    'Backup created: src/App.jsx.before-reader-post-pages.bak'
  )
}

fs.writeFileSync(
  appPath,
  content,
  'utf8'
)

console.log('src/App.jsx updated successfully.')
console.log('Added Reader Post page imports and routes.')
