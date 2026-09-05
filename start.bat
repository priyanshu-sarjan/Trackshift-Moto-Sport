@echo off
echo =======================================================================
echo APEXINTEL: AI MOTORSPORT ENERGY & OVERTAKE INTELLIGENCE PLATFORM
echo Starting FastAPI Backend & Next.js Frontend...
echo =======================================================================

start cmd /k "cd backend && python -m pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000"
start cmd /k "cd frontend && npm install && npm run dev"

echo.
echo Services launched!
echo - Frontend: http://localhost:3000
echo - Backend API Docs: http://localhost:8000/docs
echo.
pause
