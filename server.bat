@echo off
echo =======================================
echo  INICIANDO SERVIDOR AGENCIA DE VIAJES
echo =======================================
echo.

echo Deteniendo posibles instancias anteriores...
taskkill /F /IM node.exe /T > nul 2>&1

echo.
echo Ejecutando migraciones...
node migrations/migrate.js

echo.
echo Iniciando el servidor...
echo (Para detener, presione Ctrl+C)
echo.
echo =======================================
echo  SERVIDOR EN: http://localhost:4000
echo =======================================
echo.

node index.js
