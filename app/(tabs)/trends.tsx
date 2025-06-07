import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { TrendingUp, BookOpen, ExternalLink, ChartPie as PieChart, User, ChartBar as BarChart3 } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

interface TabItem {
  id: string;
  title: string;
  icon: any;
}

const tabs: TabItem[] = [
  { id: 'charts', title: 'Charts', icon: BarChart3 },
  { id: 'insights', title: 'My Insights', icon: User },
  { id: 'resources', title: 'Resources', icon: ExternalLink },
  { id: 'learning', title: 'Learning', icon: BookOpen },
];

const marketCharts = [
  { name: 'S&P 500', data: [2800, 2950, 3100, 2900, 3200, 3350, 3400, 3300, 3500, 3650, 3800, 3750] },
  { name: 'JSE All Share', data: [58000, 59500, 61000, 58500, 62000, 63500, 64000, 62800, 65000, 66200, 67500, 66800] },
  { name: 'Gold (USD/oz)', data: [1800, 1850, 1900, 1825, 1950, 2000, 2050, 1980, 2100, 2150, 2200, 2180] },
  { name: 'Crude Oil', data: [65, 68, 72, 66, 75, 78, 82, 76, 85, 88, 92, 89] },
  { name: 'Silver', data: [22, 23, 25, 21, 26, 28, 30, 27, 32, 34, 36, 35] },
  { name: 'Platinum', data: [950, 980, 1020, 940, 1050, 1080, 1120, 1060, 1150, 1180, 1220, 1200] },
];

const userInsights = [
  { name: 'Investment Growth', data: [150, 300, 500, 800, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3200] },
  { name: 'Monthly Returns', data: [15, 25, 35, 45, 55, 48, 62, 58, 75, 82, 95, 88] },
];

const resources = [
  { title: 'Financial News Today', url: 'https://www.bloomberg.com' },
  { title: 'Economic Reports', url: 'https://www.reuters.com' },
  { title: 'Market Analysis', url: 'https://www.cnbc.com' },
  { title: 'Investment Strategies', url: 'https://www.investopedia.com' },
];

const learningResources = [
  { title: 'Investment Basics for Beginners', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { title: 'Understanding Market Trends', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { title: 'Risk Management Strategies', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { title: 'Building a Diverse Portfolio', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
];

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#1976d2',
  },
};

export default function TrendsScreen() {
  const [activeTab, setActiveTab] = useState('charts');

  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };

  const renderCharts = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.chartSelector}>
        <Text style={styles.sectionTitle}>Market Charts</Text>
        <Text style={styles.sectionSubtitle}>Real-time market data and trends</Text>
      </View>

      {marketCharts.map((chart, index) => (
        <View key={index} style={styles.chartContainer}>
          <Text style={styles.chartTitle}>{chart.name}</Text>
          <LineChart
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              datasets: [{ data: chart.data }],
            }}
            width={screenWidth - 60}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={false}
            withOuterLines={false}
          />
        </View>
      ))}
    </ScrollView>
  );

  const renderInsights = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.chartSelector}>
        <Text style={styles.sectionTitle}>My Investment Insights</Text>
        <Text style={styles.sectionSubtitle}>Your personal investment performance</Text>
      </View>

      {userInsights.map((insight, index) => (
        <View key={index} style={styles.chartContainer}>
          <Text style={styles.chartTitle}>{insight.name}</Text>
          <LineChart
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              datasets: [{ data: insight.data }],
            }}
            width={screenWidth - 60}
            height={200}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`,
              propsForDots: {
                ...chartConfig.propsForDots,
                stroke: '#ffd700',
              },
            }}
            bezier
            style={styles.chart}
            withInnerLines={false}
            withOuterLines={false}
          />
        </View>
      ))}

      <View style={styles.insightSummary}>
        <View style={styles.insightCard}>
          <PieChart size={24} color="#1976d2" />
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Portfolio Growth</Text>
            <Text style={styles.insightValue}>+114% YTD</Text>
          </View>
        </View>

        <View style={styles.insightCard}>
          <TrendingUp size={24} color="#4caf50" />
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Best Performance</Text>
            <Text style={styles.insightValue}>December</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderResources = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.chartSelector}>
        <Text style={styles.sectionTitle}>Market Resources</Text>
        <Text style={styles.sectionSubtitle}>Stay informed with the latest market news</Text>
      </View>

      {resources.map((resource, index) => (
        <TouchableOpacity
          key={index}
          style={styles.resourceCard}
          onPress={() => openLink(resource.url)}
        >
          <View style={styles.resourceContent}>
            <ExternalLink size={24} color="#1976d2" />
            <View style={styles.resourceText}>
              <Text style={styles.resourceTitle}>{resource.title}</Text>
              <Text style={styles.resourceSubtitle}>Tap to open external link</Text>
            </View>
          </View>
          <ExternalLink size={16} color="#666" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderLearning = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.chartSelector}>
        <Text style={styles.sectionTitle}>Learning Hub</Text>
        <Text style={styles.sectionSubtitle}>Educational content to improve your investing skills</Text>
      </View>

      {learningResources.map((resource, index) => (
        <TouchableOpacity
          key={index}
          style={styles.resourceCard}
          onPress={() => openLink(resource.url)}
        >
          <View style={styles.resourceContent}>
            <BookOpen size={24} color="#1976d2" />
            <View style={styles.resourceText}>
              <Text style={styles.resourceTitle}>{resource.title}</Text>
              <Text style={styles.resourceSubtitle}>Educational video content</Text>
            </View>
          </View>
          <ExternalLink size={16} color="#666" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'charts':
        return renderCharts();
      case 'insights':
        return renderInsights();
      case 'resources':
        return renderResources();
      case 'learning':
        return renderLearning();
      default:
        return renderCharts();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Market Trends</Text>
        <Text style={styles.subtitle}>Track markets and grow your knowledge</Text>
      </View>

      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <IconComponent 
                size={20} 
                color={activeTab === tab.id ? '#1976d2' : '#666'} 
              />
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.content}>
        {renderContent()}
      </View>
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: '#e3f2fd',
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginLeft: 4,
  },
  activeTabText: {
    color: '#1976d2',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chartSelector: {
    marginBottom: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 12,
  },
  insightSummary: {
    marginTop: 16,
  },
  insightCard: {
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
  insightContent: {
    marginLeft: 12,
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  insightValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1976d2',
    marginTop: 2,
  },
  resourceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resourceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resourceText: {
    marginLeft: 12,
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  resourceSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 2,
  },
});