@echo off
setlocal EnableExtensions
cd /d "%~dp0"
if errorlevel 1 goto :error
where git >nul 2>nul
if errorlevel 1 (
  echo ERROR: instala Git para Windows, con Git Credential Manager.
  goto :error
)
if exist .git\ (
  echo ERROR: ya hay un repositorio Git en esta carpeta. No se cambiara.
  goto :error
)
for /f "delims=" %%N in ('git config --global user.name') do set "GITNAME=%%N"
for /f "delims=" %%E in ('git config --global user.email') do set "GITEMAIL=%%E"
if not defined GITNAME (
  echo ERROR: configura git config --global user.name "Tu nombre"
  goto :error
)
if not defined GITEMAIL (
  echo ERROR: configura git config --global user.email "tu-correo@example.com"
  goto :error
)
echo Comprobando main remoto...
set "REPO=https://github.com/ivan7800/ASHEN-PILGRIMAGE.git"
set "TMP_FILE=%TEMP%\ashen-remote-main-%RANDOM%-%RANDOM%.txt"
git ls-remote --heads "%REPO%" refs/heads/main > "%TMP_FILE%"
if errorlevel 1 (
  if exist "%TMP_FILE%" del /q "%TMP_FILE%"
  echo ERROR: no se pudo consultar GitHub. Revisa conexion y autenticacion.
  goto :error
)
for %%Z in ("%TMP_FILE%") do set "REMOTE_SIZE=%%~zZ"
del /q "%TMP_FILE%"
if not "%REMOTE_SIZE%"=="0" (
  echo BLOQUEADO: main ya tiene commits. No se sobrescribira.
  goto :error
)
git init -b main
if errorlevel 1 goto :error
git remote add origin "%REPO%"
if errorlevel 1 goto :error
git add -A
if errorlevel 1 goto :error
git diff --cached --check
if errorlevel 1 goto :error
git commit -m "feat: import ASHEN PILGRIMAGE v4.0 RC complete source, assets and QA"
if errorlevel 1 goto :error
git push -u origin main
if errorlevel 1 goto :error
echo.
echo PUBLICADO: https://github.com/ivan7800/ASHEN-PILGRIMAGE/tree/main
pause
exit /b 0
:error
echo Publicacion no completada. No se ha usado force push.
pause
exit /b 1
