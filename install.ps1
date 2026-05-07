# Cojudge Installation Script for PowerShell
# This script sets up a local function/alias for cojudge to avoid permission issues with global npm installs.

$ErrorActionPreference = "Stop"

# Colors (using PowerShell's Write-Host colors)
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Cyan"

Write-Host "Setting up Cojudge..." -ForegroundColor $Blue

# 1. Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor $Yellow
npm install

# 2. Build the application
Write-Host "Building application..." -ForegroundColor $Yellow
npm run build

# 3. Determine Profile Path
$CONFIG_FILE = $PROFILE
$INSTALL_DIR = Get-Location
$FUNCTION_NAME = "cojudge"
$FUNCTION_DEFINITION = @"

# CoJudge CLI
function $FUNCTION_NAME {
    node "$INSTALL_DIR\bin\cojudge" `$args
}
"@

if ($null -eq $CONFIG_FILE -or $CONFIG_FILE -eq "") {
    Write-Host "Could not find PowerShell profile path. Please manually add the following function to your profile:" -ForegroundColor $Yellow
    Write-Host $FUNCTION_DEFINITION
} else {
    # Create profile file if it doesn't exist
    if (!(Test-Path $CONFIG_FILE)) {
        Write-Host "Creating PowerShell profile at $CONFIG_FILE..." -ForegroundColor $Blue
        New-Item -Path $CONFIG_FILE -ItemType File -Force | Out-Null
    }

    $ProfileContent = Get-Content $CONFIG_FILE -Raw
    if ($ProfileContent -like "*function $FUNCTION_NAME *") {
        # Update existing function (this is a bit naive but matches the intent)
        # For simplicity in PS, we'll just append it again or recommend manual update if complex
        # But let's try a replacement if it looks standard
        Write-Host "Updating existing cojudge function in $CONFIG_FILE" -ForegroundColor $Green
        # Simple replacement regex
        $NewContent = $ProfileContent -replace "(?s)# CoJudge CLI\s+function $FUNCTION_NAME \{.*?}", $FUNCTION_DEFINITION
        if ($NewContent -eq $ProfileContent) {
            # If regex didn't match exactly, just append
            Add-Content -Path $CONFIG_FILE -Value $FUNCTION_DEFINITION
        } else {
            Set-Content -Path $CONFIG_FILE -Value $NewContent
        }
    } else {
        # Add new function
        Add-Content -Path $CONFIG_FILE -Value $FUNCTION_DEFINITION
        Write-Host "Added cojudge function to $CONFIG_FILE" -ForegroundColor $Green
    }
    
    Write-Host "Please restart your PowerShell session or run '. `$PROFILE' to use the 'cojudge' command." -ForegroundColor $Blue
}

Write-Host "`nCojudge setup complete!" -ForegroundColor $Green
