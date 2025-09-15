class Stats {
  final int totalMedications;
  final int logsToday;
  final int logsLast7Days;
  final int streakDays;

  Stats({
    required this.totalMedications,
    required this.logsToday,
    required this.logsLast7Days,
    required this.streakDays,
  });

  factory Stats.fromJson(Map<String, dynamic> json) => Stats(
        totalMedications: (json['total_medications'] ?? 0) as int,
        logsToday: (json['logs_today'] ?? 0) as int,
        logsLast7Days: (json['logs_last_7_days'] ?? 0) as int,
        streakDays: (json['streak_days'] ?? 0) as int,
      );
}

