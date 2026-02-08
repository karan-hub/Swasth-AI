
$maxRetries = 50
$retryCount = 0

Write-Host "Starting Robust Ingestion Loop..." -ForegroundColor Cyan

while ($retryCount -lt $maxRetries) {
    node ingest.js
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Ingestion process finished successfully!" -ForegroundColor Green
        break
    }
    
    Write-Host "Ingestion stopped/crashed. Retrying in 2 seconds (Attempt $($retryCount+1)/$maxRetries)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2
    $retryCount++
}

if ($retryCount -eq $maxRetries) {
    Write-Host "Ingestion failed too many times. Please check logs." -ForegroundColor Red
    exit 1
}

Write-Host "Starting Swasthya AI Backend Server..." -ForegroundColor Cyan
node server.js
