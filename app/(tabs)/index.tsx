import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import ModeToggle from '../../components/ModeToggle';
import TeleConsultationView from '../../components/home/TeleConsultationView';
import DiabetesReversalView from '../../components/home/DiabetesReversalView';
import { useAppMode } from '../../context/AppModeContext';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { mode } = useAppMode();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View style={{ flex: 1 }}>
        <ModeToggle />

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View>
            {mode === 'teleconsultation' ? (
              <TeleConsultationView theme={theme} />
            ) : (
              <DiabetesReversalView theme={theme} />
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
