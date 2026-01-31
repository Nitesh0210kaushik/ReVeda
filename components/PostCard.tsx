import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal, Pin, Leaf, Play } from 'lucide-react-native';
import { Theme } from '../constants/Colors';

interface PostCardProps {
  theme: Theme;
  user: { name: string; avatar: string; tag?: string; isVerified?: boolean };
  pinned?: boolean;
  medSafe?: boolean;
  timestamp: string;
  content: string;
  stats: { likes: number; comments: number; shares?: boolean };
  insight?: { text: string };
  image?: string;
  title?: string;
}

export default function PostCard({ theme, user, pinned, medSafe, timestamp, content, stats, insight, image, title }: PostCardProps) {
  return (
    <View style={[styles.postCard, { backgroundColor: theme.cardBackground, borderColor: pinned ? theme.successBorder : theme.borderColor, borderWidth: pinned ? 1.5 : 1 }]}>
      <View style={styles.postHeader}>
        <Image source={{ uri: user.avatar }} style={[styles.avatar, { backgroundColor: theme.borderColor }]} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.userName, { color: theme.text }]}>{user.name}</Text>
            {user.isVerified && (
              <View style={[styles.verifiedBadge, { backgroundColor: theme.successLight }]}>
                <Text style={[styles.verifiedText, { color: theme.success }]}>CMO</Text>
              </View>
            )}
          </View>
          <Text style={[styles.timestamp, { color: theme.textSecondary }]}>{user.tag ? `${user.tag} • ` : ''}{timestamp}</Text>
        </View>
        {pinned && (
          <View style={[styles.pinnedLabel, { backgroundColor: theme.successLight }]}>
            <Pin size={12} color={theme.success} style={{ marginRight: 4 }} />
            <Text style={[styles.pinnedText, { color: theme.success }]}>Pinned</Text>
          </View>
        )}
        {medSafe && (
          <View style={styles.medSafeBadge}>
            <Leaf size={12} color="#fff" style={{ marginRight: 4 }} />
            <Text style={styles.medSafeText}>Med-Safe</Text>
          </View>
        )}
        {!pinned && !medSafe && <MoreHorizontal size={20} color={theme.textSecondary} />}
      </View>
      {title && <Text style={[styles.postTitle, { color: theme.text }]}>{title}</Text>}
      <Text style={[styles.postBody, { color: theme.text }]}>{content}</Text>
      {insight && (
        <View style={[styles.insightBox, { backgroundColor: theme.successLight }]}>
          <Text style={[styles.insightText, { color: theme.text }]}>{insight.text}</Text>
        </View>
      )}
      {image && (
        <View style={[styles.mediaPlaceholder, { backgroundColor: theme.borderColor }]}>
          <Image source={{ uri: image }} style={styles.postImage} />
          <View style={styles.playIconOverlay}>
            <Play size={24} color="#fff" fill="#fff" />
          </View>
        </View>
      )}
      <View style={[styles.interactionRow, { borderTopColor: theme.borderColor }]}>
        <View style={styles.interactionItem}>
          <ThumbsUp size={16} color={theme.textSecondary} />
          <Text style={[styles.interactionText, { color: theme.textSecondary }]}>{stats.likes} Likes</Text>
        </View>
        <View style={styles.interactionItem}>
          <MessageSquare size={16} color={theme.textSecondary} />
          <Text style={[styles.interactionText, { color: theme.textSecondary }]}>{stats.comments} Comments</Text>
        </View>
        {stats.shares && (
          <View style={styles.interactionItem}>
            <Share2 size={16} color={theme.textSecondary} />
            <Text style={[styles.interactionText, { color: theme.textSecondary }]}>Share</Text>
          </View>
        )}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  postCard: { borderRadius: 16, padding: 16, marginBottom: 16 },
  postHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  userName: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  verifiedBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8 },
  verifiedText: { fontSize: 10, fontWeight: 'bold' },
  timestamp: { fontSize: 12 },
  pinnedLabel: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  pinnedText: { fontSize: 10, fontWeight: 'bold' },
  medSafeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2ECC71', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  medSafeText: { fontSize: 10, color: '#fff', fontWeight: 'bold' },
  postBody: { fontSize: 14, lineHeight: 22, marginBottom: 12 },
  postTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  insightBox: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 12 },
  insightText: { fontSize: 13, fontWeight: '500' },
  mediaPlaceholder: { width: '100%', height: 180, borderRadius: 12, marginBottom: 12, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  postImage: { width: '100%', height: '100%' },
  playIconOverlay: { position: 'absolute', width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  interactionRow: { flexDirection: 'row', paddingTop: 12, borderTopWidth: 1 },
  interactionItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  interactionText: { fontSize: 12, marginLeft: 6, fontWeight: '500' },
});
