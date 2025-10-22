@echo off
echo Starting Art.Decor.AI Development Environment...

echo.
echo [1/3] Starting Backend Server...
cd backend
start cmd /k "python main.py"
cd ..

echo.
echo [2/3] Starting Frontend Server...
cd frontend
start cmd /k "npm run dev"
cd ..

echo.
echo [3/3] Opening Browser...
timeout /t 5 /nobreak > nul
start http://localhost:3000

echo.
echo ✅ Art.Decor.AI is starting up!
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to exit...
pause > nul
