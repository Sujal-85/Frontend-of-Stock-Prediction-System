import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, InputAdornment, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

const FormPaper = styled(Paper)({
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
});

const PredictButton = styled(Button)({
  padding: '12px 24px',
  fontSize: '1rem',
  fontWeight: '600',
  borderRadius: '8px',
  textTransform: 'none',
  marginTop: '1rem',
  width: '100%',
});

// List of valid stock symbols for validation
const VALID_SYMBOLS = ['AAPL', 'MSFT', 'GOOG', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM', 'V', 'WMT'];

const PredictionForm = () => {
  const [symbol, setSymbol] = useState('');
  const [timeframe, setTimeframe] = useState('1m');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStockData = async (symbol) => {
    try {
      // First try Yahoo Finance API
      try {
        const response = await axios.get(
          `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1y`,
          { timeout: 5000 }
        );
        
        const result = response.data.chart.result[0];
        if (result?.indicators?.quote[0]?.close) {
          return {
            symbol: result.meta.symbol,
            prices: result.indicators.quote[0].close.filter(price => price !== null),
            timestamps: result.timestamp
          };
        }
      } catch (yahooError) {
        console.log('Yahoo Finance failed, trying Alpha Vantage');
      }

      // Fallback to Alpha Vantage (you'll need an API key)
      const alphaResponse = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=YOUR_ALPHA_VANTAGE_API_KEY`
      );
      
      if (alphaResponse.data['Time Series (Daily)']) {
        const timeSeries = alphaResponse.data['Time Series (Daily)'];
        const prices = Object.values(timeSeries).map(entry => parseFloat(entry['4. close']));
        return {
          symbol: symbol,
          prices: prices,
          timestamps: Object.keys(timeSeries)
        };
      }

      throw new Error('No valid data received from either API');

    } catch (err) {
      console.error('API Error:', err);
      throw new Error('Failed to fetch stock data. Please check the symbol and try again later.');
    }
  };

  const calculatePrediction = (prices, timeframe) => {
    if (!prices || prices.length < 20) {
      throw new Error('Not enough historical data for prediction');
    }

    const daysToPredict = {
      '1w': 5,
      '1m': 20,
      '3m': 60,
      '1y': 252
    }[timeframe] || 20;
    
    // Use last 30 days for calculation
    const recentPrices = prices.slice(-30);
    const lastPrice = recentPrices[recentPrices.length - 1];
    
    // Calculate simple moving averages
    const sma10 = recentPrices.slice(-10).reduce((sum, price) => sum + price, 0) / 10;
    const sma30 = recentPrices.reduce((sum, price) => sum + price, 0) / 30;
    
    // Calculate momentum
    const momentum = (lastPrice - recentPrices[0]) / recentPrices.length;
    
    // Calculate volatility (standard deviation)
    const avgPrice = recentPrices.reduce((sum, price) => sum + price, 0) / recentPrices.length;
    const variance = recentPrices.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) / recentPrices.length;
    const stdDev = Math.sqrt(variance);
    
    // Prediction based on moving averages and momentum
    const predictedPrice = lastPrice + (momentum * daysToPredict * 0.5);
    
    // Confidence based on volatility and trend consistency
    const confidence = Math.max(10, Math.min(95, 
      80 - (stdDev / lastPrice * 100) + 
      (Math.abs(sma10 - sma30) / lastPrice * 50)));

    return {
      predictedPrice: predictedPrice,
      confidence: confidence.toFixed(1)
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate symbol
    if (!VALID_SYMBOLS.includes(symbol.toUpperCase())) {
      setError('Please enter a valid stock symbol (e.g., AAPL, MSFT)');
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const stockData = await fetchStockData(symbol.toUpperCase());
      const currentPrice = stockData.prices[stockData.prices.length - 1];
      const { predictedPrice, confidence } = calculatePrediction(stockData.prices, timeframe);
      
      setPrediction({
        symbol: stockData.symbol,
        currentPrice: currentPrice.toFixed(2),
        predictedPrice: predictedPrice.toFixed(2),
        confidence: confidence,
        direction: predictedPrice > currentPrice ? 'up' : 'down',
        timeframe
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', my: 4 }}><br/><br/><br/>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Stock Price Predictor
      </Typography>
      
      <FormPaper elevation={3}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Stock Symbol"
                variant="outlined"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="e.g. AAPL, MSFT"
                required
                error={!!error}
                helperText={error ? error : "Supported symbols: AAPL, MSFT, GOOGL, etc."}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Prediction Timeframe"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                variant="outlined"
                SelectProps={{
                  native: true,
                }}
              >
                <option value="1w">1 Week</option>
                <option value="1m">1 Month</option>
                <option value="3m">3 Months</option>
                <option value="1y">1 Year</option>
              </TextField>
            </Grid>
          </Grid>
          
          <PredictButton
            type="submit"
            variant="contained"
            size="large"
            disabled={!symbol || loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Predict Price'}
          </PredictButton>
        </form>
        
        {prediction && (
          <Box sx={{ mt: 4, p: 3, bgcolor: '#f0fdf4', borderRadius: '8px' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              {prediction.symbol} Price Prediction ({timeframeToText(prediction.timeframe)})
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1">Current Price:</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  ${prediction.currentPrice}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Predicted Price:</Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: prediction.direction === 'up' ? '#10b981' : '#ef4444'
                  }}
                >
                  ${prediction.predictedPrice} ({prediction.direction === 'up' ? '↑' : '↓'})
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">Model Confidence:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', mr: 2 }}>
                    <Box 
                      sx={{
                        height: '8px',
                        bgcolor: '#e2e8f0',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <Box 
                        sx={{
                          height: '100%',
                          width: `${prediction.confidence}%`,
                          bgcolor: prediction.confidence > 70 ? '#10b981' : 
                                  prediction.confidence > 40 ? '#f59e0b' : '#ef4444',
                        }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {prediction.confidence}%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Typography variant="caption" display="block" sx={{ mt: 2, color: '#64748b' }}>
              Prediction based on technical analysis of historical price data.
            </Typography>
          </Box>
        )}
      </FormPaper>
    </Box>
  );
};

function timeframeToText(timeframe) {
  const map = {
    '1w': '1 Week',
    '1m': '1 Month',
    '3m': '3 Months',
    '1y': '1 Year'
  };
  return map[timeframe] || timeframe;
}

export default PredictionForm;