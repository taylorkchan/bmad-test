import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';
import '../models/stats.dart';
import '../models/medication_log.dart';
import '../theme/carehub_theme.dart';
import 'add_medication_page.dart';
import 'history_page.dart';
import 'medications_page.dart';
import 'progress_page.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  bool loading = true;
  String? error;
  Stats? stats;
  List<MedicationLog> recent = const [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final s = await ApiService.instance.getStats();
      final logs = await ApiService.instance.getLogs(limit: 10);
      setState(() {
        stats = s;
        recent = logs.take(5).toList();
      });
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
      return Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Error: $error', style: const TextStyle(color: CareHubColors.danger)),
            const SizedBox(height: 12),
            ElevatedButton(onPressed: _load, child: const Text('Retry')),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _load,
      child: ListView(
        padding: const EdgeInsets.symmetric(vertical: 8),
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: const [
                  Text('Dashboard', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                  SizedBox(height: 4),
                  Text('Track your medication progress', style: TextStyle(color: CareHubColors.gray600)),
                ]),
                FilledButton.icon(
                  onPressed: () async {
                    await Navigator.of(context).push(MaterialPageRoute(builder: (_) => const AddMedicationPage()));
                    _load();
                  },
                  icon: const Icon(Icons.add),
                  label: const Text('Log Medication'),
                )
              ],
            ),
          ),

          // Stats grid
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: GridView.count(
              shrinkWrap: true,
              crossAxisCount: 2,
              childAspectRatio: 1.9,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                _StatCard(label: 'Total Medications', value: '${stats?.totalMedications ?? 0}', color: CareHubColors.primary),
                _StatCard(label: 'Logged Today', value: '${stats?.logsToday ?? 0}', color: CareHubColors.success),
                _StatCard(label: 'Last 7 Days', value: '${stats?.logsLast7Days ?? 0}', color: CareHubColors.warning),
                _StatCard(label: 'Day Streak', value: '${stats?.streakDays ?? 0}', color: CareHubColors.info),
              ],
            ),
          ),

          // Quick actions
          Padding(
            padding: const EdgeInsets.all(16),
            child: Wrap(spacing: 8, runSpacing: 8, children: [
              FilledButton.icon(onPressed: () async { await Navigator.of(context).push(MaterialPageRoute(builder: (_) => const AddMedicationPage())); _load(); }, icon: const Icon(Icons.add), label: const Text('Log Medication')),
              OutlinedButton.icon(onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const MedicationsPage())), icon: const Icon(Icons.medical_information_outlined), label: const Text('Manage')),
              TextButton.icon(onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const ProgressPage())), icon: const Icon(Icons.show_chart_outlined), label: const Text('Progress')),
              TextButton.icon(onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const HistoryPage())), icon: const Icon(Icons.history), label: const Text('History')),
            ]),
          ),

          // Recent activity
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Recent Activity', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 18)),
                TextButton(onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const HistoryPage())), child: const Text('View All')),
              ],
            ),
          ),
          if (recent.isEmpty)
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(children: const [
                Icon(Icons.inbox_outlined, size: 48, color: CareHubColors.gray400),
                SizedBox(height: 8),
                Text('No medication logs yet'),
                Text('Start tracking your medication adherence', style: TextStyle(color: CareHubColors.gray600)),
              ]),
            )
          else ...recent.map((log) => ListTile(
                leading: const CircleAvatar(backgroundColor: CareHubColors.primarySoft, child: Icon(Icons.medication, color: CareHubColors.primary)),
                title: Text(log.medicationName),
                subtitle: Text([
                  if ((log.dosage ?? '').isNotEmpty) 'Dosage: ${log.dosage}',
                  if ((log.notes ?? '').isNotEmpty) log.notes!,
                ].where((e) => e.isNotEmpty).join(' · ')),
                trailing: Text(DateFormat('MMM d, h:mm a').format(log.takenAt), style: const TextStyle(color: CareHubColors.gray600, fontSize: 12)),
              )),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final Color color;
  const _StatCard({required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(value, style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: color)),
          const SizedBox(height: 6),
          Text(label, style: const TextStyle(color: CareHubColors.gray600)),
        ]),
      ),
    );
  }
}
