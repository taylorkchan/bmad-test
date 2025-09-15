import 'package:flutter/material.dart';
import '../theme/carehub_theme.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: CareHubColors.background,
      body: CustomScrollView(
        slivers: [
          // Sticky Header with backdrop blur
          SliverAppBar(
            backgroundColor: const Color(0x80111A22),
            expandedHeight: 0,
            floating: true,
            pinned: true,
            elevation: 0,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new, color: CareHubColors.textPrimary),
              onPressed: () => Navigator.of(context).pop(),
            ),
            title: const Text(
              'Profile',
              style: TextStyle(
                color: CareHubColors.textPrimary,
                fontSize: 20,
                fontWeight: FontWeight.w700,
                fontFamily: 'Inter',
              ),
            ),
            centerTitle: true,
          ),
          
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const SizedBox(height: 16),
                  
                  // Profile Section
                  Column(
                    children: [
                      Container(
                        width: 128,
                        height: 128,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(64),
                          border: Border.all(color: CareHubColors.border, width: 2),
                          color: CareHubColors.surface,
                        ),
                        child: const Icon(
                          Icons.person,
                          size: 64,
                          color: CareHubColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Ethan Carter',
                        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          color: CareHubColors.textPrimary,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'ethan.carter@email.com',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: CareHubColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 32),
                  
                  // Account Section
                  _buildSection(
                    context,
                    title: 'Account',
                    items: [
                      _buildSettingItem(
                        context,
                        icon: Icons.notifications,
                        title: 'Notifications',
                        hasToggle: true,
                        toggleValue: true,
                      ),
                      _buildSettingItem(
                        context,
                        icon: Icons.dark_mode,
                        title: 'Dark Mode',
                        hasToggle: true,
                        toggleValue: true,
                      ),
                      _buildSettingItem(
                        context,
                        icon: Icons.language,
                        title: 'Language',
                        trailing: 'English',
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Medication Section
                  _buildSection(
                    context,
                    title: 'Medication',
                    items: [
                      _buildSettingItem(
                        context,
                        icon: Icons.medication,
                        title: 'Medication Preferences',
                        hasArrow: true,
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Data Section
                  _buildSection(
                    context,
                    title: 'Data',
                    items: [
                      _buildSettingItem(
                        context,
                        icon: Icons.download,
                        title: 'Export Data',
                        hasArrow: true,
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 100), // Bottom padding for nav bar
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSection(BuildContext context, {required String title, required List<Widget> items}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Text(
            title,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
              color: CareHubColors.textSecondary,
              fontSize: 18,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
        Container(
          decoration: BoxDecoration(
            color: CareHubColors.surface,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(children: items),
        ),
      ],
    );
  }

  Widget _buildSettingItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    String? trailing,
    bool hasToggle = false,
    bool toggleValue = false,
    bool hasArrow = false,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: const BoxDecoration(
        border: Border(
          bottom: BorderSide(color: CareHubColors.border, width: 0.5),
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: CareHubColors.surfaceSecondary,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              icon,
              color: CareHubColors.textPrimary,
              size: 20,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              title,
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                color: CareHubColors.textPrimary,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          if (trailing != null)
            Text(
              trailing,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: CareHubColors.textSecondary,
              ),
            ),
          if (hasToggle)
            Transform.scale(
              scale: 0.8,
              child: Switch(
                value: toggleValue,
                onChanged: (value) {
                  // Handle toggle
                },
                activeColor: CareHubColors.textPrimary,
                activeTrackColor: CareHubColors.primary,
                inactiveThumbColor: CareHubColors.textPrimary,
                inactiveTrackColor: CareHubColors.border,
              ),
            ),
          if (hasArrow)
            const Icon(
              Icons.chevron_right,
              color: CareHubColors.textSecondary,
              size: 20,
            ),
        ],
      ),
    );
  }
}