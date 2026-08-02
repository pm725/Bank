import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://localhost:9090/api';

export default function DashboardScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      await fetchAccounts();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_URL}/accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const accounts = response.data;
      const total = accounts.reduce((sum: number, acc: any) => sum + acc.balance, 0);
      setBalance(total);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAccounts();
    setRefreshing(false);
  };

  const MenuButton = ({ title, icon, onPress, color = '#d32f2f' }: any) => (
    <TouchableOpacity style={[styles.menuButton, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={styles.menuText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, {user?.fullName || 'User'}!</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>Rs. {balance.toLocaleString()}</Text>
      </View>

      <View style={styles.menuGrid}>
        <MenuButton title="Accounts" icon="🏦" onPress={() => navigation.navigate('Accounts')} color="#1976d2" />
        <MenuButton title="Transfer" icon="💸" onPress={() => navigation.navigate('Transfer')} color="#2e7d32" />
        <MenuButton title="History" icon="📊" onPress={() => navigation.navigate('History')} color="#ed6c02" />
        <MenuButton title="Loans" icon="💰" onPress={() => navigation.navigate('Loans')} color="#9c27b0" />
        <MenuButton title="Profile" icon="👤" onPress={() => navigation.navigate('Profile')} color="#d32f2f" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 20,
    paddingTop: 30
  },
  welcome: { fontSize: 20, fontWeight: 'bold' },
  logout: { color: '#d32f2f', fontSize: 16 },
  balanceCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 25,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  balanceLabel: { color: '#666', fontSize: 14 },
  balanceAmount: { fontSize: 32, fontWeight: 'bold', color: '#d32f2f', marginTop: 5 },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10
  },
  menuButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  menuIcon: { fontSize: 30, marginBottom: 5 },
  menuText: { color: 'white', fontSize: 12, fontWeight: 'bold' }
});