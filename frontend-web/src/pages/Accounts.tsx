import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Grid,
  Box, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Alert, Card, CardContent,
  CircularProgress
} from '@mui/material';
import { AccountBalance, Add } from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:9090/api';

interface Account {
  id: number;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: string;
  status: string;
  createdAt: string;
}

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAccount, setNewAccount] = useState({ accountType: 'SAVINGS', initialDeposit: 0 });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccounts(response.data);
    } catch (err: any) {
      setError('Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    try {
      await axios.post(`${API_URL}/accounts`, newAccount, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Account created successfully!');
      setOpenDialog(false);
      fetchAccounts();
      setNewAccount({ accountType: 'SAVINGS', initialDeposit: 0 });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create account');
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (loading) {
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
          <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, {user.fullName || 'User'}
          </Typography>
          <Button color="inherit" onClick={() => { localStorage.clear(); window.location.href = '/'; }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {message && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMessage('')}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">My Accounts</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
            Open New Account
          </Button>
        </Box>

        <Grid container spacing={3}>
          {accounts.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Card sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary">
                  No accounts found. Open your first account!
                </Typography>
              </Card>
            </Grid>
          ) : (
            accounts.map((account) => (
              <Grid size={{ xs: 12, md: 4 }} key={account.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccountBalance color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                      <Box>
                        <Typography color="textSecondary" variant="body2">
                          {account.accountType}
                        </Typography>
                        <Typography variant="h6">{account.accountNumber}</Typography>
                        <Typography variant="h5" color="primary">
                          Rs. {account.balance.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Status: {account.status} • Currency: {account.currency}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Create Account Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          scroll="paper"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Open New Account</DialogTitle>
          <DialogContent dividers>
            <TextField
              fullWidth
              select
              label="Account Type"
              value={newAccount.accountType}
              onChange={(e) => setNewAccount({ ...newAccount, accountType: e.target.value })}
              margin="normal"
            >
              <MenuItem value="SAVINGS">Savings</MenuItem>
              <MenuItem value="CHECKING">Checking</MenuItem>
              <MenuItem value="FIXED_DEPOSIT">Fixed Deposit</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Initial Deposit"
              type="number"
              value={newAccount.initialDeposit}
              onChange={(e) => setNewAccount({ ...newAccount, initialDeposit: parseFloat(e.target.value) || 0 })}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateAccount}>Create Account</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Accounts;