import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OrderConfirmation = ({ route, navigation }) => {
  const { order } = route.params;
  
  // Prevent going back to checkout screen
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Navigate to Home instead of going back
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
        return true;
      };
      
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );
  
  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#FFA000';
      case 'CONFIRMED':
        return '#2196F3';
      case 'IN_PROGRESS':
        return '#9C27B0';
      case 'OUT_FOR_DELIVERY':
        return '#00BCD4';
      case 'DELIVERED':
        return '#4CAF50';
      case 'CANCELLED':
        return '#F44336';
      default:
        return '#757575';
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.confirmationHeader}>
        <Icon name="check-circle" size={80} color="#4CAF50" />
        <Text style={styles.confirmationTitle}>Order Confirmed!</Text>
        <Text style={styles.confirmationMessage}>
          Your order has been placed successfully
        </Text>
      </View>
      
      <View style={styles.orderInfoContainer}>
        <View style={styles.orderInfoRow}>
          <Text style={styles.orderInfoLabel}>Order ID:</Text>
          <Text style={styles.orderInfoValue}>{order.id.substring(0, 8)}</Text>
        </View>
        
        <View style={styles.orderInfoRow}>
          <Text style={styles.orderInfoLabel}>Date:</Text>
          <Text style={styles.orderInfoValue}>{formatDate(order.createdAt)}</Text>
        </View>
        
        <View style={styles.orderInfoRow}>
          <Text style={styles.orderInfoLabel}>Status:</Text>
          <View style={styles.statusContainer}>
            <View 
              style={[
                styles.statusDot, 
                { backgroundColor: getStatusColor(order.status) }
              ]} 
            />
            <Text style={styles.orderInfoValue}>
              {order.status.replace('_', ' ')}
            </Text>
          </View>
        </View>
        
        <View style={styles.orderInfoRow}>
          <Text style={styles.orderInfoLabel}>Delivery Address:</Text>
          <Text style={styles.orderInfoValue}>{order.deliveryAddress}</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        
        {order.items.map(item => (
          <View key={item.id} style={styles.orderItem}>
            <View style={styles.orderItemInfo}>
              <Text style={styles.orderItemQuantity}>{item.quantity}x</Text>
              <Text style={styles.orderItemName}>{item.menuItem.name}</Text>
            </View>
            <Text style={styles.orderItemPrice}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
        
        <View style={styles.divider} />
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>
            ${order.totalAmount.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>$0.00</Text>
        </View>
        
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            ${order.totalAmount.toFixed(2)}
          </Text>
        </View>
      </View>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.trackOrderButton}
          onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
        >
          <Icon name="local-shipping" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Track Order</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          })}
        >
          <Icon name="restaurant-menu" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  confirmationHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  confirmationMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  orderInfoContainer: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderInfoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  orderInfoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    width: 120,
  },
  orderInfoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 16,
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
  buttonsContainer: {
    padding: 16,
    marginBottom: 16,
  },
  trackOrderButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  continueButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderConfirmation;



