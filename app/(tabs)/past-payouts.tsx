import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInvestments } from '@/contexts/InvestmentContext';
import { CircleCheck as CheckCircle, TrendingUp, Calendar, DollarSign } from 'lucide-react-native';

export default function PastPayoutsScreen() {
  const { pastPayouts } = useInvestments();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getProfit = (investment: any) => {
    return (investment.totalReceived || 0) - investment.amount;
  };

  const getProfitPercentage = (investment: any) => {
    const profit = getProfit(investment);
    return ((profit / investment.amount) * 100).toFixed(1);
  };

  const totalInvested = pastPayouts.reduce((sum, payout) => sum + payout.amount, 0);
  const totalReceived = pastPayouts.reduce((sum, payout) => sum + (payout.totalReceived || 0), 0);
  const totalProfit = totalReceived - totalInvested;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Past Payouts</Text>
        <Text style={styles.subtitle}>Your completed investment history</Text>
      </View>

      {pastPayouts.length === 0 ? (
        <View style={styles.emptyState}>
          <CheckCircle size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No Completed Investments</Text>
          <Text style={styles.emptySubtitle}>
            Your completed investments will appear here
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Total Performance</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Invested</Text>
                <Text style={styles.summaryValue}>BWP {totalInvested.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Received</Text>
                <Text style={styles.summaryValuePositive}>BWP {totalReceived.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Profit</Text>
                <Text style={styles.summaryValuePositive}>BWP {totalProfit.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          {/* Payout History */}
          {pastPayouts.map((payout) => (
            <View key={payout.id} style={styles.payoutCard}>
              <View style={styles.payoutHeader}>
                <View style={styles.payoutAmount}>
                  <Text style={styles.payoutAmountText}>
                    BWP {payout.amount.toLocaleString()}
                  </Text>
                  <View style={styles.returnBadge}>
                    <Text style={styles.returnBadgeText}>{payout.returnRate}%</Text>
                  </View>
                </View>
                <View style={styles.statusContainer}>
                  <CheckCircle size={16} color="#4caf50" />
                  <Text style={styles.statusText}>Completed</Text>
                </View>
              </View>

              <View style={styles.payoutDetails}>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <DollarSign size={16} color="#666" />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Amount Received</Text>
                      <Text style={styles.detailValuePositive}>
                        BWP {(payout.totalReceived || 0).toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailItem}>
                    <TrendingUp size={16} color="#666" />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Profit Made</Text>
                      <Text style={styles.detailValuePositive}>
                        BWP {getProfit(payout).toLocaleString()} (+{getProfitPercentage(payout)}%)
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Calendar size={16} color="#666" />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Investment Date</Text>
                      <Text style={styles.detailValue}>
                        {formatDate(payout.dateCreated)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailItem}>
                    <Calendar size={16} color="#666" />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Payout Date</Text>
                      <Text style={styles.detailValue}>
                        {payout.actualPayoutDate ? formatDate(payout.actualPayoutDate) : 'N/A'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.holdingTimeContainer}>
                  <Text style={styles.holdingTimeLabel}>Holding Period:</Text>
                  <Text style={styles.holdingTimeValue}>{payout.holdingTime}</Text>
                </View>
              </View>

              <View style={styles.profitHighlight}>
                <Text style={styles.profitHighlightText}>
                  Return: BWP {payout.amount.toLocaleString()} → BWP {(payout.totalReceived || 0).toLocaleString()}
                </Text>
              </View>
            </View>
          ))}

          {/* Monthly Performance */}
          <View style={styles.performanceCard}>
            <Text style={styles.performanceTitle}>Performance Metrics</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{pastPayouts.length}</Text>
                <Text style={styles.metricLabel}>Completed Investments</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValuePositive}>
                  {totalProfit > 0 ? `+${((totalProfit / totalInvested) * 100).toFixed(1)}%` : '0%'}
                </Text>
                <Text style={styles.metricLabel}>Average Return</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>
                  BWP {pastPayouts.length > 0 ? Math.round(totalInvested / pastPayouts.length).toLocaleString() : '0'}
                </Text>
                <Text style={styles.metricLabel}>Avg Investment</Text>
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
  summaryCard: {
    backgroundColor: '#1976d2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
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
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  summaryValuePositive: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffd700',
  },
  payoutCard: {
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
  payoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  payoutAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payoutAmountText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginRight: 12,
  },
  returnBadge: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  returnBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4caf50',
    marginLeft: 4,
  },
  payoutDetails: {
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
  detailValuePositive: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#4caf50',
  },
  holdingTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  holdingTimeLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  holdingTimeValue: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#1976d2',
  },
  profitHighlight: {
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 8,
  },
  profitHighlightText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#4caf50',
    textAlign: 'center',
  },
  performanceCard: {
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
  performanceTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1976d2',
    marginBottom: 4,
  },
  metricValuePositive: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#4caf50',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
});