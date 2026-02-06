#!/usr/bin/env python3
"""
IoT Device Simulator for Supply Chain
"""
import time
import random
from web3 import Web3

# UPDATE THESE AFTER RUNNING SETUP
CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
DEVICE_PRIVATE_KEY = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
PRODUCT_ID = 0

# Contract ABI (only updateProduct function)
CONTRACT_ABI = [
    {
        "inputs": [
            {"internalType": "uint256", "name": "productId", "type": "uint256"},
            {"internalType": "uint256", "name": "value", "type": "uint256"}
        ],
        "name": "updateProduct",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

def main():
    print("="*50)
    print("  IoT Device Simulator")
    print("="*50)
    print()
    
    # Connect to blockchain
    w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))
    
    if not w3.is_connected():
        print("❌ Cannot connect to blockchain")
        return
    
    print("✅ Connected to blockchain")
    
    # Setup account
    account = w3.eth.account.from_key(DEVICE_PRIVATE_KEY)
    print(f"✅ Device address: {account.address}")
    print()
    
    # Setup contract
    contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
    
    print(f"Monitoring Product ID: {PRODUCT_ID}")
    print(f"Sending updates every 25 seconds...")
    print()
    
    update_count = 0
    
    while True:
        try:
            # Generate sensor value (temperature simulation: 20-30°C)
            sensor_value = random.randint(20, 30)
            
            print(f"[{time.strftime('%H:%M:%S')}] Sensor Value: {sensor_value}°C")
            
            # Build transaction
            nonce = w3.eth.get_transaction_count(account.address)
            
            txn = contract.functions.updateProduct(
                PRODUCT_ID,
                sensor_value
            ).build_transaction({
                'from': account.address,
                'nonce': nonce,
                'gas': 200000,
                'gasPrice': w3.eth.gas_price
            })
            
            # Sign and send
            signed_txn = w3.eth.account.sign_transaction(txn, DEVICE_PRIVATE_KEY)
            tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
            
            print(f"  → Transaction sent: {tx_hash.hex()}")
            
            # Wait for confirmation
            receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
            
            if receipt['status'] == 1:
                update_count += 1
                print(f"  ✅ Update #{update_count} confirmed in block #{receipt['blockNumber']}")
            else:
                print(f"  ❌ Transaction failed")
            
            print()
            
            # Wait 25 seconds (timeGap is 20, so 25 is safe)
            time.sleep(25)
            
        except KeyboardInterrupt:
            print("\n\n⏹️  Stopping IoT device...")
            break
        except Exception as e:
            print(f"  ❌ Error: {e}")
            print("  Retrying in 10 seconds...")
            time.sleep(10)

if __name__ == "__main__":
    main()
