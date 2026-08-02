import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Box,
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, TextField, MenuItem,
  Alert, CircularProgress, Button
} from '@mui/material';
import { Receipt, Search } from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:9090/api';

interface Transaction {
  id: number;
  transactionId: string;
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
  type: string;
  status: string;
  description: string;
  transactionDate: string;
  referenceId: string;
}

const History: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState({ type: '', status: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, filter]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data);
    } catch (err: any) {
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = transactions;
    if (filter.type) {
      filtered = filtered.filter(t => t.type === filter.type);
    }
    if (filter.status) {
      filtered = filtered.filter(t => t.status === filter.status);
    }
    setFilteredTransactions(filtered);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'FAILED': return 'error';
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
        <Typography variant="h4" gutterBottom>
          <Receipt sx={{ mr: 1 }} /> Transaction History
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              select
              label="Type"
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              size="small"
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="TRANSFER">Transfer</MenuItem>
              <MenuItem value="NEFT">NEFT</MenuItem>
              <MenuItem value="RTGS">RTGS</MenuItem>
              <MenuItem value="IMPS">IMPS</MenuItem>
            </TextField>
            <TextField
              select
              label="Status"
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              size="small"
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="FAILED">Failed</MenuItem>
            </TextField>
            <Button variant="outlined" onClick={() => setFilter({ type: '', status: '' })}>
              Clear Filters
            </Button>
          </Box>
        </Paper>

        {/* Transactions Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transaction ID</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">No transactions found</TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>{txn.transactionId}</TableCell>
                    <TableCell>{txn.fromAccountNumber}</TableCell>
                    <TableCell>{txn.toAccountNumber}</TableCell>
                    <TableCell>Rs. {txn.amount.toLocaleString()}</TableCell>
                    <TableCell>{txn.type}</TableCell>
                    <TableCell>
                      <Chip label={txn.status} color={getStatusColor(txn.status)} size="small" />
                    </TableCell>
                    <TableCell>
                      {new Date(txn.transactionDate).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default History;