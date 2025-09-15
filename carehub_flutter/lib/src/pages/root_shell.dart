import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/connectivity_service.dart';
import '../services/api_health_service.dart';
import '../theme/carehub_theme.dart';
import '../widgets/status_badges.dart';
import 'dashboard_page.dart';
import 'medications_page.dart';
import 'add_medication_page.dart';
import 'progress_page.dart';
import 'history_page.dart';
import 'profile_page.dart';

class RootShell extends StatefulWidget {
  const RootShell({super.key});

  @override
  State<RootShell> createState() => _RootShellState();
}

class _RootShellState extends State<RootShell> {
  int _index = 0;

  final _pages = const [
    DashboardPage(),
    MedicationsPage(),
    HistoryPage(),
    ProgressPage(),
    ProfilePage(),
  ];

  @override
  Widget build(BuildContext context) {
    final isDeviceOnline = context.watch<ConnectivityService>().isOnline;
    final apiOnline = context.watch<ApiHealthService?>()?.isOnline ?? false;

    return Scaffold(
      body: Column(
        children: [
          // Status banners
          if (!isDeviceOnline)
            Container(
              width: double.infinity,
              color: CareHubColors.dangerSoft,
              padding: const EdgeInsets.all(12),
              child: const Text(
                "Offline: changes will sync when connected.",
                style: TextStyle(color: CareHubColors.danger),
              ),
            ),
          if (isDeviceOnline && !apiOnline)
            Container(
              width: double.infinity,
              color: CareHubColors.warningSoft,
              padding: const EdgeInsets.all(12),
              child: const Text(
                "API Unavailable: running in offline mode.",
                style: TextStyle(color: CareHubColors.warning),
              ),
            ),
          Expanded(
            child: IndexedStack(index: _index, children: _pages),
          ),
        ],
      ),
      bottomNavigationBar: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            decoration: const BoxDecoration(
              border: Border(
                top: BorderSide(color: CareHubColors.navBorder),
              ),
            ),
            child: NavigationBar(
              backgroundColor: CareHubColors.navBackground,
              selectedIndex: _index,
              onDestinationSelected: (v) => setState(() => _index = v),
              indicatorColor: Colors.transparent,
              labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
              destinations: const [
                NavigationDestination(
                  icon: Icon(Icons.home_outlined, color: CareHubColors.navInactive),
                  selectedIcon: Icon(Icons.home, color: CareHubColors.navActive),
                  label: 'Dashboard',
                ),
                NavigationDestination(
                  icon: Icon(Icons.medication_outlined, color: CareHubColors.navInactive),
                  selectedIcon: Icon(Icons.medication, color: CareHubColors.navActive),
                  label: 'Medications',
                ),
                NavigationDestination(
                  icon: Icon(Icons.history_outlined, color: CareHubColors.navInactive),
                  selectedIcon: Icon(Icons.history, color: CareHubColors.navActive),
                  label: 'Log History',
                ),
                NavigationDestination(
                  icon: Icon(Icons.analytics_outlined, color: CareHubColors.navInactive),
                  selectedIcon: Icon(Icons.analytics, color: CareHubColors.navActive),
                  label: 'Progress',
                ),
                NavigationDestination(
                  icon: Icon(Icons.person_outline, color: CareHubColors.navInactive),
                  selectedIcon: Icon(Icons.person, color: CareHubColors.navActive),
                  label: 'Profile',
                ),
              ],
            ),
          ),
          Container(
            height: 20, // Safe area padding
            color: CareHubColors.navBackground,
          ),
        ],
      ),
      floatingActionButton: _index == 1
          ? FloatingActionButton.extended(
              backgroundColor: CareHubColors.primary,
              foregroundColor: CareHubColors.textPrimary,
              onPressed: () async {
                await Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const AddMedicationPage()),
                );
                setState(() {});
              },
              icon: const Icon(Icons.add),
              label: const Text('Add Medication'),
            )
          : null,
    );
  }
}

