import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LayoutGrid, Users, Settings } from 'lucide-react-native';

function TabIcon({ Icon, color, focused, name }: { Icon: any; color: string; focused: boolean; name: string }) {
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <Icon size={24} color={color} />
            <Text style={{
                color: color,
                fontSize: 10,
                fontFamily: 'Outfit-Medium',
                textAlign: 'center'
            }}>
                {name}
            </Text>
        </View>
    );
}

export default function AdminLayout() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: theme.background,
                    borderTopColor: theme.borderColor,
                    height: 60 + insets.bottom,
                    paddingBottom: insets.bottom + 4,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: theme.tint,
                tabBarInactiveTintColor: 'gray',
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon Icon={LayoutGrid} color={color} focused={focused} name="Dashboard" />
                    ),
                }}
            />
            <Tabs.Screen
                name="doctors"
                options={{
                    title: 'Doctors',
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon Icon={Users} color={color} focused={focused} name="Doctors" />
                    ),
                }}
            />
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
    );
}
