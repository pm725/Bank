import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Grid, Paper,
  Box, Button, Card, CardContent
} from '@mui/material';
import { AccountBalance, Payment, Receipt, Person } from '@mui/icons-material';

interface UserData {
  fullName: string;
  email: string;
  role: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [balance] = useState<number>(250000.50);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

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
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Quick Actions */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, md: 3 }}>
                <Button variant="contained" fullWidth sx={{ height: 80 }}>
                  <Box>
                    <Payment sx={{ fontSize: 30 }} />
                    <Typography>Transfer</Typography>
                  </Box>
                </Button>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Button variant="contained" fullWidth sx={{ height: 80, bgcolor: '#1976d2' }}>
                  <Box>
                    <Receipt sx={{ fontSize: 30 }} />
                    <Typography>History</Typography>
                  </Box>
                </Button>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Button variant="contained" fullWidth sx={{ height: 80, bgcolor: '#2e7d32' }}>
                  <Box>
                    <Person sx={{ fontSize: 30 }} />
                    <Typography>Profile</Typography>
                  </Box>
                </Button>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Button variant="contained" fullWidth sx={{ height: 80, bgcolor: '#ed6c02' }}>
                  <Box>
                    <AccountBalance sx={{ fontSize: 30 }} />
                    <Typography>Accounts</Typography>
                  </Box>
                </Button>
              </Grid>
            </Grid>
          </Grid>
          
          {/* Recent Transactions */}
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
              <Typography color="textSecondary">No transactions yet</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Dashboard;