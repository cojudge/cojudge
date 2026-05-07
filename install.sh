#!/usr/bin/env bash

# Cojudge Installation Script
# This script sets up a local alias for cojudge to avoid permission issues with global npm installs.

set -e

# Colors
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
BLUE="\033[0;34m"
NC="\033[0m"

echo -e "${BLUE}Setting up Cojudge...${NC}"

# 1. Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# 2. Build the application
echo -e "${YELLOW}Building application...${NC}"
npm run build

# 3. Determine Shell and Config File
SHELL_NAME=$(basename "$SHELL")
CONFIG_FILE=""

case "$SHELL_NAME" in
    zsh)
        CONFIG_FILE="$HOME/.zshrc"
        ;;
    bash)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            CONFIG_FILE="$HOME/.bash_profile"
        else
            CONFIG_FILE="$HOME/.bashrc"
        fi
        ;;
    *)
        echo -e "${YELLOW}Unsupported shell ($SHELL_NAME). Please manually add the alias to your shell config.${NC}"
        ;;
esac

INSTALL_DIR=$(pwd)
ALIAS_LINE="alias cojudge='node $INSTALL_DIR/bin/cojudge'"

if [ -n "$CONFIG_FILE" ]; then
    if grep -q "alias cojudge=" "$CONFIG_FILE"; then
        # Update existing alias
        sed -i.bak "/alias cojudge=/c\\$ALIAS_LINE" "$CONFIG_FILE"
        echo -e "${GREEN}Updated existing cojudge alias in $CONFIG_FILE${NC}"
    else
        # Add new alias
        echo -e "\n# CoJudge CLI\n$ALIAS_LINE" >> "$CONFIG_FILE"
        echo -e "${GREEN}Added cojudge alias to $CONFIG_FILE${NC}"
    fi
    echo -e "${BLUE}Please run 'source $CONFIG_FILE' or restart your terminal to use the 'cojudge' command.${NC}"
else
    echo -e "${YELLOW}Please add the following line to your shell configuration file:${NC}"
    echo -e "$ALIAS_LINE"
fi

echo -e "\n${GREEN}Cojudge setup complete!${NC}"
