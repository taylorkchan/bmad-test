class AppConfig {
  // Allows override with: --dart-define=API_URL=http://yourhost:3001/api
  // Using 10.0.2.2 for Android emulator to connect to host machine localhost
  static const apiBaseUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://10.0.2.2:3001/api',
  );
}

