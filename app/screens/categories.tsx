import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import styles from '../../style/categories.styles';
import { Link } from 'expo-router';

const CategoriesScreen = () => {
  const handleCategoryPress = (name:string) => {
    console.log('Category pressed:', name);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
        <Link href="/" style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </Link>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Categories Grid */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.categoriesGrid}>

          {/* Vegetables */}
          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => handleCategoryPress('Vegetables')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#E8F5E8' }]}>
              <Text style={[styles.categoryIcon, { color: '#4CAF50' }]}>🥬</Text>
            </View>
            <Text style={styles.categoryName}>Vegetables</Text>
          </TouchableOpacity>

          {/* Fruits */}
          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => handleCategoryPress('Fruits')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FFE8E8' }]}>
              <Text style={[styles.categoryIcon, { color: '#F44336' }]}>🍎</Text>
            </View>
            <Text style={styles.categoryName}>Fruits</Text>
          </TouchableOpacity>

          {/* Beverages */}
          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => handleCategoryPress('Beverages')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FFF8E1' }]}>
              <Text style={[styles.categoryIcon, { color: '#FF9800' }]}>🥤</Text>
            </View>
            <Text style={styles.categoryName}>Beverages</Text>
          </TouchableOpacity>

          {/* Grocery */}
          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => handleCategoryPress('Grocery')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
              <Text style={[styles.categoryIcon, { color: '#9C27B0' }]}>🛒</Text>
            </View>
            <Text style={styles.categoryName}>Grocery</Text>
          </TouchableOpacity>

          {/* Edible oil */}
          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => handleCategoryPress('Edible oil')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#E0F2F1' }]}>
              <Text style={[styles.categoryIcon, { color: '#009688' }]}>🫗</Text>
            </View>
            <Text style={styles.categoryName}>Edible oil</Text>
          </TouchableOpacity>

          {/* Household */}
          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => handleCategoryPress('Household')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FCE4EC' }]}>
              <Text style={[styles.categoryIcon, { color: '#E91E63' }]}>🧽</Text>
            </View>
            <Text style={styles.categoryName}>Household</Text>
          </TouchableOpacity>

          {/* Babycare */}
          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => handleCategoryPress('Babycare')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
              <Text style={[styles.categoryIcon, { color: '#2196F3' }]}>🍼</Text>
            </View>
            <Text style={styles.categoryName}>Babycare</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoriesScreen;
