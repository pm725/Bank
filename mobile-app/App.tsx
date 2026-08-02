import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';

// These screens are commented out because they don't exist yet
// Uncomment them after creating the files
/*
import AccountsScreen from './screens/AccountsScreen';
import TransferScreen from './screens/TransferScreen';
import HistoryScreen from './screens/HistoryScreen';
import LoansScreen from './screens/LoansScreen';
import ProfileScreen from './screens/ProfileScreen';
*/

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#d32f2f' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: 'Create Account' }}
        />
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{ title: '🏦 Mahat Bank', headerLeft: () => null }}
        />
        {/*
        <Stack.Screen 
          name="Accounts" 
          component={AccountsScreen} 
          options={{ title: 'My Accounts' }}
        />
        <Stack.Screen 
          name="Transfer" 
          component={TransferScreen} 
          options={{ title: 'Transfer Money' }}
        />
        <Stack.Screen 
          name="History" 
          component={HistoryScreen} 
          options={{ title: 'Transaction History' }}
        />
        <Stack.Screen 
          name="Loans" 
          component={LoansScreen} 
          options={{ title: 'My Loans' }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'My Profile' }}
        />
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}