import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/stats.dart';
import '../theme/carehub_theme.dart';

class ProgressPage extends StatefulWidget {
  const ProgressPage({super.key});

  @override
  State<ProgressPage> createState() => _ProgressPageState();
}

class _ProgressPageState extends State<ProgressPage> {
  bool loading = true;
  String? error;
  Stats? stats;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() { loading = true; error = null; });
    try {
      final s = await ApiService.instance.getStats();
      setState(() => stats = s);
    } catch (e) {
      setState(() => error = e.toString());
    } finally {
      setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (loading) return const Center(child: CircularProgressIndicator());
    if (error != null) {
      return Center(
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          Text('Error: $error', style: const TextStyle(color: CareHubColors.danger)),
          const SizedBox(height: 12),
          ElevatedButton(onPressed: _load, child: const Text('Retry')),
        ]),
      );
    }
    return RefreshIndicator(
      onRefresh: _load,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('Progress', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          const Text('Your adherence and activity overview', style: TextStyle(color: CareHubColors.gray600)),
          const SizedBox(height: 16),
          Card(child: ListTile(title: const Text('Logged Today'), trailing: Text('${stats?.logsToday ?? 0}', style: const TextStyle(fontWeight: FontWeight.bold)))),
          Card(child: ListTile(title: const Text('Last 7 Days'), trailing: Text('${stats?.logsLast7Days ?? 0}', style: const TextStyle(fontWeight: FontWeight.bold)))),
          Card(child: ListTile(title: const Text('Total Medications'), trailing: Text('${stats?.totalMedications ?? 0}', style: const TextStyle(fontWeight: FontWeight.bold)))),
          Card(child: ListTile(title: const Text('Day Streak'), trailing: Text('${stats?.streakDays ?? 0}', style: const TextStyle(fontWeight: FontWeight.bold)))),
          const SizedBox(height: 12),
          const Text('Charts omitted in MVP mobile. Can add flutter_charts later.', style: TextStyle(color: CareHubColors.gray500, fontSize: 12)),
        ],
      ),
    );
  }
}

