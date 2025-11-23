# Kill any process using port 9323 (Playwright report server)
Write-Host "Checking for processes using port 9323..."

$connections = netstat -ano | findstr :9323
if ($connections) {
    Write-Host "Found connections on port 9323:"
    Write-Host $connections
    
    # Extract PIDs and kill them
    $pids = $connections | ForEach-Object {
        $parts = $_ -split '\s+'
        $parts[-1]
    } | Select-Object -Unique
    
    foreach ($pid in $pids) {
        if ($pid -match '^[0-9]+$') {
            Write-Host "Killing process $pid..."
            taskkill /F /PID $pid 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Successfully killed process $pid" -ForegroundColor Green
            } else {
                Write-Host "Process $pid already terminated or not found" -ForegroundColor Yellow
            }
        }
    }
} else {
    Write-Host "No processes found using port 9323" -ForegroundColor Green
}

Write-Host ""
Write-Host "You can now run: npx playwright show-report"
