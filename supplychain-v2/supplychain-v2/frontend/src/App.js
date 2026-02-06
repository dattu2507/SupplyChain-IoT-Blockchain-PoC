import React, { useEffect, useState } from "react";
import Web3 from "web3";

// UPDATE THESE AFTER RUNNING SETUP
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "admin",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "productCounter",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "products",
    "outputs": [
      {"internalType": "string", "name": "destination", "type": "string"},
      {"internalType": "address", "name": "recipient", "type": "address"},
      {"internalType": "address", "name": "transportDevice", "type": "address"},
      {"internalType": "uint256", "name": "lastValue", "type": "uint256"},
      {"internalType": "uint256", "name": "lastUpdateTime", "type": "uint256"},
      {"internalType": "bool", "name": "received", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "timeGap",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

function App() {
  const [status, setStatus] = useState("Connecting...");
  const [blockNumber, setBlockNumber] = useState(null);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let web3;
    let contract;

    const init = async () => {
      try {
        web3 = new Web3("http://127.0.0.1:8545");
        const block = await web3.eth.getBlockNumber();
        setBlockNumber(block.toString());
        setStatus("Connected");
        
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        
        const fetchProduct = async () => {
          try {
            const data = await contract.methods.products(0).call();
            setProduct(data);
            setError("");
          } catch (e) {
            setError(e.message);
          }
        };

        fetchProduct();
        const interval = setInterval(fetchProduct, 3000);
        
        return () => clearInterval(interval);
      } catch (e) {
        setStatus("Failed");
        setError(e.message);
      }
    };

    init();
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Supply Chain Dashboard</h1>

      <div style={{
        padding: "15px",
        marginBottom: "20px",
        borderRadius: "5px",
        backgroundColor: status === "Connected" ? "#d4edda" : "#f8d7da",
        border: `1px solid ${status === "Connected" ? "#c3e6cb" : "#f5c6cb"}`
      }}>
        <p style={{ margin: 0 }}>
          <strong>Blockchain:</strong> {status} {blockNumber && `(Block #${blockNumber})`}
        </p>
      </div>

      {error && (
        <div style={{
          padding: "15px",
          marginBottom: "20px",
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeeba",
          borderRadius: "5px"
        }}>
          <p style={{ margin: 0, color: "#856404" }}>{error}</p>
        </div>
      )}

      {product ? (
        <div style={{
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          border: "1px solid #dee2e6"
        }}>
          <h2 style={{ marginTop: 0 }}>Product #0</h2>
          <p><strong>Destination:</strong> {product.destination}</p>
          <p><strong>Recipient:</strong> <code>{product.recipient}</code></p>
          <p><strong>Transport Device:</strong> <code>{product.transportDevice}</code></p>
          
          <div style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#fff",
            borderRadius: "5px"
          }}>
            <h3 style={{ marginTop: 0, color: "#28a745" }}>Sensor Data</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold", margin: "8px 0" }}>
              Value: {product.lastValue}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {product.lastUpdateTime === "0"
                ? "Not yet"
                : new Date(Number(product.lastUpdateTime) * 1000).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span style={{
                padding: "4px 12px",
                borderRadius: "12px",
                backgroundColor: product.received ? "#28a745" : "#ffc107",
                color: "white",
                fontWeight: "bold"
              }}>
                {product.received ? "Received" : "In Transit"}
              </span>
            </p>
          </div>
        </div>
      ) : (
        <p>Loading product...</p>
      )}

      <div style={{
        marginTop: "30px",
        padding: "15px",
        backgroundColor: "#e9ecef",
        borderRadius: "5px",
        fontSize: "12px"
      }}>
        <p style={{ margin: 0 }}><strong>Contract:</strong> <code>{CONTRACT_ADDRESS}</code></p>
        <p style={{ margin: "5px 0 0 0" }}><strong>RPC:</strong> <code>http://127.0.0.1:8545</code></p>
      </div>
    </div>
  );
}

export default App;
