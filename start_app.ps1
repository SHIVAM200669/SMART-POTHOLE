Write-Host "Starting Smart Pothole Detection System..." -ForegroundColor Green

# Start the Backend
Write-Host "Starting Backend on port 5000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd backend; npm start`""

# Start the Frontend
Write-Host "Starting Frontend on port 5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd frontend; npm run dev`""

Write-Host "Servers are starting up! Check the new windows." -ForegroundColor Green
