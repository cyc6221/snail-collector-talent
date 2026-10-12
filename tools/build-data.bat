@echo off
chcp 65001 >nul
node "%~dp0build-data.mjs"
echo.
pause
