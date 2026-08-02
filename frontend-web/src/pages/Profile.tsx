import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Box,
  Paper, TextField, Button, Avatar, Alert, CircularProgress
} from '@mui/material';
import { Person } from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:9090/api';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleUpdate = async () => {
    // Placeholder for future profile update
    setMessage('Profile update feature coming soon!');
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            🏦 Mahat Commercial Bank
          </Typography>
          <Button color="inherit" onClick={() => { localStorage.clear(); window.location.href = '/'; }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: '#d32f2f', mb: 2 }}>
              <Person sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h4" gutterBottom>
              My Profile
            </Typography>
          </Box>

          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            fullWidth
            label="Full Name"
            value={user.fullName || ''}
            margin="normal"
            disabled
          />
          <TextField
            fullWidth
            label="Email"
            value={user.email || ''}
            margin="normal"
            disabled
          />
          <TextField
            fullWidth
            label="Role"
            value={user.role || 'CUSTOMER'}
            margin="normal"
            disabled
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleUpdate}
            sx={{ mt: 3 }}
          >
            Update Profile (Coming Soon)
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default Profile;