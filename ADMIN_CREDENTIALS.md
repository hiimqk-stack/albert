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

⚠️ **GİZLİ BİLGİ - PAYLAŞMAYIN - SADECE HASH KODLARI KULLANIN**

Giriş yaparken bu hash kodlarını kullanın (plain text değil):

**Username Hash:** `c9c906eeaf749a6d60d763fde0fd9ab6`
**Password Hash:** `2eac1a4ed8a0255116f285c8adb7cf2e`

## Security Details

Kodda ve giriş formunda sadece hash değerleri kullanılır:

- **URL Hash (16 char):** `e9542d96151517b`
- **Username Hash (32 char):** `c9c906eeaf749a6d60d763fde0fd9ab6`
- **Password Hash (32 char):** `2eac1a4ed8a0255116f285c8adb7cf2e`

**Nasıl Çalışır:**
1. Kullanıcı hash kodlarını girer (plain text değil)
2. Girilen hash kodları direkt olarak kodda saklanan hash'lerle karşılaştırılır
3. Eşleşirse giriş başarılı

**Güvenlik:**
- Kodda plain text şifre YOK
- Sadece rastgele üretilmiş hash değerleri var
- Hash kodları 32 karakter uzunluğunda hex string
- Session storage kullanılır (tarayıcı kapanınca sıfırlanır)
- Kimse "admin" veya "password" gibi tahmin edemez

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
