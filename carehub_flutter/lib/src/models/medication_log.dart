class MedicationLog {
  final int id;
  final int medicationId;
  final DateTime takenAt;
  final String? notes;
  final String medicationName;
  final String? dosage;

  MedicationLog({
    required this.id,
    required this.medicationId,
    required this.takenAt,
    this.notes,
    required this.medicationName,
    this.dosage,
  });

  factory MedicationLog.fromJson(Map<String, dynamic> json) {
    return MedicationLog(
      id: json['id'] as int,
      medicationId: json['medication_id'] as int,
      takenAt: DateTime.tryParse(json['taken_at']?.toString() ?? '') ??
          DateTime.now(),
      notes: json['notes'] as String?,
      medicationName: json['medication_name']?.toString() ?? '',
      dosage: json['dosage'] as String?,
    );
  }
}

