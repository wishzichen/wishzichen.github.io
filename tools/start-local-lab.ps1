param(
    [ValidateSet("Full", "BridgeOnly", "NgimuOnly", "BsOnly", "DiagnoseOnly")]
    [string]$Mode = "Full",

    [int]$DevicePort = 1399,
    [int]$GuiPort = 8000,
    [int]$ApiPort = 18000,
    [int]$WebPort = 8080,
    [string]$DeviceIP = $env:ZHSL_DEVICE_IP,

    [switch]$OpenBsConfig,
    [switch]$NoBrowser,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

try {
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    [Console]::InputEncoding = [System.Text.Encoding]::UTF8
} catch {
    # Older hosts may not allow changing console encodings.
}

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$SdkDir = Join-Path $Root "integrations\ngimu-wifi"
$NgimuGuiExe = Join-Path $Root "integrations\ngimu-gui\NGIMU GUI.exe"
$RuntimeDir = Join-Path $Root ".runtime"

function Write-Step {
    param([string]$Message)
    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Write-Ok {
    param([string]$Message)
    Write-Host "[OK] $Message" -ForegroundColor Green
}

function Write-Warn {
    param([string]$Message)
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

function Write-Fail {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Get-CommandPath {
    param([string]$Name)
    $command = Get-Command $Name -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($command) {
        return $command.Source
    }
    return $null
}

function Find-Python {
    $python = Get-CommandPath "python"
    if ($python) {
        try {
            $version = & $python --version 2>&1
            if ($LASTEXITCODE -eq 0) {
                return [pscustomobject]@{
                    File = $python
                    Args = @()
                    Invocation = '"' + $python + '"'
                    Version = ($version -join " ")
                }
            }
        } catch {
        }
    }

    $py = Get-CommandPath "py"
    if ($py) {
        try {
            $version = & $py -3 --version 2>&1
            if ($LASTEXITCODE -eq 0) {
                return [pscustomobject]@{
                    File = $py
                    Args = @("-3")
                    Invocation = '"' + $py + '" -3'
                    Version = ($version -join " ")
                }
            }
        } catch {
        }
    }

    throw "Python was not found. Install Python 3, then run this launcher again."
}

function Get-LocalIPv4Candidates {
    $items = @()

    try {
        $configs = Get-NetIPConfiguration -ErrorAction Stop
        foreach ($config in $configs) {
            foreach ($address in @($config.IPv4Address)) {
                if (-not $address) { continue }
                $ip = $address.IPAddress
                if (-not $ip) { continue }
                if ($ip -like "127.*" -or $ip -like "169.254.*") { continue }

                $score = 0
                if ($config.IPv4DefaultGateway) { $score += 100 }
                if ($config.NetAdapter.Status -eq "Up") { $score += 50 }
                if ($config.InterfaceAlias -notmatch "Loopback|vEthernet|Virtual|VMware|Hyper-V|Bluetooth") { $score += 20 }
                if ($ip -like "172.*" -or $ip -like "192.168.*" -or $ip -like "10.*") { $score += 10 }

                $items += [pscustomobject]@{
                    IP = $ip
                    InterfaceAlias = $config.InterfaceAlias
                    Score = $score
                }
            }
        }
    } catch {
    }

    if (-not $items) {
        try {
            $hostName = [System.Net.Dns]::GetHostName()
            $addresses = [System.Net.Dns]::GetHostAddresses($hostName)
            foreach ($address in $addresses) {
                if ($address.AddressFamily -ne [System.Net.Sockets.AddressFamily]::InterNetwork) { continue }
                $ip = $address.IPAddressToString
                if ($ip -like "127.*" -or $ip -like "169.254.*") { continue }
                $items += [pscustomobject]@{
                    IP = $ip
                    InterfaceAlias = "DNS"
                    Score = 1
                }
            }
        } catch {
        }
    }

    return $items | Sort-Object -Property @{ Expression = "Score"; Descending = $true }, @{ Expression = "IP"; Descending = $false } -Unique
}

function Test-TcpListen {
    param([int]$Port)
    try {
        return [bool](Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
    } catch {
        return $false
    }
}

function Test-UdpUsed {
    param([int]$Port)
    try {
        return [bool](Get-NetUDPEndpoint -LocalPort $Port -ErrorAction SilentlyContinue)
    } catch {
        return $false
    }
}

function Get-FreeTcpPort {
    param([int]$StartPort)
    $port = $StartPort
    while (Test-TcpListen $port) {
        $port += 1
        if ($port -gt 65535) {
            throw "No free TCP port found after $StartPort."
        }
    }
    return $port
}

function Test-ProjectPreview {
    param([int]$Port)
    try {
        $response = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$Port/records/ngimu.html" -TimeoutSec 2
        return [int]$response.StatusCode -eq 200
    } catch {
        return $false
    }
}

function Find-BsImuExe {
    $candidates = @(
        (Join-Path $Root "..\..\bs-imu-260402\bs-imu-260402\bs-imu.exe"),
        (Join-Path $Root "..\bs-imu-260402\bs-imu-260402\bs-imu.exe"),
        "E:\TJUTCM\Activities\中国大学生计算机设计大赛\bs-imu-260402\bs-imu-260402\bs-imu.exe"
    )

    foreach ($candidate in $candidates) {
        if (Test-Path -LiteralPath $candidate) {
            return (Resolve-Path -LiteralPath $candidate).Path
        }
    }

    return $null
}

function Run-Diagnostics {
    param($Python)

    Write-Step "Diagnostics"
    if (-not (Test-Path -LiteralPath $SdkDir)) {
        throw "SDK directory was not found: $SdkDir"
    }

    $diagnose = Join-Path $SdkDir "diagnose_bridge.py"
    if (Test-Path -LiteralPath $diagnose) {
        & $Python.File @($Python.Args + @($diagnose, "--device-port", "$DevicePort", "--gui-port", "$GuiPort", "--api-port", "$ApiPort"))
    } else {
        Write-Warn "diagnose_bridge.py was not found."
    }
}

function Start-StaticServer {
    param($Python)

    $actualPort = $WebPort
    if (Test-TcpListen $WebPort) {
        if (Test-ProjectPreview $WebPort) {
            Write-Ok "Web preview already available: http://127.0.0.1:$WebPort/"
            return $WebPort
        }
        $actualPort = Get-FreeTcpPort ($WebPort + 1)
        Write-Warn "TCP $WebPort is already in use by another service. Web preview will use $actualPort."
    }

    $url = "http://127.0.0.1:$actualPort/"
    if ($DryRun) {
        Write-Host "[DRY-RUN] Start static server: $url"
        return $actualPort
    }

    if (-not (Test-Path -LiteralPath $RuntimeDir)) {
        New-Item -ItemType Directory -Path $RuntimeDir | Out-Null
    }

    $args = @($Python.Args + @("-m", "http.server", "$actualPort", "--bind", "127.0.0.1"))
    $process = Start-Process -FilePath $Python.File -ArgumentList $args -WorkingDirectory $Root -WindowStyle Hidden -PassThru
    Set-Content -LiteralPath (Join-Path $RuntimeDir "local-web.pid") -Value $process.Id -Encoding ASCII
    Start-Sleep -Milliseconds 900
    Write-Ok "Web preview started: $url (PID $($process.Id))"
    return $actualPort
}

function Start-NgimuGui {
    if (-not (Test-Path -LiteralPath $NgimuGuiExe)) {
        Write-Warn "NGIMU GUI was not found: $NgimuGuiExe"
        return
    }

    if ($DryRun) {
        Write-Host "[DRY-RUN] Start NGIMU GUI: $NgimuGuiExe"
        return
    }

    Start-Process -FilePath $NgimuGuiExe -WorkingDirectory (Split-Path -Parent $NgimuGuiExe)
    Write-Ok "NGIMU GUI launched."
}

function Start-BsImuConfig {
    $bsExe = Find-BsImuExe
    if (-not $bsExe) {
        Write-Warn "BS-IMU config software was not found."
        Write-Host "Expected local path:"
        Write-Host "  E:\TJUTCM\Activities\Chinese-Collegiate-Computer-Design-Contest\bs-imu-260402\bs-imu-260402\bs-imu.exe"
        Write-Host "Actual Chinese path is also searched automatically when it exists."
        return
    }

    if ($DryRun) {
        Write-Host "[DRY-RUN] Start BS-IMU config: $bsExe"
        return
    }

    Start-Process -FilePath $bsExe -WorkingDirectory (Split-Path -Parent $bsExe)
    Write-Ok "BS-IMU config launched."
}

function Start-Bridge {
    param($Python)

    if (-not (Test-Path -LiteralPath $SdkDir)) {
        throw "SDK directory was not found: $SdkDir"
    }

    $bridge = Join-Path $SdkDir "run_ngimu_web_bridge.py"
    if (-not (Test-Path -LiteralPath $bridge)) {
        throw "Bridge script was not found: $bridge"
    }

    if (Test-UdpUsed $DevicePort) {
        Write-Warn "UDP $DevicePort is already in use. If the bridge fails, close the owner or choose another port."
    }
    if (Test-UdpUsed $GuiPort) {
        Write-Warn "UDP $GuiPort is already in use. NGIMU GUI may already be listening."
    }
    if (Test-TcpListen $ApiPort) {
        Write-Warn "TCP $ApiPort is already listening. The bridge API may already be running."
    }

    $bridgeLine = "$($Python.Invocation) run_ngimu_web_bridge.py --protocol UDP --device-port $DevicePort --gui-port $GuiPort --api-port $ApiPort"
    if ($DryRun) {
        Write-Host "[DRY-RUN] Bridge command:"
        Write-Host "  cd /d `"$SdkDir`" && $bridgeLine"
        return
    }

    Start-Process -FilePath "cmd.exe" -ArgumentList @("/k", "cd /d `"$SdkDir`" && $bridgeLine") -WorkingDirectory $SdkDir
    Write-Ok "Bridge console launched."
}

function Open-Url {
    param([string]$Url)
    if ($NoBrowser) {
        Write-Host "Browser disabled. Open manually: $Url"
        return
    }
    if ($DryRun) {
        Write-Host "[DRY-RUN] Open browser: $Url"
        return
    }
    Start-Process $Url
    Write-Ok "Browser opened: $Url"
}

function Show-Wiring {
    param([string]$SelectedIP, [object[]]$Candidates)

    Write-Step "BS-WF91 forwarding settings"
    if ($Candidates.Count -gt 0) {
        Write-Host "Local IPv4 candidates:"
        foreach ($item in $Candidates) {
            $mark = " "
            if ($item.IP -eq $SelectedIP) { $mark = "*" }
            Write-Host " $mark $($item.IP)  [$($item.InterfaceAlias)]"
        }
    } else {
        Write-Warn "No local IPv4 address detected. Connect the PC and device to the same network, then run again."
    }

    Write-Host ""
    Write-Host "Set BS-IMU device forwarding to:"
    Write-Host "  Protocol    : UDP"
    Write-Host "  Server IP   : $SelectedIP"
    Write-Host "  Server Port : $DevicePort"
    Write-Host ""
    Write-Host "Bridge outputs:"
    Write-Host "  NGIMU GUI receive port : $GuiPort"
    Write-Host "  Local Web API          : http://127.0.0.1:$ApiPort/api"
    Write-Host "  BS-IMU config software : debug only, not opened by default"

    if ($SelectedIP) {
        $clipboardText = "Protocol=UDP`r`nServerIP=$SelectedIP`r`nServerPort=$DevicePort"
        try {
            Set-Clipboard -Value $clipboardText -ErrorAction Stop
            Write-Ok "Forwarding settings copied to clipboard."
        } catch {
            Write-Warn "Clipboard is not available in this shell."
        }
    }
}

try {
    Set-Location $Root

    Write-Step "Project"
    Write-Host "Root: $Root"
    Write-Host "Mode: $Mode"

    if ($Mode -eq "NgimuOnly") {
        Start-NgimuGui
        exit 0
    }

    if ($Mode -eq "BsOnly") {
        Start-BsImuConfig
        exit 0
    }

    $python = Find-Python
    Write-Ok "Python detected: $($python.Version)"

    $ipCandidates = @(Get-LocalIPv4Candidates)
    $selectedIP = $DeviceIP
    if (-not $selectedIP -and $ipCandidates.Count -gt 0) {
        $selectedIP = $ipCandidates[0].IP
    }
    if ($DeviceIP -and $ipCandidates.Count -gt 0 -and $DeviceIP -notin @($ipCandidates | ForEach-Object { $_.IP })) {
        Write-Warn "DeviceIP $DeviceIP is not in the detected IPv4 list. It will still be shown as the forwarding target."
    }

    Show-Wiring -SelectedIP $selectedIP -Candidates $ipCandidates
    Run-Diagnostics -Python $python

    if ($Mode -eq "DiagnoseOnly") {
        Write-Ok "Diagnostics completed."
        exit 0
    }

    $webPortActual = $null
    if ($Mode -eq "Full") {
        Write-Step "Applications"
        Start-NgimuGui
        if ($OpenBsConfig) {
            Start-BsImuConfig
        } else {
            Write-Host "BS-IMU config is skipped by default. Use the BS-IMU config launcher only when changing sensor forwarding."
        }

        Write-Step "Web preview"
        $webPortActual = Start-StaticServer -Python $python
    }

    Write-Step "Bridge"
    Start-Bridge -Python $python

    if ($Mode -eq "Full") {
        $appUrl = "http://127.0.0.1:$webPortActual/records/ngimu.html"
        Open-Url -Url $appUrl
    }

    Write-Step "Ready"
    Write-Host "Keep the bridge console open while testing hardware data."
    Write-Host "If no data arrives after several seconds, set BS-IMU forwarding to UDP $selectedIP`:$DevicePort."
    Write-Host "In NGIMU GUI, use UDP receive port $GuiPort. BS-IMU config is only needed when the device forwarding target changes."
} catch {
    Write-Fail $_.Exception.Message
    exit 1
}
