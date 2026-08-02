import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';

// Temporary placeholder components (we'll build these later)
const Transfer: React.FC = () => <div>Transfer Page (Coming Soon)</div>;
const History: React.FC = () => <div>Transaction History (Coming Soon)</div>;
const Profile: React.FC = () => <div>Profile Page (Coming Soon)</div>;

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/accounts" element={isAuthenticated ? <Accounts /> : <Navigate to="/" />} />
          <Route path="/transfer" element={isAuthenticated ? <Transfer /> : <Navigate to="/" />} />
          <Route path="/history" element={isAuthenticated ? <History /> : <Navigate to="/" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;