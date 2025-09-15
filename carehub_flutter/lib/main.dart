import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'src/theme/carehub_theme.dart';
import 'src/pages/root_shell.dart';
import 'src/services/connectivity_service.dart';
import 'src/services/api_health_service.dart';

void main() {
  runApp(const CareHubApp());
}

class CareHubApp extends StatelessWidget {
  const CareHubApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ConnectivityService()),
        ChangeNotifierProvider(create: (_) => ApiHealthService()),
      ],
      child: MaterialApp(
        title: 'CareHub',
        debugShowCheckedModeBanner: false,
        theme: buildCareHubTheme(),
        home: const RootShell(),
      ),
    );
  }
}
