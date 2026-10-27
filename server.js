const express = require('express');
const yahooFinance = require('yahoo-finance2').default;
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();

// Security middleware - disable CSP to allow external CDN scripts (Chart.js, FontAwesome, Google Fonts)
app.use(helmet({
  contentSecurityPolicy: false
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));

// Serve static frontend files
app.use(express.static(__dirname));

// Rate limiting for API routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

const PORT = process.env.PORT || 3000;

// Enhanced stock data route with caching
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

app.get('/api/stock/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    
    // Check cache
    const cached = cache.get(symbol);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return res.json(cached.data);
    }

    const stockData = await yahooFinance.quote(symbol);
    const responseData = {
      symbol: stockData.symbol,
      name: stockData.longName || stockData.shortName || symbol,
      price: stockData.regularMarketPrice,
      changePercent: stockData.regularMarketChangePercent ? stockData.regularMarketChangePercent.toFixed(2) : '0.00',
      change: stockData.regularMarketChange || 0,
      volume: stockData.regularMarketVolume,
      marketCap: stockData.marketCap,
      dayHigh: stockData.regularMarketDayHigh || stockData.dayHigh,
      dayLow: stockData.regularMarketDayLow || stockData.dayLow,
      fiftyTwoWeekHigh: stockData.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: stockData.fiftyTwoWeekLow,
      currency: stockData.currency || 'INR'
    };

    // Update cache
    cache.set(symbol, {
      timestamp: Date.now(),
      data: responseData
    });

    res.json(responseData);
  } catch (error) {
    console.error(`Error fetching data for ${req.params.symbol}:`, error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

// Fallback to index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Stock Saarthi server running at http://localhost:${PORT}`);
});