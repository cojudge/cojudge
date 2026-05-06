#!/usr/bin/env sh
set -eu

PORT=${PORT:-5375}

# Colors
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[1;33m"
NC="\033[0m"

# Check for Node.js
if ! command -v node >/dev/null 2>&1; then
  printf "%bError: Node.js is not installed.%b\n" "$RED" "$NC"
  printf "Please install Node.js (v18+) to run CoJudge.\n"
  exit 1
fi

# Check for npm
if ! command -v npm >/dev/null 2>&1; then
  printf "%bError: npm is not installed.%b\n" "$RED" "$NC"
  exit 1
fi

printf "%bInstalling dependencies...%b\n" "$YELLOW" "$NC"
npm install

printf "%bBuilding application...%b\n" "$YELLOW" "$NC"
npm run build

printf "%bStarting application on http://localhost:%s ...%b\n" "$YELLOW" "$PORT" "$NC"
printf "%bNote: Docker is required for code execution but not for browsing and editing.%b\n" "$GREEN" "$NC"
npm run preview -- --port "$PORT" --host
