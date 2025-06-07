import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInvestments } from '@/contexts/InvestmentContext';
import { router } from 'expo-router';
import { Clock, TrendingUp, Calendar, CheckCircle, AlertCircle, Play, Pause, BarChart3, Users, Target, Award } from 'lucide-react-native';

interface InvestmentWindow {
  id: string;
  startDate: Date;
  endDate: Date;
  status: 'open' | 'closed' | 'upcoming';
  totalInvestments?: number;
  totalAmount?: number;
  participantCount?: number;
}

export default function InvestmentWindowsScreen() {
  const { getInvestmentAttempts, getActiveInvestmentsCount } = useInvestments();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Simulated current window - open for demo
  const currentWindow: InvestmentWindow = {
    id: 'window-2024-01',
    startDate: new Date('2024-01-01T09:00:00'),
    endDate: new Date('2024-12-31T17:00:00'), // Extended for demo
    status: 'open',
    totalInvestments: 1247,
    totalAmount: 2850000,
    participantCount: 892
  };

  // Simulated past windows
  const pastWindows: InvestmentWindow[] = [
    {
      id: 'window-2023-12',
      startDate: new Date('2023-12-01T09:00:00'),
      endDate: new Date('2023-12-31T17:00:00'),
      status: 'closed',
      totalInvestments: 1156,
      totalAmount: 2650000,
      participantCount: 834
    },
    {
      id: 'window-2023-11',
      startDate: new Date('2023-11-01T09:00:00'),
      endDate: new Date('2023-11-30T17:00:00'),
      status: 'closed',
      totalInvestments: 1089,
      totalAmount: 2420000,
      participantCount: 756
    },
    {
      id: 'window-2023-10',
      startDate: new Date('2023-10-01T09:00:00'),
      endDate: new Date('2023-10-31T17:00:00'),
      status: 'closed',
      totalInvestments: 967,
      totalAmount: 2180000,
      participantCount: 689
    }
  ];

  const investmentAttempts = getInvestmentAttempts();
  const maxAttempts = 5;
  const attemptsRemaining = maxAttempts - investmentAttempts;

  // Update current time every second for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (endDate: Date) => {
    const now = currentTime;
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Closed';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleInvestNow = () => {
    if (attemptsRemaining <= 0) {
      Alert.alert(
        'Investment Limit Reached',
        'You have reached the maximum of 5 investments for this 60-day period. Please wait for the next period to make additional investments.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    router.push('/(tabs)/invest');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#4caf50';
      case 'closed': return '#f44336';
      case 'upcoming': return '#ff9800';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Play size={16} color="#ffffff" />;
      case 'closed': return <Pause size={16} color="#ffffff" />;
      case 'upcoming': return <Clock size={16} color="#ffffff" />;
      default: return <Clock size={16} color="#ffffff" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('@/assets/images/fnb_logo.webp')}
              style={styles.logo}
            />
            <Text style={styles.logoText}>PulseInvest</Text>
          </View>
          <Text style={styles.title}>Investment Windows</Text>
          <Text style={styles.subtitle}>Track investment opportunities and limits</Text>
        </View>

        {/* Current Investment Window */}
        <View style={styles.currentWindowCard}>
          <View style={styles.windowHeader}>
            <View style={styles.windowTitleContainer}>
              <Text style={styles.windowTitle}>Current Investment Window</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentWindow.status) }]}>
                {getStatusIcon(currentWindow.status)}
                <Text style={styles.statusText}>
                  {currentWindow.status.charAt(0).toUpperCase() + currentWindow.status.slice(1)}
                </Text>
              </View>
            </View>
          </View>

          {currentWindow.status === 'open' && (
            <View style={styles.countdownContainer}>
              <Clock size={24} color="#ffd700" />
              <View style={styles.countdownContent}>
                <Text style={styles.countdownLabel}>Window closes in:</Text>
                <Text style={styles.countdownValue}>{formatCountdown(currentWindow.endDate)}</Text>
              </View>
            </View>
          )}

          <View style={styles.windowStats}>
            <View style={styles.statItem}>
              <BarChart3 size={20} color="#1976d2" />
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{currentWindow.totalInvestments?.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Total Investments</Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <Target size={20} color="#4caf50" />
              <View style={styles.statContent}>
                <Text style={styles.statValue}>BWP {(currentWindow.totalAmount || 0).toLocaleString()}</Text>
                <Text style={styles.statLabel}>Total Amount</Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <Users size={20} color="#ff9800" />
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{currentWindow.participantCount?.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Participants</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={[
              styles.investButton,
              attemptsRemaining <= 0 && styles.investButtonDisabled
            ]} 
            onPress={handleInvestNow}
            disabled={attemptsRemaining <= 0}
          >
            <TrendingUp size={20} color="#ffffff" />
            <Text style={styles.investButtonText}>
              {attemptsRemaining > 0 ? 'Invest Now' : 'Limit Reached'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Investment Activity Tracking */}
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>Your Investment Activity</Text>
          
          <View style={styles.activityContent}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityLabel}>Investments in Last 60 Days</Text>
              <Text style={styles.activityValue}>
                {investmentAttempts} / {maxAttempts}
              </Text>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${(investmentAttempts / maxAttempts) * 100}%`,
                      backgroundColor: attemptsRemaining > 0 ? '#4caf50' : '#f44336'
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {attemptsRemaining > 0 
                  ? `${attemptsRemaining} attempts remaining`
                  : 'Maximum attempts reached'
                }
              </Text>
            </View>

            {attemptsRemaining <= 2 && attemptsRemaining > 0 && (
              <View style={styles.warningContainer}>
                <AlertCircle size={16} color="#ff9800" />
                <Text style={styles.warningText}>
                  You have {attemptsRemaining} investment{attemptsRemaining === 1 ? '' : 's'} remaining in this period
                </Text>
              </View>
            )}

            {attemptsRemaining <= 0 && (
              <View style={styles.limitContainer}>
                <AlertCircle size={16} color="#f44336" />
                <Text style={styles.limitText}>
                  Investment limit reached. Next reset in 45 days.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Past Investment Windows */}
        <View style={styles.pastWindowsSection}>
          <Text style={styles.sectionTitle}>Past Investment Windows</Text>
          
          {pastWindows.map((window) => (
            <View key={window.id} style={styles.pastWindowCard}>
              <View style={styles.pastWindowHeader}>
                <View style={styles.pastWindowInfo}>
                  <Text style={styles.pastWindowTitle}>
                    Window {window.id.split('-')[1]}/{window.id.split('-')[2]}
                  </Text>
                  <Text style={styles.pastWindowDate}>
                    {formatDate(window.startDate)} - {formatDate(window.endDate)}
                  </Text>
                </View>
                <View style={styles.pastWindowStatus}>
                  <CheckCircle size={16} color="#4caf50" />
                  <Text style={styles.pastWindowStatusText}>Completed</Text>
                </View>
              </View>

              <View style={styles.pastWindowStats}>
                <View style={styles.pastStatItem}>
                  <Text style={styles.pastStatValue}>{window.totalInvestments}</Text>
                  <Text style={styles.pastStatLabel}>Investments</Text>
                </View>
                <View style={styles.pastStatItem}>
                  <Text style={styles.pastStatValue}>BWP {(window.totalAmount || 0).toLocaleString()}</Text>
                  <Text style={styles.pastStatLabel}>Total Amount</Text>
                </View>
                <View style={styles.pastStatItem}>
                  <Text style={styles.pastStatValue}>{window.participantCount}</Text>
                  <Text style={styles.pastStatLabel}>Participants</Text>
                </View>
              </View>

              <View style={styles.pastWindowFooter}>
                <Award size={16} color="#ffd700" />
                <Text style={styles.pastWindowFooterText}>Successfully Deployed • Payouts Complete</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Performance Summary */}
        <View style={styles.performanceCard}>
          <Text style={styles.performanceTitle}>Window Performance Summary</Text>
          
          <View style={styles.performanceGrid}>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceValue}>4</Text>
              <Text style={styles.performanceLabel}>Windows Participated</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceValue}>100%</Text>
              <Text style={styles.performanceLabel}>Success Rate</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceValue}>BWP 2.1K</Text>
              <Text style={styles.performanceLabel}>Avg Investment</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceValue}>15.2%</Text>
              <Text style={styles.performanceLabel}>Avg Return</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
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
  },
  currentWindowCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#e3f2fd',
  },
  windowHeader: {
    marginBottom: 20,
  },
  windowTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  windowTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginLeft: 4,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976d2',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  countdownContent: {
    marginLeft: 12,
    flex: 1,
  },
  countdownLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.9,
  },
  countdownValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffd700',
    marginTop: 2,
  },
  windowStats: {
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statContent: {
    marginLeft: 12,
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 2,
  },
  investButton: {
    backgroundColor: '#1976d2',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  investButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  investButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  activityTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 16,
  },
  activityContent: {
    gap: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  activityValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1976d2',
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 12,
  },
  warningText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#856404',
    marginLeft: 8,
    flex: 1,
  },
  limitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
    borderRadius: 8,
    padding: 12,
  },
  limitText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#721c24',
    marginLeft: 8,
    flex: 1,
  },
  pastWindowsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 16,
  },
  pastWindowCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pastWindowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pastWindowInfo: {
    flex: 1,
  },
  pastWindowTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  pastWindowDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 2,
  },
  pastWindowStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pastWindowStatusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#4caf50',
    marginLeft: 4,
  },
  pastWindowStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pastStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  pastStatValue: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  pastStatLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 2,
  },
  pastWindowFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
  },
  pastWindowFooterText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginLeft: 6,
  },
  performanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
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
  performanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  performanceItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  performanceValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1976d2',
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 32,
  },
});