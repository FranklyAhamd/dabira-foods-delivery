import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <AppNavigator />
          <Toast />
        </SafeAreaView>
      </CartProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
