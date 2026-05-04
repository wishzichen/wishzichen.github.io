param(
    [int]$DevicePort = 1413,
    [int]$ApiPort = 18113,
    [string]$ChromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe",
    [int]$DeviceCount = 7
)

$ErrorActionPreference = "Stop"

if (!(Test-Path -LiteralPath $ChromePath)) {
    throw "Chrome was not found at $ChromePath"
}

$chromeDir = Split-Path -Parent $ChromePath
$env:Path = "$chromeDir;$env:Path"
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$parts = @()
if ($userPath) {
    $parts = $userPath -split ";" | Where-Object { $_ }
}

if (($parts | Where-Object { $_.TrimEnd("\") -ieq $chromeDir.TrimEnd("\") }).Count -eq 0) {
    $newPath = if ($userPath) { "$chromeDir;$userPath" } else { $chromeDir }
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
}

$server = $null
$simulator = $null
$desktop = Join-Path $env:TEMP "imu-dashboard-desktop.png"
$mobile = Join-Path $env:TEMP "imu-dashboard-mobile.png"

function Get-ImageStats {
    param([string]$Path)

    Add-Type -AssemblyName System.Drawing
    $bitmap = [System.Drawing.Bitmap]::FromFile($Path)
    try {
        $colored = 0
        $checked = 0
        $stepX = [Math]::Max(1, [int]($bitmap.Width / 140))
        $stepY = [Math]::Max(1, [int]($bitmap.Height / 140))

        for ($x = 0; $x -lt $bitmap.Width; $x += $stepX) {
            for ($y = 0; $y -lt $bitmap.Height; $y += $stepY) {
                $pixel = $bitmap.GetPixel($x, $y)
                $contrast = [Math]::Abs($pixel.R - $pixel.G) + [Math]::Abs($pixel.G - $pixel.B) + [Math]::Abs($pixel.R - $pixel.B)
                if ($contrast -gt 12 -or $pixel.R -lt 238 -or $pixel.G -lt 238 -or $pixel.B -lt 238) {
                    $colored += 1
                }
                $checked += 1
            }
        }

        [pscustomobject]@{
            Path = $Path
            Width = $bitmap.Width
            Height = $bitmap.Height
            Checked = $checked
            Colored = $colored
        }
    }
    finally {
        $bitmap.Dispose()
    }
}

try {
    $server = Start-Process -FilePath python -ArgumentList @(
        "run_dashboard.py",
        "--protocol", "UDP",
        "--device-port", "$DevicePort",
        "--api-port", "$ApiPort",
        "--quiet"
    ) -WorkingDirectory $PSScriptRoot -PassThru -WindowStyle Hidden

    Start-Sleep -Seconds 2

    $simulator = Start-Process -FilePath python -ArgumentList @(
        "simulate_device.py",
        "--protocol", "UDP",
        "--host", "127.0.0.1",
        "--port", "$DevicePort",
        "--template", "lower-body",
        "--device-count", "$DeviceCount",
        "--count", "0",
        "--delay", "0.03"
    ) -WorkingDirectory $PSScriptRoot -PassThru -WindowStyle Hidden

    Start-Sleep -Seconds 2

    $dashboardUrl = "http://127.0.0.1:$ApiPort/"
    npx --yes playwright screenshot --channel chrome --viewport-size "1440,1100" --wait-for-timeout 5000 $dashboardUrl $desktop
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

    npx --yes playwright screenshot --channel chrome --viewport-size "390,900" --wait-for-timeout 5000 $dashboardUrl $mobile
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

    $health = Invoke-RestMethod -Uri "http://127.0.0.1:$ApiPort/api/health"
    $stats = @(Get-ImageStats $desktop; Get-ImageStats $mobile)
    $result = [pscustomobject]@{
        Dashboard = $dashboardUrl
        DeviceCount = $health.device_count
        Desktop = $stats[0]
        Mobile = $stats[1]
    }

    $result | ConvertTo-Json -Depth 5

    if ($health.device_count -lt [Math]::Min($DeviceCount, 7)) {
        throw "Expected simulated devices were not received."
    }
    if (($stats | Where-Object { $_.Colored -lt 120 }).Count -gt 0) {
        throw "Screenshot looked blank or under-rendered."
    }
}
finally {
    if ($simulator -and !$simulator.HasExited) {
        Stop-Process -Id $simulator.Id -Force
    }
    if ($server -and !$server.HasExited) {
        Stop-Process -Id $server.Id -Force
    }
}
