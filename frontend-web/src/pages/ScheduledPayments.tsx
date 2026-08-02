import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Grid,
  Box, Button, Card, CardContent, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem,
  Alert, Chip, CircularProgress, Divider
} from '@mui/material';
import { Schedule, Add, Delete } from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:9090/api';

interface ScheduledPayment {
  id: number;
  fromAccount?: { id: number; accountNumber: string; };  // ← Made optional
  toAccount?: { id: number; accountNumber: string; };     // ← Made optional
  amount: number;
  description: string;
  frequency: string;
  startDate: string;
  endDate: string;
  lastExecuted: string | null;
  status: string;
}

const ScheduledPayments: React.FC = () => {
  const [payments, setPayments] = useState<ScheduledPayment[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [newPayment, setNewPayment] = useState({
    fromAccountId: '',
    toAccountNumber: '',
    amount: 0,
    description: '',
    frequency: 'MONTHLY',
    startDate: '',
    endDate: ''
  });

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchPayments();
    fetchAccounts();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/scheduled`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(response.data);
    } catch (err: any) {
      setError('Failed to fetch scheduled payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API_URL}/accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccounts(response.data);
    } catch (err) {
      console.error('Failed to fetch accounts');
    }
  };

 const handleCreate = async () => {
  try {
    const payload = {
      fromAccount: { 
        id: parseInt(newPayment.fromAccountId) 
      },
      toAccount: { 
        accountNumber: newPayment.toAccountNumber 
      },
      amount: newPayment.amount,
      description: newPayment.description || 'Scheduled payment',
      frequency: newPayment.frequency,
      startDate: newPayment.startDate,  // ← Just the date, no time
      endDate: newPayment.endDate || null  // ← Just the date, no time
    };

    await axios.post(`${API_URL}/scheduled`, payload, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    setMessage('✅ Scheduled payment created successfully!');
    setOpenDialog(false);
    fetchPayments();
    setNewPayment({
      fromAccountId: '',
      toAccountNumber: '',
      amount: 0,
      description: '',
      frequency: 'MONTHLY',
      startDate: '',
      endDate: ''
    });
  } catch (err: any) {
    console.error('Error:', err.response?.data);
    setError(err.response?.data?.error || 'Failed to create scheduled payment');
  }
};

  const handleCancel = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled payment?')) return;
    
    try {
      await axios.delete(`${API_URL}/scheduled/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Scheduled payment cancelled');
      fetchPayments();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to cancel');
    }
  };

  const getFrequencyLabel = (freq: string) => {
    switch(freq) {
      case 'DAILY': return 'Daily';
      case 'WEEKLY': return 'Weekly';
      case 'MONTHLY': return 'Monthly';
      case 'ONCE': return 'One-time';
      default: return freq;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ACTIVE': return 'success';
      case 'PAUSED': return 'warning';
      case 'COMPLETED': return 'info';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

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
          <Typography variant="h4">
            <Schedule sx={{ mr: 1 }} /> Scheduled Payments
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
            Schedule Payment
          </Button>
        </Box>

        <Grid container spacing={3}>
          {payments.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Card sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary">
                  No scheduled payments. Create your first scheduled payment!
                </Typography>
              </Card>
            </Grid>
          ) : (
            payments.map((payment) => (
              <Grid size={{ xs: 12, md: 6 }} key={payment.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6">
                          Rs. {payment.amount?.toLocaleString() || 0}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {payment.description || 'No description'}
                        </Typography>
                      </Box>
                      <Chip 
                        label={payment.status} 
                        color={getStatusColor(payment.status)}
                        size="small"
                      />
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Grid container spacing={1}>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="textSecondary">From</Typography>
                        <Typography variant="body2">{payment.fromAccount?.accountNumber || 'N/A'}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="textSecondary">To</Typography>
                        <Typography variant="body2">{payment.toAccount?.accountNumber || 'N/A'}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="textSecondary">Frequency</Typography>
                        <Typography variant="body2">{getFrequencyLabel(payment.frequency)}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="textSecondary">Status</Typography>
                        <Typography variant="body2">{payment.status}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="textSecondary">Start Date</Typography>
                        <Typography variant="body2">{payment.startDate ? new Date(payment.startDate).toLocaleDateString() : 'N/A'}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="textSecondary">End Date</Typography>
                        <Typography variant="body2">{payment.endDate ? new Date(payment.endDate).toLocaleDateString() : 'N/A'}</Typography>
                      </Grid>
                    </Grid>

                    {payment.status === 'ACTIVE' && (
                      <Box sx={{ mt: 2 }}>
                        <Button 
                          variant="outlined" 
                          color="error" 
                          size="small"
                          startIcon={<Delete />}
                          onClick={() => handleCancel(payment.id)}
                        >
                          Cancel
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Create Scheduled Payment Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          scroll="paper"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Schedule a Payment</DialogTitle>
          <DialogContent dividers>
            <TextField
              fullWidth
              select
              label="From Account"
              value={newPayment.fromAccountId}
              onChange={(e) => setNewPayment({ ...newPayment, fromAccountId: e.target.value })}
              margin="normal"
              required
            >
              {accounts.map((acc) => (
                <MenuItem key={acc.id} value={acc.id}>
                  {acc.accountNumber} (Rs. {acc.balance.toLocaleString()})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="To Account Number"
              value={newPayment.toAccountNumber}
              onChange={(e) => setNewPayment({ ...newPayment, toAccountNumber: e.target.value })}
              margin="normal"
              required
              placeholder="Enter recipient account number"
            />

            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={newPayment.amount}
              onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) || 0 })}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              select
              label="Frequency"
              value={newPayment.frequency}
              onChange={(e) => setNewPayment({ ...newPayment, frequency: e.target.value })}
              margin="normal"
            >
              <MenuItem value="ONCE">One-time</MenuItem>
              <MenuItem value="DAILY">Daily</MenuItem>
              <MenuItem value="WEEKLY">Weekly</MenuItem>
              <MenuItem value="MONTHLY">Monthly</MenuItem>
            </TextField>

            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={newPayment.startDate}
              onChange={(e) => setNewPayment({ ...newPayment, startDate: e.target.value })}
              margin="normal"
              required
              slotProps={{
                inputLabel: { shrink: true }
              }}
            />

            <TextField
              fullWidth
              label="End Date (Optional)"
              type="date"
              value={newPayment.endDate}
              onChange={(e) => setNewPayment({ ...newPayment, endDate: e.target.value })}
              margin="normal"
              slotProps={{
                inputLabel: { shrink: true }
              }}
            />

            <TextField
              fullWidth
              label="Description (Optional)"
              value={newPayment.description}
              onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
              margin="normal"
              multiline
              rows={2}
              placeholder="What is this payment for?"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleCreate}
              disabled={!newPayment.fromAccountId || !newPayment.toAccountNumber || newPayment.amount <= 0 || !newPayment.startDate}
            >
              Schedule Payment
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default ScheduledPayments;