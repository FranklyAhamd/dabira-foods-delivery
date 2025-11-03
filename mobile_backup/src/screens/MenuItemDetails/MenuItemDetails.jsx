import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useCart } from '../../context/CartContext';

const MenuItemDetails = ({ route, navigation }) => {
  const { item } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const { addToCart } = useCart();
  
  // Increment quantity
  const incrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };
  
  // Decrement quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };
  
  // Add to cart
  const handleAddToCart = () => {
    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      addToCart(item, quantity);
      setLoading(false);
      
      Alert.alert(
        'Added to Cart',
        `${quantity} x ${item.name} added to your cart`,
        [
          {
            text: 'Continue Shopping',
            style: 'cancel',
          },
          {
            text: 'Go to Cart',
            onPress: () => navigation.navigate('Cart'),
          },
        ]
      );
    }, 500);
  };
  
  return (
    <ScrollView style={styles.container}>
      {/* Item Image */}
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/400?text=No+Image' }}
        style={styles.image}
        resizeMode="cover"
      />
      
      {/* Item Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.header}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>
        
        <View style={styles.categoryContainer}>
          <Icon name="restaurant" size={16} color="#FF6B35" />
          <Text style={styles.category}>{item.category}</Text>
        </View>
        
        <Text style={styles.description}>{item.description}</Text>
        
        {/* Quantity Selector */}
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Quantity:</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Icon 
                name="remove" 
                size={20} 
                color={quantity <= 1 ? '#ccc' : '#FF6B35'} 
              />
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={incrementQuantity}
            >
              <Icon name="add" size={20} color="#FF6B35" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Total Price */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>
            ${(item.price * quantity).toFixed(2)}
          </Text>
        </View>
        
        {/* Add to Cart Button */}
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="shopping-cart" size={20} color="#fff" style={styles.cartIcon} />
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
  },
  detailsContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 24,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  quantityButton: {
    padding: 8,
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  addToCartButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIcon: {
    marginRight: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MenuItemDetails;



