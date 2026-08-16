@echo off
setlocal
title Site Arquitetura
cd /d "%~dp0"

set PORT=8090
set URL=http://127.0.0.1:8090/

set PY=
python --version >nul 2>&1 && set PY=python
if not defined PY (
  py --version >nul 2>&1 && set PY=py
)
if not defined PY (
  echo Python nao encontrado. Instale o Python e marque a opcao "Add to PATH".
  pause
  exit /b 1
)

netstat -ano | findstr ":8090 " | findstr LISTENING >nul
if %errorlevel%==0 (
  echo Servidor ja esta em execucao em %URL%
  start "" %URL%
  exit /b 0
)

echo Iniciando o site em %URL%
echo Feche esta janela para encerrar o servidor.
echo.

start "" cmd /c "timeout /t 1 /nobreak >nul & start %URL%"
"%PY%" -m http.server %PORT% --bind 127.0.0.1
if errorlevel 1 (
  echo.
  echo Nao foi possivel iniciar o servidor na porta %PORT%.
  pause
  exit /b 1
)
