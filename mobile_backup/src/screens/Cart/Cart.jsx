import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Cart = ({ navigation }) => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Handle checkout button press
  const handleCheckout = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'You need to login to proceed with checkout.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Auth') }
        ]
      );
      return;
    }
    
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Add items to your cart before checkout.');
      return;
    }
    
    navigation.navigate('Checkout');
  };
  
  // Render empty cart
  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Icon name="shopping-cart" size={80} color="#ddd" />
      <Text style={styles.emptyText}>Your cart is empty</Text>
      <Text style={styles.emptySubtext}>
        Add items to your cart to start your order
      </Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.shopButtonText}>Browse Menu</Text>
      </TouchableOpacity>
    </View>
  );
  
  // Render cart item
  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/100?text=No+Image' }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Icon name="remove" size={16} color="#FF6B35" />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Icon name="add" size={16} color="#FF6B35" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.itemActions}>
        <Text style={styles.itemTotal}>
          ${(item.price * item.quantity).toFixed(2)}
        </Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => {
            Alert.alert(
              'Remove Item',
              `Remove ${item.name} from cart?`,
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', onPress: () => removeFromCart(item.id), style: 'destructive' }
              ]
            );
          }}
        >
          <Icon name="delete-outline" size={24} color="#FF6B35" />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={item => item.id}
            renderItem={renderCartItem}
            contentContainerStyle={styles.cartList}
          />
          
          <View style={styles.cartSummary}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearCart}
            >
              <Icon name="remove-shopping-cart" size={18} color="#FF6B35" />
              <Text style={styles.clearButtonText}>Clear Cart</Text>
            </TouchableOpacity>
            
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>
                ${getTotalPrice().toFixed(2)}
              </Text>
            </View>
            
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Icon name="shopping-bag" size={20} color="#fff" style={styles.checkoutIcon} />
                  <Text style={styles.checkoutText}>Checkout</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  cartList: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 4,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 8,
  },
  itemActions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  removeButton: {
    padding: 4,
  },
  cartSummary: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  clearButtonText: {
    color: '#FF6B35',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  checkoutButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutIcon: {
    marginRight: 8,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
});

export default Cart;



