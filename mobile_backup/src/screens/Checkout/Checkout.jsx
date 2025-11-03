import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';

const Checkout = ({ navigation }) => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  
  // Initialize form with user data if available
  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '');
      setCustomerPhone(user.phone || '');
    }
  }, [user]);
  
  // Validate form
  const validateForm = () => {
    if (!deliveryAddress.trim()) {
      Alert.alert('Error', 'Please enter a delivery address');
      return false;
    }
    
    if (!customerName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    
    if (!customerPhone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }
    
    return true;
  };
  
  // Handle place order
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const orderItems = cartItems.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity
      }));
      
      const orderData = {
        items: orderItems,
        deliveryAddress,
        customerName,
        customerPhone,
        notes: notes.trim() || null
      };
      
      const response = await api.post('/orders', orderData);
      
      // Order placed successfully
      clearCart();
      navigation.navigate('OrderConfirmation', { order: response.data.order });
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
      Alert.alert('Order Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate total amount
  const subtotal = getTotalPrice();
  const deliveryFee = 5.00; // This could be fetched from settings API
  const total = subtotal + deliveryFee;
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Delivery Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Delivery Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your delivery address"
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              multiline
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={customerName}
              onChangeText={setCustomerName}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              value={customerPhone}
              onChangeText={setCustomerPhone}
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Additional Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="Special instructions, allergies, etc."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
        
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          {cartItems.map(item => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.orderItemInfo}>
                <Text style={styles.orderItemQuantity}>{item.quantity}x</Text>
                <Text style={styles.orderItemName}>{item.name}</Text>
              </View>
              <Text style={styles.orderItemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
        
        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentOption}>
            <Icon name="payments" size={24} color="#FF6B35" />
            <Text style={styles.paymentText}>Cash on Delivery</Text>
          </View>
        </View>
        
        {/* Place Order Button */}
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.placeOrderText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderItemInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  orderItemQuantity: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF6B35',
    marginRight: 8,
  },
  orderItemName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  paymentText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  placeOrderButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Checkout;



