import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/medication.dart';
import '../services/api_service.dart';
import '../theme/carehub_theme.dart';

class MedicationsPage extends StatefulWidget {
  const MedicationsPage({super.key});

  @override
  State<MedicationsPage> createState() => _MedicationsPageState();
}

class _MedicationsPageState extends State<MedicationsPage> {
  bool loading = true;
  String? error;
  String? success;
  List<Medication> meds = const [];

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
      final list = await ApiService.instance.getMedications();
      setState(() => meds = list);
    } catch (e) {
      setState(() => error = e.toString());
    } finally {
      setState(() => loading = false);
    }
  }

  Future<void> _logNow(Medication m) async {
    try {
      await ApiService.instance.logDose(m.id, notes: 'Quick log from medications list');
      setState(() => success = 'Logged ${m.name} successfully!');
      Future.delayed(const Duration(seconds: 3), () => setState(() => success = null));
    } catch (e) {
      setState(() => error = e.toString());
    }
  }

  Future<void> _delete(int id) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete medication?'),
        content: const Text('Are you sure you want to delete this medication?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
          FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Delete')),
        ],
      ),
    );
    if (ok != true) return;
    try {
      await ApiService.instance.deleteMedication(id);
      setState(() => meds = meds.where((e) => e.id != id).toList());
      setState(() => success = 'Medication deleted successfully!');
      Future.delayed(const Duration(seconds: 3), () => setState(() => success = null));
    } catch (e) {
      setState(() => error = e.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    if (loading) return const Center(child: CircularProgressIndicator());

    return RefreshIndicator(
      onRefresh: _load,
      child: ListView(
        padding: const EdgeInsets.symmetric(vertical: 8),
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: const [
              Text('My Medications', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
              SizedBox(height: 4),
              Text('Manage and track your medication doses', style: TextStyle(color: CareHubColors.gray600)),
            ]),
          ),
          if (error != null)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Card(color: const Color(0xFFFFEDEC), child: ListTile(
                leading: const Icon(Icons.error, color: CareHubColors.danger),
                title: Text('Error: $error', style: const TextStyle(color: CareHubColors.danger)),
                trailing: TextButton(onPressed: _load, child: const Text('Retry')),
              )),
            ),
          if (success != null)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Card(color: const Color(0xFFE9FBEA), child: ListTile(
                leading: const Icon(Icons.check_circle, color: CareHubColors.success),
                title: Text(success!),
              )),
            ),
          if (meds.isEmpty)
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(children: const [
                Icon(Icons.medication_liquid_outlined, size: 56, color: CareHubColors.gray400),
                SizedBox(height: 8),
                Text('No medications added yet'),
                Text('Add your first medication to track doses and schedules', style: TextStyle(color: CareHubColors.gray600)),
              ]),
            )
          else ...meds.map((m) => Card(
                child: Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    const SizedBox(width: 4),
                    Expanded(
                      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text(m.name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 6),
                        Wrap(spacing: 12, runSpacing: 6, children: [
                          if ((m.dosage ?? '').isNotEmpty)
                            Row(mainAxisSize: MainAxisSize.min, children: const [Icon(Icons.straighten, size: 16, color: Colors.blue), SizedBox(width: 6), Text('Dosage')]),
                          if ((m.dosage ?? '').isNotEmpty) Text(m.dosage!, style: const TextStyle(color: CareHubColors.gray700)),
                          if ((m.frequency ?? '').isNotEmpty)
                            Row(mainAxisSize: MainAxisSize.min, children: const [Icon(Icons.schedule, size: 16, color: Colors.green), SizedBox(width: 6), Text('Frequency')]),
                          if ((m.frequency ?? '').isNotEmpty) Text(m.frequency!, style: const TextStyle(color: CareHubColors.gray700)),
                        ]),
                        if ((m.notes ?? '').isNotEmpty)
                          Container(
                            margin: const EdgeInsets.only(top: 8),
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(color: CareHubColors.gray50, borderRadius: BorderRadius.circular(8)),
                            child: Text(m.notes!, style: const TextStyle(color: CareHubColors.gray700)),
                          ),
                        const SizedBox(height: 6),
                        Text('Added: ${DateFormat('MMM d, yyyy').format(m.createdAt)}', style: const TextStyle(fontSize: 12, color: CareHubColors.gray600)),
                      ]),
                    ),
                    const SizedBox(width: 12),
                    Column(children: [
                      ElevatedButton.icon(onPressed: () => _logNow(m), icon: const Icon(Icons.check), label: const Text('Log Now')),
                      const SizedBox(height: 8),
                      OutlinedButton.icon(onPressed: () => _delete(m.id), icon: const Icon(Icons.delete_outline), label: const Text('Delete')),
                    ]),
                  ]),
                ),
              )),
          const SizedBox(height: 80),
        ],
      ),
    );
  }
}

