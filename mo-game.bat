@echo off
chcp 65001 >nul
cd /d "%~dp0"
set /p TK=Nhap ten TikTok (khong co dau @): 
set "DIR=%~dp0"
set "URLDIR=%DIR:\=/%"

echo Dang khoi dong server...
start "Server TikTok - giu cua so nay mo" cmd /k node server.js %TK%
timeout /t 3 >nul

where chrome >nul 2>&1 && (set "BR=chrome") || (set "BR=msedge")

echo Mo cua so game (cua so de dua len live)...
start "" %BR% --app="file:///%URLDIR%keo-co-live.html?clean" --window-size=540,990 --window-position=0,0 --user-data-dir="%TEMP%\keoco-game" --no-first-run --disable-features=CalculateNativeWinOcclusion --disable-backgrounding-occluded-windows --disable-renderer-backgrounding --disable-background-timer-throttling --autoplay-policy=no-user-gesture-required
timeout /t 2 >nul

echo Mo trang dieu khien (chi minh ban thay)...
start "" %BR% --new-window "file:///%URLDIR%control.html"
