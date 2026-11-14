param(
    [string]$Tag = $(if ($env:COJUDGE_VERSION) { $env:COJUDGE_VERSION } else { "latest" })
)

$ErrorActionPreference = "Stop"

$Repo = if ($env:COJUDGE_REPO) { $env:COJUDGE_REPO } else { "cojudge/cojudge" }
$Silent = $env:COJUDGE_SILENT -eq "1"

function Resolve-CojudgeAssetUrl {
    param([string]$ReleaseTag)

    $headers = @{ "User-Agent" = "cojudge-installer" }
    $releases = @()

    if ($ReleaseTag -eq "latest") {
        try {
            $latest = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repo/releases/latest" -Headers $headers
            if ($latest) { $releases += $latest }
        } catch {
            # Fall back to recent releases if no latest release exists yet
        }
        if ($releases.Count -eq 0) {
            $releases = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repo/releases?per_page=10" -Headers $headers
        }
    } else {
        $normalizedTag = if ($ReleaseTag.StartsWith("v")) { $ReleaseTag } else { "v$ReleaseTag" }
        $release = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repo/releases/tags/$normalizedTag" -Headers $headers
        if ($release) { $releases += $release }
    }

    foreach ($rel in $releases) {
        if (-not $rel.assets) { continue }
        $asset = $rel.assets | Where-Object {
            $_.name -match "_x64-setup\.exe$" -and $_.name -notmatch "\.sig$"
        } | Select-Object -First 1
        if ($asset) {
            return $asset.browser_download_url
        }
    }

    throw "Could not find a Windows installer (*_x64-setup.exe) for '$ReleaseTag'."
}

Write-Host "Resolving Cojudge Windows release ($Tag)..."
$AssetUrl = Resolve-CojudgeAssetUrl -ReleaseTag $Tag

$InstallerPath = Join-Path $env:TEMP ("Cojudge-setup-" + [guid]::NewGuid().ToString("N") + ".exe")

try {
    Write-Host "Downloading $AssetUrl..."
    Invoke-WebRequest -Uri $AssetUrl -OutFile $InstallerPath -UseBasicParsing

    Write-Host "Running Cojudge installer..."
    $procArgs = @{
        FilePath = $InstallerPath
        Wait     = $true
        PassThru = $true
    }
    if ($Silent) {
        $procArgs["ArgumentList"] = "/S"
    }

    $proc = Start-Process @procArgs
    if ($proc.ExitCode -ne 0) {
        throw "Installer exited with code $($proc.ExitCode)."
    }
} finally {
    if (Test-Path $InstallerPath) {
        Remove-Item -Path $InstallerPath -Force -ErrorAction SilentlyContinue
    }
}

$candidates = @(
    (Join-Path $env:LOCALAPPDATA "Cojudge\Cojudge.exe"),
    (Join-Path $env:LOCALAPPDATA "Cojudge\cojudge-desktop.exe"),
    (Join-Path $env:ProgramFiles "Cojudge\Cojudge.exe"),
    (Join-Path $env:ProgramFiles "Cojudge\cojudge-desktop.exe")
)
$exe = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if ($exe) {
    Write-Host "Cojudge installed to $exe"
    Write-Host "Launch it from the Start Menu or run:"
    Write-Host "  `"$exe`""
} else {
    Write-Host "Cojudge installation complete. Launch it from the Start Menu."
}
