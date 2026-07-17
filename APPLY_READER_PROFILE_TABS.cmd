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

if not exist "APPLY_READER_PROFILE_TABS.cjs" (
  echo ERROR: Missing APPLY_READER_PROFILE_TABS.cjs
  exit /b 1
)

node APPLY_READER_PROFILE_TABS.cjs
if errorlevel 1 exit /b 1

npm run build
if errorlevel 1 exit /b 1

echo.
echo Reader Profile tabs setup completed successfully.
exit /b 0
