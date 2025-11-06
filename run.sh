#!/usr/bin/env bash
set -euo pipefail

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
  echo -e "${RED}Docker is not installed or not in PATH.${NC}\nInstall Docker and try again: https://docs.docker.com/get-docker/"
  exit 1
fi

# Check Docker daemon
if ! docker info >/dev/null 2>&1; then
  echo -e "${RED}Docker daemon doesn't seem to be running.${NC}\nStart Docker and try again."
  exit 1
fi

# Check internet connectivity
check_internet() {
  # Try to reach a reliable DNS server with a short timeout
  if timeout 3 ping -c 1 8.8.8.8 >/dev/null 2>&1 || timeout 3 ping -c 1 1.1.1.1 >/dev/null 2>&1; then
    return 0
  else
    return 1
  fi
}

# Build image only if internet is available
if check_internet; then
  echo -e "${YELLOW}Building image '${IMAGE}'...${NC}"
  docker build -t "${IMAGE}" .
else
  echo -e "${YELLOW}No internet connection detected. Skipping build process.${NC}"
  echo -e "${YELLOW}Using existing image '${IMAGE}' if available...${NC}"
  
  # Check if the image exists locally
  if ! docker image inspect "${IMAGE}" >/dev/null 2>&1; then
    echo -e "${RED}Image '${IMAGE}' not found locally and cannot build without internet.${NC}"
    echo -e "${YELLOW}Please ensure you have internet connection to build the image first.${NC}"
    exit 1
  fi
fi

# Stop previous container if exists
if docker ps -a --format '{{.Names}}' | grep -q "^${NAME}$"; then
  echo -e "${YELLOW}Stopping existing container '${NAME}'...${NC}"
  docker rm -f "${NAME}" >/dev/null 2>&1 || true
fi

echo -e "${YELLOW}Starting container '${NAME}' on http://localhost:${HOST_PORT} ...${NC}"
docker run -d \
  --name "${NAME}" \
  -p "${HOST_PORT}:${APP_PORT}" \
  -v "${HOST_DOCKER_SOCKET}:/var/run/docker.sock" \
  --restart=unless-stopped \
  "${IMAGE}" >/dev/null

echo -e "${GREEN}Done.${NC} Open ${GREEN}http://localhost:${HOST_PORT}${NC}"
echo "View logs: docker logs -f ${NAME}"
echo "Stop: docker rm -f ${NAME}"