@echo off
echo [API Client Generation] Generating frontend API client from swagger.json...

:: Frontend 폴더로 이동하여 pnpm 명령 실행 (현재 배치파일 위치 기준)
cd /d "%~dp0..\Frontend"
call pnpm generate-api

echo.
echo [Done] API Client has been updated successfully.
pause
