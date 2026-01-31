import React from 'react';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useColorScheme } from 'react-native';

import Colors from '../../constants/Colors';
import { Activity, LayoutGrid, Utensils, Users, Settings, Home, Calendar, FileText, MessageCircle, User } from 'lucide-react-native';
import { useAppMode } from '../../context/AppModeContext';
import AuthGuard from '../../components/auth/AuthGuard';
import { Redirect } from 'expo-router';

function TabIcon({ Icon, color, focused, name }: { Icon: any; color: string; focused: boolean; name: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Icon size={24} color={color} />
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { mode } = useAppMode();

  return (
    <AuthGuard fallback={<Redirect href="/auth/login" />}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.tint,
          tabBarInactiveTintColor: theme.tabIconDefault,
          tabBarStyle: {
            backgroundColor: theme.background,
            borderTopColor: theme.borderColor,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          headerShown: false,
        }}>

        {/* 1. Home */}
        <Tabs.Screen
          name="index"
          options={{
            title: mode === 'teleconsultation' ? 'Consult' : 'Dashboard',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon Icon={mode === 'teleconsultation' ? Home : LayoutGrid} color={color} focused={focused} name="Home" />
            ),
          }}
        />

        {/* 2. Daily Engine / Appointments */}
        <Tabs.Screen
          name="daily-engine"
          options={{
            href: mode === 'teleconsultation' ? null : '/daily-engine',
            title: 'Daily Engine',
            tabBarIcon: ({ color, focused }) => <TabIcon Icon={Activity} color={color} focused={focused} name="Daily" />,
          }}
        />
        <Tabs.Screen
          name="appointments"
          options={{
            href: mode === 'reversal' ? null : '/appointments',
            title: 'Appointments',
            tabBarIcon: ({ color, focused }) => <TabIcon Icon={Calendar} color={color} focused={focused} name="Apps" />,
          }}
        />

        {/* 3. Food Log / Records */}
        <Tabs.Screen
          name="food-log"
          options={{
            href: mode === 'teleconsultation' ? null : '/food-log',
            title: 'Food Log',
            tabBarIcon: ({ color, focused }) => <TabIcon Icon={Utensils} color={color} focused={focused} name="Food" />,
          }}
        />
        <Tabs.Screen
          name="records"
          options={{
            href: mode === 'reversal' ? null : '/records',
            title: 'Records',
            tabBarIcon: ({ color, focused }) => <TabIcon Icon={FileText} color={color} focused={focused} name="Records" />,
          }}
        />

        {/* 4. Community / Chat */}
        <Tabs.Screen
          name="community"
          options={{
            href: mode === 'teleconsultation' ? null : '/community',
            title: 'Community',
            tabBarIcon: ({ color, focused }) => <TabIcon Icon={Users} color={color} focused={focused} name="Community" />,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            href: mode === 'reversal' ? null : '/chat',
            title: 'Chat',
            tabBarIcon: ({ color, focused }) => <TabIcon Icon={MessageCircle} color={color} focused={focused} name="Chat" />,
          }}
        />

        {/* 5. Profile - Hidden from Tab Bar */}
        <Tabs.Screen
          name="profile"
          options={{
            href: null, // Hides the tab
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon Icon={User} color={color} focused={focused} name="Profile" />
            ),
          }}
        />

        {/* Profile Details - Hidden from Tab Bar but accesssible */}
        <Tabs.Screen
          name="profile-details"
          options={{
            href: null,
            headerShown: false,
          }}
        />

        {/* 6. Settings */}
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon Icon={Settings} color={color} focused={focused} name="Settings" />
            ),
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
