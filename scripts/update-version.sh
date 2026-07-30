#!/bin/bash
set -e

# Check if version argument is provided
if [ -z "$1" ]; then
  echo "Error: No version provided."
  echo "Usage: ./scripts/update-version.sh <version>"
  exit 1
fi

VERSION=$1

# Validate version format (e.g., 0.0.3)
if [[ ! "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$ ]]; then
  echo "Error: Invalid version format '$VERSION'. Must be semver (e.g. 0.0.3 or 1.0.0-beta.1)."
  exit 1
fi

echo "Updating version to $VERSION..."

# 1. Update package.json and package-lock.json
npm version "$VERSION" --no-git-tag-version

# 2. Update src-tauri/Cargo.toml
node -e "
const fs = require('fs');
const content = fs.readFileSync('src-tauri/Cargo.toml', 'utf8');
const updated = content.replace(/^version\s*=\s*\"[^\"]+\"/m, 'version = \"' + process.argv[1] + '\"');
fs.writeFileSync('src-tauri/Cargo.toml', updated);
" "$VERSION"

# 3. Update src-tauri/Cargo.lock if it exists
if [ -f "src-tauri/Cargo.lock" ]; then
  node -e "
const fs = require('fs');
const content = fs.readFileSync('src-tauri/Cargo.lock', 'utf8');
const regex = /(name\s*=\s*\"cojudge-desktop\"\s*\r?\nversion\s*=\s*\")[^\"]+(\")/g;
const updated = content.replace(regex, '\$1' + process.argv[1] + '\$2');
fs.writeFileSync('src-tauri/Cargo.lock', updated);
" "$VERSION"
fi

echo "Successfully updated version in package.json, package-lock.json, Cargo.toml, and Cargo.lock to $VERSION"
