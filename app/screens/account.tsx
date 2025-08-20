import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Link, useRouter } from 'expo-router';

// Types
interface MenuItemProps {
  icon: string;
  iconColor: string;
  title: string;
  onPress: () => void;
  showArrow?: boolean;
}

interface BottomTabItemProps {
  icon: string;
  isActive?: boolean;
  onPress: () => void;
}

const ProfileScreen: React.FC = () => {
    const router = useRouter();
    
  const handleMenuPress = (item: string) => {
    console.log(`${item} pressed`);
  };

  const handleTabPress = (tab: string) => {
    console.log(`${tab} tab pressed`);
  };

  const MenuItem: React.FC<MenuItemProps> = ({ 
    icon, 
    iconColor, 
    title, 
    onPress, 
    showArrow = true 
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      {showArrow && (
        <Text style={styles.arrowIcon}>〉</Text>
      )}
    </TouchableOpacity>
  );

  const BottomTabItem: React.FC<BottomTabItemProps> = ({ 
    icon, 
    isActive = false, 
    onPress 
  }) => (
    <TouchableOpacity 
      style={[
        styles.tabItem,
        isActive && styles.activeTabItem
      ]} 
      onPress={onPress}
    >
      <Text style={[
        styles.tabIcon,
        isActive && styles.activeTabIcon
      ]}>
        {icon}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ 
                uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b0e2?w=150&h=150&fit=crop&crop=face' 
              }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.userName}>Olivia Austin</Text>
          <Text style={styles.userEmail}>oliviasaustin@email.com</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
            
          <MenuItem
            icon="👤"
            iconColor="#E8F5E8"
            title="About me"
            onPress={() => router.push('/screens/About')} 
          />
          
          <MenuItem
            icon="📦"
            iconColor="#FFF3E0"
            title="My Orders"
            onPress={() => router.push('/screens/About')} 
          />
          
          <MenuItem
            icon="❤️"
            iconColor="#FCE4EC"
            title="My Favorites"
            onPress={() => router.push('/screens/About')} 
          />
          
          <MenuItem
            icon="📍"
            iconColor="#E8F5E8"
            title="My Address"
            onPress={() => router.push('/screens/useraddress')} 
          />
          
          <MenuItem
            icon="💳"
            iconColor="#E3F2FD"
            title="Credit Cards"
            onPress={() => router.push('/screens/paymentmethod')} 
          />
          
          <MenuItem
            icon="💰"
            iconColor="#E8F5E8"
            title="Transactions"
            onPress={() => router.push('/screens/About')} 
          />
          
          <MenuItem
            icon="🔔"
            iconColor="#FFF3E0"
            title="Notifications"
            onPress={() => router.push('/screens/About')} 
          />
          
          <MenuItem
            icon="🚪"
            iconColor="#FFEBEE"
            title="Sign out"
            onPress={() => router.push('/screens/About')} 
            showArrow={false}
          />
        </View>
      </ScrollView>

     
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
  },
  menuContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100, // Space for bottom navigation
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 18,
  },
  menuItemText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  arrowIcon: {
    fontSize: 16,
    color: '#CCCCCC',
    marginLeft: 8,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    padding: 12,
    borderRadius: 16,
    minWidth: 48,
    alignItems: 'center',
  },
  activeTabItem: {
    backgroundColor: '#4CAF50',
  },
  tabIcon: {
    fontSize: 20,
  },
  activeTabIcon: {
    color: '#FFFFFF',
  },
});

export default ProfileScreen;