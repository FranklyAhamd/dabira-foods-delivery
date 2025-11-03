import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const Home = ({ navigation }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  
  const { user } = useAuth();
  
  // Fetch menu items and categories when component mounts
  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);
  
  // Fetch menu items from API
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/menu', {
        params: {
          available: true
        }
      });
      
      setMenuItems(response.data.menuItems);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError('Failed to load menu items. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await api.get('/menu/categories');
      setCategories(['All', ...response.data.categories]);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };
  
  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchMenuItems();
    fetchCategories();
  };
  
  // Filter menu items by category and search query
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Render menu item
  const renderMenuItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.menuItem}
      onPress={() => navigation.navigate('MenuItemDetails', { item })}
    >
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/150?text=No+Image' }}
        style={styles.menuItemImage}
        resizeMode="cover"
      />
      <View style={styles.menuItemInfo}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text style={styles.menuItemDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.menuItemFooter}>
          <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
          <TouchableOpacity style={styles.addButton}>
            <Icon name="add-circle" size={24} color="#FF6B35" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  // Render category item
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item && styles.selectedCategoryItem
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item && styles.selectedCategoryText
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search menu items..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="clear" size={24} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {/* Welcome Message */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>
          Welcome{user ? `, ${user.name.split(' ')[0]}` : ''}!
        </Text>
        <Text style={styles.taglineText}>
          What would you like to order today?
        </Text>
      </View>
      
      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={renderCategory}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      {/* Menu Items */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Loading menu items...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={48} color="#FF6B35" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchMenuItems}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : filteredItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="restaurant-menu" size={48} color="#FF6B35" />
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'No menu items match your search'
              : 'No menu items available in this category'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderMenuItem}
          contentContainerStyle={styles.menuList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  welcomeContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  taglineText: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 12,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  selectedCategoryItem: {
    backgroundColor: '#FF6B35',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  menuList: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItemImage: {
    width: 100,
    height: 100,
  },
  menuItemInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  addButton: {
    padding: 4,
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
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default Home;
