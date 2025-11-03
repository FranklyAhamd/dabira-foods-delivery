import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';

const Profile = ({ navigation }) => {
  const { user, updateProfile, logout, loading } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [updating, setUpdating] = useState(false);
  
  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);
  
  // Handle save profile
  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    
    try {
      setUpdating(true);
      
      const result = await updateProfile({
        name,
        phone: phone.trim() || null
      });
      
      if (result.success) {
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: () => logout(),
          style: 'destructive'
        }
      ]
    );
  };
  
  if (!user) {
    return (
      <View style={styles.authContainer}>
        <Icon name="account-circle" size={80} color="#ddd" />
        <Text style={styles.authTitle}>Login Required</Text>
        <Text style={styles.authMessage}>
          Please login to view and manage your profile
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        
        {/* Profile Form */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {!isEditing && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Icon name="edit" size={20} color="#FF6B35" />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
              />
            ) : (
              <Text style={styles.value}>{user.name}</Text>
            )}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user.email}</Text>
            <Text style={styles.helperText}>Email cannot be changed</Text>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.value}>{user.phone || 'Not provided'}</Text>
            )}
          </View>
          
          {isEditing && (
            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsEditing(false);
                  setName(user.name || '');
                  setPhone(user.phone || '');
                }}
                disabled={updating}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity
            style={styles.accountAction}
            onPress={() => navigation.navigate('Orders')}
          >
            <Icon name="receipt" size={24} color="#333" />
            <Text style={styles.accountActionText}>My Orders</Text>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.accountAction}
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon.')}
          >
            <Icon name="favorite" size={24} color="#333" />
            <Text style={styles.accountActionText}>Favorite Items</Text>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.accountAction}
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon.')}
          >
            <Icon name="location-on" size={24} color="#333" />
            <Text style={styles.accountActionText}>Saved Addresses</Text>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.accountAction}
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon.')}
          >
            <Icon name="payment" size={24} color="#333" />
            <Text style={styles.accountActionText}>Payment Methods</Text>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.accountAction, styles.logoutAction]}
            onPress={handleLogout}
          >
            <Icon name="logout" size={24} color="#F44336" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        
        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Dabira Foods v1.0.0</Text>
        </View>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    color: '#FF6B35',
    marginLeft: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  accountAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  accountActionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginLeft: 16,
  },
  logoutAction: {
    borderBottomWidth: 0,
  },
  logoutText: {
    fontSize: 16,
    color: '#F44336',
    flex: 1,
    marginLeft: 16,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  appVersion: {
    fontSize: 14,
    color: '#999',
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

export default Profile;



