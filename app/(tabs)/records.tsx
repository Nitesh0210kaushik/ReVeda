import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import HealthVaultView from '../../components/teleconsultation/HealthVaultView';

export default function RecordsScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            <View style={{ padding: 20 }}>
                <Text style={[styles.title, { color: theme.text }]}>My Records</Text>
            </View>
            <HealthVaultView theme={theme} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    title: { fontSize: 24, fontWeight: 'bold' },
});
