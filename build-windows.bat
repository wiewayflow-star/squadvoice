@echo off
echo ========================================
echo  SquadVoice - Windows Build Script
echo ========================================
echo.

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js 18+ LTS from: https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js found:
node --version
echo.

:: Clean everything
echo [1/4] Cleaning old node_modules...
if exist node_modules rmdir /s /q node_modules
if exist desktop-client\node_modules rmdir /s /q desktop-client\node_modules
if exist shared\node_modules rmdir /s /q shared\node_modules

:: Install root + server workspaces
echo [2/4] Installing server dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install root dependencies
    pause
    exit /b 1
)

:: Build shared package first
echo [3/4] Building shared package...
call npm run build --workspace=shared
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build shared package
    pause
    exit /b 1
)

:: Install desktop-client separately (keeps all binaries local)
echo [4/4] Installing and building desktop client...
pushd desktop-client
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install desktop-client dependencies
    popd
    pause
    exit /b 1
)

call npm run package
if %errorlevel% neq 0 (
    echo [ERROR] Build/package failed. Check errors above.
    popd
    pause
    exit /b 1
)
popd

echo.
echo ========================================
echo  Build complete!
echo  Installer is in: desktop-client\out\
echo ========================================
pause
