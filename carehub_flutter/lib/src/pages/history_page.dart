import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/medication_log.dart';
import '../services/api_service.dart';
import '../theme/carehub_theme.dart';

class HistoryPage extends StatefulWidget {
  const HistoryPage({super.key});

  @override
  State<HistoryPage> createState() => _HistoryPageState();
}

class _HistoryPageState extends State<HistoryPage> {
  bool loading = true;
  String? error;
  List<MedicationLog> logs = const [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() { loading = true; error = null; });
    try {
      final l = await ApiService.instance.getLogs(limit: 100);
      setState(() => logs = l);
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
    if (logs.isEmpty) {
      return const Center(child: Text('No medication logs yet'));
    }
    return RefreshIndicator(
      onRefresh: _load,
      child: ListView.separated(
        itemCount: logs.length,
        separatorBuilder: (_, __) => const Divider(height: 1),
        itemBuilder: (ctx, i) {
          final l = logs[i];
          return ListTile(
            leading: const CircleAvatar(child: Icon(Icons.check)),
            title: Text(l.medicationName),
            subtitle: Text([
              if ((l.dosage ?? '').isNotEmpty) 'Dosage: ${l.dosage}',
              if ((l.notes ?? '').isNotEmpty) l.notes!,
            ].where((e) => e.isNotEmpty).join(' · ')),
            trailing: Text(DateFormat('MMM d, h:mm a').format(l.takenAt), style: const TextStyle(color: CareHubColors.gray600, fontSize: 12)),
          );
        },
      ),
    );
  }
}

