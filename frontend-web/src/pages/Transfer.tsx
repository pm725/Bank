import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Box, Paper,
  TextField, Button, MenuItem, Alert, InputAdornment
} from '@mui/material';
import { Send } from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:9090/api';

interface Account {
  id: number;
  accountNumber: string;
  accountType: string;
  balance: number;
}

interface TransferFormData {
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
  description: string;
  transactionType: string;
}

const Transfer: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [formData, setFormData] = useState<TransferFormData>({
    fromAccountNumber: '',
    toAccountNumber: '',
    amount: 0,
    description: '',
    transactionType: 'TRANSFER'
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API_URL}/accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccounts(response.data);
      // Set default from account
      if (response.data.length > 0) {
        setFormData(prev => ({
          ...prev,
          fromAccountNumber: response.data[0].accountNumber
        }));
      }
    } catch (err) {
      setError('Failed to fetch accounts');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/transactions/transfer`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(`✅ Transfer successful! Rs. ${formData.amount.toLocaleString()} sent to ${formData.toAccountNumber}`);
      setFormData({
        ...formData,
        amount: 0,
        description: ''
      });
      // Refresh account balances
      fetchAccounts();
    } catch (err: any) {
      setError(err.response?.data?.error || '❌ Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  // Get balance for selected account
  const getSelectedAccountBalance = () => {
    const account = accounts.find(acc => acc.accountNumber === formData.fromAccountNumber);
    return account ? account.balance : 0;
  };

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
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            <Send sx={{ mr: 1 }} /> Transfer Money
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Send money to another account instantly
          </Typography>

          {message && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMessage('')}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

          {accounts.length === 0 ? (
            <Alert severity="warning">
              You don't have any accounts. Please create an account first.
            </Alert>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                select
                label="From Account"
                name="fromAccountNumber"
                value={formData.fromAccountNumber}
                onChange={handleChange}
                margin="normal"
                required
                helperText={`Available balance: Rs. ${getSelectedAccountBalance().toLocaleString()}`}
              >
                {accounts.map((acc) => (
                  <MenuItem key={acc.id} value={acc.accountNumber}>
                    {acc.accountNumber} - {acc.accountType} (Rs. {acc.balance.toLocaleString()})
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="To Account Number"
                name="toAccountNumber"
                value={formData.toAccountNumber}
                onChange={handleChange}
                margin="normal"
                required
                placeholder="Enter recipient account number"
              />

              <TextField
                fullWidth
                label="Amount"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                margin="normal"
                required
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                  }
                }}
                helperText={`Max: Rs. ${getSelectedAccountBalance().toLocaleString()}`}
              />

              <TextField
                fullWidth
                select
                label="Transaction Type"
                name="transactionType"
                value={formData.transactionType}
                onChange={handleChange}
                margin="normal"
              >
                <MenuItem value="TRANSFER">⚡ Instant Transfer</MenuItem>
                <MenuItem value="NEFT">🏦 NEFT (2-4 hours)</MenuItem>
                <MenuItem value="RTGS">💎 RTGS (Real-time)</MenuItem>
                <MenuItem value="IMPS">📱 IMPS (Instant)</MenuItem>
              </TextField>

              <TextField
                fullWidth
                label="Description (Optional)"
                name="description"
                value={formData.description}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={2}
                placeholder="What's this transfer for?"
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 3 }}
                disabled={loading || !formData.toAccountNumber || formData.amount <= 0}
              >
                {loading ? 'Processing...' : 'Send Money'}
              </Button>
            </form>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default Transfer;