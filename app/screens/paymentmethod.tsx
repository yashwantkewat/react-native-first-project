import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Switch,
} from 'react-native';

const PaymentMethodScreen = () => {
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [saveCard, setSaveCard] = useState(true);
  const [cardData, setCardData] = useState({
    nameOnCard: 'RUSSELL AUSTIN',
    cardNumber: '8790',
    month: '',
    year: '',
    cvv: '',
  });

  const paymentSteps = [
    { step: 1, title: 'DELIVERY', completed: true },
    { step: 2, title: 'ADDRESS', completed: true },
    { step: 3, title: 'PAYMENT', active: true },
  ];

  const paymentMethods = [
    { id: 'paypal', title: 'Paypal', icon: '💳' },
    { id: 'card', title: 'Credit Card', icon: '💳' },
    { id: 'apple', title: 'Apple pay', icon: '🍎' },
  ];

  const renderProgressSteps = () => (
    <View style={styles.progressContainer}>
      {paymentSteps.map((step, index) => (
        <View key={step.step} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            step.completed && styles.stepCompleted,
            step.active && styles.stepActive
          ]}>
            <Text style={[
              styles.stepNumber,
              (step.completed || step.active) && styles.stepNumberActive
            ]}>
              {step.completed ? '✓' : step.step}
            </Text>
          </View>
          <Text style={styles.stepTitle}>{step.title}</Text>
          {index < paymentSteps.length - 1 && (
            <View style={[
              styles.stepLine,
              step.completed && styles.stepLineCompleted
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderPaymentMethods = () => (
    <View style={styles.paymentMethodsContainer}>
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.paymentMethod,
            selectedPayment === method.id && styles.paymentMethodSelected
          ]}
          onPress={() => setSelectedPayment(method.id)}
        >
          <Text style={styles.paymentIcon}>{method.icon}</Text>
          <Text style={styles.paymentTitle}>{method.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCreditCard = () => (
    <View style={styles.creditCardContainer}>
      <View style={styles.creditCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardChip} />
          <Text style={styles.moreOptions}>⋮</Text>
        </View>
        
        <View style={styles.cardPatterns}>
          <View style={[styles.cardCircle, { backgroundColor: '#FF6B35', left: 200 }]} />
          <View style={[styles.cardCircle, { backgroundColor: '#4CAF50', right: 200 }]} />
        </View>
        
        <Text style={styles.cardNumber}>XXXX XXXX XXXX {cardData.cardNumber}</Text>
        
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.cardLabel}>CARD HOLDER</Text>
            <Text style={styles.cardValue}>{cardData.nameOnCard}</Text>
          </View>
          <View>
            <Text style={styles.cardLabel}>EXPIRES</Text>
            <Text style={styles.cardValue}>01/25</Text>
          </View>
          <View style={styles.cardBrand}>
            <Text style={styles.cardBrandText}>💳</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderCardForm = () => (
    <View style={styles.cardForm}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputIcon}>👤</Text>
        <TextInput
          style={styles.input}
          placeholder="Name on the card"
          value={cardData.nameOnCard}
          onChangeText={(text) => setCardData({...cardData, nameOnCard: text})}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputIcon}>💳</Text>
        <TextInput
          style={styles.input}
          placeholder="Card number"
          value={`XXXX XXXX XXXX ${cardData.cardNumber}`}
          onChangeText={(text) => setCardData({...cardData, cardNumber: text.slice(-4)})}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.rowInputs}>
        <View style={[styles.inputContainer, styles.smallInput]}>
          <Text style={styles.inputIcon}>📅</Text>
          <TextInput
            style={styles.input}
            placeholder="Month / Year"
            value="01/25"
            keyboardType="numeric"
          />
        </View>
        
        <View style={[styles.inputContainer, styles.smallInput]}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            style={styles.input}
            placeholder="CVV"
            value="123"
            keyboardType="numeric"
            maxLength={3}
          />
        </View>
      </View>

      <View style={styles.saveCardContainer}>
        <Switch
          value={saveCard}
          onValueChange={setSaveCard}
          thumbColor={saveCard ? '#7CB342' : '#f4f3f4'}
          trackColor={{ false: '#767577', true: '#C8E6C9' }}
        />
        <Text style={styles.saveCardText}>Save this card</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Method</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Progress Steps */}
          {renderProgressSteps()}

          {/* Payment Methods */}
          {renderPaymentMethods()}

          {/* Credit Card Display */}
          {selectedPayment === 'card' && renderCreditCard()}

          {/* Card Form */}
          {selectedPayment === 'card' && renderCardForm()}

          {/* Make Payment Button */}
          <TouchableOpacity style={styles.paymentButton}>
            <Text style={styles.paymentButtonText}>Make a payment</Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backArrow: {
    fontSize: 20,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCompleted: {
    backgroundColor: '#7CB342',
  },
  stepActive: {
    backgroundColor: '#7CB342',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  stepLine: {
    position: 'absolute',
    top: 16,
    left: '60%',
    right: '-60%',
    height: 2,
    backgroundColor: '#E0E0E0',
  },
  stepLineCompleted: {
    backgroundColor: '#7CB342',
  },
  paymentMethodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  paymentMethod: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentMethodSelected: {
    borderColor: '#7CB342',
  },
  paymentIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  paymentTitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  creditCardContainer: {
    marginBottom: 24,
  },
  creditCard: {
    backgroundColor: '#7CB342',
    borderRadius: 16,
    padding: 20,
    height: 180,
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardChip: {
    width: 32,
    height: 24,
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  moreOptions: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardPatterns: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.3,
    top: 60,
  },
  cardNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLabel: {
    color: '#fff',
    fontSize: 10,
    opacity: 0.8,
    marginBottom: 2,
  },
  cardValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardBrand: {
    alignItems: 'center',
  },
  cardBrandText: {
    fontSize: 20,
  },
  cardForm: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallInput: {
    width: '48%',
  },
  saveCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  saveCardText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  paymentButton: {
    backgroundColor: '#7CB342',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentMethodScreen;