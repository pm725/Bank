import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Container, Grid, Box,
  Card, CardContent, Button, Avatar, Divider, Chip,
  List, ListItem, ListItemText, ListItemAvatar,
  Paper, IconButton, Fade, Slide, Stack, LinearProgress,
  Menu, MenuItem, Tooltip
} from '@mui/material';
import {
  AccountBalance, Payment, Receipt, Person,
  AccountBalanceWallet, Schedule, Description,
  TrendingUp, ArrowForward, Logout, Phone,
  Email, Facebook, Twitter, Instagram, LinkedIn,
  LocationOn, Savings, Home, School, CarRental,
  BusinessCenter, Loyalty, Add, ExpandMore, Settings
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:9090/api';

interface Account {
  id: number;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: string;
  status: string;
}

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
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [accountCount, setAccountCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [accountsRes, txnRes] = await Promise.all([
        axios.get(`${API_URL}/accounts`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      const accData = accountsRes.data;
      setAccounts(accData);
      setAccountCount(accData.length);
      const totalBal = accData.reduce((sum: number, acc: any) => sum + acc.balance, 0);
      setBalance(totalBal);
      setTransactions(txnRes.data.slice(0, 5));
    } catch (err) {
      console.log('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'FAILED': return 'error';
      default: return 'default';
    }
  };

  const getAccountTypeIcon = (type: string) => {
    switch(type) {
      case 'SAVINGS': return <Savings />;
      case 'CHECKING': return <AccountBalance />;
      case 'FIXED_DEPOSIT': return <TrendingUp />;
      default: return <AccountBalance />;
    }
  };

  const QuickActionButton = ({ icon, label, color, path }: any) => (
    <Fade in={true} timeout={500}>
      <Button
        variant="contained"
        fullWidth
        sx={{
          height: 80,
          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          borderRadius: 3,
          boxShadow: 3,
          '&:hover': {
            transform: 'translateY(-6px) scale(1.02)',
            boxShadow: 8,
            background: `linear-gradient(135deg, ${color} 0%, ${color} 100%)`,
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onClick={() => navigate(path)}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {icon}
          <Typography variant="caption" sx={{ mt: 0.5, fontWeight: 'bold' }}>
            {label}
          </Typography>
        </Box>
      </Button>
    </Fade>
  );

  const isAdmin = user?.role === 'ADMIN';

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#fafafa' }}>

      {/* ===================== PREMIUM HEADER ===================== */}
      {/* ===================== PREMIUM HEADER WITH CSS LOGO ===================== */}
<AppBar
  position="sticky"
  elevation={2}
  sx={{
    background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 50%, #880e4f 100%)',
    py: 0.5
  }}
>
  <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>

    {/* ===== CSS-ONLY LOGO ===== */}
    <Box
      onClick={() => navigate('/dashboard')}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        cursor: 'pointer',
        backgroundColor: 'rgba(255,255,255,0.08)',
        padding: '4px 16px 4px 12px',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.18)',
          transform: 'scale(1.02)',
        }
      }}
    >
      {/* Circular "M" Icon */}
      <Box
        sx={{
          backgroundColor: 'white',
          width: { xs: 36, sm: 44 },
          height: { xs: 36, sm: 44 },
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          fontSize: { xs: '18px', sm: '22px' },
          color: '#d32f2f',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'rotate(-10deg) scale(1.05)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
          }
        }}
      >
        M
      </Box>

      {/* Bank Name */}
      <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
            letterSpacing: 2,
            color: 'white',
            fontSize: { xs: '1rem', sm: '1.4rem' },
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          MAHAT
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255,255,255,0.85)',
            letterSpacing: 0.8,
            fontSize: { xs: '0.5rem', sm: '0.65rem' },
            fontWeight: 500,
            textTransform: 'uppercase'
          }}
        >
          Commercial Bank
        </Typography>
      </Box>
    </Box>

    {/* Navigation Links (Desktop) */}
    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
      <Button
        color="inherit"
        sx={{ color: 'white', fontWeight: 'bold', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
        onClick={() => navigate('/dashboard')}
      >
        Home
      </Button>
      <Button
        color="inherit"
        sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
        onClick={() => navigate('/accounts')}
      >
        Accounts
      </Button>
      <Button
        color="inherit"
        sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
        onClick={() => navigate('/transfer')}
      >
        Transfer
      </Button>
      <Button
        color="inherit"
        sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
        onClick={() => navigate('/loans')}
      >
        Loans
      </Button>
      <Button
        color="inherit"
        sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
        onClick={() => navigate('/history')}
      >
        History
      </Button>
      {isAdmin && (
        <Button
          color="inherit"
          sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
          onClick={() => navigate('/admin')}
        >
          Admin
        </Button>
      )}
    </Box>

    {/* User Profile */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Tooltip title="Profile & Settings">
        <IconButton
          onClick={handleMenuOpen}
          sx={{ color: 'white', p: 0.5 }}
          size="small"
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: '#fff',
              color: '#d32f2f',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <ExpandMore sx={{ fontSize: 20, ml: 0.5 }} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { mt: 1, minWidth: 200, borderRadius: 2, boxShadow: 4 }
          }
        }}
      >
        <MenuItem sx={{ fontWeight: 'bold', pointerEvents: 'none' }}>
          {user?.fullName || 'User'}
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
          <Person sx={{ mr: 1, fontSize: 20 }} /> My Profile
        </MenuItem>
        <MenuItem onClick={() => { navigate('/accounts'); handleMenuClose(); }}>
          <AccountBalance sx={{ mr: 1, fontSize: 20 }} /> My Accounts
        </MenuItem>
        <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
          <Settings sx={{ mr: 1, fontSize: 20 }} /> Settings
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => { handleLogout(); handleMenuClose(); }}
          sx={{ color: '#d32f2f' }}
        >
          <Logout sx={{ mr: 1, fontSize: 20 }} /> Logout
        </MenuItem>
      </Menu>
    </Box>
  </Toolbar>
</AppBar>

      {/* ===================== MAIN CONTENT ===================== */}
      <Container maxWidth="lg" sx={{ flex: 1, mt: 4, mb: 4 }}>

        {/* ===== HERO SECTION ===== */}
        <Slide direction="down" in={true} timeout={600}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
              borderRadius: 4,
              borderLeft: '6px solid #d32f2f',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
                Welcome back, {user?.fullName?.split(' ')[0] || 'User'}! 👋
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: '70%' }}>
                Here's your financial snapshot – manage your accounts, transfer money, and track your spending.
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                🏦 Mahat Commercial Bank – Your trusted partner in financial growth.
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                right: -50,
                top: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(211, 47, 47, 0.05)',
                zIndex: 0
              }}
            />
          </Paper>
        </Slide>

        {/* ===== STATS ROW ===== */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#d32f2f', width: 56, height: 56 }}>
                  <AccountBalance sx={{ fontSize: 30 }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="textSecondary">Total Balance</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Rs. {balance.toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56 }}>
                  <AccountBalanceWallet sx={{ fontSize: 30 }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="textSecondary">Total Accounts</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {accountCount}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#2e7d32', width: 56, height: 56 }}>
                  <Receipt sx={{ fontSize: 30 }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="textSecondary">Transactions</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {transactions.length}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* ===== ACCOUNT TYPES & QUICK ACTIONS ===== */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Account Types */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Savings /> Your Accounts
              </Typography>
              {accounts.length === 0 ? (
                <Typography color="textSecondary" align="center" sx={{ py: 3 }}>
                  No accounts yet. Open one now!
                </Typography>
              ) : (
                <List dense>
                  {accounts.slice(0, 3).map((acc) => (
                    <ListItem key={acc.id} divider>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#d32f2f' }}>
                          {getAccountTypeIcon(acc.accountType)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={acc.accountNumber}
                        secondary={`${acc.accountType} • ${acc.status}`}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Rs. {acc.balance.toLocaleString()}
                      </Typography>
                    </ListItem>
                  ))}
                  {accounts.length > 3 && (
                    <Button
                      size="small"
                      endIcon={<ArrowForward />}
                      onClick={() => navigate('/accounts')}
                      sx={{ mt: 1 }}
                    >
                      View all {accountCount} accounts
                    </Button>
                  )}
                </List>
              )}
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Add />}
                onClick={() => navigate('/accounts')}
                sx={{ mt: 2 }}
              >
                Open New Account
              </Button>
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                  <QuickActionButton
                    icon={<AccountBalance sx={{ fontSize: 30 }} />}
                    label="Accounts"
                    color="#1976d2"
                    path="/accounts"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                  <QuickActionButton
                    icon={<Payment sx={{ fontSize: 30 }} />}
                    label="Transfer"
                    color="#2e7d32"
                    path="/transfer"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                  <QuickActionButton
                    icon={<Receipt sx={{ fontSize: 30 }} />}
                    label="History"
                    color="#ed6c02"
                    path="/history"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                  <QuickActionButton
                    icon={<Person sx={{ fontSize: 30 }} />}
                    label="Profile"
                    color="#6a1b9a"
                    path="/profile"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                  <QuickActionButton
                    icon={<AccountBalanceWallet sx={{ fontSize: 30 }} />}
                    label="Loans"
                    color="#9c27b0"
                    path="/loans"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                  <QuickActionButton
                    icon={<Schedule sx={{ fontSize: 30 }} />}
                    label="Scheduled"
                    color="#00bcd4"
                    path="/scheduled"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                  <QuickActionButton
                    icon={<Description sx={{ fontSize: 30 }} />}
                    label="Reports"
                    color="#4caf50"
                    path="/reports"
                  />
                </Grid>
                {isAdmin && (
                  <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                    <QuickActionButton
                      icon={<AccountBalance sx={{ fontSize: 30 }} />}
                      label="Admin"
                      color="#e91e63"
                      path="/admin"
                    />
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* ===== LOAN SERVICES SECTION ===== */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 4, mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountBalanceWallet /> Loan Services
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Check out our competitive facilities for different types of loans.
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ borderTop: '4px solid #d32f2f', borderRadius: 2 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Home sx={{ fontSize: 40, color: '#d32f2f' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Home Loan</Typography>
                  <Typography variant="caption" color="textSecondary">Up to 8.5% p.a.</Typography>
                  <Button size="small" sx={{ mt: 1 }} onClick={() => navigate('/loans')}>Apply</Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ borderTop: '4px solid #1976d2', borderRadius: 2 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <CarRental sx={{ fontSize: 40, color: '#1976d2' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Auto Loan</Typography>
                  <Typography variant="caption" color="textSecondary">Up to 9.0% p.a.</Typography>
                  <Button size="small" sx={{ mt: 1 }} onClick={() => navigate('/loans')}>Apply</Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ borderTop: '4px solid #2e7d32', borderRadius: 2 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <School sx={{ fontSize: 40, color: '#2e7d32' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Education Loan</Typography>
                  <Typography variant="caption" color="textSecondary">Up to 7.5% p.a.</Typography>
                  <Button size="small" sx={{ mt: 1 }} onClick={() => navigate('/loans')}>Apply</Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ borderTop: '4px solid #ed6c02', borderRadius: 2 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <BusinessCenter sx={{ fontSize: 40, color: '#ed6c02' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Business Loan</Typography>
                  <Typography variant="caption" color="textSecondary">Up to 10.0% p.a.</Typography>
                  <Button size="small" sx={{ mt: 1 }} onClick={() => navigate('/loans')}>Apply</Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* ===== EXCLUSIVE OFFERS ===== */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Loyalty /> Exclusive Offers
            </Typography>
            <Button size="small" endIcon={<ArrowForward />}>View All Offers</Button>
          </Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ borderRadius: 2, bgcolor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>🎓 Student Discount</Typography>
                  <Typography variant="caption" color="textSecondary">Get 5% off on education loans</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ borderRadius: 2, bgcolor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>🏠 Home Loan Fest</Typography>
                  <Typography variant="caption" color="textSecondary">0% processing fee till Dec 2026</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ borderRadius: 2, bgcolor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>💰 Refer & Earn</Typography>
                  <Typography variant="caption" color="textSecondary">Rs. 500 for each referral</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ borderRadius: 2, bgcolor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>🎁 Birthday Bonus</Typography>
                  <Typography variant="caption" color="textSecondary">Get 1% cashback on birthday</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* ===== RECENT TRANSACTIONS ===== */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Receipt /> Recent Transactions
            </Typography>
            <Button size="small" endIcon={<ArrowForward />} onClick={() => navigate('/history')}>
              View All
            </Button>
          </Box>
          {transactions.length === 0 ? (
            <Typography color="textSecondary" align="center" sx={{ py: 3 }}>
              No recent transactions
            </Typography>
          ) : (
            <List dense>
              {transactions.map((txn) => (
                <ListItem key={txn.id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: txn.type === 'TRANSFER' ? '#1976d2' : '#ed6c02' }}>
                      <Payment />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={txn.description || 'Transfer'}
                    secondary={`${txn.fromAccountNumber} → ${txn.toAccountNumber}`}
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Rs. {txn.amount.toLocaleString()}
                    </Typography>
                    <Chip
                      label={txn.status}
                      color={getStatusColor(txn.status)}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

      </Container>

      {/* ===================== FOOTER ===================== */}
      <Box
        component="footer"
        sx={{
          background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 50%, #880e4f 100%)',
          color: 'white',
          py: 4,
          px: 2,
          mt: 'auto'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                🏦 Mahat Commercial Bank
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                Your trusted partner in financial growth. Secure banking with modern technology.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <IconButton sx={{ color: 'white' }} size="small">
                  <Facebook />
                </IconButton>
                <IconButton sx={{ color: 'white' }} size="small">
                  <Twitter />
                </IconButton>
                <IconButton sx={{ color: 'white' }} size="small">
                  <Instagram />
                </IconButton>
                <IconButton sx={{ color: 'white' }} size="small">
                  <LinkedIn />
                </IconButton>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                <Typography variant="caption" sx={{ opacity: 0.8, cursor: 'pointer' }}>Home</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, cursor: 'pointer' }}>About Us</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, cursor: 'pointer' }}>Services</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, cursor: 'pointer' }}>Careers</Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
                Support
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ fontSize: 16, opacity: 0.8 }} />
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    +977 9876543211
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ fontSize: 16, opacity: 0.8 }} />
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    support@mahatbank.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn sx={{ fontSize: 16, opacity: 0.8 }} />
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Kathmandu, Nepal
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
                Banking Hours
              </Typography>
              <Stack spacing={1}>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Mon-Fri: 9:00 AM – 5:00 PM
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Sat: 10:00 AM – 2:00 PM
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Sun: Closed
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, mt: 1 }}>
                  📞 24/7 Customer Support
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <Typography variant="body2" align="center" sx={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} Mahat Commercial Bank. All rights reserved.
          </Typography>
          <Typography variant="caption" align="center" sx={{ display: 'block', opacity: 0.5, mt: 1 }}>
            Built with ❤️ for the Mahat Bank project
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;