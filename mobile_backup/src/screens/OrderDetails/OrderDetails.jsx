import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const OrderDetails = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();
  
  // Fetch order details when component mounts
  useEffect(() => {
    fetchOrderDetails();
  }, []);
  
  // Fetch order details from API
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data.order);
    } catch (err) {
      console.error('Error fetching order details:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load order details. Please try again.';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
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
  
  // Get status description
  const getStatusDescription = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Your order has been received and is awaiting confirmation.';
      case 'CONFIRMED':
        return 'Your order has been confirmed and will be prepared soon.';
      case 'IN_PROGRESS':
        return 'Your order is being prepared.';
      case 'OUT_FOR_DELIVERY':
        return 'Your order is on its way to you.';
      case 'DELIVERED':
        return 'Your order has been delivered. Enjoy your meal!';
      case 'CANCELLED':
        return 'Your order has been cancelled.';
      default:
        return '';
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={48} color="#FF6B35" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOrderDetails}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="not-interested" size={48} color="#FF6B35" />
        <Text style={styles.errorText}>Order not found</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      {/* Order Status */}
      <View 
        style={[
          styles.statusContainer, 
          { backgroundColor: getStatusColor(order.status) }
        ]}
      >
        <Text style={styles.statusTitle}>
          {order.status.replace('_', ' ')}
        </Text>
        <Text style={styles.statusDescription}>
          {getStatusDescription(order.status)}
        </Text>
      </View>
      
      {/* Order Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Order ID:</Text>
          <Text style={styles.infoValue}>{order.id}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date:</Text>
          <Text style={styles.infoValue}>{formatDate(order.createdAt)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Customer:</Text>
          <Text style={styles.infoValue}>{order.customerName}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoValue}>{order.customerPhone}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Delivery Address:</Text>
          <Text style={styles.infoValue}>{order.deliveryAddress}</Text>
        </View>
        
        {order.notes && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Notes:</Text>
            <Text style={styles.infoValue}>{order.notes}</Text>
          </View>
        )}
      </View>
      
      {/* Order Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        
        {order.items.map((item) => (
          <View key={item.id} style={styles.orderItem}>
            <View style={styles.orderItemHeader}>
              <Text style={styles.orderItemName}>{item.menuItem.name}</Text>
              <Text style={styles.orderItemQuantity}>x{item.quantity}</Text>
            </View>
            <Text style={styles.orderItemPrice}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
        
        <View style={styles.divider} />
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalValue}>
            ${order.totalAmount.toFixed(2)}
          </Text>
        </View>
      </View>
      
      {/* Payment Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Payment Status:</Text>
          <View style={styles.paymentStatus}>
            <View 
              style={[
                styles.paymentStatusDot, 
                { backgroundColor: order.paymentStatus === 'PAID' ? '#4CAF50' : '#FFA000' }
              ]} 
            />
            <Text style={styles.infoValue}>{order.paymentStatus}</Text>
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Payment Method:</Text>
          <Text style={styles.infoValue}>Cash on Delivery</Text>
        </View>
      </View>
      
      {/* Actions */}
      {order.status === 'PENDING' && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              Alert.alert(
                'Cancel Order',
                'Are you sure you want to cancel this order?',
                [
                  { text: 'No', style: 'cancel' },
                  { 
                    text: 'Yes, Cancel', 
                    onPress: async () => {
                      try {
                        setLoading(true);
                        await api.patch(`/orders/${order.id}/status`, { status: 'CANCELLED' });
                        fetchOrderDetails();
                      } catch (err) {
                        console.error('Error cancelling order:', err);
                        Alert.alert('Error', 'Failed to cancel order. Please try again.');
                      } finally {
                        setLoading(false);
                      }
                    },
                    style: 'destructive'
                  }
                ]
              );
            }}
          >
            <Icon name="cancel" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Cancel Order</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {order.status === 'DELIVERED' && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.reorderButton}
            onPress={() => {
              // Implement reorder functionality
              Alert.alert('Reorder', 'Reorder functionality will be implemented soon.');
            }}
          >
            <Icon name="replay" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Reorder</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statusContainer: {
    padding: 16,
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    marginTop: 0,
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
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    width: 120,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  orderItem: {
    marginBottom: 12,
  },
  orderItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  orderItemQuantity: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF6B35',
    marginLeft: 8,
  },
  orderItemPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  actionsContainer: {
    padding: 16,
    marginBottom: 16,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reorderButton: {
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

export default OrderDetails;



