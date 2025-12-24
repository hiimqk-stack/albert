# 🔐 Admin Panel Credentials

## Admin Panel URL
```
https://maxwin584.com/e9542d96151517b
```
veya
```
https://albert9.pages.dev/e9542d96151517b
```

## Login Credentials

⚠️ **GİZLİ BİLGİ - PAYLAŞMAYIN**

**Username:** `admin`
**Password:** `maxwin2024`

## Security Details (SHA-256 Hash)

Kodda sadece hash değerleri saklanır, plain text bilgiler yoktur:

- **URL Hash (16 char):** `e9542d96151517b`
- **Username Hash:** `8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918`
- **Password Hash:** `5dd60ca27ee6f87d525e6f558b4bd5fde308a5e00988da494692147275c9d6b9`

**Nasıl Çalışır:**
1. Kullanıcı username/password girer
2. Browser'da SHA-256 ile hash'lenir
3. Hash değerleri kodda saklanan hash'lerle karşılaştırılır
4. Eşleşirse giriş başarılı

**Güvenlik:**
- Kodda plain text şifre YOK
- Sadece hash değerleri var
- Hash'ten geriye dönüş imkansız (one-way encryption)
- Session storage kullanılır (tarayıcı kapanınca sıfırlanır)

## Firebase Database Rules

**⚠️ ÖNEMLİ:** Permission Denied hatasını önlemek için Firebase Console'da şu kuralları ayarlayın:

1. https://console.firebase.google.com/ → **isaa-559ef** projesi
2. **Realtime Database** → **Rules** sekmesi
3. Aşağıdaki kuralları yapıştırın:

```json
{
  "rules": {
    "bankAccounts": {
      ".read": true,
      ".write": true
    }
  }
}
```

4. **Publish** butonuna tıklayın

### Daha Güvenli Rules (Production için önerilir):

```json
{
  "rules": {
    "bankAccounts": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

Bu durumda Firebase Authentication eklemeniz gerekir.

## Admin Panel Özellikleri

✅ **IBAN Ekleme** - Yeni banka hesabı ekle
✅ **IBAN Düzenleme** - Mevcut hesap bilgilerini güncelle
✅ **IBAN Silme** - Hesap sil
✅ **Realtime Güncelleme** - Değişiklikler anında yansır
✅ **Güvenli Giriş** - SHA-256 hash ile şifreleme
✅ **Session Yönetimi** - Oturum kontrolü

## Notlar

- Admin paneli `noindex, nofollow` meta tag'i ile arama motorlarından gizlenmiştir
- Session storage kullanılır (tarayıcı kapatılınca oturum kapanır)
- Tüm şifreler SHA-256 ile hash'lenir
- URL 16 haneli rastgele hash ile korunur

## Permission Denied Hatası Çözümü

Eğer "Permission Denied" hatası alıyorsanız:

1. Firebase Console → Realtime Database → Rules
2. `.write: true` olarak ayarlayın
3. Publish edin
4. 1-2 dakika bekleyin
5. Sayfayı yenileyin

**Test için geçici olarak tüm izinleri açabilirsiniz:**

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

⚠️ **Dikkat:** Production'da mutlaka daha güvenli rules kullanın!
