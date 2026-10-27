// =====================================================
// Stock Saarthi — Auth, Wallet, Portfolio & Transactions
// =====================================================
// All data stored in localStorage. Simulated trading.

// ── Utilities ───────────────────────────────────────
function generateId() {
  return 'ss_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
}

function hashPassword(password) {
  // Simple hash for demo — NOT secure for production
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36);
}

// ══════════════════════════════════════════════════════
// AUTH MANAGER
// ══════════════════════════════════════════════════════
const AuthManager = {
  USERS_KEY: 'ss_users',
  CURRENT_USER_KEY: 'ss_current_user',
  STARTING_BALANCE: 100000, // ₹1,00,000

  _getUsers() {
    try { return JSON.parse(localStorage.getItem(this.USERS_KEY)) || []; }
    catch { return []; }
  },

  _saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  },

  register(fullName, email, username, password) {
    const users = this._getUsers();

    // Check existing username
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: 'Username already exists' };
    }

    // Check existing email
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email already registered' };
    }

    const user = {
      id: generateId(),
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      username: username.trim(),
      password: hashPassword(password),
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    this._saveUsers(users);

    // Initialize wallet with starting balance
    WalletManager.initWallet(user.id, this.STARTING_BALANCE);

    // Initialize empty portfolio
    PortfolioManager.initPortfolio(user.id);

    // Record initial deposit
    if (this.STARTING_BALANCE > 0) {
      TransactionManager.addTransaction(user.id, {
        type: 'DEPOSIT',
        symbol: null,
        stockName: 'Welcome Bonus',
        qty: null,
        price: null,
        total: this.STARTING_BALANCE,
      });
    }

    // Auto login
    this.setCurrentUser(user.id);

    return { success: true, user };
  },

  login(username, password) {
    const users = this._getUsers();
    const user = users.find(
      u => u.username.toLowerCase() === username.toLowerCase() &&
           u.password === hashPassword(password)
    );

    if (!user) {
      return { success: false, error: 'Invalid username or password' };
    }

    this.setCurrentUser(user.id);
    return { success: true, user };
  },

  logout() {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  },

  setCurrentUser(userId) {
    localStorage.setItem(this.CURRENT_USER_KEY, userId);
  },

  getCurrentUserId() {
    return localStorage.getItem(this.CURRENT_USER_KEY);
  },

  getCurrentUser() {
    const userId = this.getCurrentUserId();
    if (!userId) return null;
    const users = this._getUsers();
    return users.find(u => u.id === userId) || null;
  },

  isLoggedIn() {
    return !!this.getCurrentUser();
  },

  // Returns user-safe object (no password)
  getUserProfile() {
    const user = this.getCurrentUser();
    if (!user) return null;
    const { password, ...profile } = user;
    return profile;
  },
};

// ══════════════════════════════════════════════════════
// WALLET MANAGER
// ══════════════════════════════════════════════════════
const WalletManager = {
  _key(userId) { return `ss_wallet_${userId}`; },

  initWallet(userId, startingBalance = 0) {
    const wallet = {
      balance: startingBalance,
      totalDeposited: startingBalance,
      totalWithdrawn: 0,
    };
    localStorage.setItem(this._key(userId), JSON.stringify(wallet));
    return wallet;
  },

  getWallet(userId) {
    try {
      const data = localStorage.getItem(this._key(userId));
      if (!data) return this.initWallet(userId);
      return JSON.parse(data);
    } catch { return this.initWallet(userId); }
  },

  _saveWallet(userId, wallet) {
    localStorage.setItem(this._key(userId), JSON.stringify(wallet));
  },

  getBalance(userId) {
    return this.getWallet(userId).balance;
  },

  addFunds(userId, amount) {
    if (amount <= 0) return { success: false, error: 'Amount must be positive' };
    if (amount > 10000000) return { success: false, error: 'Maximum deposit limit is ₹1,00,00,000' };

    const wallet = this.getWallet(userId);
    wallet.balance += amount;
    wallet.totalDeposited += amount;
    this._saveWallet(userId, wallet);

    TransactionManager.addTransaction(userId, {
      type: 'DEPOSIT',
      symbol: null,
      stockName: 'Funds Added',
      qty: null,
      price: null,
      total: amount,
    });

    return { success: true, newBalance: wallet.balance };
  },

  withdraw(userId, amount) {
    if (amount <= 0) return { success: false, error: 'Amount must be positive' };

    const wallet = this.getWallet(userId);
    if (amount > wallet.balance) {
      return { success: false, error: 'Insufficient balance' };
    }

    wallet.balance -= amount;
    wallet.totalWithdrawn += amount;
    this._saveWallet(userId, wallet);

    TransactionManager.addTransaction(userId, {
      type: 'WITHDRAWAL',
      symbol: null,
      stockName: 'Funds Withdrawn',
      qty: null,
      price: null,
      total: amount,
    });

    return { success: true, newBalance: wallet.balance };
  },

  deduct(userId, amount) {
    const wallet = this.getWallet(userId);
    if (amount > wallet.balance) return false;
    wallet.balance -= amount;
    this._saveWallet(userId, wallet);
    return true;
  },

  credit(userId, amount) {
    const wallet = this.getWallet(userId);
    wallet.balance += amount;
    this._saveWallet(userId, wallet);
    return true;
  },
};

// ══════════════════════════════════════════════════════
// PORTFOLIO MANAGER
// ══════════════════════════════════════════════════════
const PortfolioManager = {
  _key(userId) { return `ss_portfolio_${userId}`; },

  initPortfolio(userId) {
    localStorage.setItem(this._key(userId), JSON.stringify({}));
    return {};
  },

  getPortfolio(userId) {
    try {
      const data = localStorage.getItem(this._key(userId));
      if (!data) return this.initPortfolio(userId);
      return JSON.parse(data);
    } catch { return this.initPortfolio(userId); }
  },

  _savePortfolio(userId, portfolio) {
    localStorage.setItem(this._key(userId), JSON.stringify(portfolio));
  },

  getHoldings(userId) {
    const portfolio = this.getPortfolio(userId);
    return Object.entries(portfolio).map(([symbol, data]) => ({
      symbol,
      ...data,
    }));
  },

  buyStock(userId, symbol, stockName, qty, pricePerUnit) {
    const totalCost = qty * pricePerUnit;

    // Check wallet balance
    const balance = WalletManager.getBalance(userId);
    if (totalCost > balance) {
      return { success: false, error: `Insufficient balance. Need ${formatINRValue(totalCost)}, have ${formatINRValue(balance)}` };
    }

    // Deduct from wallet
    if (!WalletManager.deduct(userId, totalCost)) {
      return { success: false, error: 'Failed to deduct from wallet' };
    }

    // Update portfolio
    const portfolio = this.getPortfolio(userId);
    if (portfolio[symbol]) {
      // Average down/up
      const existing = portfolio[symbol];
      const totalQty = existing.qty + qty;
      const totalInvested = existing.totalInvested + totalCost;
      portfolio[symbol] = {
        name: stockName,
        qty: totalQty,
        avgPrice: totalInvested / totalQty,
        totalInvested,
      };
    } else {
      portfolio[symbol] = {
        name: stockName,
        qty,
        avgPrice: pricePerUnit,
        totalInvested: totalCost,
      };
    }

    this._savePortfolio(userId, portfolio);

    // Record transaction
    TransactionManager.addTransaction(userId, {
      type: 'BUY',
      symbol,
      stockName,
      qty,
      price: pricePerUnit,
      total: totalCost,
    });

    return {
      success: true,
      holding: portfolio[symbol],
      newBalance: WalletManager.getBalance(userId),
    };
  },

  sellStock(userId, symbol, stockName, qty, pricePerUnit) {
    const portfolio = this.getPortfolio(userId);

    if (!portfolio[symbol] || portfolio[symbol].qty < qty) {
      const held = portfolio[symbol]?.qty || 0;
      return { success: false, error: `Insufficient holdings. You have ${held} shares of ${stockName}` };
    }

    const totalCredit = qty * pricePerUnit;
    const holding = portfolio[symbol];

    // Calculate proportional investment being sold
    const investmentSold = (qty / holding.qty) * holding.totalInvested;

    // Update portfolio
    holding.qty -= qty;
    holding.totalInvested -= investmentSold;

    if (holding.qty <= 0) {
      delete portfolio[symbol];
    } else {
      holding.avgPrice = holding.totalInvested / holding.qty;
    }

    this._savePortfolio(userId, portfolio);

    // Credit wallet
    WalletManager.credit(userId, totalCredit);

    // Record transaction
    TransactionManager.addTransaction(userId, {
      type: 'SELL',
      symbol,
      stockName,
      qty,
      price: pricePerUnit,
      total: totalCredit,
    });

    return {
      success: true,
      holding: portfolio[symbol] || null,
      newBalance: WalletManager.getBalance(userId),
      profit: totalCredit - investmentSold,
    };
  },

  getPortfolioSummary(userId) {
    const holdings = this.getHoldings(userId);
    const totalInvested = holdings.reduce((sum, h) => sum + h.totalInvested, 0);
    return {
      holdings,
      totalInvested,
      stockCount: holdings.length,
      totalShares: holdings.reduce((sum, h) => sum + h.qty, 0),
    };
  },
};

// ══════════════════════════════════════════════════════
// TRANSACTION MANAGER
// ══════════════════════════════════════════════════════
const TransactionManager = {
  _key(userId) { return `ss_transactions_${userId}`; },

  getTransactions(userId) {
    try {
      const data = localStorage.getItem(this._key(userId));
      if (!data) return [];
      return JSON.parse(data);
    } catch { return []; }
  },

  _saveTransactions(userId, txns) {
    localStorage.setItem(this._key(userId), JSON.stringify(txns));
  },

  addTransaction(userId, txn) {
    const txns = this.getTransactions(userId);
    txns.unshift({
      id: generateId(),
      ...txn,
      timestamp: new Date().toISOString(),
    });
    this._saveTransactions(userId, txns);
  },

  filterByType(userId, type) {
    return this.getTransactions(userId).filter(t => t.type === type);
  },

  getRecentTransactions(userId, count = 20) {
    return this.getTransactions(userId).slice(0, count);
  },
};

// ── Helper for formatting (used in error messages) ──
function formatINRValue(v) {
  if (v == null || isNaN(v)) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 2,
  }).format(v);
}

// ── Toast Notification System ───────────────────────
const Toast = {
  show(message, type = 'info', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle',
    };

    toast.innerHTML = `
      <i class="fas ${icons[type] || icons.info}"></i>
      <span>${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => toast.classList.add('toast-visible'));

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('toast-visible');
      toast.classList.add('toast-hiding');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  },

  success(msg) { this.show(msg, 'success'); },
  error(msg) { this.show(msg, 'error', 5000); },
  warning(msg) { this.show(msg, 'warning', 4000); },
  info(msg) { this.show(msg, 'info'); },
};

// ── Navbar Auth State ───────────────────────────────
function updateNavbarAuthState() {
  const loginLink = document.querySelector('a.navbar-item[href="login.html"]');
  if (!loginLink) return;

  const user = AuthManager.getCurrentUser();

  if (user) {
    // Replace login link with user info
    loginLink.innerHTML = `<i class="fas fa-user-circle"></i> ${user.fullName.split(' ')[0]}`;
    loginLink.href = 'profile.html';

    // Add wallet balance indicator next to the wallet link
    const walletLink = document.querySelector('a.navbar-item[href="profile.html"]');
    if (walletLink && !walletLink.dataset.balanceShown) {
      const balance = WalletManager.getBalance(user.id);
      walletLink.innerHTML = `<i class="fas fa-wallet"></i> ₹${formatCompactNumber(balance)}`;
      walletLink.dataset.balanceShown = 'true';
    }
  }
}

function formatCompactNumber(num) {
  if (num >= 10000000) return (num / 10000000).toFixed(1) + 'Cr';
  if (num >= 100000) return (num / 100000).toFixed(1) + 'L';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toFixed(0);
}

// Auto-update navbar on page load
document.addEventListener('DOMContentLoaded', () => {
  updateNavbarAuthState();
});
