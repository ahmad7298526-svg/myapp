"# OS Theme Hub - مركز ثيمات نظام التشغيل

تطبيق ويب حديث لإدارة وتخصيص ثيمات نظام Zorin OS، يوفر واجهة سهلة الاستخدام لتغيير مظهر سطح المكتب وشاشة الإقلاع.

## المميزات الرئيسية

### 🎨 ثيمات سطح المكتب
- **macOS Monterey**: ثيم حديث يحاكي نظام macOS
- **Windows 11**: تصميم عصري مع الزوايا الدائرية
- **Windows 10**: التصميم المسطح الكلاسيكي
- **Windows 8**: تصميم Metro UI
- **Windows 7**: ثيم Aero Glass الكلاسيكي

### 🚀 ثيمات البوت (GRUB)
- ثيمات مخصصة لشاشة الإقلاع تحاكي أنظمة:
  - macOS
  - Windows 11
  - Windows 10
  - Windows 7

### ⭐ ميزات إضافية
- **معاينة مباشرة**: شاهد الثيم قبل تطبيقه
- **المفضلة**: احفظ ثيماتك المفضلة للوصول السريع
- **التخصيص الكامل**:
  - اختيار لون التمييز (6 ألوان متاحة)
  - تغيير ثيم الأيقونات
  - اختيار عائلة الخطوط
  - ضبط حجم الخط

## التقنيات المستخدمة

### Backend
- **FastAPI**: إطار عمل Python حديث وسريع
- **MongoDB**: قاعدة بيانات NoSQL للتخزين
- **Motor**: محرك MongoDB غير متزامن

### Frontend
- **React 19**: مكتبة واجهة المستخدم
- **Tailwind CSS**: إطار عمل CSS للتصميم
- **Shadcn UI**: مكونات واجهة حديثة
- **Lucide React**: أيقونات حديثة ونظيفة
- **Sonner**: إشعارات Toast جميلة

### التصميم
- **نمط Dark Mode** مع تأثيرات Glassmorphism
- **خطوط**: Outfit للعناوين، IBM Plex Sans للنصوص
- **ألوان عالية التباين** مع لمسات احترافية

## البنية

```
/app/
├── backend/
│   ├── server.py              # تطبيق FastAPI الرئيسي
│   ├── requirements.txt       # اعتماديات Python
│   └── .env                   # متغيرات البيئة
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js      # تخطيط الصفحة الرئيسي
│   │   │   └── ThemeCard.js   # بطاقة عرض الثيم
│   │   ├── pages/
│   │   │   ├── Dashboard.js   # لوحة التحكم
│   │   │   ├── DesktopThemes.js  # ثيمات سطح المكتب
│   │   │   ├── BootThemes.js     # ثيمات البوت
│   │   │   ├── Customization.js  # صفحة التخصيص
│   │   │   └── Favorites.js      # الثيمات المفضلة
│   │   ├── App.js             # مكون التطبيق الرئيسي
│   │   └── index.js           # نقطة الدخول
│   └── package.json           # اعتماديات Node.js
│
└── ZORIN_THEME_GUIDE.md       # دليل التطبيق الفعلي على Zorin OS
```

## API Endpoints

### الثيمات
- `GET /api/themes` - جلب جميع الثيمات
- `GET /api/themes?category=desktop` - ثيمات سطح المكتب فقط
- `GET /api/themes?category=boot` - ثيمات البوت فقط
- `GET /api/themes/{theme_id}` - جلب ثيم محدد
- `POST /api/themes/{theme_id}/apply` - تطبيق ثيم
- `POST /api/themes/{theme_id}/preview` - معاينة ثيم

### المفضلة
- `GET /api/favorites` - جلب الثيمات المفضلة
- `POST /api/favorites/{theme_id}` - إضافة للمفضلة
- `DELETE /api/favorites/{theme_id}` - حذف من المفضلة

### التخصيص
- `GET /api/customization` - جلب الإعدادات الحالية
- `POST /api/customization` - تحديث الإعدادات

## التشغيل المحلي

### Backend
```bash
cd /app/backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend
```bash
cd /app/frontend
yarn install
yarn start
```

## التطبيق على Zorin OS الفعلي

لتطبيق الثيمات على نظام Zorin OS الحقيقي، راجع الدليل الشامل:
**[ZORIN_THEME_GUIDE.md](/app/ZORIN_THEME_GUIDE.md)**

يشمل الدليل:
- تعليمات تثبيت كل ثيم
- أوامر تطبيق ثيمات GTK
- تكوين ثيمات GRUB
- نصائح استكشاف الأخطاء
- أمثلة على التكامل مع Python

## ملاحظات مهمة

### الوضع الحالي
التطبيق يعمل في **وضع المحاكاة** في بيئة Docker:
- ✅ واجهة المستخدم كاملة الوظائف
- ✅ إدارة المفضلة
- ✅ التخصيص
- ⚠️ تطبيق الثيمات محاكى (simulation)

### التطبيق الفعلي
لتطبيق الثيمات بشكل حقيقي على Zorin OS:
1. نقل التطبيق لنظام Zorin OS
2. منح الصلاحيات المطلوبة (sudo)
3. تثبيت الثيمات المطلوبة
4. تفعيل أوامر التطبيق في Backend

## الأمان

- 🔒 تطبيق ثيمات GRUB يتطلب صلاحيات root
- 🔒 يُنصح باستخدام PolicyKit لإدارة الصلاحيات
- 🔒 التحقق من صحة مسارات الثيمات قبل التطبيق

## المساهمة

التطبيق مفتوح المصدر ويرحب بالمساهمات:
- تحسينات على الواجهة
- إضافة ثيمات جديدة
- تحسينات الأداء
- إصلاح الأخطاء

## الترخيص

MIT License

## الدعم

للمساعدة والدعم، راجع:
- [Zorin OS Documentation](https://help.zorin.com/)
- [GNOME Theming Guide](https://wiki.gnome.org/Projects/GnomeShell/Extensions)
- الدليل المرفق: ZORIN_THEME_GUIDE.md

---

**صُنع بواسطة Emergent AI** 🚀
"
