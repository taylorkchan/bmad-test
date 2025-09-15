import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class CareHubColors {
  // Primary colors from stitch design
  static const Color primary = Color(0xFF1173D4); // --primary-color
  static const Color primaryDark = Color(0xFF0E5FA3);
  static const Color accent = Color(0xFF38BDF8);
  
  // Dark theme backgrounds
  static const Color background = Color(0xFF0D151C); // Main background
  static const Color backgroundAlt = Color(0xFF0D131A); // Alternative background
  static const Color backgroundDark = Color(0xFF111827); // Darker background
  static const Color backgroundModal = Color(0xFF111A22); // Modal background
  
  // Surface colors
  static const Color surface = Color(0xFF1C2938); // Cards, surfaces
  static const Color surfaceAlt = Color(0xFF1C2939); // Alternative surface
  static const Color surfaceDark = Color(0xFF1F2937); // Darker surface
  static const Color surfaceAccent = Color(0xFF233648); // Accent surfaces
  static const Color surfaceSecondary = Color(0xFF2E4053); // Secondary surfaces
  static const Color surfaceGradient1 = Color(0xFF233648); // Gradient start
  static const Color surfaceGradient2 = Color(0xFF1A2B3A); // Gradient end
  
  // Text colors
  static const Color textPrimary = Color(0xFFFFFFFF); // White text
  static const Color textSecondary = Color(0xFF92ADC9); // Secondary text
  static const Color textMuted = Color(0xFF6B7280); // Muted text
  static const Color textDisabled = Color(0xFF4B5563); // Disabled text
  
  // Border colors
  static const Color border = Color(0xFF374151); // Default borders
  static const Color borderLight = Color(0xFF4B5563); // Light borders
  static const Color borderMuted = Color(0xFF1F2937); // Muted borders
  
  // Semantic colors (maintaining accessibility)
  static const Color success = Color(0xFF10B981);
  static const Color successSoft = Color(0xFF064E3B);
  static const Color warning = Color(0xFFF59E0B);
  static const Color warningSoft = Color(0xFF92400E);
  static const Color danger = Color(0xFFEF4444);
  static const Color dangerSoft = Color(0xFF991B1B);
  static const Color info = Color(0xFF06B6D4);
  static const Color infoSoft = Color(0xFF0E7490);
  
  // Navigation colors
  static const Color navBackground = Color(0xFF192633);
  static const Color navBorder = Color(0xFF233648);
  static const Color navActive = Color(0xFF1173D4);
  static const Color navInactive = Color(0xFF92ADC9);
  
  // Legacy gray colors for compatibility
  static const Color gray50 = Color(0xFF1C2938);
  static const Color gray400 = Color(0xFF6B7280);
  static const Color gray500 = Color(0xFF4B5563);
  static const Color gray600 = Color(0xFF92ADC9);
  static const Color gray700 = Color(0xFFFFFFFF);
  static const Color primarySoft = Color(0xFF233648);
}

ThemeData buildCareHubTheme() {
  return ThemeData(
    useMaterial3: true,
    fontFamily: 'Inter',
    brightness: Brightness.dark,
    
    // Color scheme
    colorScheme: const ColorScheme.dark(
      primary: CareHubColors.primary,
      primaryContainer: CareHubColors.surfaceAccent,
      secondary: CareHubColors.accent,
      secondaryContainer: CareHubColors.surface,
      surface: CareHubColors.surface,
      background: CareHubColors.background,
      error: CareHubColors.danger,
      onPrimary: CareHubColors.textPrimary,
      onSecondary: CareHubColors.textPrimary,
      onSurface: CareHubColors.textPrimary,
      onBackground: CareHubColors.textPrimary,
      onError: CareHubColors.textPrimary,
      outline: CareHubColors.border,
      surfaceVariant: CareHubColors.surfaceAlt,
      onSurfaceVariant: CareHubColors.textSecondary,
    ),
    
    // Background colors
    scaffoldBackgroundColor: CareHubColors.background,
    
    // App bar theme with backdrop blur effect
    appBarTheme: const AppBarTheme(
      backgroundColor: Color(0x80111A22), // Semi-transparent for blur effect
      foregroundColor: CareHubColors.textPrimary,
      elevation: 0,
      scrolledUnderElevation: 0,
      systemOverlayStyle: SystemUiOverlayStyle.light,
      titleTextStyle: TextStyle(
        color: CareHubColors.textPrimary,
        fontSize: 20,
        fontWeight: FontWeight.w700,
        fontFamily: 'Inter',
      ),
      iconTheme: IconThemeData(
        color: CareHubColors.textPrimary,
      ),
    ),
    
    // Card theme matching stitch design
    cardTheme: CardThemeData(
      color: CareHubColors.surface,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      margin: const EdgeInsets.all(0),
    ),
    
    // Button themes
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: CareHubColors.primary,
        foregroundColor: CareHubColors.textPrimary,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24), // Rounded full buttons
        ),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        textStyle: const TextStyle(
          fontWeight: FontWeight.w700,
          fontSize: 16,
          fontFamily: 'Inter',
        ),
      ),
    ),
    
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        backgroundColor: CareHubColors.primary,
        foregroundColor: CareHubColors.textPrimary,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        textStyle: const TextStyle(
          fontWeight: FontWeight.w700,
          fontSize: 16,
          fontFamily: 'Inter',
        ),
      ),
    ),
    
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        backgroundColor: CareHubColors.border,
        foregroundColor: CareHubColors.textPrimary,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
        ),
        side: const BorderSide(color: CareHubColors.border),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        textStyle: const TextStyle(
          fontWeight: FontWeight.w700,
          fontSize: 16,
          fontFamily: 'Inter',
        ),
      ),
    ),
    
    // Input decoration theme matching stitch forms
    inputDecorationTheme: InputDecorationTheme(
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
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: CareHubColors.danger),
      ),
      labelStyle: const TextStyle(
        color: CareHubColors.textSecondary,
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: FontWeight.w500,
      ),
      hintStyle: const TextStyle(
        color: CareHubColors.textSecondary,
        fontFamily: 'Inter',
        fontSize: 16,
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
    ),
    
    // Text theme matching stitch typography
    textTheme: const TextTheme(
      headlineLarge: TextStyle(
        color: CareHubColors.textPrimary,
        fontSize: 32,
        fontWeight: FontWeight.w700,
        fontFamily: 'Inter',
        letterSpacing: -0.015,
      ),
      headlineMedium: TextStyle(
        color: CareHubColors.textPrimary,
        fontSize: 28,
        fontWeight: FontWeight.w700,
        fontFamily: 'Inter',
        letterSpacing: -0.015,
      ),
      headlineSmall: TextStyle(
        color: CareHubColors.textPrimary,
        fontSize: 24,
        fontWeight: FontWeight.w700,
        fontFamily: 'Inter',
        letterSpacing: -0.015,
      ),
      titleLarge: TextStyle(
        color: CareHubColors.textPrimary,
        fontSize: 22,
        fontWeight: FontWeight.w700,
        fontFamily: 'Inter',
        letterSpacing: -0.015,
      ),
      titleMedium: TextStyle(
        color: CareHubColors.textPrimary,
        fontSize: 20,
        fontWeight: FontWeight.w700,
        fontFamily: 'Inter',
        letterSpacing: -0.015,
      ),
      titleSmall: TextStyle(
        color: CareHubColors.textPrimary,
        fontSize: 18,
        fontWeight: FontWeight.w600,
        fontFamily: 'Inter',
      ),
      bodyLarge: TextStyle(
        color: CareHubColors.textPrimary,
        fontSize: 16,
        fontWeight: FontWeight.w400,
        fontFamily: 'Inter',
      ),
      bodyMedium: TextStyle(
        color: CareHubColors.textPrimary,
        fontSize: 14,
        fontWeight: FontWeight.w400,
        fontFamily: 'Inter',
      ),
      bodySmall: TextStyle(
        color: CareHubColors.textSecondary,
        fontSize: 12,
        fontWeight: FontWeight.w400,
        fontFamily: 'Inter',
      ),
      labelLarge: TextStyle(
        color: CareHubColors.textSecondary,
        fontSize: 14,
        fontWeight: FontWeight.w500,
        fontFamily: 'Inter',
      ),
      labelMedium: TextStyle(
        color: CareHubColors.textSecondary,
        fontSize: 12,
        fontWeight: FontWeight.w500,
        fontFamily: 'Inter',
        letterSpacing: 0.015,
      ),
      labelSmall: TextStyle(
        color: CareHubColors.textSecondary,
        fontSize: 10,
        fontWeight: FontWeight.w500,
        fontFamily: 'Inter',
        letterSpacing: 0.015,
      ),
    ),
    
    // Bottom navigation bar theme matching stitch design
    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: CareHubColors.navBackground,
      selectedItemColor: CareHubColors.navActive,
      unselectedItemColor: CareHubColors.navInactive,
      type: BottomNavigationBarType.fixed,
      elevation: 0,
      selectedLabelStyle: TextStyle(
        fontWeight: FontWeight.w700,
        fontSize: 12,
        fontFamily: 'Inter',
      ),
      unselectedLabelStyle: TextStyle(
        fontWeight: FontWeight.w500,
        fontSize: 12,
        fontFamily: 'Inter',
      ),
    ),
    
    // List tile theme
    listTileTheme: const ListTileThemeData(
      textColor: CareHubColors.textPrimary,
      iconColor: CareHubColors.textSecondary,
      tileColor: CareHubColors.surface,
      contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
    ),
    
    // Switch theme for toggles
    switchTheme: SwitchThemeData(
      thumbColor: MaterialStateProperty.resolveWith((states) {
        if (states.contains(MaterialState.selected)) {
          return CareHubColors.textPrimary;
        }
        return CareHubColors.textPrimary;
      }),
      trackColor: MaterialStateProperty.resolveWith((states) {
        if (states.contains(MaterialState.selected)) {
          return CareHubColors.primary;
        }
        return CareHubColors.border;
      }),
    ),
    
    // Divider theme
    dividerTheme: const DividerThemeData(
      color: CareHubColors.border,
      thickness: 1,
    ),
  );
}
