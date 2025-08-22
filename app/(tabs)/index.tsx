import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReviewsScreen from '../screens/getreview';
import VegetablesScreen from '../screens/fooddata';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const userData = await AsyncStorage.getItem('user'); // yaha 'user' me tum login data store karte ho
        if (!userData) {
          router.replace('/screens/authuser/Login'); // agar user login nahi hai, redirect
        } 
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };
    checkUserLoggedIn();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/screens/myorder')}
            >
              <Text style={styles.quickActionIcon}>📦</Text>
              <Text style={styles.quickActionText}>My Orders</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/screens/useraddress')}
            >
              <Text style={styles.quickActionIcon}>📍</Text>
              <Text style={styles.quickActionText}>Addresses</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/screens/review')}
            >
              <Text style={styles.quickActionIcon}>⭐</Text>
              <Text style={styles.quickActionText}>Reviews</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <VegetablesScreen />
        </View>

        <View style={styles.section}>
          <ReviewsScreen />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  searchInput: { backgroundColor: '#f0f0f0', borderRadius: 10, paddingHorizontal: 15, height: 45, fontSize: 16, color: '#333' },
  section: { paddingHorizontal: 20, marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 15 },
  quickActionsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  quickActionCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 15, alignItems: 'center', marginHorizontal: 5, elevation: 2 },
  quickActionIcon: { fontSize: 24, marginBottom: 5 },
  quickActionText: { fontSize: 12, fontWeight: '600', color: '#333', textAlign: 'center' },
});
