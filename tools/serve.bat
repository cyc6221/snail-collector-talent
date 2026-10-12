@echo off
chcp 65001 >nul
start "" http://localhost:8000
node "%~dp0serve.mjs"
pause
