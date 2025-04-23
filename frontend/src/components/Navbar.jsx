import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Divider,
  useScrollTrigger,
  Slide,
  CssBaseline,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  TrendingUp,
  ShowChart,
  Login,
  Logout,
  PersonAdd
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';

const AnimatedButton = styled(Button)({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
});

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    navigate('/login');
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem 
        onClick={() => {
          handleMenuClose();
          navigate('/profile');
        }}
      >
        <AccountCircle sx={{ mr: 1 }} /> Profile
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <Logout sx={{ mr: 1 }} /> Logout
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem component={Link} to="/news">
        <IconButton size="large" color="inherit">
          <TrendingUp />
        </IconButton>
        <p>Market News</p>
      </MenuItem>
      <MenuItem component="a" href="https://sujal-85-stock-price-prediction-project-app-cwvodq.streamlit.app/" target="_blank" rel="noopener noreferrer">
        <IconButton size="large" color="inherit">
          <ShowChart />
        </IconButton>
        <p>Predictions</p>
      </MenuItem>
      {user ? (
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }} src="/broken-image.jpg">
              {user?.name?.charAt(0) || ''}
            </Avatar>
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      ) : (
        <>
          <MenuItem component={Link} to="/login">
            <IconButton size="large" color="inherit">
              <Login />
            </IconButton>
            <p>Login</p>
          </MenuItem>
          <MenuItem component={Link} to="/register">
            <IconButton size="large" color="inherit">
              <PersonAdd />
            </IconButton>
            <p>Register</p>
          </MenuItem>
        </>
      )}
    </Menu>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <CssBaseline />
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          sx={{ 
            background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Logo/Brand */}
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                background: 'linear-gradient(45deg, #4fc3f7 30%, #00acc1 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              StockSense
            </Typography>

            <Box sx={{ flexGrow: 1 }} />
            
            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              <AnimatedButton 
                component={Link} 
                to="/news" 
                color="inherit"
                startIcon={<TrendingUp />}
                sx={{ 
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Market News
              </AnimatedButton>
              
              <AnimatedButton 
              component={Link}
              to="/stock-chart"  // This should match your route path
              color="inherit"
              startIcon={<ShowChart />}
              sx={{ 
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Predictions
            </AnimatedButton>

              {user ? (
                <>
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                    sx={{ ml: 1 }}
                  >
                    <Avatar sx={{ width: 32, height: 32 }} src="/broken-image.jpg">
                      {user.name.charAt(0)}
                    </Avatar>
                  </IconButton>
                </>
              ) : (
                <>
                  <AnimatedButton 
                    component={Link} 
                    to="/login" 
                    color="inherit"
                    startIcon={<Login />}
                    sx={{ 
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Login
                  </AnimatedButton>
                  <AnimatedButton 
                    component={Link} 
                    to="/register" 
                    color="inherit"
                    startIcon={<PersonAdd />}
                    sx={{ 
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Register
                  </AnimatedButton>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      {renderMobileMenu}
      {renderMenu}
    </>
  );
}