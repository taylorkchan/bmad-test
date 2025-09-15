import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../services/api_service.dart';
import '../theme/carehub_theme.dart';

class AddMedicationPage extends StatefulWidget {
  const AddMedicationPage({super.key});

  @override
  State<AddMedicationPage> createState() => _AddMedicationPageState();
}

class _AddMedicationPageState extends State<AddMedicationPage> {
  final _form = GlobalKey<FormState>();
  final _name = TextEditingController(text: 'Ibuprofen');
  final _dosage = TextEditingController(text: '200');
  final _frequency = TextEditingController(text: 'Twice a day');
  final _notes = TextEditingController(text: 'Take one tablet in the morning and one in the evening.');
  bool saving = false;
  String? error;

  Future<void> _submit() async {
    if (!_form.currentState!.validate()) return;
    setState(() { saving = true; error = null; });
    try {
      await ApiService.instance.createMedication({
        'name': _name.text.trim(),
        'dosage': _dosage.text.trim().isEmpty ? null : _dosage.text.trim(),
        'frequency': _frequency.text.trim().isEmpty ? null : _frequency.text.trim(),
        'notes': _notes.text.trim().isEmpty ? null : _notes.text.trim(),
      });
      if (!mounted) return;
      Navigator.of(context).pop(true);
    } catch (e) {
      setState(() => error = e.toString());
    } finally {
      setState(() => saving = false);
    }
  }

  Future<void> _scanLabel() async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(source: ImageSource.camera, maxWidth: 1600, imageQuality: 85);
    if (picked == null) return;
    setState(() { saving = true; error = null; });
    try {
      final data = await ApiService.instance.processLabelImage(File(picked.path));
      // Fill fields if present
      if ((data['medicationName'] ?? '').toString().isNotEmpty) _name.text = data['medicationName'];
      if ((data['dosage'] ?? '').toString().isNotEmpty) _dosage.text = data['dosage'];
      if ((data['instructions'] ?? '').toString().isNotEmpty) _frequency.text = data['instructions'];
      if ((data['rawText'] ?? '').toString().isNotEmpty) {
        final existing = _notes.text.trim();
        _notes.text = [existing, data['rawText']].where((e) => e != null && e.toString().trim().isNotEmpty).join('\n');
      }
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Fields prefilled from label')));
    } catch (e) {
      setState(() => error = 'OCR failed: $e');
    } finally {
      setState(() => saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: CareHubColors.backgroundModal,
      body: SafeArea(
        child: Column(
          children: [
            // Sticky Header with backdrop blur
            Container(
              decoration: const BoxDecoration(
                color: Color(0x80111A22), // Semi-transparent for blur effect
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.close, color: CareHubColors.textPrimary, size: 28),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                    Expanded(
                      child: Text(
                        'Edit Medication',
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          color: CareHubColors.textPrimary,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    const SizedBox(width: 48), // Balance the close button
                  ],
                ),
              ),
            ),
            
            // Main Content
            Expanded(
              child: AbsorbPointer(
                absorbing: saving,
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Form(
                    key: _form,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (error != null)
                          Container(
                            padding: const EdgeInsets.all(16),
                            margin: const EdgeInsets.only(bottom: 24),
                            decoration: BoxDecoration(
                              color: CareHubColors.dangerSoft,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: CareHubColors.danger),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.error, color: CareHubColors.danger),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Text(
                                    'Error: $error',
                                    style: const TextStyle(color: CareHubColors.danger),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        
                        // Medication Name
                        _buildFormField(
                          label: 'Medication Name',
                          controller: _name,
                          validator: (v) => (v == null || v.trim().isEmpty) ? 'Required' : null,
                        ),
                        
                        const SizedBox(height: 24),
                        
                        // Dosage with suffix
                        _buildFormField(
                          label: 'Dosage',
                          controller: _dosage,
                          suffix: 'mg',
                        ),
                        
                        const SizedBox(height: 24),
                        
                        // Frequency Dropdown
                        _buildDropdownField(),
                        
                        const SizedBox(height: 24),
                        
                        // Instructions (Notes)
                        _buildFormField(
                          label: 'Instructions',
                          controller: _notes,
                          maxLines: 4,
                          placeholder: 'e.g. Take with food',
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            
            // Sticky Footer
            Container(
              decoration: const BoxDecoration(
                color: Color(0x80111A22), // Semi-transparent for blur effect
              ),
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: saving ? null : () => Navigator.of(context).pop(),
                      style: OutlinedButton.styleFrom(
                        backgroundColor: CareHubColors.border,
                        foregroundColor: CareHubColors.textPrimary,
                        side: const BorderSide(color: CareHubColors.border),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: const Text(
                        'Cancel',
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 16,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: FilledButton(
                      onPressed: saving ? null : _submit,
                      style: FilledButton.styleFrom(
                        backgroundColor: CareHubColors.primary,
                        foregroundColor: CareHubColors.textPrimary,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: Text(
                        saving ? 'Saving...' : 'Save',
                        style: const TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 16,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            
            // Bottom safe area
            Container(
              height: 20,
              color: const Color(0x80111A22),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFormField({
    required String label,
    required TextEditingController controller,
    String? Function(String?)? validator,
    String? suffix,
    int maxLines = 1,
    String? placeholder,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: CareHubColors.textSecondary,
            fontSize: 14,
            fontWeight: FontWeight.w500,
            fontFamily: 'Inter',
          ),
        ),
        const SizedBox(height: 8),
        Stack(
          children: [
            TextFormField(
              controller: controller,
              validator: validator,
              maxLines: maxLines,
              enabled: !saving,
              style: const TextStyle(
                color: CareHubColors.textPrimary,
                fontSize: 16,
                fontFamily: 'Inter',
              ),
              decoration: InputDecoration(
                filled: true,
                fillColor: CareHubColors.surface,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: CareHubColors.border),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: CareHubColors.border),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: CareHubColors.primary, width: 2),
                ),
                hintText: placeholder,
                hintStyle: const TextStyle(
                  color: CareHubColors.textSecondary,
                  fontFamily: 'Inter',
                ),
                contentPadding: EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: maxLines > 1 ? 16 : 14,
                ),
              ),
            ),
            if (suffix != null)
              Positioned(
                right: 16,
                top: 0,
                bottom: 0,
                child: Center(
                  child: Text(
                    suffix,
                    style: const TextStyle(
                      color: CareHubColors.textSecondary,
                      fontSize: 16,
                      fontFamily: 'Inter',
                    ),
                  ),
                ),
              ),
          ],
        ),
      ],
    );
  }

  Widget _buildDropdownField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Frequency',
          style: TextStyle(
            color: CareHubColors.textSecondary,
            fontSize: 14,
            fontWeight: FontWeight.w500,
            fontFamily: 'Inter',
          ),
        ),
        const SizedBox(height: 8),
        Container(
          decoration: BoxDecoration(
            color: CareHubColors.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: CareHubColors.border),
          ),
          child: DropdownButtonFormField<String>(
            value: _frequency.text.isEmpty ? 'Twice a day' : _frequency.text,
            onChanged: saving ? null : (String? newValue) {
              if (newValue != null) {
                _frequency.text = newValue;
              }
            },
            items: const [
              DropdownMenuItem(value: 'Once a day', child: Text('Once a day')),
              DropdownMenuItem(value: 'Twice a day', child: Text('Twice a day')),
              DropdownMenuItem(value: '3 times a day', child: Text('3 times a day')),
              DropdownMenuItem(value: 'As needed', child: Text('As needed')),
            ],
            style: const TextStyle(
              color: CareHubColors.textPrimary,
              fontSize: 16,
              fontFamily: 'Inter',
            ),
            decoration: const InputDecoration(
              border: InputBorder.none,
              contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            ),
            dropdownColor: CareHubColors.surface,
            icon: const Icon(
              Icons.expand_more,
              color: CareHubColors.textSecondary,
            ),
          ),
        ),
      ],
    );
  }
}

