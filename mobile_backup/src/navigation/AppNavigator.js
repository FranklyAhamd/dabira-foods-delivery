import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Auth Screens
import Login from '../screens/Auth/Login';
import Register from '../screens/Auth/Register';

// Main App Screens
import Home from '../screens/Home/Home';
import MenuItemDetails from '../screens/MenuItemDetails/MenuItemDetails';
import Cart from '../screens/Cart/Cart';
import Checkout from '../screens/Checkout/Checkout';
import OrderConfirmation from '../screens/OrderConfirmation/OrderConfirmation';
import MyOrders from '../screens/MyOrders/MyOrders';
import OrderDetails from '../screens/OrderDetails/OrderDetails';
import Profile from '../screens/Profile/Profile';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Navigator
const AuthNavigator = () => (
  <Stack.Navigator 
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#fff' }
    }}
  >
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
  </Stack.Navigator>
);

// Home Stack Navigator
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: '#FF6B35',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name="HomeScreen" 
      component={Home} 
      options={{ title: 'Dabira Foods' }} 
    />
    <Stack.Screen 
      name="MenuItemDetails" 
      component={MenuItemDetails} 
      options={{ title: 'Menu Item' }} 
    />
  </Stack.Navigator>
);

// Orders Stack Navigator
const OrdersStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#FF6B35',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name="MyOrdersScreen" 
      component={MyOrders} 
      options={{ title: 'My Orders' }} 
    />
    <Stack.Screen 
      name="OrderDetails" 
      component={OrderDetails} 
      options={{ title: 'Order Details' }} 
    />
  </Stack.Navigator>
);

// Profile Stack Navigator
const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#FF6B35',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name="ProfileScreen" 
      component={Profile} 
      options={{ title: 'My Profile' }} 
    />
  </Stack.Navigator>
);

// Cart Stack Navigator
const CartStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#FF6B35',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name="CartScreen" 
      component={Cart} 
      options={{ title: 'My Cart' }} 
    />
    <Stack.Screen 
      name="Checkout" 
      component={Checkout} 
      options={{ title: 'Checkout' }} 
    />
    <Stack.Screen 
      name="OrderConfirmation" 
      component={OrderConfirmation} 
      options={{ title: 'Order Confirmation', headerLeft: null }} 
    />
  </Stack.Navigator>
);

// Main Tab Navigator
const TabNavigator = () => {
  const { getTotalItems } = useCart();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack} 
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="home" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersStack} 
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="receipt" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartStack} 
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="shopping-cart" size={26} color={color} />
          ),
          tabBarBadge: getTotalItems() > 0 ? getTotalItems() : null,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack} 
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="person" size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // You can return a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Main" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;



