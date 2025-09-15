class Medication {
  final int id;
  final String name;
  final String? dosage;
  final String? frequency;
  final String? notes;
  final DateTime createdAt;

  Medication({
    required this.id,
    required this.name,
    this.dosage,
    this.frequency,
    this.notes,
    required this.createdAt,
  });

  factory Medication.fromJson(Map<String, dynamic> json) {
    return Medication(
      id: json['id'] as int,
      name: json['name'] as String,
      dosage: json['dosage'] as String?,
      frequency: json['frequency'] as String?,
      notes: json['notes'] as String?,
      createdAt: DateTime.tryParse(json['created_at']?.toString() ?? '') ??
          DateTime.now(),
    );
  }
}

