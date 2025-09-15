CareHub Flutter (mobile)

Overview
- Mirrors simple_todo/client functionality as a mobile app.
- Uses the same API routes exposed by simple_todo/server.
- Mobile-friendly UI styled to match the CareHub palette.

Features
- Dashboard with stats and recent logs.
- Medications list with quick log and delete.
- Add medication with camera-based OCR autofill.
- Progress summary (basic cards; charts can be added later).
- History list of recent logs.
- Online and API status indicators.

Requirements
- Flutter 3.35+ and Dart 3.9+
- Running backend at http://127.0.0.1:3001/api (or override).

Setup
1) Get dependencies:
   flutter pub get

2) Run the backend server from simple_todo/server (ensure it exposes /api):
   - Ensure dependencies are installed (npm install) and start it (npm start).

3) Run the app (replace API URL if not localhost):
   flutter run --dart-define=API_URL=http://127.0.0.1:3001/api

Notes
- Camera permission added on Android and iOS. On iOS, update NSCameraUsageDescription if needed.
- For physical devices, replace 127.0.0.1 with your machine LAN IP.
- OCR uses the server /ocr/process-image route; set OPENAI_API_KEY on the server.

