# Blog Battle

Blog Battle, kullanıcıların blog yazıları oluşturabildiği, paylaşabildiği ve diğer kullanıcıların yazıları oylayabildiği bir platformdur.

#Özellikler

Kayıt & Giriş: JWT tabanlı kimlik doğrulama ile kayıt olabilir ve giriş yapabilirsiniz.

Blog Paylaşımı: Görsel, başlık ve içerik ekleyerek blog oluşturabilir; profil sayfanızdan kendi bloglarınızı silebilir veya düzenleyebilirsiniz blog silerseniz yarıştan ayrılırsınız.

Blog Görüntüleme: Kayıt olmadan tüm blogları görüntüleyebilirsiniz.

Oylama: Bloglara oy verebilmek için giriş yapmanız gerekir. Kendi blogunuza oy veremezsiniz ve her eşleşmede yalnızca bir bloga oy kullanabilirsiniz.

Blog Yarışları: “Blog Yarışları” bölümünde eşleşen blogları görebilir, giriş yaptıysanız oy kullanabilirsiniz.

Profil: Profil kısmından verilerinizi düzenleyebilirsiniz, yaptığınız değişiklikler otomatik olarak veritabanına kaydedilir.  
Dilerseniz de Hesabı Kaldır butonunu kullanarak hesabınızı ve tüm bloglarınızı silebilirsiniz.

## Kurulum ve Çalıştırma

1. Repository'i bilgisayarınıza indirin.

2. Backend ve frontend bağımlılıklarını yükleyin:
   ```bash
   cd api
   npm install
   cd ../client
   npm install


3.Frontend'i çalıştırın:
  cd client
  npm run dev
4. Backend'i çalıştırın:
  cd api
  npm run dev
  
5.Kullanım:
  Kayıt olup giriş yaptıktan sonra blog paylaşabilir ve oy verebilirsiniz.
  Kayıt olmadan sadece blogları görüntüleyebilirsiniz.

  MongoDb üzerindeki veritabanı kayıtları ekte verilmiştir.
<img width="1161" height="476" alt="image" src="https://github.com/user-attachments/assets/fb2cf8ce-84a6-43c4-b114-607a3d0274dd" />
<img width="1087" height="483" alt="image" src="https://github.com/user-attachments/assets/f29e6c94-f279-42a2-8942-06385caeac01" />


