import React from 'react';
import { Box, Container, Grid, Typography, Divider, Button, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: '#fff',
  padding: theme.spacing(6, 0),
  marginTop: 'auto',
}));

const FooterButton = styled(Button)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.8)',
  textTransform: 'none',
  justifyContent: 'flex-start',
  padding: 0,
  marginBottom: theme.spacing(1),
  '&:hover': {
    color: '#fff',
    backgroundColor: 'transparent',
  },
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  color: '#fff',
  marginRight: theme.spacing(1),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
}));

const Footer = () => {
  return (
    <FooterContainer component="footer">
      <Container maxWidth="lg" >
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              StockSense
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Predicting stock market trends using the power of AI.
            </Typography>
            <Box sx={{ display: 'flex', mt: 2 }}>
              <SocialIconButton href="https://twitter.com" target="_blank" aria-label="Twitter">
                <TwitterIcon />
              </SocialIconButton>
              <SocialIconButton href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
                <LinkedInIcon />
              </SocialIconButton>
              <SocialIconButton href="https://github.com" target="_blank" aria-label="GitHub">
                <GitHubIcon />
              </SocialIconButton>
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Product
            </Typography>
            <FooterButton href="#">Features</FooterButton>
            <FooterButton href="#">Pricing</FooterButton>
            <FooterButton href="#">API</FooterButton>
            <FooterButton href="#">Docs</FooterButton>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Company
            </Typography>
            <FooterButton href="#">About</FooterButton>
            <FooterButton href="#">Blog</FooterButton>
            <FooterButton href="#">Careers</FooterButton>
            <FooterButton href="#">Contact</FooterButton>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

        <Typography variant="body2" align="center" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          © {new Date().getFullYear()} StockSense. All rights reserved.
        </Typography>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
