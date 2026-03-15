@echo off
:: Quick push to GitHub
:: Usage: push.bat "your commit message"
:: Or just: push.bat  (uses default message)

set MSG=%~1
if "%MSG%"=="" set MSG=update

git add .
git commit -m "%MSG%"
git push

echo.
echo Pushed: %MSG%
