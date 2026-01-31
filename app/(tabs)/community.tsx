import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, Image, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Camera, Tag, TrendingDown } from 'lucide-react-native';
import PostCard from '../../components/PostCard';
import Colors from '../../constants/Colors';

export default function CommunityScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const filters = ['All Posts', 'Success Stories', 'Challenges', 'Mentor Tips'];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Community Circle</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Safe, verified support for your reversal journey.</Text>
        </View>
        <TouchableOpacity style={[styles.notificationButton, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }]}>
          <Bell size={20} color={theme.text} />
          <View style={[styles.notificationBadge, { backgroundColor: theme.badgeText }]} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.challengeCard, { backgroundColor: theme.successLight, borderColor: theme.successBorder }]}>
          <View style={styles.challengeHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.challengeIcon, { backgroundColor: theme.success }]}><TrendingDown size={18} color="#fff" /></View>
              <View>
                <Text style={[styles.challengeTitle, { color: theme.text }]}>Active Challenge</Text>
                <Text style={[styles.challengeSubtitle, { color: theme.textSecondary }]}>Post-Meal Walk • Day 3/7</Text>
              </View>
            </View>
            <Text style={[styles.challengeStatus, { color: theme.success, backgroundColor: theme.background }]}>On Track</Text>
          </View>
          <View style={[styles.progressBarBg, { backgroundColor: theme.background }]}><View style={[styles.progressBarFill, { backgroundColor: theme.success, width: '45%' }]} /></View>
          <Text style={[styles.challengeMotivational, { color: theme.textSecondary }]}>You're on a streak! Keep it up.</Text>
        </View>
        <View style={[styles.createPostCard, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }]}>
          <View style={styles.inputRow}>
            <View style={[styles.currentUserAvatar, { backgroundColor: theme.borderColor }]}><Image source={{ uri: 'https://i.pravatar.cc/150?u=nitesh' }} style={styles.avatarImage} /></View>
            <TextInput placeholder="Share your progress..." placeholderTextColor={theme.textSecondary} style={[styles.textInput, { color: theme.text }]} />
          </View>
          <View style={[styles.postActions, { borderTopColor: theme.borderColor }]}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.background }]}><Camera size={16} color={theme.success} /><Text style={[styles.actionButtonText, { color: theme.textSecondary }]}>Photo</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.background }]}><Tag size={16} color={theme.success} /><Text style={[styles.actionButtonText, { color: theme.textSecondary }]}>Tag</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.postButton, { backgroundColor: theme.success }]}><Text style={styles.postButtonText}>Post</Text></TouchableOpacity>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {filters.map((filter, index) => (<TouchableOpacity key={index} style={[styles.filterChip, { backgroundColor: index === 0 ? theme.text : theme.cardBackground, borderColor: index === 0 ? theme.text : theme.borderColor }]}><Text style={[styles.filterText, { color: index === 0 ? theme.background : theme.textSecondary }]}>{filter}</Text></TouchableOpacity>))}
        </ScrollView>
        <PostCard theme={theme} user={{ name: 'Dr. Anjali Sharma', avatar: 'https://i.pravatar.cc/150?u=anjali', isVerified: true }} pinned={true} timestamp="Monday Motivation • 4h ago" content="Remember: Reversal is not a race. Every small change in your diet, every post-meal walk, adds up." stats={{ likes: 124, comments: 18 }} />
        <PostCard theme={theme} user={{ name: 'Priya Kapoor', avatar: 'https://i.pravatar.cc/150?u=priya' }} medSafe={true} timestamp="Type 2 Reversal Journey • 2h ago" content="Just got my latest reports back! 🎉 My HbA1c dropped from 8.2 to 6.5 in just 3 months." stats={{ likes: 45, comments: 8, shares: true }} insight={{ text: "Fasting Sugar: 110 mg/dL (was 150)" }} />
        <PostCard theme={theme} user={{ name: 'Coach Vikram', avatar: 'https://i.pravatar.cc/150?u=vikram' }} timestamp="Tip of the Day • 6h ago" title="Myth-busting: Fruits & Diabetes 🍎" content="Many think you must stop eating fruit entirely. Not true! The key is pairing with protein or fat." stats={{ likes: 210, comments: 42 }} image="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop" />
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  headerContainer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  headerSubtitle: { fontSize: 13 },
  notificationButton: { padding: 8, borderRadius: 20, borderWidth: 1 },
  notificationBadge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4 },
  challengeCard: { borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1 },
  challengeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  challengeIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  challengeTitle: { fontSize: 14, fontWeight: 'bold' },
  challengeSubtitle: { fontSize: 12 },
  challengeStatus: { fontSize: 10, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  progressBarBg: { height: 6, borderRadius: 3, marginBottom: 8, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
  challengeMotivational: { fontSize: 11, fontStyle: 'italic' },
  createPostCard: { borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 2 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  currentUserAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 12, overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%' },
  textInput: { flex: 1, fontSize: 14 },
  postActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1 },
  actionButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  actionButtonText: { fontSize: 12, marginLeft: 6, fontWeight: '600' },
  postButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  postButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  filterScroll: { marginBottom: 20 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 10 },
  filterText: { fontSize: 13, fontWeight: '600' },
});
