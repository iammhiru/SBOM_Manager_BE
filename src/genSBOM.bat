@echo off
set PROJECT_PATH=%1
set FORMAT=%2
set OUTPUT_PATH=%3

echo Running syft with:
echo Project path: %PROJECT_PATH%
echo Format: %FORMAT%
echo Output path: %OUTPUT_PATH%

syft %PROJECT_PATH% -o %FORMAT% > %OUTPUT_PATH%