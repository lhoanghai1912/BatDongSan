# Homes App - Deploy Checklist

## 📱 THÔNG TIN APP

- **Tên App**: Homes App
- **Package Name**: com.homesapp
- **Version**: 1.0.0 (Version Code: 1)
- **Target SDK**: 35
- **Min SDK**: 24

## 🔐 KEYSTORE INFO

- **File**: homes-app-release-key.keystore
- **Alias**: homes-app-key-alias
- **Password**: 123456 (THAY ĐỔI NGAY SAU KHI DEPLOY!)

## 📋 CHECKLIST TRƯỚC KHI DEPLOY

### ✅ 1. App Assets

- [ ] App Icon (512x512, 192x192, 144x144, 96x96, 72x72, 48x48)
- [ ] Feature Graphic (1024x500)
- [ ] Screenshots (ít nhất 2 ảnh)
- [ ] App Description (tiếng Việt và tiếng Anh)

### ✅ 2. App Store Listing

- [ ] Title: Homes App - Bất Động Sản
- [ ] Short Description (80 ký tự)
- [ ] Full Description (4000 ký tự)
- [ ] Category: House & Home hoặc Lifestyle
- [ ] Content Rating: Everyone

### ✅ 3. Technical Requirements

- [ ] Build AAB thành công
- [ ] Test app trên device thực
- [ ] Kiểm tra permissions
- [ ] Test các tính năng chính

### ✅ 4. Legal & Privacy

- [ ] Privacy Policy URL
- [ ] Terms & Conditions URL
- [ ] Target audience: 18+

## 🚀 CÁC BƯỚC DEPLOY

1. **Tạo Google Play Console Account** ($25 registration fee)
2. **Tạo App mới** trong console
3. **Upload AAB** file
4. **Điền thông tin** app listing
5. **Setup** internal testing
6. **Review** và publish

## 📁 FILES QUAN TRỌNG

- `android/app/build/outputs/bundle/release/app-release.aab`
- `android/app/homes-app-release-key.keystore`
- Screenshots và assets

## ⚠️ LƯU Ý BẢO MẬT

- KHÔNG share keystore file
- THAY ĐỔI password sau deploy
- Backup keystore ở nơi an toàn
- Sử dụng Google Play App Signing
