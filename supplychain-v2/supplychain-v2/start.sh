#!/bin/bash

echo "========================================"
echo "  Supply Chain Project v2"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Kill existing processes
echo -e "${YELLOW}Cleaning up...${NC}"
fuser -k 8545/tcp 2>/dev/null
fuser -k 3000/tcp 2>/dev/null
pkill -f "hardhat node" 2>/dev/null
pkill -f "iot_device.py" 2>/dev/null
pkill -f "react-scripts" 2>/dev/null
sleep 2

# Start Hardhat node
echo -e "\n${GREEN}[1/3] Starting Hardhat node...${NC}"
gnome-terminal --title="Hardhat Node" -- bash -c "
cd blockchain
npx hardhat node --hostname 0.0.0.0
exec bash
" 2>/dev/null &

sleep 8

# Check if node started
if nc -z 127.0.0.1 8545 2>/dev/null; then
    echo -e "${GREEN}✓ Blockchain running${NC}"
else
    echo -e "${YELLOW}⚠ Blockchain not responding${NC}"
fi

# Start IoT simulator
echo -e "\n${GREEN}[2/3] Starting IoT simulator...${NC}"
gnome-terminal --title="IoT Simulator" -- bash -c "
cd iot-simulator
source venv/bin/activate
python3 iot_device.py
exec bash
" 2>/dev/null &

sleep 2
echo -e "${GREEN}✓ IoT simulator started${NC}"

# Start frontend
echo -e "\n${GREEN}[3/3] Starting frontend...${NC}"
gnome-terminal --title="React Frontend" -- bash -c "
cd frontend
BROWSER=none npm start
exec bash
" 2>/dev/null &

sleep 3
echo -e "${GREEN}✓ Frontend started${NC}"

echo ""
echo "========================================"
echo -e "${GREEN}  All services started!${NC}"
echo "========================================"
echo ""
echo "Blockchain:  http://127.0.0.1:8545"
echo "Frontend:    http://localhost:3000"
echo ""
echo "Opening Firefox..."
sleep 3
firefox http://localhost:3000 &
echo ""
echo "To stop: ./stop.sh"
echo ""
