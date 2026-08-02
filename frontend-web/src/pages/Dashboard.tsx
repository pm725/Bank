import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Container, Grid, Paper,
  Box, Button, Card, CardContent
} from '@mui/material';
import { AccountBalance, Payment, Receipt, Person, Add } from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:9090/api';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [accountCount, setAccountCount] = useState(0);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API_URL}/accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const accounts = response.data;
      setAccountCount(accounts.length);
      const totalBalance = accounts.reduce((sum: number, acc: any) => sum + acc.balance, 0);
      setBalance(totalBalance);
    } catch (err) {
      console.log('Failed to fetch accounts');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            🏦 Mahat Commercial Bank
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, {user?.fullName || 'User'}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Balance Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ backgroundColor: '#f5f5f5' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccountBalance color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary">Total Balance</Typography>
                    <Typography variant="h4">Rs. {balance.toLocaleString()}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {accountCount} account(s)
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, md: 3 }}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  sx={{ height: 80 }}
                  onClick={() => navigate('/accounts')}
                >
                  <Box>
                    <AccountBalance sx={{ fontSize: 30 }} />
                    <Typography>Accounts</Typography>
                  </Box>
                </Button>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  sx={{ height: 80, bgcolor: '#1976d2' }}
                  onClick={() => navigate('/transfer')}
                >
                  <Box>
                    <Payment sx={{ fontSize: 30 }} />
                    <Typography>Transfer</Typography>
                  </Box>
                </Button>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  sx={{ height: 80, bgcolor: '#2e7d32' }}
                  onClick={() => navigate('/history')}
                >
                  <Box>
                    <Receipt sx={{ fontSize: 30 }} />
                    <Typography>History</Typography>
                  </Box>
                </Button>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  sx={{ height: 80, bgcolor: '#ed6c02' }}
                  onClick={() => navigate('/profile')}
                >
                  <Box>
                    <Person sx={{ fontSize: 30 }} />
                    <Typography>Profile</Typography>
                  </Box>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Dashboard;