#!/bin/bash

echo "Stopping all services..."

pkill -f "hardhat node"
pkill -f "iot_device.py"
pkill -f "react-scripts"
fuser -k 8545/tcp 2>/dev/null
fuser -k 3000/tcp 2>/dev/null

echo "✓ All services stopped"
