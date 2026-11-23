@echo off
setlocal EnableExtensions
cd /d "%~dp0"
if errorlevel 1 goto :directorio
where py >nul 2>nul
if not errorlevel 1 (
    py -3 -c "import sys; sys.exit(0 if sys.version_info.major == 3 else 1)" >nul 2>nul
    if not errorlevel 1 goto :py
)
where python >nul 2>nul
if not errorlevel 1 (
    python -c "import sys; sys.exit(0 if sys.version_info.major == 3 else 1)" >nul 2>nul
    if not errorlevel 1 goto :python
)
echo ERROR: Se necesita Python 3 para iniciar ASHEN PILGRIMAGE.
echo Instala Python 3 desde https://www.python.org/downloads/windows/
pause
exit /b 1
:py
py -3 "%~dp0serve.py" %*
set "RESULTADO=%errorlevel%"
if not "%RESULTADO%"=="0" pause
exit /b %RESULTADO%
:python
python "%~dp0serve.py" %*
set "RESULTADO=%errorlevel%"
if not "%RESULTADO%"=="0" pause
exit /b %RESULTADO%
:directorio
echo ERROR: No se puede acceder a la carpeta del juego.
pause
exit /b 1
