import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInvestments } from '@/contexts/InvestmentContext';
import { TrendingUp, Clock, DollarSign, Calendar } from 'lucide-react-native';

export default function CurrentInvestmentsScreen() {
  const { investments } = useInvestments();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getExpectedReturn = (amount: number, returnRate: number) => {
    return amount * (returnRate / 100);
  };

  const getTotalReturn = (amount: number, returnRate: number) => {
    return amount + getExpectedReturn(amount, returnRate);
  };

  const getStatusColor = (expectedDate: Date) => {
    const now = new Date();
    const daysUntilPayout = Math.ceil((expectedDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilPayout <= 30) return '#ffd700';
    if (daysUntilPayout <= 90) return '#ff9800';
    return '#4caf50';
  };

  const getDaysUntilPayout = (expectedDate: Date) => {
    const now = new Date();
    const daysUntilPayout = Math.ceil((expectedDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilPayout <= 0) return 'Due now';
    if (daysUntilPayout === 1) return '1 day';
    if (daysUntilPayout <= 30) return `${daysUntilPayout} days`;
    if (daysUntilPayout <= 365) return `${Math.ceil(daysUntilPayout / 30)} months`;
    return `${Math.ceil(daysUntilPayout / 365)} years`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Current Investments</Text>
        <Text style={styles.subtitle}>Track your active investments</Text>
      </View>

      {investments.length === 0 ? (
        <View style={styles.emptyState}>
          <TrendingUp size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No Active Investments</Text>
          <Text style={styles.emptySubtitle}>
            Start investing to see your portfolio grow
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {investments.map((investment) => (
            <View key={investment.id} style={styles.investmentCard}>
              <View style={styles.investmentHeader}>
                <View style={styles.investmentAmount}>
                  <Text style={styles.investmentAmountText}>
                    BWP {investment.amount.toLocaleString()}
                  </Text>
                  <View style={[styles.returnBadge, { backgroundColor: getStatusColor(investment.expectedPayoutDate) }]}>
                    <Text style={styles.returnBadgeText}>{investment.returnRate}%</Text>
                  </View>
                </View>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(investment.expectedPayoutDate) }]} />
                  <Text style={styles.statusText}>Active</Text>
                </View>
              </View>

              <View style={styles.investmentDetails}>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <DollarSign size={16} color="#666" />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Expected Return</Text>
                      <Text style={styles.detailValue}>
                        BWP {getExpectedReturn(investment.amount, investment.returnRate).toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailItem}>
                    <TrendingUp size={16} color="#666" />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Total Return</Text>
                      <Text style={styles.detailValuePrimary}>
                        BWP {getTotalReturn(investment.amount, investment.returnRate).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Clock size={16} color="#666" />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Holding Time</Text>
                      <Text style={styles.detailValue}>{investment.holdingTime}</Text>
                    </View>
                  </View>

                  <View style={styles.detailItem}>
                    <Calendar size={16} color="#666" />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Payout Date</Text>
                      <Text style={styles.detailValue}>
                        {formatDate(investment.expectedPayoutDate)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.timeUntilPayout}>
                  <Text style={styles.timeUntilPayoutLabel}>Time until payout:</Text>
                  <Text style={[styles.timeUntilPayoutValue, { color: getStatusColor(investment.expectedPayoutDate) }]}>
                    {getDaysUntilPayout(investment.expectedPayoutDate)}
                  </Text>
                </View>
              </View>

              <View style={styles.investmentFooter}>
                <Text style={styles.investmentDate}>
                  Invested on {formatDate(investment.dateCreated)}
                </Text>
              </View>
            </View>
          ))}

          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Investment Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Invested</Text>
                <Text style={styles.summaryValue}>
                  BWP {investments.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Expected Returns</Text>
                <Text style={styles.summaryValuePositive}>
                  BWP {investments.reduce((sum, inv) => sum + getExpectedReturn(inv.amount, inv.returnRate), 0).toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
  investmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  investmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  investmentAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  investmentAmountText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1976d2',
    marginRight: 12,
  },
  returnBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  returnBadgeText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  investmentDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailContent: {
    marginLeft: 8,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  detailValuePrimary: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#1976d2',
  },
  timeUntilPayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  timeUntilPayoutLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  timeUntilPayoutValue: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  investmentFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  investmentDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  summary: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  summaryValuePositive: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#4caf50',
  },
});