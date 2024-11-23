# analysis_utils.py
import yfinance as yf
import pandas as pd
from datetime import datetime
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def analyze_crypto_seasonality(symbol, start_year=2016):
    """Analyze cryptocurrency December-March periods."""
    try:
        # Download data
        crypto = yf.download(
            symbol, 
            start=f'{start_year}-01-01',
            end=datetime.now().strftime('%Y-%m-%d')
        )
        
        # Initialize results storage
        results = []
        
        # Analyze each December-March period
        for year in range(start_year, datetime.now().year + 1):
            period_start = f'{year}-12-01'
            period_end = f'{year+1}-03-01'
            
            # Get data for the period
            period_data = crypto.loc[period_start:period_end]
            
            if not period_data.empty:
                # Calculate metrics
                start_price = period_data['Close'].iloc[0]
                end_price = period_data['Close'].iloc[-1]
                period_return = ((end_price - start_price) / start_price) * 100
                
                # Calculate drawdown
                rolling_max = period_data['Close'].expanding().max()
                drawdown = ((rolling_max - period_data['Close']) / rolling_max * 100).max()
                
                # Calculate volatility (annualized)
                volatility = period_data['Close'].pct_change().std() * 100 * np.sqrt(252)
                
                results.append({
                    "year": f"{year}-{str(year+1)[-2:]}",
                    "return": round(period_return, 2),
                    "drawdown": round(drawdown, 2),
                    "volatility": round(volatility, 2),
                    "startPrice": round(start_price, 2),
                    "endPrice": round(end_price, 2)
                })
    
    except Exception as e:
        print(f"Error analyzing {symbol}: {e}")
        return []
    
    return results

@app.get("/api/crypto-analysis/{symbol}")
async def get_crypto_analysis(symbol: str):
    """API endpoint to get crypto analysis"""
    symbol = f"{symbol}-USD"  # Convert to Yahoo Finance format
    data = analyze_crypto_seasonality(symbol)
    return {"data": data}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)