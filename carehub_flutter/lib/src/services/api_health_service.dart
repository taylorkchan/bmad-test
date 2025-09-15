import 'dart:async';
import 'package:flutter/foundation.dart';
import 'api_service.dart';

class ApiHealthService extends ChangeNotifier {
  bool _isOnline = false;
  bool get isOnline => _isOnline;

  Timer? _timer;

  ApiHealthService() {
    _check();
    _timer = Timer.periodic(const Duration(seconds: 30), (_) => _check());
  }

  Future<void> _check() async {
    final ok = await ApiService.instance.healthCheck();
    if (ok != _isOnline) {
      _isOnline = ok;
      notifyListeners();
    }
  }

  Future<void> refresh() => _check();

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}

