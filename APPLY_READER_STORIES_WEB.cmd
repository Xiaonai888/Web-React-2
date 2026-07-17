@echo off
setlocal

cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js was not found.
  exit /b 1
)

if not exist "src\components\discover\DiscoverStorySection.jsx" (
  echo ERROR: Missing DiscoverStorySection.jsx
  exit /b 1
)

node APPLY_READER_STORIES_WEB.cjs
if errorlevel 1 exit /b 1

npm run build
if errorlevel 1 exit /b 1

echo.
echo Reader Stories web setup completed.
exit /b 0
