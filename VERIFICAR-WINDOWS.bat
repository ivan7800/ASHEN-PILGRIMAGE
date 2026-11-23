@echo off
setlocal EnableExtensions
cd /d "%~dp0"
if errorlevel 1 goto :fail
where node >nul 2>nul
if errorlevel 1 (
 echo ERROR: Node.js 18+ es necesario para QA, pero no para jugar.
 goto :fail
)
where py >nul 2>nul
if not errorlevel 1 (
 py -3 -c "import sys;sys.exit(0 if sys.version_info.major==3 else 1)" >nul 2>nul
 if not errorlevel 1 goto :py
)
where python >nul 2>nul
if not errorlevel 1 (
 python -c "import sys;sys.exit(0 if sys.version_info.major==3 else 1)" >nul 2>nul
 if not errorlevel 1 goto :python
)
echo ERROR: Python 3 no encontrado.
goto :fail
:py
set "PY=py -3"
goto :tests
:python
set "PY=python"
:tests
echo ASHEN PILGRIMAGE - QA automatizada
for %%F in (test-*.mjs) do (
 node "%%F"
 if errorlevel 1 goto :fail
)
%PY% tools\qa-v36-preflight.py
if errorlevel 1 goto :fail
echo OK v4.0 RC. Pendiente: campaña humana completa, Windows 11, Linux Mint y mando real.
pause
exit /b 0
:fail
echo ERROR en las comprobaciones. Revisa las lineas anteriores.
pause
exit /b 1
