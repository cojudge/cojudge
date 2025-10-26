Param(
  [string]$Image = "cojudge",
  [string]$Name = "cojudge",
  [int]$HostPort = 5375,
  [int]$AppPort = 3000
)

function Fail($msg) {
  Write-Host $msg -ForegroundColor Red
  exit 1
}

# Check Docker CLI
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Fail "Docker is not installed or not in PATH. Install Docker Desktop and try again: https://docs.docker.com/desktop/"
}

# Check Docker daemon
try { docker info | Out-Null } catch { Fail "Docker daemon doesn't seem to be running. Start Docker Desktop and try again." }

Write-Host "Building image '$Image'..." -ForegroundColor Yellow
docker build -t $Image .
if ($LASTEXITCODE -ne 0) { Fail "Image build failed." }

# Stop previous container if exists
$exists = docker ps -a --format '{{.Names}}' | Select-String "^$Name$" -Quiet
if ($exists) {
  Write-Host "Stopping existing container '$Name'..." -ForegroundColor Yellow
  docker rm -f $Name | Out-Null
}

# Current working directory
$pwdPath = (Get-Location).Path
Write-Host "Starting container '$Name' on http://localhost:$HostPort ..." -ForegroundColor Yellow

docker run -d `
  --name $Name `
  -p "$HostPort`:$AppPort" `
  -v /var/run/docker.sock:/var/run/docker.sock `
  -v "$pwdPath":"$pwdPath" `
  -w "$pwdPath" `
  --restart=unless-stopped `
  $Image | Out-Null

if ($LASTEXITCODE -ne 0) {
  Fail "Failed to start the container. If you're on Windows, inner-Docker (/var/run/docker.sock) may not be available. Try running locally: 'npm install' then 'npm run dev'"
}

Write-Host "Done. Open http://localhost:$HostPort" -ForegroundColor Green
Write-Host "View logs: docker logs -f $Name"
Write-Host "Stop: docker rm -f $Name"