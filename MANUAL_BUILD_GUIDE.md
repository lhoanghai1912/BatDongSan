# MANUAL BUILD GUIDE - Homes App

## Nếu build tự động gặp lỗi, thực hiện theo các bước sau:

### 1. MỞ COMMAND PROMPT (CMD) - KHÔNG DÙNG POWERSHELL
```bash
cd "D:\Code\React Native\BatDongSan\android"
```

### 2. CLEAN PROJECT
```bash
gradlew.bat clean
```

### 3. BUILD APK (for testing)
```bash
gradlew.bat assembleRelease
```

### 4. BUILD AAB (for Play Store)  
```bash
gradlew.bat bundleRelease
```

### 5. TÌM FILE OUTPUT
**APK Location:**
```
android/app/build/outputs/apk/release/app-release.apk
```

**AAB Location:**
```
android/app/build/outputs/bundle/release/app-release.aab
```

### 6. KIỂM TRA FILE BUILD
- File AAB size: ~15-50MB
- Có thể cài APK để test trước
- AAB là file upload lên Google Play Store

### 7. NẾU GẶP LỖI THƯỜNG GẶप
**OutOfMemory Error:**
```bash
set GRADLE_OPTS=-Xmx4g -XX:MaxPermSize=512m
gradlew.bat bundleRelease
```

**Missing SDK:**
```bash
# Đảm bảo ANDROID_HOME được set
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
```

**Network Error:**
```bash
gradlew.bat bundleRelease --offline
```

### 8. ALTERNATIVE - SỬ DỤNG ANDROID STUDIO
1. Mở Android Studio
2. Open project: `D:\Code\React Native\BatDongSan\android`  
3. Build → Generate Signed Bundle / APK
4. Chọn "Android App Bundle"
5. Chọn keystore: `homes-app-release-key.keystore`
6. Nhập password: `123456`
7. Build

## ⚠️ LƯU Ý QUAN TRỌNG
- Đảm bảo có Java JDK 11 hoặc 17
- Android SDK Build Tools version 34+
- Đủ RAM (ít nhất 8GB recommended)
- Đủ disk space (~5GB free space)
