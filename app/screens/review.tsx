import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView, 
  StatusBar, 
  Alert 
} from 'react-native';
import styles from '../../style/ReviewScreen.styles';
import { Link } from 'expo-router';
import axiosInstance from '../../service/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReviewScreen() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  // Stars render karna
  const stars = [1, 2, 3, 4, 5].map(i => (
    <TouchableOpacity key={i} onPress={() => setRating(i)}>
      <Text style={[styles.star, { color: i <= rating ? '#FFD700' : '#ccc' }]}>★</Text>
    </TouchableOpacity>
  ));

  // Review POST request using axiosInstance
  const handleSubmit = async () => {
    if (!rating || !review.trim()) {
      Alert.alert('Error', 'Please provide rating and review.');
      return;
    }

    try {
      // Token check (optional, for debug)
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'User not authenticated. Please login.');
        return;
      }

      // POST request
      const response = await axiosInstance.post('/users/review', { rating, review });
      
      Alert.alert('Success', response.data.message || 'Review Submitted!');
      setRating(0);
      setReview('');

    } catch (error:any) {
      console.log("Review Error:", error.response?.data || error.message);
      Alert.alert(
        'Error', 
        error.response?.data?.message || 'Error submitting review'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Link href="/" style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </Link>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Write Review</Text>
        </View>
      </View>

      {/* Stars */}
      <Text style={styles.starsRow}>What do you think</Text>
      <View style={styles.starsRow}>{stars}</View>

      {/* Review Input */}
      <TextInput
        style={styles.textInput}
        placeholder="Share your experience..."
        value={review}
        onChangeText={setReview}
        multiline
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Review</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
