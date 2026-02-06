# Supply Chain Project v2

Clean, working implementation from scratch.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Blockchain
cd blockchain
npm install

# Frontend
cd ../frontend
npm install

# IoT Simulator
cd ../iot-simulator
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ..
```

### 2. Start Hardhat Node

```bash
cd blockchain
npx hardhat node --hostname 0.0.0.0
```

**Leave this running!**

### 3. Deploy & Setup (New Terminal)

```bash
cd blockchain
npm run setup
```

This will:
- Deploy the contract
- Grant producer permissions
- Create a product
- Save config to `blockchain/config.json`

**Copy the contract address** from output!

### 4. Update Files

**Update `frontend/src/App.js` line 6:**
```javascript
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";
```

**Update `iot-simulator/iot_device.py` line 11:**
```python
CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE"
```

### 5. Start Frontend

```bash
cd frontend
npm start
```

Open http://localhost:3000 in browser

### 6. Start IoT Simulator

```bash
cd iot-simulator
source venv/bin/activate
python3 iot_device.py
```

## 🎯 Using Start Scripts

Or use the automated scripts:

```bash
# Make executable
chmod +x start.sh stop.sh

# Start everything
./start.sh

# Stop everything
./stop.sh
```

**Note:** After running `start.sh`, you still need to:
1. Run `npm run setup` in blockchain directory (once)
2. Update the contract addresses in frontend and iot-simulator

## 📁 Project Structure

```
supplychain-v2/
├── blockchain/
│   ├── contracts/
│   │   └── SupplyChain.sol
│   ├── scripts/
│   │   ├── deploy.js
│   │   └── setup.js
│   ├── hardhat.config.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
├── iot-simulator/
│   ├── iot_device.py
│   └── requirements.txt
├── start.sh
├── stop.sh
└── README.md
```

## ✅ Everything Works

- ✅ CommonJS (no ES module errors)
- ✅ Simple deployment scripts
- ✅ Auto-config generation
- ✅ Clean React frontend
- ✅ Python IoT simulator
- ✅ Start/stop scripts

## 🎓 For Your Project Report

This demonstrates:
- Blockchain integration (Ethereum/Solidity)
- Smart contract deployment
- IoT device simulation
- Autonomous transactions
- Real-time dashboard
- Access control
- Data immutability
