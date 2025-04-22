import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Avatar,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  InputAdornment,
  DialogActions,
  Alert
} from '@mui/material';
import {
  Person,
  Email,
  Logout,
  VerifiedUser,
  Edit,
  Password,
  Close
} from '@mui/icons-material';
import { styled } from '@mui/system';

const ProfileCard = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  marginTop: theme.spacing(2),
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  fontSize: '2.5rem',
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
}));

const Profile = () => {
  const { user, logout, verifyPassword } = useAuth();
  const theme = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [verifyMode, setVerifyMode] = useState(false);
  const [password, setPassword] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogout = () => {
    logout();
  };

  const handleEditClick = () => {
    setVerifyMode(true);
  };

  const handleVerify = async () => {
    try {
      const isValid = await verifyPassword(password);
      if (isValid) {
        setVerifyMode(false);
        setEditMode(true);
        setError('');
      } else {
        setError('Incorrect password');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    }
  };

  const handleSave = () => {
    // Here you would typically call an API to update the user's name
    // For now, we'll just simulate a successful update
    setSuccess('Profile updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
    setEditMode(false);
  };

  const handleCancelEdit = () => {
    setName(user.name);
    setEditMode(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        mt: 8, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        minHeight: '70vh'
      }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          My Profile
        </Typography>
        
        {success && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            {success}
          </Alert>
        )}
        
        {user && (
          <ProfileCard elevation={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ProfileAvatar>
                {user.name.charAt(0).toUpperCase()}
              </ProfileAvatar>
              
              {editMode ? (
                <TextField
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                  label="Full Name"
                  variant="outlined"
                />
              ) : (
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {user.name}
                </Typography>
              )}
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: theme.palette.success.main,
                mt: 1,
                mb: 3
              }}>
                <VerifiedUser fontSize="small" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  Verified Account
                </Typography>
              </Box>
              
              <Divider sx={{ width: '100%', my: 2 }} />
              
              <List sx={{ width: '100%' }}>
                <ListItem>
                  <ListItemIcon>
                    <Person color="primary" />
                  </ListItemIcon>
                  {editMode ? (
                    <ListItemText 
                      primary="Full Name" 
                      secondary={
                        <TextField
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          fullWidth
                          size="small"
                        />
                      } 
                    />
                  ) : (
                    <ListItemText 
                      primary="Full Name" 
                      secondary={user.name} 
                      secondaryTypographyProps={{ color: 'text.primary' }}
                    />
                  )}
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Email color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email Address" 
                    secondary={user.email} 
                    secondaryTypographyProps={{ color: 'text.primary' }}
                  />
                </ListItem>
              </List>
              
              <Box sx={{ 
                display: 'flex', 
                width: '100%', 
                justifyContent: 'space-between',
                mt: 3
              }}>
                {editMode ? (
                  <>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleCancelEdit}
                      startIcon={<Close />}
                      sx={{ mr: 2 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSave}
                      startIcon={<VerifiedUser />}
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleEditClick}
                      startIcon={<Edit />}
                      sx={{ mr: 2 }}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleLogout}
                      startIcon={<Logout />}
                    >
                      Logout
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </ProfileCard>
        )}
      </Box>

      {/* Verification Dialog */}
      <Dialog open={verifyMode} onClose={() => setVerifyMode(false)}>
        <DialogTitle>Verify Your Identity</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please enter your password to edit your profile:
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Password />
                </InputAdornment>
              ),
            }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerifyMode(false)}>Cancel</Button>
          <Button 
            onClick={handleVerify} 
            variant="contained" 
            color="primary"
            disabled={!password}
          >
            Verify
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;