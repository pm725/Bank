import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Grid,
  Box, Button, Card, CardContent, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem,
  Alert, Chip, CircularProgress, Divider
} from '@mui/material';
import { AccountBalanceWallet, Add, Calculate } from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:9090/api';

interface Loan {
  id: number;
  loanNumber: string;
  loanType: string;
  amount: number;
  interestRate: number;
  tenureMonths: number;
  status: string;
  purpose: string;
  emi: number;
  createdAt: string;
  approvedDate: string | null;
}

const Loans: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newLoan, setNewLoan] = useState({
    loanType: 'PERSONAL',
    amount: 100000,
    interestRate: 10.5,
    tenureMonths: 36,
    purpose: ''
  });
  const [emiResult, setEmiResult] = useState<{ emi: number; totalPayment: number; totalInterest: number } | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/loans`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoans(response.data);
    } catch (err: any) {
      setError('Failed to fetch loans');
    } finally {
      setLoading(false);
    }
  };

  const calculateEMI = async () => {
    try {
      const response = await axios.post(`${API_URL}/loans/calculate-emi`, {
        amount: newLoan.amount,
        interestRate: newLoan.interestRate,
        tenureMonths: newLoan.tenureMonths
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmiResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'EMI calculation failed');
    }
  };

  const handleApply = async () => {
    try {
      await axios.post(`${API_URL}/loans/apply`, newLoan, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Loan application submitted successfully!');
      setOpenDialog(false);
      fetchLoans();
      setEmiResult(null);
      setNewLoan({
        loanType: 'PERSONAL',
        amount: 100000,
        interestRate: 10.5,
        tenureMonths: 36,
        purpose: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.error || '❌ Loan application failed');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'warning';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      case 'DISBURSED': return 'info';
      default: return 'default';
    }
  };

  const getLoanTypeIcon = (type: string) => {
    switch(type) {
      case 'HOME': return '🏠';
      case 'AUTO': return '🚗';
      case 'PERSONAL': return '💰';
      case 'EDUCATION': return '📚';
      case 'BUSINESS': return '🏢';
      default: return '💰';
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
          <Typography variant="h4">My Loans</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
            Apply for Loan
          </Button>
        </Box>

        <Grid container spacing={3}>
          {loans.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Card sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary">
                  No loans found. Apply for your first loan!
                </Typography>
              </Card>
            </Grid>
          ) : (
            loans.map((loan) => (
              <Grid size={{ xs: 12, md: 4 }} key={loan.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">
                          {getLoanTypeIcon(loan.loanType)} {loan.loanType}
                        </Typography>
                        <Chip 
                          label={loan.status} 
                          color={getStatusColor(loan.status) as any}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        {loan.loanNumber}
                      </Typography>
                      <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                        Rs. {loan.amount.toLocaleString()}
                      </Typography>
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="textSecondary">
                          Rate: {loan.interestRate}%
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Tenure: {loan.tenureMonths} months
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        EMI: Rs. {loan.emi?.toLocaleString() || 'Calculating...'}
                      </Typography>
                      {loan.purpose && (
                        <Typography variant="caption" color="textSecondary">
                          Purpose: {loan.purpose}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Apply for Loan Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={() => { setOpenDialog(false); setEmiResult(null); }}
          scroll="paper"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Apply for Loan</DialogTitle>
          <DialogContent dividers>
            <TextField
              fullWidth
              select
              label="Loan Type"
              value={newLoan.loanType}
              onChange={(e) => setNewLoan({ ...newLoan, loanType: e.target.value })}
              margin="normal"
            >
              <MenuItem value="PERSONAL">💰 Personal Loan</MenuItem>
              <MenuItem value="HOME">🏠 Home Loan</MenuItem>
              <MenuItem value="AUTO">🚗 Auto Loan</MenuItem>
              <MenuItem value="EDUCATION">📚 Education Loan</MenuItem>
              <MenuItem value="BUSINESS">🏢 Business Loan</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={newLoan.amount}
              onChange={(e) => setNewLoan({ ...newLoan, amount: parseFloat(e.target.value) || 0 })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Interest Rate (%)"
              type="number"
              value={newLoan.interestRate}
              onChange={(e) => setNewLoan({ ...newLoan, interestRate: parseFloat(e.target.value) || 0 })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Tenure (months)"
              type="number"
              value={newLoan.tenureMonths}
              onChange={(e) => setNewLoan({ ...newLoan, tenureMonths: parseInt(e.target.value) || 0 })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Purpose"
              value={newLoan.purpose}
              onChange={(e) => setNewLoan({ ...newLoan, purpose: e.target.value })}
              margin="normal"
              multiline
              rows={2}
              placeholder="What is this loan for?"
            />
            <Button 
              variant="outlined" 
              startIcon={<Calculate />} 
              onClick={calculateEMI}
              sx={{ mt: 2 }}
            >
              Calculate EMI
            </Button>
            {emiResult && (
              <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>📊 EMI Details</Typography>
                <Typography><strong>Monthly EMI:</strong> Rs. {emiResult.emi.toLocaleString()}</Typography>
                <Typography><strong>Total Payment:</strong> Rs. {emiResult.totalPayment.toLocaleString()}</Typography>
                <Typography><strong>Total Interest:</strong> Rs. {emiResult.totalInterest.toLocaleString()}</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setOpenDialog(false); setEmiResult(null); }}>Cancel</Button>
            <Button variant="contained" onClick={handleApply}>Apply for Loan</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Loans;