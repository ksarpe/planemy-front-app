# Migration Script - Update all API calls to use buildApiUrl
# This is a PowerShell script to help migrate hardcoded URLs

Write-Host "🔄 Starting API URL migration..." -ForegroundColor Cyan

# Files to update
$apiFiles = Get-ChildItem -Path "shared/api" -Filter "*.ts" -Recurse

$totalFiles = $apiFiles.Count
$currentFile = 0

foreach ($file in $apiFiles) {
    $currentFile++
    Write-Host "[$currentFile/$totalFiles] Processing: $($file.Name)" -ForegroundColor Yellow
    
    $content = Get-Content $file.FullName -Raw
    
    # Check if file already imports buildApiUrl
    $hasImport = $content -match "buildApiUrl"
    
    # Count how many localhost URLs are in the file
    $urlMatches = [regex]::Matches($content, 'http://localhost:8080/api/v1/')
    $urlCount = $urlMatches.Count
    
    if ($urlCount -gt 0) {
        Write-Host "  Found $urlCount hardcoded URLs" -ForegroundColor Red
        Write-Host "  File needs migration: $($file.FullName)" -ForegroundColor Magenta
    }
    else {
        Write-Host "  ✓ No hardcoded URLs found" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "📋 Migration Summary:" -ForegroundColor Cyan
Write-Host "To migrate a file manually:" -ForegroundColor White
Write-Host "1. Add import: import { buildApiUrl } from '@shared/config/api';" -ForegroundColor Gray
Write-Host "2. Replace: 'http://localhost:8080/api/v1/tasks' → buildApiUrl('tasks')" -ForegroundColor Gray
Write-Host ""
Write-Host "See docs/ENVIRONMENT_CONFIG.md for detailed instructions" -ForegroundColor Yellow
