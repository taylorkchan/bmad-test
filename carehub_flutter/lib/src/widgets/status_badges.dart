import 'package:flutter/material.dart';
import '../theme/carehub_theme.dart';

class StatusDot extends StatelessWidget {
  final bool ok;
  final String label;
  final Color okColor;
  final Color badColor;
  const StatusDot({
    super.key,
    required this.ok,
    required this.label,
    this.okColor = CareHubColors.success,
    this.badColor = CareHubColors.warning,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            color: ok ? okColor : badColor,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 6),
        Text(label, style: const TextStyle(fontSize: 12)),
      ],
    );
  }
}

