@echo off
setlocal

cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js was not found in PATH.
  exit /b 1
)

if not exist "src\pages\ProfilePage.jsx" (
  echo ERROR: Missing src\pages\ProfilePage.jsx
  exit /b 1
)

if not exist "src\components\reader-posts\ReaderPostCard.jsx" (
  echo ERROR: Missing ReaderPostCard.jsx
  exit /b 1
)

if not exist "src\components\reader-posts\ReaderPostOptionsSheet.jsx" (
  echo ERROR: Missing ReaderPostOptionsSheet.jsx
  exit /b 1
)

if not exist "src\components\reader-posts\ReaderProfilePostsPanel.jsx" (
  echo ERROR: Missing ReaderProfilePostsPanel.jsx
  exit /b 1
)

node APPLY_REAL_READER_PROFILE_POSTS.cjs
if errorlevel 1 exit /b 1

npm run build
if errorlevel 1 exit /b 1

echo.
echo Real Reader Profile Posts setup completed successfully.
exit /b 0
