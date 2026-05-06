#!/usr/bin/env sh
set -eu

IMAGE=${IMAGE:-cojudge}
NAME=${NAME:-cojudge}
HOST_PORT=${HOST_PORT:-5375}
APP_PORT=${APP_PORT:-3000}
HOST_DOCKER_SOCKET=${HOST_DOCKER_SOCKET:-/var/run/docker.sock}

# Colors (optional)
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[1;33m"
NC="\033[0m"

# Check Docker CLI
if ! command -v docker >/dev/null 2>&1; then
  printf "%bDocker is not installed or not in PATH.%b\n" "$RED" "$NC"
  printf "Install Docker and try again: https://docs.docker.com/get-docker/\n"
  exit 1
fi

# Check Docker daemon
if ! docker info >/dev/null 2>&1; then
  printf "%bDocker daemon doesn't seem to be running.%b\n" "$RED" "$NC"
  printf "Start Docker and try again.\n"
  exit 1
fi

# Check internet connectivity
check_internet() {
  # Try nc if available
  if command -v nc >/dev/null 2>&1; then
    if nc -zw1 google.com 443 >/dev/null 2>&1; then
      return 0
    fi
  fi
  # Fallback to curl if available
  if command -v curl >/dev/null 2>&1; then
    if curl -sSfI https://google.com >/dev/null 2>&1; then
      return 0
    fi
  fi
  # Fallback to wget if available
  if command -v wget >/dev/null 2>&1; then
    if wget -q --spider https://google.com >/dev/null 2>&1; then
      return 0
    fi
  fi
  return 1
}

# Build image only if internet is available
if check_internet; then
  printf "%bBuilding image '%s'...%b\n" "$YELLOW" "$IMAGE" "$NC"
  docker build -t "${IMAGE}" .
else
  printf "%bNo internet connection detected. Skipping build process.%b\n" "$YELLOW" "$NC"
  printf "%bUsing existing image '%s' if available...%b\n" "$YELLOW" "$IMAGE" "$NC"
  
  # Check if the image exists locally
  if ! docker image inspect "${IMAGE}" >/dev/null 2>&1; then
    printf "%bImage '%s' not found locally and cannot build without internet.%b\n" "$RED" "$IMAGE" "$NC"
    printf "%bPlease ensure you have internet connection to build the image first.%b\n" "$YELLOW" "$NC"
    exit 1
  fi
fi

# Stop previous container if exists
if docker ps -a --format '{{.Names}}' | grep -q "^${NAME}$"; then
  printf "%bStopping existing container '%s'...%b\n" "$YELLOW" "$NAME" "$NC"
  docker rm -f "${NAME}" >/dev/null 2>&1 || true
fi

printf "%bStarting container '%s' on http://localhost:%s ...%b\n" "$YELLOW" "$NAME" "$HOST_PORT" "$NC"
docker run -d \
  --name "${NAME}" \
  -p "${HOST_PORT}:${APP_PORT}" \
  -v "${HOST_DOCKER_SOCKET}:/var/run/docker.sock" \
  --restart=unless-stopped \
  "${IMAGE}" >/dev/null

printf "%bDone.%b Open %bhttp://localhost:%s%b\n" "$GREEN" "$NC" "$GREEN" "$HOST_PORT" "$NC"
printf "View logs: docker logs -f %s\n" "$NAME"
printf "Stop: docker rm -f %s\n" "$NAME"
