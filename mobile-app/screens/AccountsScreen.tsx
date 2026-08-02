import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AccountsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🏦 Accounts Screen</Text>
      <Text style={styles.subtext}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  text: { fontSize: 24, fontWeight: 'bold', color: '#d32f2f' },
  subtext: { fontSize: 16, color: '#666', marginTop: 10 }
});