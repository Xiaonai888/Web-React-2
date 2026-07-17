@echo off
setlocal

cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js was not found.
  exit /b 1
)

if not exist "APPLY_POST_10000_WEB.cjs" (
  echo ERROR: Missing APPLY_POST_10000_WEB.cjs
  exit /b 1
)

node APPLY_POST_10000_WEB.cjs
if errorlevel 1 exit /b 1

npm run build
if errorlevel 1 exit /b 1

echo.
echo Web post limit update completed successfully.
exit /b 0
