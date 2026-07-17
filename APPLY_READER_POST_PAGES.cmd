@echo off
setlocal

cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js was not found in PATH.
  exit /b 1
)

if not exist "src\pages\ReaderPosts\ReaderPostCreatePage.jsx" (
  echo ERROR: Missing ReaderPostCreatePage.jsx
  exit /b 1
)

if not exist "src\pages\ReaderPosts\ReaderPostReviewPage.jsx" (
  echo ERROR: Missing ReaderPostReviewPage.jsx
  exit /b 1
)

if not exist "src\features\reader-posts\readerPostDraft.js" (
  echo ERROR: Missing readerPostDraft.js
  exit /b 1
)

node APPLY_READER_POST_PAGES.cjs
if errorlevel 1 exit /b 1

npm run build
if errorlevel 1 exit /b 1

echo.
echo Reader Post full-page UI installed successfully.
exit /b 0
