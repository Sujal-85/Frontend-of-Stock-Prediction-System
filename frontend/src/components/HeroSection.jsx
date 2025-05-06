import React from 'react';
import { Box, Typography, Button, Container, Tooltip } from '@mui/material';
import { styled } from '@mui/system';
import { useAuth } from '../context/AuthContext';

const HeroContainer = styled(Box)({
  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
  color: 'white',
  padding: '6rem 0',
  borderRadius: '0 0 20px 20px',
  textAlign: 'center',
});

const HeroButton = styled(Button)({
  marginTop: '2rem',
  padding: '12px 32px',
  fontSize: '1.1rem',
  fontWeight: '600',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
  },
});

const HeroSection = () => {
  const { user } = useAuth();
  const isAdmin = user && user.email === 'admin@gmail.com';

  return (
    <HeroContainer>
      <Container maxWidth="md">
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Stock Price Prediction
        </Typography>
        <Typography variant="h5" component="p" sx={{ opacity: 0.9, mb: 2, color:'white', fontWeight:'bold'}}>
          Harness the power of machine learning to forecast stock prices with unprecedented accuracy
        </Typography>
        
        {isAdmin ? (
          <HeroButton
            variant="contained"
            color="secondary"
            size="large"
            href="https://stock-prediction-system-v1.streamlit.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Try Stock Predictor (Admin Access)
          </HeroButton>
        ) : user ? (
          // <Tooltip title="This feature is users">
            <span>
              <HeroButton
                variant="contained"
                color="secondary"
                href="https://user-stock-prediction-ah3p48egrrxjlv3rxustmk.streamlit.app/"
                size="large"
                target="_blank"
                rel="noopener noreferrer"
              >
                Try Stock Predictor
              </HeroButton>
            </span>
          // </Tooltip>
        ) : (
          <Tooltip title="Please login to access the predictor">
            <span>
              <HeroButton
                variant="contained"
                color="secondary"
                size="large"
                disabled
              >
                Try Stock Predictor
              </HeroButton>
            </span>
          </Tooltip>
        )}
      </Container>
    </HeroContainer>
  );
};

export default HeroSection;