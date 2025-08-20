import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../service/axiosInstance"; // 👈 apna path check kar lena

// Types
interface Order {
  orderId: string;
  date: string;
  orderStatus: string;
  quantity: number;
  tracking: string;
}

interface OrderStepProps {
  title: string;
  date: string;
  isCompleted: boolean;
  isActive: boolean;
  isPending: boolean;
}

const OrdersScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId"); // 👈 fetch from storage
        if (!userId) {
          console.log("❌ No userId found in storage");
          return;
        }
  
        const res = await axiosInstance.get<Order[]>(`/products/order/${userId}`);
        setOrders(res.data);
      } catch (err) {
        console.log("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, []);
  

  const getOrderSteps = (orderStatus: string) => {
    const steps = [
      { title: 'Order placed', date: 'Oct 19 2021', key: 'placed' },
      { title: 'Order confirmed', date: 'Oct 20 2021', key: 'confirmed' },
      { title: 'Order shipped', date: 'Oct 20 2021', key: 'shipped' },
      { title: 'Out for delivery', date: 'pending', key: 'out_for_delivery' },
      { title: 'Order delivered', date: 'pending', key: 'delivered' },
    ];

    const statusOrder = ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(orderStatus);

    return steps.map((step, index) => ({
      ...step,
      isCompleted: index <= currentIndex,
      isActive: index === currentIndex,
      isPending: index > currentIndex,
    }));
  };

  const OrderStep: React.FC<OrderStepProps> = ({ 
    title, 
    date, 
    isCompleted, 
    isActive, 
    isPending 
  }) => (
    <View style={styles.orderStep}>
      <View style={styles.stepIndicator}>
        <View style={[
          styles.stepDot,
          isCompleted && styles.completedDot,
          isActive && styles.activeDot,
          isPending && styles.pendingDot,
        ]}>
          {isCompleted && <Text style={styles.checkmark}>✓</Text>}
        </View>
        {title !== 'Order delivered' && (
          <View style={[
            styles.stepLine,
            isCompleted && styles.completedLine,
          ]} />
        )}
      </View>
      <View style={styles.stepContent}>
        <Text style={[
          styles.stepTitle,
          isCompleted && styles.completedText,
          isActive && styles.activeText,
          isPending && styles.pendingText,
        ]}>
          {title}
        </Text>
        <Text style={styles.stepDate}>{date}</Text>
      </View>
    </View>
  );

  const OrderCard: React.FC<{ order: Order; isExpanded?: boolean }> = ({ 
    order, 
    isExpanded = false 
  }) => {
    const steps = getOrderSteps(order.orderStatus);
    
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.orderIcon}>
            <Text style={styles.packageIcon}>📦</Text>
          </View>
          <View style={styles.orderInfo}>
            <Text style={styles.orderNumber}>Order {order.orderId}</Text>
            <Text style={styles.orderDate}>
              Placed on {new Date(order.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </Text>
            <Text style={styles.orderDetails}>
              Quantity: {order.quantity}
            </Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreIcon}>⋯</Text>
          </TouchableOpacity>
        </View>

        {isExpanded && (
          <View style={styles.orderTracking}>
            {steps.map((step, index) => (
              <OrderStep
                key={index}
                title={step.title}
                date={step.date}
                isCompleted={step.isCompleted}
                isActive={step.isActive}
                isPending={step.isPending}
              />
            ))}
          </View>
        )}

        {!isExpanded && order.orderStatus === 'delivered' && (
          <View style={styles.deliveredStatus}>
            <Text style={styles.deliveredText}>Order Delivered</Text>
            <Text style={styles.deliveredDate}>
              {new Date(order.date).toLocaleDateString('en-US')}
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading Orders...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Order</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>≡</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No orders found.</Text>
          </View>
        ) : (
          orders.map((order, index) => (
            <OrderCard 
              key={`${order.orderId}-${index}`} 
              order={order} 
              isExpanded={index === 0} // Expand first order to show tracking
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  filterButton: {
    padding: 8,
  },
  filterIcon: {
    fontSize: 18,
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  orderIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  packageIcon: {
    fontSize: 24,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderDetails: {
    fontSize: 14,
    color: '#666',
  },
  moreButton: {
    padding: 4,
  },
  moreIcon: {
    fontSize: 20,
    color: '#4CAF50',
  },
  orderTracking: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  orderStep: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepIndicator: {
    alignItems: 'center',
    marginRight: 12,
  },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedDot: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  activeDot: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  pendingDot: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepLine: {
    width: 2,
    height: 24,
    backgroundColor: '#E0E0E0',
    marginTop: 4,
  },
  completedLine: {
    backgroundColor: '#4CAF50',
  },
  stepContent: {
    flex: 1,
    paddingTop: 2,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  completedText: {
    color: '#4CAF50',
  },
  activeText: {
    color: '#4CAF50',
  },
  pendingText: {
    color: '#999',
  },
  stepDate: {
    fontSize: 12,
    color: '#999',
  },
  deliveredStatus: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  deliveredText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4CAF50',
    marginBottom: 2,
  },
  deliveredDate: {
    fontSize: 12,
    color: '#999',
  },
});

export default OrdersScreen;