@echo off
echo ========================================
echo  SquadVoice - GitHub Setup
echo ========================================
echo.

git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed!
    echo Download from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [OK] Git found.
echo.

:: Init repo if not already
if not exist .git (
    echo Initializing git repository...
    git init
    echo.
)

:: Ask for GitHub repo URL
set /p REPO_URL="Paste your GitHub repo URL (e.g. https://github.com/username/SquadVoice): "

git remote remove origin 2>nul
git remote add origin %REPO_URL%

:: Create .gitignore if missing
if not exist .gitignore (
    echo node_modules/ > .gitignore
    echo dist/ >> .gitignore
    echo out/ >> .gitignore
    echo .env >> .gitignore
    echo data/ >> .gitignore
    echo *.db >> .gitignore
)

git add .
git commit -m "Initial commit: SquadVoice"
git branch -M main
git push -u origin main

echo.
echo ========================================
echo  Done! Repo pushed to GitHub.
echo ========================================
pause
