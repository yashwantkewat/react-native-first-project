import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, SafeAreaView, Alert, Image, ScrollView } from 'react-native';
import styles from '../../style/getreview.styles';
import { Link } from 'expo-router';
import axiosInstance from '../../service/axiosInstance';

interface Review {
  name: string;
  rating: number;
  review: string;
  profileImage?: string;
}

const ReviewsScreen: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get('/users/get-review');
        setReviews(response.data.reviews || []);
      } catch (error: any) {
        console.log('Error fetching reviews:', error.response?.data || error.message);
        Alert.alert('Error', 'Unable to fetch reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Text key={`full-${i}`} style={styles.star}>★</Text>);
    }
    if (hasHalfStar) {
      stars.push(<Text key="half" style={styles.star}>☆</Text>);
    }
    return stars;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#7CB342" style={{ marginTop: 20 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Link href="/" style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </Link>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>User Reviews</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.reviewsList}>
        {reviews.map((item, index) => (
          <View key={index} style={styles.reviewItem}>
            <View style={styles.row}>
              <Image
                source={{
                  uri:
                    item.profileImage && item.profileImage.trim() !== ''
                      ? item.profileImage
                      : 'https://i.pinimg.com/736x/23/87/d8/2387d8f1257021c4868c2e326269b796.jpg',
                }}
                style={styles.profileImage}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.rating}>{renderStars(item.rating)}</View>
              </View>
            </View>
            <Text style={styles.reviewText}>{item.review}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReviewsScreen;
