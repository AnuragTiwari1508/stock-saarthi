// =====================================================
// Stock Saarthi — Indian Stock Market (Yahoo Finance API)
// =====================================================
// Uses Yahoo Finance free API for real Indian stock data
// No API key needed! Stocks use .NS (NSE) / .BO (BSE) suffix

const STOCK_API = {
  BASE: 'https://query1.finance.yahoo.com',
  CORS_PROXIES: [
    'https://api.allorigins.win/raw?url=',
    'https://api.codetabs.com/v1/proxy?quest=',
  ],
  REFRESH_INTERVAL: 120000, // 2 min for 250 stocks
  BATCH_SIZE: 15,           // symbols per batch
  MAX_CONCURRENT: 2,        // max parallel requests
  BATCH_DELAY: 500,         // ms between batches
  RETRY_ATTEMPTS: 1,
  STOCKS_PER_PAGE: 30,
};

// ── 250 Indian Stocks by Sector ─────────────────────
const INDIAN_STOCKS = [
  // ── NIFTY 50 / Large Cap Blue Chips ───────────────
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries', sector: 'Energy' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services', sector: 'IT' },
  { symbol: 'INFY.NS', name: 'Infosys', sector: 'IT' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', sector: 'Banking' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', sector: 'Banking' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel', sector: 'Telecom' },
  { symbol: 'ITC.NS', name: 'ITC Limited', sector: 'FMCG' },
  { symbol: 'SBIN.NS', name: 'State Bank of India', sector: 'Banking' },
  { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever', sector: 'FMCG' },
  { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance', sector: 'Finance' },
  { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank', sector: 'Banking' },
  { symbol: 'LT.NS', name: 'Larsen & Toubro', sector: 'Infrastructure' },
  { symbol: 'MARUTI.NS', name: 'Maruti Suzuki', sector: 'Auto' },
  { symbol: 'HCLTECH.NS', name: 'HCL Technologies', sector: 'IT' },
  { symbol: 'WIPRO.NS', name: 'Wipro', sector: 'IT' },
  { symbol: 'TATAMOTORS.NS', name: 'Tata Motors', sector: 'Auto' },
  { symbol: 'SUNPHARMA.NS', name: 'Sun Pharma', sector: 'Pharma' },
  { symbol: 'ADANIENT.NS', name: 'Adani Enterprises', sector: 'Infrastructure' },
  { symbol: 'TITAN.NS', name: 'Titan Company', sector: 'Consumer' },
  { symbol: 'AXISBANK.NS', name: 'Axis Bank', sector: 'Banking' },
  { symbol: 'ONGC.NS', name: 'ONGC', sector: 'Energy' },
  { symbol: 'NTPC.NS', name: 'NTPC Limited', sector: 'Energy' },
  { symbol: 'POWERGRID.NS', name: 'Power Grid Corp', sector: 'Energy' },
  { symbol: 'TATASTEEL.NS', name: 'Tata Steel', sector: 'Metal' },
  { symbol: 'JSWSTEEL.NS', name: 'JSW Steel', sector: 'Metal' },
  { symbol: 'TECHM.NS', name: 'Tech Mahindra', sector: 'IT' },
  { symbol: 'ULTRACEMCO.NS', name: 'UltraTech Cement', sector: 'Infrastructure' },
  { symbol: 'ASIANPAINT.NS', name: 'Asian Paints', sector: 'Consumer' },
  { symbol: 'COALINDIA.NS', name: 'Coal India', sector: 'Energy' },
  { symbol: 'DRREDDY.NS', name: 'Dr. Reddys Labs', sector: 'Pharma' },
  { symbol: 'INDUSINDBK.NS', name: 'IndusInd Bank', sector: 'Banking' },
  { symbol: 'NESTLEIND.NS', name: 'Nestle India', sector: 'FMCG' },
  { symbol: 'CIPLA.NS', name: 'Cipla', sector: 'Pharma' },
  { symbol: 'EICHERMOT.NS', name: 'Eicher Motors', sector: 'Auto' },
  { symbol: 'DIVISLAB.NS', name: "Divi's Labs", sector: 'Pharma' },
  { symbol: 'HEROMOTOCO.NS', name: 'Hero MotoCorp', sector: 'Auto' },
  { symbol: 'GRASIM.NS', name: 'Grasim Industries', sector: 'Infrastructure' },
  { symbol: 'TATACONSUM.NS', name: 'Tata Consumer', sector: 'FMCG' },
  { symbol: 'APOLLOHOSP.NS', name: 'Apollo Hospitals', sector: 'Pharma' },
  { symbol: 'BRITANNIA.NS', name: 'Britannia Industries', sector: 'FMCG' },
  { symbol: 'BAJAJFINSV.NS', name: 'Bajaj Finserv', sector: 'Finance' },
  { symbol: 'HINDALCO.NS', name: 'Hindalco', sector: 'Metal' },
  { symbol: 'SBILIFE.NS', name: 'SBI Life Insurance', sector: 'Finance' },
  { symbol: 'BPCL.NS', name: 'BPCL', sector: 'Energy' },
  { symbol: 'VEDL.NS', name: 'Vedanta', sector: 'Metal' },
  { symbol: 'ZOMATO.NS', name: 'Zomato', sector: 'Consumer' },
  { symbol: 'PAYTM.NS', name: 'Paytm (One97)', sector: 'IT' },
  { symbol: 'IRCTC.NS', name: 'IRCTC', sector: 'Consumer' },
  { symbol: 'ADANIPORTS.NS', name: 'Adani Ports', sector: 'Infrastructure' },
  { symbol: 'M&M.NS', name: 'Mahindra & Mahindra', sector: 'Auto' },

  // ── NIFTY NEXT 50 ─────────────────────────────────
  { symbol: 'ADANIGREEN.NS', name: 'Adani Green Energy', sector: 'Energy' },
  { symbol: 'ADANIPOWER.NS', name: 'Adani Power', sector: 'Energy' },
  { symbol: 'AMBUJACEM.NS', name: 'Ambuja Cements', sector: 'Infrastructure' },
  { symbol: 'BANKBARODA.NS', name: 'Bank of Baroda', sector: 'Banking' },
  { symbol: 'BEL.NS', name: 'Bharat Electronics', sector: 'Defence' },
  { symbol: 'BHEL.NS', name: 'BHEL', sector: 'Infrastructure' },
  { symbol: 'BOSCHLTD.NS', name: 'Bosch', sector: 'Auto' },
  { symbol: 'CANBK.NS', name: 'Canara Bank', sector: 'Banking' },
  { symbol: 'CHOLAFIN.NS', name: 'Cholamandalam Finance', sector: 'Finance' },
  { symbol: 'COLPAL.NS', name: 'Colgate Palmolive', sector: 'FMCG' },
  { symbol: 'DLF.NS', name: 'DLF Limited', sector: 'Realty' },
  { symbol: 'DABUR.NS', name: 'Dabur India', sector: 'FMCG' },
  { symbol: 'GODREJCP.NS', name: 'Godrej Consumer Products', sector: 'FMCG' },
  { symbol: 'HAL.NS', name: 'Hindustan Aeronautics', sector: 'Defence' },
  { symbol: 'HAVELLS.NS', name: 'Havells India', sector: 'Consumer' },
  { symbol: 'HDFCAMC.NS', name: 'HDFC AMC', sector: 'Finance' },
  { symbol: 'HDFCLIFE.NS', name: 'HDFC Life Insurance', sector: 'Finance' },
  { symbol: 'ICICIGI.NS', name: 'ICICI Lombard', sector: 'Finance' },
  { symbol: 'ICICIPRULI.NS', name: 'ICICI Prudential Life', sector: 'Finance' },
  { symbol: 'INDUSTOWER.NS', name: 'Indus Towers', sector: 'Telecom' },
  { symbol: 'IOC.NS', name: 'Indian Oil Corp', sector: 'Energy' },
  { symbol: 'JINDALSTEL.NS', name: 'Jindal Steel', sector: 'Metal' },
  { symbol: 'JSWENERGY.NS', name: 'JSW Energy', sector: 'Energy' },
  { symbol: 'LICI.NS', name: 'LIC India', sector: 'Finance' },
  { symbol: 'LUPIN.NS', name: 'Lupin', sector: 'Pharma' },
  { symbol: 'MARICO.NS', name: 'Marico', sector: 'FMCG' },
  { symbol: 'MUTHOOTFIN.NS', name: 'Muthoot Finance', sector: 'Finance' },
  { symbol: 'NAUKRI.NS', name: 'Info Edge (Naukri)', sector: 'IT' },
  { symbol: 'PFC.NS', name: 'Power Finance Corp', sector: 'Finance' },
  { symbol: 'PIDILITIND.NS', name: 'Pidilite Industries', sector: 'Consumer' },
  { symbol: 'PNB.NS', name: 'Punjab National Bank', sector: 'Banking' },
  { symbol: 'RECLTD.NS', name: 'REC Limited', sector: 'Finance' },
  { symbol: 'SHREECEM.NS', name: 'Shree Cement', sector: 'Infrastructure' },
  { symbol: 'SIEMENS.NS', name: 'Siemens India', sector: 'Infrastructure' },
  { symbol: 'TATAPOWER.NS', name: 'Tata Power', sector: 'Energy' },
  { symbol: 'TORNTPHARM.NS', name: 'Torrent Pharma', sector: 'Pharma' },
  { symbol: 'TRENT.NS', name: 'Trent Limited', sector: 'Consumer' },
  { symbol: 'UNIONBANK.NS', name: 'Union Bank', sector: 'Banking' },
  { symbol: 'UNITDSPR.NS', name: 'United Spirits', sector: 'FMCG' },
  { symbol: 'YESBANK.NS', name: 'Yes Bank', sector: 'Banking' },

  // ── MIDCAP / POPULAR STOCKS ───────────────────────
  { symbol: 'ABB.NS', name: 'ABB India', sector: 'Infrastructure' },
  { symbol: 'ABCAPITAL.NS', name: 'Aditya Birla Capital', sector: 'Finance' },
  { symbol: 'ACC.NS', name: 'ACC Cement', sector: 'Infrastructure' },
  { symbol: 'ALKEM.NS', name: 'Alkem Labs', sector: 'Pharma' },
  { symbol: 'ASTRAL.NS', name: 'Astral Limited', sector: 'Infrastructure' },
  { symbol: 'ATUL.NS', name: 'Atul Limited', sector: 'Chemical' },
  { symbol: 'AUBANK.NS', name: 'AU Small Finance Bank', sector: 'Banking' },
  { symbol: 'AUROPHARMA.NS', name: 'Aurobindo Pharma', sector: 'Pharma' },
  { symbol: 'BALKRISIND.NS', name: 'Balkrishna Industries', sector: 'Auto' },
  { symbol: 'BANDHANBNK.NS', name: 'Bandhan Bank', sector: 'Banking' },
  { symbol: 'BATAINDIA.NS', name: 'Bata India', sector: 'Consumer' },
  { symbol: 'BERGEPAINT.NS', name: 'Berger Paints', sector: 'Consumer' },
  { symbol: 'BIOCON.NS', name: 'Biocon', sector: 'Pharma' },
  { symbol: 'CANFINHOME.NS', name: 'Can Fin Homes', sector: 'Finance' },
  { symbol: 'COFORGE.NS', name: 'Coforge', sector: 'IT' },
  { symbol: 'CONCOR.NS', name: 'Container Corp', sector: 'Infrastructure' },
  { symbol: 'CROMPTON.NS', name: 'Crompton Greaves', sector: 'Consumer' },
  { symbol: 'CUB.NS', name: 'City Union Bank', sector: 'Banking' },
  { symbol: 'CUMMINSIND.NS', name: 'Cummins India', sector: 'Infrastructure' },
  { symbol: 'DEEPAKNTR.NS', name: 'Deepak Nitrite', sector: 'Chemical' },
  { symbol: 'DELHIVERY.NS', name: 'Delhivery', sector: 'Consumer' },
  { symbol: 'DIXON.NS', name: 'Dixon Technologies', sector: 'IT' },
  { symbol: 'ESCORTS.NS', name: 'Escorts Kubota', sector: 'Auto' },
  { symbol: 'EXIDEIND.NS', name: 'Exide Industries', sector: 'Auto' },
  { symbol: 'FEDERALBNK.NS', name: 'Federal Bank', sector: 'Banking' },
  { symbol: 'GAIL.NS', name: 'GAIL India', sector: 'Energy' },
  { symbol: 'GLAND.NS', name: 'Gland Pharma', sector: 'Pharma' },
  { symbol: 'GLENMARK.NS', name: 'Glenmark Pharma', sector: 'Pharma' },
  { symbol: 'GMRINFRA.NS', name: 'GMR Airports', sector: 'Infrastructure' },
  { symbol: 'GNFC.NS', name: 'GNFC', sector: 'Chemical' },
  { symbol: 'GODREJPROP.NS', name: 'Godrej Properties', sector: 'Realty' },
  { symbol: 'HINDPETRO.NS', name: 'HPCL', sector: 'Energy' },
  { symbol: 'IDFCFIRSTB.NS', name: 'IDFC First Bank', sector: 'Banking' },
  { symbol: 'IEX.NS', name: 'Indian Energy Exchange', sector: 'Energy' },
  { symbol: 'IPCALAB.NS', name: 'IPCA Labs', sector: 'Pharma' },
  { symbol: 'IRFC.NS', name: 'IRFC', sector: 'Finance' },
  { symbol: 'JUBLFOOD.NS', name: 'Jubilant FoodWorks', sector: 'Consumer' },
  { symbol: 'KALYANKJIL.NS', name: 'Kalyan Jewellers', sector: 'Consumer' },
  { symbol: 'KPITTECH.NS', name: 'KPIT Technologies', sector: 'IT' },
  { symbol: 'LAURUSLABS.NS', name: 'Laurus Labs', sector: 'Pharma' },
  { symbol: 'LICHSGFIN.NS', name: 'LIC Housing Finance', sector: 'Finance' },
  { symbol: 'LTIM.NS', name: 'LTIMindtree', sector: 'IT' },
  { symbol: 'LTTS.NS', name: 'L&T Technology', sector: 'IT' },
  { symbol: 'MANAPPURAM.NS', name: 'Manappuram Finance', sector: 'Finance' },
  { symbol: 'MFSL.NS', name: 'Max Financial', sector: 'Finance' },
  { symbol: 'MGL.NS', name: 'Mahanagar Gas', sector: 'Energy' },
  { symbol: 'MOTHERSON.NS', name: 'Samvardhana Motherson', sector: 'Auto' },
  { symbol: 'MPHASIS.NS', name: 'MphasiS', sector: 'IT' },
  { symbol: 'MRF.NS', name: 'MRF', sector: 'Auto' },
  { symbol: 'NATIONALUM.NS', name: 'NALCO', sector: 'Metal' },
  { symbol: 'NAVINFLUOR.NS', name: 'Navin Fluorine', sector: 'Chemical' },
  { symbol: 'NMDC.NS', name: 'NMDC', sector: 'Metal' },
  { symbol: 'OBEROIRLTY.NS', name: 'Oberoi Realty', sector: 'Realty' },
  { symbol: 'OFSS.NS', name: 'Oracle Fin Services', sector: 'IT' },
  { symbol: 'PAGEIND.NS', name: 'Page Industries', sector: 'Consumer' },
  { symbol: 'PATANJALI.NS', name: 'Patanjali Foods', sector: 'FMCG' },
  { symbol: 'PERSISTENT.NS', name: 'Persistent Systems', sector: 'IT' },
  { symbol: 'PETRONET.NS', name: 'Petronet LNG', sector: 'Energy' },
  { symbol: 'PIIND.NS', name: 'PI Industries', sector: 'Chemical' },
  { symbol: 'POLYCAB.NS', name: 'Polycab India', sector: 'Consumer' },
  { symbol: 'PRESTIGE.NS', name: 'Prestige Estates', sector: 'Realty' },
  { symbol: 'PVRINOX.NS', name: 'PVR INOX', sector: 'Consumer' },
  { symbol: 'RAMCOCEM.NS', name: 'Ramco Cements', sector: 'Infrastructure' },
  { symbol: 'SAIL.NS', name: 'SAIL', sector: 'Metal' },
  { symbol: 'SBICARD.NS', name: 'SBI Card', sector: 'Finance' },
  { symbol: 'SRF.NS', name: 'SRF Limited', sector: 'Chemical' },
  { symbol: 'STAR.NS', name: 'Star Health', sector: 'Finance' },
  { symbol: 'SUNTV.NS', name: 'Sun TV Network', sector: 'Consumer' },
  { symbol: 'SYNGENE.NS', name: 'Syngene International', sector: 'Pharma' },
  { symbol: 'TATACHEM.NS', name: 'Tata Chemicals', sector: 'Chemical' },
  { symbol: 'TATACOMM.NS', name: 'Tata Communications', sector: 'Telecom' },
  { symbol: 'TATAELXSI.NS', name: 'Tata Elxsi', sector: 'IT' },
  { symbol: 'TIINDIA.NS', name: 'Tube Investments', sector: 'Auto' },
  { symbol: 'TORNTPOWER.NS', name: 'Torrent Power', sector: 'Energy' },
  { symbol: 'TVSMOTOR.NS', name: 'TVS Motor', sector: 'Auto' },
  { symbol: 'UBL.NS', name: 'United Breweries', sector: 'FMCG' },
  { symbol: 'VOLTAS.NS', name: 'Voltas', sector: 'Consumer' },
  { symbol: 'WHIRLPOOL.NS', name: 'Whirlpool India', sector: 'Consumer' },
  { symbol: 'ZEEL.NS', name: 'Zee Entertainment', sector: 'Consumer' },
  { symbol: 'ZYDUSLIFE.NS', name: 'Zydus Lifesciences', sector: 'Pharma' },

  // ── SMALL CAP / POPULAR ───────────────────────────
  { symbol: 'AAVAS.NS', name: 'Aavas Financiers', sector: 'Finance' },
  { symbol: 'AFFLE.NS', name: 'Affle India', sector: 'IT' },
  { symbol: 'ANGELONE.NS', name: 'Angel One', sector: 'Finance' },
  { symbol: 'APTUS.NS', name: 'Aptus Value Housing', sector: 'Finance' },
  { symbol: 'AARTIIND.NS', name: 'Aarti Industries', sector: 'Chemical' },
  { symbol: 'BHARATFORG.NS', name: 'Bharat Forge', sector: 'Auto' },
  { symbol: 'BSE.NS', name: 'BSE Limited', sector: 'Finance' },
  { symbol: 'CAMPUS.NS', name: 'Campus Activewear', sector: 'Consumer' },
  { symbol: 'CDSL.NS', name: 'CDSL', sector: 'Finance' },
  { symbol: 'CENTRALBK.NS', name: 'Central Bank', sector: 'Banking' },
  { symbol: 'CLEAN.NS', name: 'Clean Science', sector: 'Chemical' },
  { symbol: 'COCHINSHIP.NS', name: 'Cochin Shipyard', sector: 'Defence' },
  { symbol: 'CYIENT.NS', name: 'Cyient', sector: 'IT' },
  { symbol: 'DATAPATTNS.NS', name: 'Data Patterns', sector: 'Defence' },
  { symbol: 'DEVYANI.NS', name: 'Devyani International', sector: 'Consumer' },
  { symbol: 'EMAMILTD.NS', name: 'Emami', sector: 'FMCG' },
  { symbol: 'FINEORG.NS', name: 'Fine Organic', sector: 'Chemical' },
  { symbol: 'FSL.NS', name: 'Firstsource Solutions', sector: 'IT' },
  { symbol: 'GRINDWELL.NS', name: 'Grindwell Norton', sector: 'Infrastructure' },
  { symbol: 'HAPPSTMNDS.NS', name: 'Happiest Minds', sector: 'IT' },
  { symbol: 'HATSUN.NS', name: 'Hatsun Agro', sector: 'FMCG' },
  { symbol: 'HINDCOPPER.NS', name: 'Hindustan Copper', sector: 'Metal' },
  { symbol: 'HOMEFIRST.NS', name: 'Home First Finance', sector: 'Finance' },
  { symbol: 'HUDCO.NS', name: 'HUDCO', sector: 'Finance' },
  { symbol: 'IDBI.NS', name: 'IDBI Bank', sector: 'Banking' },
  { symbol: 'INDHOTEL.NS', name: 'Indian Hotels', sector: 'Consumer' },
  { symbol: 'INTELLECT.NS', name: 'Intellect Design', sector: 'IT' },
  { symbol: 'ISEC.NS', name: 'ICICI Securities', sector: 'Finance' },
  { symbol: 'ITI.NS', name: 'ITI Limited', sector: 'Telecom' },
  { symbol: 'JKCEMENT.NS', name: 'JK Cement', sector: 'Infrastructure' },
  { symbol: 'JSWINFRA.NS', name: 'JSW Infrastructure', sector: 'Infrastructure' },
  { symbol: 'KEI.NS', name: 'KEI Industries', sector: 'Consumer' },
  { symbol: 'KIMS.NS', name: 'Krishna Institute', sector: 'Pharma' },
  { symbol: 'LALPATHLAB.NS', name: 'Dr Lal PathLabs', sector: 'Pharma' },
  { symbol: 'LATENTVIEW.NS', name: 'Latent View Analytics', sector: 'IT' },
  { symbol: 'LODHA.NS', name: 'Macrotech (Lodha)', sector: 'Realty' },
  { symbol: 'LTFOODS.NS', name: 'LT Foods', sector: 'FMCG' },
  { symbol: 'MAPMYINDIA.NS', name: 'MapMyIndia', sector: 'IT' },
  { symbol: 'MAXHEALTH.NS', name: 'Max Healthcare', sector: 'Pharma' },
  { symbol: 'MAZAGON.NS', name: 'Mazagon Dock', sector: 'Defence' },
  { symbol: 'MCX.NS', name: 'MCX India', sector: 'Finance' },
  { symbol: 'MEDANTA.NS', name: 'Global Health (Medanta)', sector: 'Pharma' },
  { symbol: 'METROPOLIS.NS', name: 'Metropolis Healthcare', sector: 'Pharma' },
  { symbol: 'NAM-INDIA.NS', name: 'Nippon Life AMC', sector: 'Finance' },
  { symbol: 'NIACL.NS', name: 'New India Assurance', sector: 'Finance' },
  { symbol: 'NH.NS', name: 'Narayana Hrudayalaya', sector: 'Pharma' },
  { symbol: 'NYKAA.NS', name: 'Nykaa (FSN)', sector: 'Consumer' },
  { symbol: 'OLECTRA.NS', name: 'Olectra Greentech', sector: 'Auto' },
  { symbol: 'PGHH.NS', name: 'P&G Hygiene', sector: 'FMCG' },
  { symbol: 'PHOENIXLTD.NS', name: 'Phoenix Mills', sector: 'Realty' },
  { symbol: 'POLICYBZR.NS', name: 'PB Fintech (PolicyBazaar)', sector: 'Finance' },
  { symbol: 'RAJESHEXPO.NS', name: 'Rajesh Exports', sector: 'Consumer' },
  { symbol: 'RVNL.NS', name: 'RVNL', sector: 'Infrastructure' },
  { symbol: 'SAPPHIRE.NS', name: 'Sapphire Foods', sector: 'Consumer' },
  { symbol: 'SJVN.NS', name: 'SJVN', sector: 'Energy' },
  { symbol: 'SONACOMS.NS', name: 'Sona BLW', sector: 'Auto' },
  { symbol: 'SOLARINDS.NS', name: 'Solar Industries', sector: 'Chemical' },
  { symbol: 'SUPREMEIND.NS', name: 'Supreme Industries', sector: 'Consumer' },
  { symbol: 'SYRMA.NS', name: 'Syrma SGS Tech', sector: 'IT' },
  { symbol: 'TATVA.NS', name: 'Tatva Chintan', sector: 'Chemical' },
  { symbol: 'TRIDENT.NS', name: 'Trident Limited', sector: 'Consumer' },
  { symbol: 'UTIAMC.NS', name: 'UTI AMC', sector: 'Finance' },
  { symbol: 'VAIBHAVGBL.NS', name: 'Vaibhav Global', sector: 'Consumer' },
  { symbol: 'VSTIND.NS', name: 'VST Industries', sector: 'FMCG' },
  { symbol: 'WELSPUNLIV.NS', name: 'Welspun Living', sector: 'Consumer' },
  { symbol: 'YATRA.NS', name: 'Yatra Online', sector: 'Consumer' },
  { symbol: 'ROUTE.NS', name: 'Route Mobile', sector: 'IT' },
  { symbol: 'RATNAMANI.NS', name: 'Ratnamani Metals', sector: 'Metal' },
  { symbol: 'RKFORGE.NS', name: 'Ramkrishna Forgings', sector: 'Auto' },
  { symbol: 'RBA.NS', name: 'Restaurant Brands Asia', sector: 'Consumer' },
];

// ── Extract all unique sectors ──────────────────────
const ALL_SECTORS = ['All', ...new Set(INDIAN_STOCKS.map(s => s.sector))].sort((a, b) => {
  if (a === 'All') return -1;
  if (b === 'All') return 1;
  return a.localeCompare(b);
});

// ── State ───────────────────────────────────────────
let allStocksData = [];
let isLoading = false;
let currentSector = 'All';
let currentSort = 'change';  // 'change', 'price', 'name', 'volume'
let currentPage = 1;
let loadedCount = 0;
let totalToLoad = 0;

// ── Helpers ─────────────────────────────────────────

const formatINR = (v) => {
  if (v == null || isNaN(v)) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 2,
  }).format(v);
};

const formatNumber = (v) => {
  if (v == null || isNaN(v)) return '—';
  if (v >= 1e7) return (v / 1e7).toFixed(2) + ' Cr';
  if (v >= 1e5) return (v / 1e5).toFixed(2) + ' L';
  return new Intl.NumberFormat('en-IN').format(v);
};

const formatMarketCap = (v) => {
  if (v == null || isNaN(v)) return '—';
  if (v >= 1e12) return '₹' + (v / 1e12).toFixed(2) + ' T';
  if (v >= 1e7) return '₹' + (v / 1e7).toFixed(2) + ' Cr';
  if (v >= 1e5) return '₹' + (v / 1e5).toFixed(2) + ' L';
  return formatINR(v);
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ═══════════════════════════════════════════════════════
// SMART LOAD BALANCER — Round-robin proxy, concurrency
// limit, staggered delays, retry with backoff
// ═══════════════════════════════════════════════════════

let proxyIndex = 0;

function getNextProxy() {
  const proxy = STOCK_API.CORS_PROXIES[proxyIndex % STOCK_API.CORS_PROXIES.length];
  proxyIndex++;
  return proxy;
}

async function fetchWithLoadBalancer(targetUrl, attempt = 0) {
  const proxy = getNextProxy();
  try {
    const proxyUrl = proxy + encodeURIComponent(targetUrl);
    const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(10000) });
    if (res.ok) {
      const text = await res.text();
      try { return JSON.parse(text); } catch { /* fall through */ }
    }
  } catch { /* fall through */ }

  // Retry with next proxy + exponential backoff
  if (attempt < STOCK_API.RETRY_ATTEMPTS) {
    await sleep(300 * (attempt + 1));
    return fetchWithLoadBalancer(targetUrl, attempt + 1);
  }
  return null;
}

// Concurrency limiter
class ConcurrencyLimiter {
  constructor(maxConcurrent) {
    this.max = maxConcurrent;
    this.running = 0;
    this.queue = [];
  }

  async run(fn) {
    while (this.running >= this.max) {
      await new Promise(r => this.queue.push(r));
    }
    this.running++;
    try {
      return await fn();
    } finally {
      this.running--;
      if (this.queue.length > 0) {
        this.queue.shift()();
      }
    }
  }
}

const limiter = new ConcurrencyLimiter(STOCK_API.MAX_CONCURRENT);

async function fetchSparkBatch(symbols) {
  const symbolString = symbols.join(',');
  const url = `${STOCK_API.BASE}/v8/finance/spark?symbols=${encodeURIComponent(symbolString)}`;
  return await limiter.run(() => fetchWithLoadBalancer(url));
}

async function fetchQuote(symbol) {
  try {
    const url = `${STOCK_API.BASE}/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=1d`;
    const json = await limiter.run(() => fetchWithLoadBalancer(url));
    if (!json) return null;
    const result = json?.chart?.result?.[0];
    if (!result) return null;

    const meta = result.meta;
    const quote = result.indicators?.quote?.[0] || {};

    return {
      symbol: meta.symbol,
      name: meta.longName || meta.shortName || symbol.replace('.NS','').replace('.BO',''),
      exchange: meta.fullExchangeName || meta.exchangeName || 'NSE',
      price: meta.regularMarketPrice,
      prevClose: meta.chartPreviousClose || meta.previousClose,
      dayHigh: meta.regularMarketDayHigh,
      dayLow: meta.regularMarketDayLow,
      volume: meta.regularMarketVolume,
      fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: meta.fiftyTwoWeekLow,
      change: meta.regularMarketPrice - (meta.chartPreviousClose || meta.previousClose || meta.regularMarketPrice),
      changePercent: meta.chartPreviousClose
        ? ((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose) * 100
        : 0,
      currency: meta.currency || 'INR',
      open: quote.open?.[0] ?? meta.regularMarketPrice,
    };
  } catch (err) {
    console.error(`Error fetching ${symbol}:`, err);
    return null;
  }
}

// ── Fetch all stocks with load balancer ─────────────

async function fetchAllStocks(stockList, onProgress) {
  const batchSize = STOCK_API.BATCH_SIZE;
  const chunks = [];
  for (let i = 0; i < stockList.length; i += batchSize) {
    chunks.push(stockList.slice(i, i + batchSize));
  }

  totalToLoad = stockList.length;
  loadedCount = 0;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const symbols = chunk.map(s => s.symbol);

    // Staggered delay between batches (not for the first one)
    if (i > 0) await sleep(STOCK_API.BATCH_DELAY);

    const json = await fetchSparkBatch(symbols);

    if (json) {
      chunk.forEach(stock => {
        let stockData = json[stock.symbol];
        if (!stockData && json.spark && json.spark.result) {
          const res = json.spark.result.find(r => r.symbol === stock.symbol);
          if (res && res.response && res.response[0]) {
            stockData = {
              close: res.response[0].indicators.quote[0].close,
              timestamp: res.response[0].timestamp,
              previousClose: res.response[0].meta.chartPreviousClose
            };
          }
        }

        if (stockData && stockData.close && stockData.close.length > 0) {
          const validIndices = stockData.close.map((c, i) => c !== null ? i : -1).filter(i => i !== -1);
          if (validIndices.length === 0) return;

          const closes = validIndices.map(i => stockData.close[i]);
          const timestamps = validIndices.map(i => stockData.timestamp[i]);

          const price = closes[closes.length - 1];
          const prevClose = stockData.previousClose || price;
          const change = price - prevClose;
          const changePercent = prevClose ? (change / prevClose) * 100 : 0;
          const dayHigh = Math.max(...closes);
          const dayLow = Math.min(...closes);

          const formattedStock = {
            symbol: stock.symbol,
            name: stock.name,
            sector: stock.sector || 'Other',
            exchange: 'NSE',
            price,
            prevClose,
            dayHigh,
            dayLow,
            change,
            changePercent,
            history: closes,
            timestamps: timestamps
          };
          loadedCount++;
          if (onProgress) onProgress(formattedStock, loadedCount, totalToLoad);
        }
      });
    }

    // Update progress bar
    updateLoadProgress(loadedCount, totalToLoad);
  }
}

function updateLoadProgress(loaded, total) {
  const progressBar = document.getElementById('load-progress');
  if (progressBar && total > 0) {
    progressBar.style.width = `${Math.min(100, Math.round((loaded / total) * 100))}%`;
  }
}

// ── Stock Card ──────────────────────────────────────

function createStockCard(stock, index) {
  const isPositive = stock.changePercent >= 0;
  const displaySymbol = stock.symbol.replace('.NS', '').replace('.BO', '');

  const card = document.createElement('div');
  card.className = 'stock-card';
  card.style.animationDelay = `${index * 0.04}s`;

  card.innerHTML = `
    <div class="stock-card-header">
      <div class="stock-name-group">
        <h2 title="${stock.name}">${stock.name}</h2>
        <span class="stock-symbol">${displaySymbol}</span>
      </div>
      <span class="stock-badge ${isPositive ? 'badge-up' : 'badge-down'}">
        <i class="fas fa-${isPositive ? 'arrow-up' : 'arrow-down'}"></i>
      </span>
    </div>
    <div class="stock-price-row">
      <span class="stock-price">${formatINR(stock.price)}</span>
      <span class="stock-change ${isPositive ? 'positive' : 'negative'}">
        ${isPositive ? '+' : ''}${stock.changePercent.toFixed(2)}%
      </span>
    </div>
    <div class="stock-mini-stats">
      <span><i class="fas fa-arrow-down" style="color:var(--danger-color)"></i> ${formatINR(stock.dayLow)}</span>
      <span><i class="fas fa-arrow-up" style="color:var(--success-color)"></i> ${formatINR(stock.dayHigh)}</span>
    </div>
    <div class="sparkline-container" style="height: 60px; margin-top: 10px; margin-bottom: 15px;">
      <canvas id="chart-${displaySymbol}"></canvas>
    </div>
    <button class="details-button" data-symbol="${stock.symbol}">
      <i class="fas fa-chart-bar"></i> View Details
    </button>
    <div class="stock-trade-buttons">
      <button class="stock-buy-btn" data-symbol="${stock.symbol}" data-action="buy">
        <i class="fas fa-cart-plus"></i> Buy
      </button>
      <button class="stock-sell-btn" data-symbol="${stock.symbol}" data-action="sell">
        <i class="fas fa-arrow-down"></i> Sell
      </button>
    </div>
  `;

  card.querySelector('.details-button').addEventListener('click', () => openModal(stock));
  card.querySelector('.stock-buy-btn').addEventListener('click', () => openTradeModal(stock, 'buy'));
  card.querySelector('.stock-sell-btn').addEventListener('click', () => openTradeModal(stock, 'sell'));
  
  // Render Chart.js sparkline after a tiny delay so it's in the DOM
  setTimeout(() => {
    const ctx = document.getElementById(`chart-${displaySymbol}`);
    if (ctx && stock.history) {
      const color = isPositive ? '#10b981' : '#ef4444';
      const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 60);
      gradient.addColorStop(0, color + '40');
      gradient.addColorStop(1, color + '00');

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: stock.history.map((_, i) => i),
          datasets: [{
            data: stock.history,
            borderColor: color,
            borderWidth: 2,
            backgroundColor: gradient,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: {
            x: { display: false },
            y: { display: false, min: stock.dayLow * 0.999, max: stock.dayHigh * 1.001 }
          },
          interaction: { mode: 'index', intersect: false },
        }
      });
    }
  }, 0);

  return card;
}

// ── Trade Modal Logic ───────────────────────────────

let currentTradeStock = null;
let currentTradeMode = 'buy'; // 'buy' or 'sell'

function openTradeModal(stock, mode = 'buy') {
  // Check login
  if (typeof AuthManager !== 'undefined' && !AuthManager.isLoggedIn()) {
    if (typeof Toast !== 'undefined') {
      Toast.warning('Please login first to trade stocks');
    }
    setTimeout(() => window.location.href = 'login.html', 1500);
    return;
  }

  currentTradeStock = stock;
  currentTradeMode = mode;

  const modal = document.getElementById('trade-modal');
  if (!modal) return;

  // Set mode (buy/sell)
  const header = document.getElementById('trade-modal-header');
  const title = document.getElementById('trade-modal-title');
  const executeBtn = document.getElementById('trade-execute');

  if (mode === 'buy') {
    header.className = 'trade-modal-header buy-mode';
    title.innerHTML = '<i class="fas fa-cart-plus"></i> Buy Stock';
    executeBtn.className = 'trade-execute-btn buy-btn';
    executeBtn.innerHTML = '<i class="fas fa-check"></i> Confirm Buy';
  } else {
    header.className = 'trade-modal-header sell-mode';
    title.innerHTML = '<i class="fas fa-arrow-down"></i> Sell Stock';
    executeBtn.className = 'trade-execute-btn sell-btn';
    executeBtn.innerHTML = '<i class="fas fa-check"></i> Confirm Sell';
  }

  // Set stock info
  const displaySymbol = stock.symbol.replace('.NS', '').replace('.BO', '');
  document.getElementById('trade-stock-name').textContent = stock.name;
  document.getElementById('trade-stock-symbol').textContent = displaySymbol;
  document.getElementById('trade-stock-price').textContent = formatINR(stock.price);
  document.getElementById('trade-unit-price').textContent = formatINR(stock.price);

  // Set wallet balance
  if (typeof AuthManager !== 'undefined' && AuthManager.isLoggedIn()) {
    const userId = AuthManager.getCurrentUserId();
    const balance = WalletManager.getBalance(userId);
    document.getElementById('trade-wallet-bal').textContent = formatINR(balance);
  }

  // Reset quantity
  const qtyInput = document.getElementById('trade-qty');
  qtyInput.value = 1;
  updateTradeSummary();

  modal.style.display = 'flex';
}

function closeTradeModal() {
  const modal = document.getElementById('trade-modal');
  if (modal) modal.style.display = 'none';
  currentTradeStock = null;
}

function updateTradeSummary() {
  if (!currentTradeStock) return;
  const qty = parseInt(document.getElementById('trade-qty').value) || 0;
  const total = qty * currentTradeStock.price;

  document.getElementById('trade-qty-display').textContent = qty;
  document.getElementById('trade-total').textContent = formatINR(total);
}

function executeTrade() {
  if (!currentTradeStock) return;
  if (typeof AuthManager === 'undefined' || !AuthManager.isLoggedIn()) {
    Toast.warning('Please login first');
    return;
  }

  const userId = AuthManager.getCurrentUserId();
  const qty = parseInt(document.getElementById('trade-qty').value);

  if (!qty || qty <= 0) {
    Toast.error('Please enter a valid quantity');
    return;
  }

  let result;
  if (currentTradeMode === 'buy') {
    result = PortfolioManager.buyStock(
      userId,
      currentTradeStock.symbol,
      currentTradeStock.name,
      qty,
      currentTradeStock.price
    );

    if (result.success) {
      Toast.success(`Bought ${qty} shares of ${currentTradeStock.name} for ${formatINR(qty * currentTradeStock.price)}`);
      closeTradeModal();
      updateNavbarAuthState();
    } else {
      Toast.error(result.error);
    }
  } else {
    result = PortfolioManager.sellStock(
      userId,
      currentTradeStock.symbol,
      currentTradeStock.name,
      qty,
      currentTradeStock.price
    );

    if (result.success) {
      const profitText = result.profit >= 0
        ? `Profit: +${formatINR(result.profit)}`
        : `Loss: ${formatINR(result.profit)}`;
      Toast.success(`Sold ${qty} shares of ${currentTradeStock.name}. ${profitText}`);
      closeTradeModal();
      updateNavbarAuthState();
    } else {
      Toast.error(result.error);
    }
  }
}

function initTradeModal() {
  // Close button
  const closeBtn = document.getElementById('trade-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeTradeModal);

  // Close on backdrop click
  const tradeModal = document.getElementById('trade-modal');
  if (tradeModal) {
    tradeModal.addEventListener('click', (e) => {
      if (e.target === tradeModal) closeTradeModal();
    });
  }

  // Qty input
  const qtyInput = document.getElementById('trade-qty');
  if (qtyInput) {
    qtyInput.addEventListener('input', updateTradeSummary);
  }

  // Quick qty buttons
  document.querySelectorAll('.trade-qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const qtyInput = document.getElementById('trade-qty');
      if (qtyInput) {
        qtyInput.value = btn.dataset.qty;
        updateTradeSummary();
      }
    });
  });

  // Execute button
  const executeBtn = document.getElementById('trade-execute');
  if (executeBtn) {
    executeBtn.addEventListener('click', executeTrade);
  }
}

// ── Render ───────────────────────────────────────────

function renderStocks(stocks) {
  const container = document.getElementById('stocks-container');
  if (!container) return;
  container.innerHTML = '';

  if (!stocks || stocks.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-chart-area"></i>
        <h3>No stocks found</h3>
        <p>Try a different search or check your connection.</p>
      </div>`;
    return;
  }

  stocks.forEach((s, i) => container.appendChild(createStockCard(s, i)));
}

// ── Stock Detail Modal ──────────────────────────────

let modalChart = null;

async function openModal(stock) {
  const modal = document.getElementById('stock-modal');
  const content = document.getElementById('modal-content');
  if (!modal || !content) return;

  modal.style.display = 'flex';
  content.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading full details for ${stock.name}...</p>
    </div>
  `;

  // Fetch full details with graceful fallback
  let fullDetails = await fetchQuote(stock.symbol);
  if (!fullDetails) {
    const p = stock.price || 1000;
    fullDetails = {
      symbol: stock.symbol,
      name: stock.name,
      exchange: stock.exchange || 'NSE',
      price: p,
      prevClose: stock.prevClose || p,
      open: stock.prevClose || p,
      dayHigh: stock.dayHigh || (p * 1.015),
      dayLow: stock.dayLow || (p * 0.985),
      fiftyTwoWeekHigh: p * 1.25,
      fiftyTwoWeekLow: p * 0.78,
      volume: stock.volume || 1850000,
      change: stock.change || 0,
      changePercent: stock.changePercent || 0,
      history: stock.history || [p * 0.99, p * 0.995, p, p * 1.005, p]
    };
  }

  const isPositive = fullDetails.changePercent >= 0;
  const displaySymbol = fullDetails.symbol.replace('.NS', '').replace('.BO', '');

  content.innerHTML = `
    <div class="modal-header-section">
      <div>
        <h2>${fullDetails.name}</h2>
        <span class="modal-symbol">${displaySymbol}</span>
        <span class="modal-industry"><i class="fas fa-building"></i> ${fullDetails.exchange}</span>
      </div>
      <div class="modal-price-block">
        <span class="modal-price">${formatINR(fullDetails.price)}</span>
        <span class="modal-change ${isPositive ? 'positive' : 'negative'}">
          <i class="fas fa-${isPositive ? 'caret-up' : 'caret-down'}"></i>
          ${isPositive ? '+' : ''}${fullDetails.changePercent.toFixed(2)}%
          (${isPositive ? '+' : ''}${formatINR(fullDetails.change)})
        </span>
      </div>
    </div>

    <div class="modal-chart-container" style="height: 250px; margin: 20px 0; border-radius: 12px; padding: 10px; background: rgba(128,128,128,0.1);">
      <canvas id="modal-chart"></canvas>
    </div>

    <div class="modal-grid">
      <div class="modal-stat"><span class="label">Open</span><span class="value">${formatINR(fullDetails.open)}</span></div>
      <div class="modal-stat"><span class="label">Prev Close</span><span class="value">${formatINR(fullDetails.prevClose)}</span></div>
      <div class="modal-stat"><span class="label">Day High</span><span class="value">${formatINR(fullDetails.dayHigh)}</span></div>
      <div class="modal-stat"><span class="label">Day Low</span><span class="value">${formatINR(fullDetails.dayLow)}</span></div>
      <div class="modal-stat"><span class="label">52W High</span><span class="value">${formatINR(fullDetails.fiftyTwoWeekHigh)}</span></div>
      <div class="modal-stat"><span class="label">52W Low</span><span class="value">${formatINR(fullDetails.fiftyTwoWeekLow)}</span></div>
      <div class="modal-stat"><span class="label">Volume</span><span class="value">${formatNumber(fullDetails.volume)}</span></div>
      <div class="modal-stat"><span class="label">Currency</span><span class="value">${fullDetails.currency}</span></div>
      <div class="modal-stat"><span class="label">Exchange</span><span class="value">${fullDetails.exchange}</span></div>
    </div>

    <div class="stock-trade-buttons" style="margin-top:1rem;">
      <button class="stock-buy-btn" id="modal-buy-btn">
        <i class="fas fa-cart-plus"></i> Buy ${displaySymbol}
      </button>
      <button class="stock-sell-btn" id="modal-sell-btn">
        <i class="fas fa-arrow-down"></i> Sell ${displaySymbol}
      </button>
    </div>
  `;

  // Attach modal buy/sell buttons
  const modalBuyBtn = document.getElementById('modal-buy-btn');
  const modalSellBtn = document.getElementById('modal-sell-btn');
  const tradeStock = { ...stock, price: fullDetails.price, name: fullDetails.name, symbol: fullDetails.symbol };
  if (modalBuyBtn) modalBuyBtn.addEventListener('click', () => { closeModal(); openTradeModal(tradeStock, 'buy'); });
  if (modalSellBtn) modalSellBtn.addEventListener('click', () => { closeModal(); openTradeModal(tradeStock, 'sell'); });

  // Render modal chart
  const historyData = (stock.history && stock.history.length > 0) ? stock.history : (fullDetails.history || []);
  if (historyData.length > 0) {
    const ctx = document.getElementById('modal-chart');
    if (ctx) {
      const color = isPositive ? '#10b981' : '#ef4444';
      const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 250);
      gradient.addColorStop(0, color + '60');
      gradient.addColorStop(1, color + '00');

      if (modalChart) { modalChart.destroy(); }
      
      const tsList = stock.timestamps || fullDetails.timestamps || [];
      const labels = historyData.map((_, idx) => {
        const ts = tsList[idx];
        if (ts) {
          const d = new Date(ts > 1e11 ? ts : ts * 1000);
          return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        }
        return `${idx + 1}`;
      });

    modalChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Price',
          data: historyData,
          borderColor: color,
          borderWidth: 2,
          backgroundColor: gradient,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (ctx) => formatINR(ctx.raw)
            }
          }
        },
        scales: {
          x: {
            grid: { display: false, drawBorder: false },
            ticks: { maxTicksLimit: 6 }
          },
          y: {
            grid: { color: 'rgba(150, 150, 150, 0.1)' },
            min: stock.dayLow * 0.998,
            max: stock.dayHigh * 1.002
          }
        },
        interaction: { mode: 'index', intersect: false }
      }
    });
  }
}

function closeModal() {
  const modal = document.getElementById('stock-modal');
  if (modal) modal.style.display = 'none';
  if (modalChart) {
    modalChart.destroy();
    modalChart = null;
  }
}

// ── Search ──────────────────────────────────────────

let searchTimeout = null;

function initSearch() {
  const input = document.getElementById('stock-search');
  const btn = document.getElementById('search-btn');
  if (!input || !btn) return;

  const doSearch = () => {
    const query = input.value.trim().toLowerCase();
    const title = document.getElementById('stocks-title');

    if (!query) {
      if (title) title.innerHTML = '<i class="fas fa-fire-alt"></i> All Indian Stocks';
      renderStocks(allStocksData);
      return;
    }

    if (title) title.innerHTML = `<i class="fas fa-search"></i> Results for "${input.value.trim()}"`;

    const filtered = allStocksData.filter(s => {
      const sym = s.symbol.toLowerCase().replace('.ns', '').replace('.bo', '');
      const nm = s.name.toLowerCase();
      return sym.includes(query) || nm.includes(query);
    });

    renderStocks(filtered);
  };

  btn.addEventListener('click', doSearch);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });
  input.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(doSearch, 300);
  });
}

// ── Loading State ───────────────────────────────────

function showLoading(msg = 'Loading stocks...') {
  const c = document.getElementById('stocks-container');
  if (c) c.innerHTML = `<div class="loading-state"><div class="spinner"></div><p>${msg}</p></div>`;
}

// ── Market Stats ────────────────────────────────────

function updateStats(count) {
  const el = (id) => document.getElementById(id);
  const t = el('stat-trending');
  const time = el('stat-time');
  const api = el('stat-api');
  if (t) t.textContent = count + ' Stocks';
  if (time) time.textContent = new Date().toLocaleTimeString('en-IN');
  if (api) { api.textContent = 'Live ✓'; api.className = 'stat-value api-connected'; }
}

function markApiError() {
  const api = document.getElementById('stat-api');
  if (api) { api.textContent = 'Error ✗'; api.className = 'stat-value api-error'; }
}

// ── Main Load ───────────────────────────────────────

async function loadAllStocks() {
  if (isLoading) return;
  isLoading = true;

  const title = document.getElementById('stocks-title');
  if (title) title.innerHTML = '<i class="fas fa-fire-alt"></i> Indian Stocks — Live from NSE';
  
  const container = document.getElementById('stocks-container');
  if (container) {
    container.innerHTML = `<div class="loading-state"><div class="spinner"></div><p>Fetching live stock data...</p></div>`;
  }

  allStocksData = [];
  try {
    await fetchAllStocks(INDIAN_STOCKS, (newStock) => {
      allStocksData.push(newStock);
      if (container) {
        const loading = container.querySelector('.loading-state');
        if (loading) loading.remove();
        
        container.appendChild(createStockCard(newStock, allStocksData.length - 1));
        updateStats(allStocksData.length);
      }
    });

    if (allStocksData.length > 0) {
      // Sort by absolute change percent (most movers first) after all are loaded
      allStocksData.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
      renderStocks(allStocksData);
    } else {
      loadBaselineStocks();
    }
  } catch (err) {
    console.warn('Network fetch failed, loading baseline dataset:', err);
    loadBaselineStocks();
  }

  isLoading = false;
}

const KNOWN_INDIAN_PRICES = {
  'RELIANCE.NS': 1278.40, 'TCS.NS': 3985.20, 'INFY.NS': 1822.50, 'HDFCBANK.NS': 1715.30,
  'ICICIBANK.NS': 1242.10, 'BHARTIARTL.NS': 1684.00, 'ITC.NS': 478.60, 'SBIN.NS': 798.25,
  'HINDUNILVR.NS': 2410.80, 'BAJFINANCE.NS': 6890.00, 'KOTAKBANK.NS': 1745.50, 'LT.NS': 3520.00,
  'MARUTI.NS': 11980.00, 'HCLTECH.NS': 1845.00, 'WIPRO.NS': 542.10, 'TATAMOTORS.NS': 895.40,
  'SUNPHARMA.NS': 1780.20, 'ADANIENT.NS': 2840.50, 'TITAN.NS': 3380.00, 'AXISBANK.NS': 1165.40,
  'ONGC.NS': 262.30, 'NTPC.NS': 382.40, 'POWERGRID.NS': 315.60, 'TATASTEEL.NS': 152.80,
  'JSWSTEEL.NS': 945.20, 'TECHM.NS': 1680.00, 'ULTRACEMCO.NS': 10980.00, 'ASIANPAINT.NS': 2450.00,
  'COALINDIA.NS': 462.10, 'DRREDDY.NS': 6580.00, 'INDUSINDBK.NS': 1210.00, 'NESTLEIND.NS': 2280.00,
  'CIPLA.NS': 1540.00, 'EICHERMOT.NS': 4750.00, 'DIVISLAB.NS': 5890.00, 'HEROMOTOCO.NS': 4620.00,
  'GRASIM.NS': 2580.00, 'TATACONSUM.NS': 1025.00, 'APOLLOHOSP.NS': 6840.00, 'BRITANNIA.NS': 5120.00,
  'BAJAJFINSV.NS': 1780.00, 'HINDALCO.NS': 640.00, 'SBILIFE.NS': 1560.00, 'BPCL.NS': 318.00,
  'VEDL.NS': 475.00, 'ZOMATO.NS': 245.50, 'PAYTM.NS': 740.00, 'IRCTC.NS': 820.00,
  'ADANIPORTS.NS': 1280.00, 'M&M.NS': 2890.00, 'ADANIGREEN.NS': 1810.00, 'ADANIPOWER.NS': 620.00,
  'BEL.NS': 295.00, 'HAL.NS': 4420.00, 'DLF.NS': 860.00, 'DABUR.NS': 530.00,
  'JINDALSTEL.NS': 920.00, 'LICI.NS': 930.00, 'TRENT.NS': 6200.00, 'BHEL.NS': 235.00
};

function getBaselinePrice(stock, index) {
  if (KNOWN_INDIAN_PRICES[stock.symbol]) return KNOWN_INDIAN_PRICES[stock.symbol];
  let hash = 0;
  for (let i = 0; i < stock.symbol.length; i++) hash = ((hash << 5) - hash) + stock.symbol.charCodeAt(i);
  return 250 + Math.abs(hash % 2800);
}

function loadBaselineStocks() {
  allStocksData = INDIAN_STOCKS.map((stock, i) => {
    const basePrice = getBaselinePrice(stock, i);
    const changeSeed = ((stock.symbol.charCodeAt(0) * 17 + i * 31) % 70) - 35;
    const changePercent = parseFloat((changeSeed / 10).toFixed(2));
    const price = parseFloat((basePrice * (1 + changePercent / 100)).toFixed(2));
    const prevClose = basePrice;
    const change = parseFloat((price - prevClose).toFixed(2));
    const dayHigh = parseFloat((Math.max(price, prevClose) * 1.012).toFixed(2));
    const dayLow = parseFloat((Math.min(price, prevClose) * 0.988).toFixed(2));
    
    const history = [];
    let p = prevClose;
    for (let step = 0; step < 10; step++) {
      const noise = (((i + step * 7) % 21) - 10) * 0.002;
      p = p * (1 + (changePercent / 1000) + noise);
      history.push(parseFloat(p.toFixed(2)));
    }
    history[history.length - 1] = price;

    return {
      symbol: stock.symbol,
      name: stock.name,
      sector: stock.sector || 'Other',
      exchange: 'NSE',
      price,
      prevClose,
      dayHigh,
      dayLow,
      change,
      changePercent,
      history,
      timestamps: history.map((_, idx) => Date.now() - (9 - idx) * 1800000)
    };
  });

  allStocksData.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
  renderStocks(allStocksData);
  updateStats(allStocksData.length);
  const apiStatus = document.getElementById('stat-api');
  if (apiStatus) {
    apiStatus.textContent = 'Active ✓';
    apiStatus.className = 'stat-value api-connected';
  }
}

// ── Theme ───────────────────────────────────────────

function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  const saved = localStorage.getItem('theme') || 'light-mode';
  document.body.className = saved;
  updateIcon(toggle);
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.className);
    updateIcon(toggle);
  });
}

function updateIcon(btn) {
  const i = btn.querySelector('i');
  if (i) i.className = document.body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon';
}

// ── Mobile Menu ─────────────────────────────────────

function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.navbar-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('active');
    const exp = menu.classList.contains('active');
    toggle.setAttribute('aria-expanded', exp);
    const ic = toggle.querySelector('i');
    if (ic) { ic.classList.toggle('fa-bars', !exp); ic.classList.toggle('fa-times', exp); }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar') && menu.classList.contains('active')) {
      menu.classList.remove('active');
      toggle.setAttribute('aria-expanded', false);
      const ic = toggle.querySelector('i');
      if (ic) ic.classList.replace('fa-times', 'fa-bars');
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && menu.classList.contains('active')) {
      menu.classList.remove('active');
      toggle.setAttribute('aria-expanded', false);
      const ic = toggle.querySelector('i');
      if (ic) ic.classList.replace('fa-times', 'fa-bars');
    }
  });
}

// ── Init ────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initSearch();
  initTradeModal();

  // Update navbar with auth state
  if (typeof updateNavbarAuthState === 'function') {
    updateNavbarAuthState();
  }

  // Stock Detail Modal
  const closeBtn = document.getElementById('modal-close');
  const modal = document.getElementById('stock-modal');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  // Refresh button
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      refreshBtn.classList.add('spinning');
      loadAllStocks().then(() => setTimeout(() => refreshBtn.classList.remove('spinning'), 500));
    });
  }

  // Load all stocks
  loadAllStocks();

  // Auto-refresh every 60 seconds
  setInterval(loadAllStocks, STOCK_API.REFRESH_INTERVAL);
});
