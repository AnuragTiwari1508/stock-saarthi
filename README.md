# 📈 Stock Saarthi — AI-Powered Stock Trading & Portfolio Platform

> **Live Indian Stock Market (NSE/BSE) Data • Google Gemini AI Investment Assistant • Simulated Trading Wallet • MetaMask Web3 Integration**

---

## 🌟 Overview

**Stock Saarthi** is a modern, responsive web application that bridges traditional Indian stock investing with state-of-the-art AI analysis and Web3 blockchain integration. 

Whether you want to track real-time NSE/BSE stock movements, test trading strategies risk-free using a simulated ₹1,00,000 paper trading wallet, or chat with a specialized financial AI assistant, Stock Saarthi provides an all-in-one experience.

---

## 🚀 Key Features

### 1. 🤖 AI Financial Assistant (Powered by Gemini)
- Interactive, context-aware stock market companion trained on Indian financial markets (NSE, BSE, SEBI regulations).
- Automatically detects mentioned stocks (e.g. *"Should I invest in Reliance or TCS?"*) and dynamically renders live price cards and interactive Chart.js mini charts within the chat stream.
- Supports bilingual Hindi-English (Hinglish) market queries.

### 2. 📊 Live Stock Explorer (NSE & BSE)
- Real-time tracking of top Indian blue-chip stocks and sector leaders (NIFTY 50, NIFTY NEXT 50, Banking, IT, Energy, Auto, Pharma, FMCG, and more).
- Interactive Chart.js sparklines displaying daily price trends for every single stock.
- Deep detail modal displaying comprehensive statistics: Day High/Low, 52-Week Range, Previous Close, Volume, and Market Cap.
- Instant search filter by company name, ticker symbol, or sector.

### 3. 💼 Simulated Paper Trading & Portfolio Wallet
- Automatic ₹1,00,000 initial welcome bonus credited to every new account.
- Real-time Buy & Sell stock order execution with custom quantities and quick-select buttons.
- Real-time profit/loss tracking, average buy price calculation, and portfolio valuation.
- Comprehensive transaction history with deposit, withdrawal, and trade records.

### 4. 🦊 MetaMask Web3 Integration
- One-click MetaMask wallet connection for Ethereum/Polygon account viewing.
- Displays connected wallet address and balance in real time.

### 5. 🌓 Modern UI & Light/Dark Theme
- Sleek glassmorphism and gradient design with smooth micro-animations.
- Full mobile-responsive navigation with hamburger drawer.
- Instant theme toggle between vibrant Light mode and sleek Dark mode, preserved across sessions in `localStorage`.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Modern CSS3 (Variables, Flexbox, Grid), JavaScript (ES6+)
- **Charting**: [Chart.js 4.4](https://www.chartjs.org/)
- **Icons**: [Font Awesome 6](https://fontawesome.com/)
- **AI Integration**: Google Generative AI (Gemini Flash API)
- **Market Data**: Yahoo Finance API with load-balanced proxy failover & offline baseline resilience
- **Web3**: MetaMask Ethereum Provider API (`window.ethereum`)
- **Backend (Optional)**: 
  - Node.js + Express (`server.js`)
  - Python + Flask + yfinance (`flaskbackend.py`)

---

## ⚡ Quick Start

### Option 1: Run directly in any browser (No setup required!)
Simply open `index.html` in your web browser:
```bash
# On Windows PowerShell
Start-Process index.html
```

### Option 2: Run with Node.js Fullstack Server
```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open http://localhost:3000 in your browser
```

### Option 3: Run with Python Flask Backend
```bash
# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Run the Flask server
python flaskbackend.py
```

---

## 📁 Project Structure

```text
stock-saarthi/
├── index.html            # Main dashboard & live stock explorer
├── AI.html               # Gemini-powered AI Assistant chat page
├── profile.html          # Portfolio tracker & trading wallet
├── login.html            # User login page
├── register.html         # User registration page
├── aboutus.html          # About us & mission page
├── contactUS.html        # Contact support & FAQ page
├── privacy.html          # Privacy policy page
├── script.js             # Stock market data engine, search & trading modal
├── ai-assistant.js       # Gemini AI chat engine & chart renderer
├── auth.js               # Authentication, wallet & portfolio manager
├── website.css           # Global stylesheet & design tokens
├── ai-assistant.css      # AI Assistant custom styles & chat bubbles
├── login.css             # Authentication card styles
├── server.js             # Express.js backend & API proxy
├── flaskbackend.py       # Python Flask alternative backend
├── package.json          # Node.js project metadata & scripts
├── requirements.txt      # Python dependencies
└── .gitignore            # Git exclusion rules
```

---

## 👤 Author

**Anurag Tiwari**
- GitHub: [@AnuragTiwari1508](https://github.com/AnuragTiwari1508)
- Repository: [https://github.com/AnuragTiwari1508/stock-saarthi](https://github.com/AnuragTiwari1508/stock-saarthi)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
