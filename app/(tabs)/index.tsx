import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useInvestments } from '@/contexts/InvestmentContext';
import { router } from 'expo-router';
import { TrendingUp, Wallet, DollarSign, Clock, LogOut } from 'lucide-react-native';

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const { getTotalInvested, getExpectedReturns, getActiveInvestmentsCount, pastPayouts } = useInvestments();

  const totalInvested = getTotalInvested();
  const expectedReturns = getExpectedReturns();
  const activeInvestments = getActiveInvestmentsCount();
  const totalPayouts = pastPayouts.reduce((sum, payout) => sum + (payout.totalReceived || 0), 0);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('@/assets/images/fnb_logo.webp')}
                style={styles.logo}
              />
              <Text style={styles.logoText}>PulseInvest</Text>
            </View>
            <View style={styles.welcomeContainer}>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>{user?.name}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Portfolio Overview */}
        <View style={styles.portfolioCard}>
          <Text style={styles.portfolioTitle}>Portfolio Overview</Text>
          <View style={styles.portfolioValue}>
            <Text style={styles.portfolioAmount}>BWP {(totalInvested + expectedReturns).toLocaleString()}</Text>
            <Text style={styles.portfolioGrowth}>+{expectedReturns.toLocaleString()} Expected</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <View style={styles.statIcon}>
              <Wallet size={24} color="#1976d2" />
            </View>
            <Text style={styles.statValue}>BWP {totalInvested.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Invested</Text>
          </View>

          <View style={[styles.statCard, styles.statCardGold]}>
            <View style={styles.statIcon}>
              <TrendingUp size={24} color="#ffd700" />
            </View>
            <Text style={styles.statValue}>BWP {expectedReturns.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Expected Returns</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Clock size={24} color="#1976d2" />
            </View>
            <Text style={styles.statValue}>{activeInvestments}</Text>
            <Text style={styles.statLabel}>Active Investments</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <DollarSign size={24} color="#4caf50" />
            </View>
            <Text style={styles.statValue}>BWP {totalPayouts.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Payouts</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/invest')}
          >
            <TrendingUp size={24} color="#ffffff" />
            <Text style={styles.actionButtonText}>New Investment</Text>
          </TouchableOpacity>

          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/current-investments')}
            >
              <Wallet size={20} color="#1976d2" />
              <Text style={styles.actionCardText}>View Investments</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/past-payouts')}
            >
              <DollarSign size={20} color="#1976d2" />
              <Text style={styles.actionCardText}>View History</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          {pastPayouts.slice(0, 3).map((payout) => (
            <View key={payout.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <DollarSign size={16} color="#4caf50" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Investment Completed</Text>
                <Text style={styles.activitySubtitle}>
                  BWP {payout.amount} → BWP {payout.totalReceived}
                </Text>
              </View>
              <Text style={styles.activityDate}>
                {payout.actualPayoutDate?.toLocaleDateString('en-GB', { 
                  day: '2-digit', 
                  month: 'short' 
                })}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerLeft: {
    flex: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  welcomeContainer: {
    marginTop: 4,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  portfolioCard: {
    backgroundColor: '#1976d2',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  portfolioTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    opacity: 0.9,
  },
  portfolioValue: {
    marginTop: 8,
  },
  portfolioAmount: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  portfolioGrowth: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffd700',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardPrimary: {
    borderLeftWidth: 4,
    borderLeftColor: '#1976d2',
  },
  statCardGold: {
    borderLeftWidth: 4,
    borderLeftColor: '#ffd700',
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  actionsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#1976d2',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionCardText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1976d2',
    marginTop: 8,
  },
  activitySection: {
    marginBottom: 32,
  },
  activityItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIcon: {
    backgroundColor: '#e8f5e8',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  activitySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 2,
  },
  activityDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
});