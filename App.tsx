import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AuthProvider, useAuth } from './src/presentation/context/AuthContext';
import {
  CompanyHomeScreen,
  CreatorHomeScreen,
  LoginScreen,
  RegisterScreen,
  WelcomeScreen,
} from './src/presentation/screens';
import { colors } from './src/presentation/theme';

type AuthRoute = 'welcome' | 'login' | 'register';

function RootNavigator() {
  const { user, isLoading } = useAuth();
  const [route, setRoute] = useState<AuthRoute>('welcome');

  useEffect(() => {
    if (user) {
      setRoute('welcome');
    }
  }, [user]);

  if (isLoading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!user) {
    if (route === 'login') {
      return (
        <LoginScreen
          onBack={() => setRoute('welcome')}
          onRegister={() => setRoute('register')}
        />
      );
    }

    if (route === 'register') {
      return (
        <RegisterScreen
          onBack={() => setRoute('welcome')}
          onLogin={() => setRoute('login')}
        />
      );
    }

    return (
      <WelcomeScreen
        onLogin={() => setRoute('login')}
        onRegister={() => setRoute('register')}
      />
    );
  }

  return user.isCompany() ? <CompanyHomeScreen /> : <CreatorHomeScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
