@echo off
echo Rebuilding desktop client...
pushd desktop-client
call npm run package
if %errorlevel% neq 0 (
    echo [ERROR] Build failed.
    popd
    pause
    exit /b 1
)
popd
echo.
echo Done! Installer: desktop-client\out\SquadVoice Setup 0.1.0.exe
pause
