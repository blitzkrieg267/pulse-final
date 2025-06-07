import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal, ActivityIndicator, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInvestments } from '@/contexts/InvestmentContext';
import { router } from 'expo-router';
import { Calculator, CircleCheck as CheckCircle, DollarSign, TrendingUp, Clock } from 'lucide-react-native';

interface AIRecommendation {
  holdingTime: string;
  minHoldingTime: string;
  alternatives: Array<{
    returnRate: number;
    holdingTime: string;
  }>;
}

const returnRateOptions = [5, 10, 15, 20, 25];

export default function InvestScreen() {
  const [amount, setAmount] = useState('');
  const [selectedReturnRate, setSelectedReturnRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  const { addInvestment, getInvestmentAttempts } = useInvestments();

  const investmentAttempts = getInvestmentAttempts();
  const maxAttempts = 5;
  const attemptsRemaining = maxAttempts - investmentAttempts;

  const calculateHoldingTime = () => {
    if (!amount || !selectedReturnRate) {
      Alert.alert('Error', 'Please enter amount and select return rate');
      return;
    }

    const investAmount = parseFloat(amount);
    if (investAmount < 150) {
      Alert.alert('Error', 'Minimum investment amount is BWP 150');
      return;
    }

    if (attemptsRemaining <= 0) {
      Alert.alert(
        'Investment Limit Reached',
        'You have reached the maximum of 5 investments for this 60-day period. Please wait for the next period to make additional investments.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    
    // Simulate AI calculation delay
    setTimeout(() => {
      const recommendations = generateAIRecommendation(selectedReturnRate);
      setRecommendation(recommendations);
      setLoading(false);
    }, 2000);
  };

  const generateAIRecommendation = (returnRate: number): AIRecommendation => {
    // Simulated AI logic for holding times
    const holdingTimeMap: { [key: number]: string } = {
      5: '3',
      10: '6',
      15: '12',
      20: '18',
      25: '24'
    };

    const holdingTime = holdingTimeMap[returnRate];
    
    // Generate alternatives
    const alternatives = returnRateOptions
      .filter(rate => rate !== returnRate)
      .map(rate => ({
        returnRate: rate,
        holdingTime: `${holdingTimeMap[rate]} months`
      }))
      .slice(0, 2);

    return {
      holdingTime: `${holdingTime} months`,
      minHoldingTime: `${holdingTime} months`,
      alternatives
    };
  };

  const confirmInvestment = () => {
    if (attemptsRemaining <= 0) {
      Alert.alert(
        'Investment Limit Reached',
        'You have reached the maximum of 5 investments for this 60-day period. Please wait for the next period to make additional investments.',
        [{ text: 'OK' }]
      );
      return;
    }
    setShowConfirmModal(true);
  };

  const processPayment = async () => {
    setProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const investAmount = parseFloat(amount);
      addInvestment(investAmount, selectedReturnRate!, recommendation!.holdingTime);
      
      setProcessingPayment(false);
      setShowConfirmModal(false);
      
      Alert.alert(
        'Success!', 
        'Your investment has been confirmed successfully.',
        [
          {
            text: 'View Dashboard',
            onPress: () => router.push('/(tabs)')
          },
          {
            text: 'New Investment',
            onPress: () => {
              setAmount('');
              setSelectedReturnRate(null);
              setRecommendation(null);
            }
          }
        ]
      );
    }, 3000);
  };

  const expectedReturn = amount && selectedReturnRate 
    ? (parseFloat(amount) * (selectedReturnRate / 100))
    : 0;

  const totalReturn = amount ? parseFloat(amount) + expectedReturn : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('@/assets/images/fnb_logo.webp')}
              style={styles.logo}
            />
            <Text style={styles.logoText}>PulseInvest</Text>
          </View>
          <Text style={styles.title}>Make Investment</Text>
          <Text style={styles.subtitle}>Start growing your wealth today</Text>
          
          {/* Investment Attempts Warning */}
          {attemptsRemaining <= 2 && (
            <View style={[styles.warningBanner, attemptsRemaining === 0 && styles.errorBanner]}>
              <Text style={[styles.warningText, attemptsRemaining === 0 && styles.errorText]}>
                {attemptsRemaining === 0 
                  ? 'Investment limit reached (5/5). Wait for next period.'
                  : `${attemptsRemaining} investment${attemptsRemaining === 1 ? '' : 's'} remaining (${investmentAttempts}/5)`
                }
              </Text>
            </View>
          )}
        </View>

        {/* Investment Amount */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investment Amount</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencyLabel}>BWP</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="150"
              keyboardType="numeric"
              editable={attemptsRemaining > 0}
            />
          </View>
          <Text style={styles.minAmountText}>Minimum amount: BWP 150</Text>
        </View>

        {/* Return Rate Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guaranteed Return Rate</Text>
          <View style={styles.returnRateGrid}>
            {returnRateOptions.map((rate) => (
              <TouchableOpacity
                key={rate}
                style={[
                  styles.returnRateCard,
                  selectedReturnRate === rate && styles.returnRateCardSelected,
                  attemptsRemaining <= 0 && styles.returnRateCardDisabled
                ]}
                onPress={() => attemptsRemaining > 0 && setSelectedReturnRate(rate)}
                disabled={attemptsRemaining <= 0}
              >
                <Text style={[
                  styles.returnRateText,
                  selectedReturnRate === rate && styles.returnRateTextSelected,
                  attemptsRemaining <= 0 && styles.returnRateTextDisabled
                ]}>
                  {rate}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Expected Returns Preview */}
        {amount && selectedReturnRate && (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>Investment Preview</Text>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Investment Amount:</Text>
              <Text style={styles.previewValue}>BWP {parseFloat(amount).toLocaleString()}</Text>
            </View>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Expected Return ({selectedReturnRate}%):</Text>
              <Text style={styles.previewValue}>BWP {expectedReturn.toLocaleString()}</Text>
            </View>
            <View style={[styles.previewRow, styles.previewRowTotal]}>
              <Text style={styles.previewLabelTotal}>Total Return:</Text>
              <Text style={styles.previewValueTotal}>BWP {totalReturn.toLocaleString()}</Text>
            </View>
          </View>
        )}

        {/* Calculate Button */}
        <TouchableOpacity
          style={[
            styles.calculateButton,
            (!amount || !selectedReturnRate || loading || attemptsRemaining <= 0) && styles.calculateButtonDisabled
          ]}
          onPress={calculateHoldingTime}
          disabled={!amount || !selectedReturnRate || loading || attemptsRemaining <= 0}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Calculator size={20} color="#ffffff" />
              <Text style={styles.calculateButtonText}>
                {attemptsRemaining <= 0 ? 'Limit Reached' : 'Calculate Holding Time'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* AI Recommendation */}
        {recommendation && (
          <View style={styles.recommendationCard}>
            <View style={styles.recommendationHeader}>
              <TrendingUp size={24} color="#1976d2" />
              <Text style={styles.recommendationTitle}>AI Recommendation</Text>
            </View>
            
            <View style={styles.recommendationContent}>
              <View style={styles.recommendationMain}>
                <Text style={styles.recommendationLabel}>Minimum Holding Time:</Text>
                <Text style={styles.recommendationValue}>{recommendation.minHoldingTime}</Text>
              </View>

              {recommendation.alternatives.length > 0 && (
                <View style={styles.alternativesSection}>
                  <Text style={styles.alternativesTitle}>Alternative Suggestions:</Text>
                  {recommendation.alternatives.map((alt, index) => (
                    <View key={index} style={styles.alternativeItem}>
                      <Text style={styles.alternativeText}>
                        For {alt.returnRate}% return: {alt.holdingTime}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                attemptsRemaining <= 0 && styles.confirmButtonDisabled
              ]}
              onPress={confirmInvestment}
              disabled={attemptsRemaining <= 0}
            >
              <CheckCircle size={20} color="#ffffff" />
              <Text style={styles.confirmButtonText}>
                {attemptsRemaining <= 0 ? 'Limit Reached' : 'Confirm Investment'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Payment Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Investment</Text>
            
            <View style={styles.modalSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Investment Amount:</Text>
                <Text style={styles.summaryValue}>BWP {parseFloat(amount).toLocaleString()}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Return Rate:</Text>
                <Text style={styles.summaryValue}>{selectedReturnRate}%</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Holding Time:</Text>
                <Text style={styles.summaryValue}>{recommendation?.holdingTime}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Processing Fee:</Text>
                <Text style={styles.summaryValue}>BWP 10</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Attempts After:</Text>
                <Text style={styles.summaryValue}>{investmentAttempts + 1}/5</Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryRowTotal]}>
                <Text style={styles.summaryLabelTotal}>Total Amount:</Text>
                <Text style={styles.summaryValueTotal}>
                  BWP {(parseFloat(amount) + 10).toLocaleString()}
                </Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => setShowConfirmModal(false)}
                disabled={processingPayment}
              >
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButtonPrimary, processingPayment && styles.modalButtonDisabled]}
                onPress={processPayment}
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <>
                    <DollarSign size={16} color="#ffffff" />
                    <Text style={styles.modalButtonPrimaryText}>Confirm Payment</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  logoText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1976d2',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 16,
  },
  warningBanner: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  errorBanner: {
    backgroundColor: '#f8d7da',
    borderLeftColor: '#dc3545',
  },
  warningText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#856404',
    textAlign: 'center',
  },
  errorText: {
    color: '#721c24',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currencyLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1976d2',
    paddingVertical: 16,
  },
  minAmountText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 8,
  },
  returnRateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  returnRateCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '18%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  returnRateCardSelected: {
    borderColor: '#1976d2',
    backgroundColor: '#e3f2fd',
  },
  returnRateCardDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  returnRateText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  returnRateTextSelected: {
    color: '#1976d2',
  },
  returnRateTextDisabled: {
    color: '#ccc',
  },
  previewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  previewTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 16,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewRowTotal: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
    marginTop: 8,
  },
  previewLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  previewValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  previewLabelTotal: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  previewValueTotal: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1976d2',
  },
  calculateButton: {
    backgroundColor: '#1976d2',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  calculateButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  calculateButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  recommendationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e3f2fd',
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  recommendationTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1976d2',
    marginLeft: 12,
  },
  recommendationContent: {
    marginBottom: 24,
  },
  recommendationMain: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  recommendationLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginBottom: 4,
  },
  recommendationValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1976d2',
  },
  alternativesSection: {
    marginTop: 8,
  },
  alternativesTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 12,
  },
  alternativeItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  alternativeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  confirmButton: {
    backgroundColor: '#ffd700',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ffd700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmButtonText: {
    color: '#333',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalSummary: {
    marginBottom: 32,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryRowTotal: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  summaryLabelTotal: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  summaryValueTotal: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1976d2',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButtonSecondary: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  modalButtonSecondaryText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#666',
  },
  modalButtonPrimary: {
    backgroundColor: '#1976d2',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonDisabled: {
    opacity: 0.7,
  },
  modalButtonPrimaryText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginLeft: 8,
  },
});