import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const MyOrders = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  
  const { isAuthenticated } = useAuth();
  
  // Fetch orders when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);
  
  // Fetch orders from API
  const fetchOrders = async (status = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (status && status !== 'all') {
        params.status = status;
      }
      
      const response = await api.get('/orders/my-orders', { params });
      
      setOrders(response.data.orders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders(activeFilter === 'all' ? null : activeFilter);
  };
  
  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    fetchOrders(filter === 'all' ? null : filter);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
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
  
  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return 'schedule';
      case 'CONFIRMED':
        return 'check-circle';
      case 'IN_PROGRESS':
        return 'restaurant';
      case 'OUT_FOR_DELIVERY':
        return 'local-shipping';
      case 'DELIVERED':
        return 'done-all';
      case 'CANCELLED':
        return 'cancel';
      default:
        return 'help';
    }
  };
  
  // Render filter tab
  const renderFilterTab = (label, value) => (
    <TouchableOpacity
      style={[
        styles.filterTab,
        activeFilter === value && styles.activeFilterTab
      ]}
      onPress={() => handleFilterChange(value)}
    >
      <Text
        style={[
          styles.filterTabText,
          activeFilter === value && styles.activeFilterTabText
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  // Render order item
  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderIdLabel}>Order ID:</Text>
          <Text style={styles.orderId}>{item.id.substring(0, 8)}</Text>
        </View>
        <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
      </View>
      
      <View style={styles.orderContent}>
        <View style={styles.orderItems}>
          {item.items.slice(0, 2).map((orderItem, index) => (
            <Text key={orderItem.id} style={styles.orderItemText}>
              {orderItem.quantity}x {orderItem.menuItem.name}
            </Text>
          ))}
          {item.items.length > 2 && (
            <Text style={styles.orderItemMore}>
              +{item.items.length - 2} more items
            </Text>
          )}
        </View>
        
        <View style={styles.orderTotal}>
          <Text style={styles.orderTotalLabel}>Total:</Text>
          <Text style={styles.orderTotalValue}>
            ${item.totalAmount.toFixed(2)}
          </Text>
        </View>
      </View>
      
      <View style={styles.orderFooter}>
        <View style={styles.orderStatus}>
          <Icon
            name={getStatusIcon(item.status)}
            size={16}
            color={getStatusColor(item.status)}
            style={styles.statusIcon}
          />
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(item.status) }
            ]}
          >
            {item.status.replace('_', ' ')}
          </Text>
        </View>
        
        <View style={styles.orderAction}>
          <Text style={styles.orderActionText}>View Details</Text>
          <Icon name="chevron-right" size={16} color="#666" />
        </View>
      </View>
    </TouchableOpacity>
  );
  
  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="receipt-long" size={80} color="#ddd" />
      <Text style={styles.emptyText}>No orders found</Text>
      <Text style={styles.emptySubtext}>
        {activeFilter === 'all'
          ? "You haven't placed any orders yet"
          : `You don't have any ${activeFilter.toLowerCase()} orders`}
      </Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.shopButtonText}>Browse Menu</Text>
      </TouchableOpacity>
    </View>
  );
  
  if (!isAuthenticated) {
    return (
      <View style={styles.authContainer}>
        <Icon name="lock" size={80} color="#ddd" />
        <Text style={styles.authTitle}>Login Required</Text>
        <Text style={styles.authMessage}>
          Please login to view your orders
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {renderFilterTab('All', 'all')}
          {renderFilterTab('Pending', 'PENDING')}
          {renderFilterTab('Confirmed', 'CONFIRMED')}
          {renderFilterTab('In Progress', 'IN_PROGRESS')}
          {renderFilterTab('Delivering', 'OUT_FOR_DELIVERY')}
          {renderFilterTab('Delivered', 'DELIVERED')}
          {renderFilterTab('Cancelled', 'CANCELLED')}
        </ScrollView>
      </View>
      
      {/* Orders List */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={48} color="#FF6B35" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.ordersList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterScroll: {
    paddingHorizontal: 12,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeFilterTab: {
    backgroundColor: '#FF6B35',
  },
  filterTabText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterTabText: {
    color: '#fff',
    fontWeight: '500',
  },
  ordersList: {
    padding: 16,
  },
  orderItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderIdLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },
  orderId: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
  },
  orderContent: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderItems: {
    marginBottom: 8,
  },
  orderItemText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  orderItemMore: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  orderTotalLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  orderTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fafafa',
  },
  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderActionText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 400,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  authMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyOrders;



