import 'dart:io';
import 'package:dio/dio.dart';
import '../config.dart';
import '../models/medication.dart';
import '../models/medication_log.dart';
import '../models/stats.dart';

class ApiService {
  ApiService._() {
    _dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.apiBaseUrl,
        connectTimeout: const Duration(seconds: 5),
        receiveTimeout: const Duration(seconds: 10),
        headers: {'Content-Type': 'application/json'},
      ),
    );
  }

  static final ApiService instance = ApiService._();
  late final Dio _dio;

  Future<bool> healthCheck() async {
    try {
      final res = await _dio.get('/health');
      return (res.data is Map && res.data['success'] == true) || res.statusCode == 200;
    } on DioException {
      return false;
    }
  }

  // Medications
  Future<List<Medication>> getMedications({int userId = 1}) async {
    final res = await _dio.get('/medications', queryParameters: {'user_id': userId});
    final list = (res.data['data'] as List<dynamic>? ?? []);
    return list.map((e) => Medication.fromJson(Map<String, dynamic>.from(e))).toList();
  }

  Future<Medication> createMedication(Map<String, dynamic> payload) async {
    final res = await _dio.post('/medications', data: {...payload, 'user_id': 1});
    return Medication.fromJson(Map<String, dynamic>.from(res.data['data']));
  }

  Future<Medication> updateMedication(int id, Map<String, dynamic> payload) async {
    final res = await _dio.put('/medications/$id', data: {...payload, 'user_id': 1});
    return Medication.fromJson(Map<String, dynamic>.from(res.data['data']));
  }

  Future<void> deleteMedication(int id) async {
    await _dio.delete('/medications/$id', queryParameters: {'user_id': 1});
  }

  Future<void> logDose(int id, {DateTime? takenAt, String? notes}) async {
    await _dio.post('/medications/$id/log', data: {
      'user_id': 1,
      'taken_at': (takenAt ?? DateTime.now()).toIso8601String(),
      if (notes != null) 'notes': notes,
    });
  }

  Future<List<MedicationLog>> getLogs({int limit = 50}) async {
    final res = await _dio.get('/medications/logs', queryParameters: {
      'user_id': 1,
      'limit': limit,
    });
    final list = (res.data['data'] as List<dynamic>? ?? []);
    return list.map((e) => MedicationLog.fromJson(Map<String, dynamic>.from(e))).toList();
  }

  // User
  Future<Stats> getStats() async {
    final res = await _dio.get('/users/stats', queryParameters: {'user_id': 1});
    return Stats.fromJson(Map<String, dynamic>.from(res.data['data']));
  }

  // OCR upload
  Future<Map<String, dynamic>> processLabelImage(File file) async {
    final formData = FormData.fromMap({
      'image': await MultipartFile.fromFile(file.path, filename: file.uri.pathSegments.last),
    });
    final res = await _dio.post('/ocr/process-image', data: formData);
    final data = Map<String, dynamic>.from(res.data);
    // Server returns { success, data | error }
    if (data['success'] == true && data['data'] is Map) {
      return Map<String, dynamic>.from(data['data']);
    }
    throw DioException.badResponse(
      statusCode: res.statusCode ?? 500,
      requestOptions: res.requestOptions,
      response: res,
    );
  }
}

