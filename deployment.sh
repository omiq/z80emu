#!/bin/bash

# Z80 Emulator Deployment Script
# Uploads the project to live web server using rsync

# Configuration
REMOTE_USER="cpm"
REMOTE_HOST="server"
REMOTE_PATH="/home/cpm/htdocs/cpm.retrogamecoders.com"
LOCAL_PATH="."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Z80 Emulator Deployment Script ===${NC}"
echo -e "${YELLOW}Deploying to: ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}${NC}"
echo ""

# Check if rsync is available
if ! command -v rsync &> /dev/null; then
    echo -e "${RED}Error: rsync is not installed. Please install rsync first.${NC}"
    exit 1
fi

# Check if we can connect to the remote server
echo -e "${BLUE}Testing connection to remote server...${NC}"
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes ${REMOTE_USER}@${REMOTE_HOST} "echo 'Connection successful'" 2>/dev/null; then
    echo -e "${RED}Error: Cannot connect to ${REMOTE_USER}@${REMOTE_HOST}${NC}"
    echo -e "${YELLOW}Make sure:${NC}"
    echo -e "  - SSH key is set up for passwordless login"
    echo -e "  - Server is accessible"
    echo -e "  - User '${REMOTE_USER}' has access to the server"
    exit 1
fi

echo -e "${GREEN}Connection successful!${NC}"
echo ""

# Create backup of current deployment (optional)
echo -e "${BLUE}Creating backup of current deployment...${NC}"
BACKUP_DATE=$(date +"%Y%m%d_%H%M%S")
ssh ${REMOTE_USER}@${REMOTE_HOST} "if [ -d ${REMOTE_PATH} ]; then tar -czf ${REMOTE_PATH}_backup_${BACKUP_DATE}.tar.gz -C $(dirname ${REMOTE_PATH}) $(basename ${REMOTE_PATH}); fi"
echo -e "${GREEN}Backup created: ${REMOTE_PATH}_backup_${BACKUP_DATE}.tar.gz${NC}"
echo ""

# Deploy using rsync
echo -e "${BLUE}Deploying files to server...${NC}"
rsync -avz --progress \
    --exclude='.git/' \
    --exclude='.gitignore' \
    --exclude='deployment.sh' \
    --exclude='test.html' \
    --exclude='README.md' \
    --exclude='*.log' \
    --exclude='*.tmp' \
    --exclude='node_modules/' \
    --exclude='.DS_Store' \
    --exclude='Thumbs.db' \
    --delete \
    ${LOCAL_PATH}/ \
    ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/

# Check if rsync was successful
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}=== Deployment Successful! ===${NC}"
    echo -e "${GREEN}✓ Files uploaded successfully${NC}"
    echo -e "${GREEN}✓ Old files cleaned up${NC}"
    echo ""
    echo -e "${BLUE}Deployment Details:${NC}"
    echo -e "  Remote Server: ${REMOTE_USER}@${REMOTE_HOST}"
    echo -e "  Remote Path: ${REMOTE_PATH}"
    echo -e "  Backup: ${REMOTE_PATH}_backup_${BACKUP_DATE}.tar.gz"
    echo ""
    echo -e "${YELLOW}Your Z80 emulator should now be live at:${NC}"
    echo -e "  https://cpm.retrogamecoders.com"
    echo ""
    echo -e "${BLUE}Features deployed:${NC}"
    echo -e "  ✓ IndexedDB support for modern browsers"
    echo -e "  ✓ Auto-boot CP/M 2.2"
    echo -e "  ✓ VT52 font with green-on-black terminal"
    echo -e "  ✓ Full Z80 CPU emulation"
else
    echo ""
    echo -e "${RED}=== Deployment Failed! ===${NC}"
    echo -e "${RED}Error: rsync failed with exit code $?${NC}"
    echo ""
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo -e "  - Check your internet connection"
    echo -e "  - Verify SSH access to the server"
    echo -e "  - Ensure the remote directory exists and is writable"
    exit 1
fi

# Optional: Test the deployment
echo -e "${BLUE}Testing deployment...${NC}"
if curl -s -o /dev/null -w "%{http_code}" https://cpm.retrogamecoders.com | grep -q "200"; then
    echo -e "${GREEN}✓ Website is responding (HTTP 200)${NC}"
else
    echo -e "${YELLOW}⚠ Website test inconclusive - check manually${NC}"
fi

echo ""
echo -e "${GREEN}Deployment complete!${NC}"
