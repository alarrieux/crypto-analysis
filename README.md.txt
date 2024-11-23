# Crypto Seasonal Analysis Dashboard

This dashboard analyzes cryptocurrency performance during the December-March period across multiple years, helping identify seasonal patterns in the crypto market.

## Features
- Interactive analysis of BTC and ETH performance
- December-March seasonal pattern analysis
- Visual representation of returns, volatility, and drawdowns
- Historical performance metrics
- Easy-to-use interface with asset selection


## Installation

1. Clone the repository
```bash
git clone [your-repository-url]
cd crypto-seasonal-analysis
```

2. Install dependencies
```bash
# Backend dependencies
pip install -r requirements.txt

# Frontend dependencies (if using React version)
npm install
```

3. Run the application
```bash
# For Streamlit version
streamlit run app.py

# For React + FastAPI version
# Terminal 1 - Backend
python analysis_utils.py

# Terminal 2 - Frontend
npm run dev
```

## Environment Setup

Create a `.env` file in the root directory with the following variables:
```
PORT=8000
HOST=localhost
# Add any other configuration variables here
```

## Security Notes
- This application uses public market data from Yahoo Finance
- No API keys or sensitive credentials are required
- The analysis is based on publicly available historical price data

## Data Sources
- Price data: Yahoo Finance API via yfinance
- Analysis period: December-March (configurable)
- Historical range: 2016-present

## Contributing
Feel free to fork this repository and submit pull requests. For major changes, please open an issue first.

## License
MIT License - See LICENSE file for details