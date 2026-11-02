import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_700Bold,
  Sora_800ExtraBold,
} from '@expo-google-fonts/sora';
import { ThemeProvider } from './src/theme/ThemeContext';
import { PlayerProvider } from './src/store/PlayerContext';
import { AppNavigator } from './src/navigation';

export default function App(): React.JSX.Element {
  const [fontsLoaded, fontError] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_700Bold,
    Sora_800ExtraBold,
  });

  // Fallback timer: prevents app from hanging indefinitely on cold start if font loading stalls
  const [fontTimeout, setFontTimeout] = React.useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFontTimeout(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded && !fontError && !fontTimeout) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22D3FF" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PlayerProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </PlayerProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#050B1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
