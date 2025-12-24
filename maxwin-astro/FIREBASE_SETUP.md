# Firebase Realtime Database Setup

## IBAN'lar için Veri Yapısı

Firebase Realtime Database'de aşağıdaki yapıyı oluşturun:

```json
{
  "bankAccounts": {
    "account1": {
      "bankName": "Ziraat Bankası",
      "accountHolder": "MAXWIN YATIRIM A.Ş.",
      "iban": "TR120001001234567890123456",
      "minAmount": "100"
    },
    "account2": {
      "bankName": "Yapı Kredi",
      "accountHolder": "MAXWIN YATIRIM A.Ş.",
      "iban": "TR980006701000000012345678",
      "minAmount": "100"
    },
    "account3": {
      "bankName": "İş Bankası",
      "accountHolder": "MAXWIN YATIRIM A.Ş.",
      "iban": "TR450006400000112345678901",
      "minAmount": "100"
    }
  }
}
```

## Firebase Console'da Yapılacaklar

1. https://console.firebase.google.com/ adresine gidin
2. "isaa-559ef" projesini seçin
3. Sol menüden "Realtime Database" seçin
4. "Data" sekmesinde yukarıdaki JSON yapısını ekleyin
5. "Rules" sekmesinde okuma izni verin:

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

## Nasıl Çalışır?

- Sayfa yüklendiğinde Firebase'den `bankAccounts` node'u okunur
- Her hesap dinamik olarak HTML'e eklenir
- IBAN'lar otomatik formatlanır (4'lü gruplar halinde)
- Kopyala butonu çalışır
- Kripto adresler statik kalır (sadece IBAN'lar dinamik)

## Yeni Hesap Eklemek

Firebase Console'da `bankAccounts` altına yeni bir key ekleyin:

```json
"account4": {
  "bankName": "Garanti BBVA",
  "accountHolder": "MAXWIN YATIRIM A.Ş.",
  "iban": "TR330006200011900000012345",
  "minAmount": "100"
}
```

Değişiklikler anında sayfaya yansır (realtime).
