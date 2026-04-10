"# دليل تطبيق الثيمات على Zorin OS

## نظرة عامة
هذا الدليل يشرح كيفية تطبيق ثيمات سطح المكتب وثيمات البوت على نظام Zorin OS بشكل فعلي.

## متطلبات النظام
- Zorin OS (أي إصدار)
- صلاحيات المدير (sudo)
- اتصال بالإنترنت (لتحميل الثيمات)

---

## 1. تطبيق ثيمات سطح المكتب (GTK Themes)

### macOS Theme

#### تثبيت WhiteSur GTK Theme (يحاكي macOS Big Sur/Monterey)

```bash
# تثبيت المتطلبات
sudo apt install git gnome-shell-extensions gnome-tweaks

# تحميل الثيم
cd ~/Downloads
git clone https://github.com/vinceliuice/WhiteSur-gtk-theme.git
cd WhiteSur-gtk-theme

# تثبيت الثيم
./install.sh

# تطبيق الثيم عبر gsettings
gsettings set org.gnome.desktop.interface gtk-theme \"WhiteSur-Dark\"
gsettings set org.gnome.desktop.wm.preferences theme \"WhiteSur-Dark\"

# تثبيت أيقونات macOS
cd ~/Downloads
git clone https://github.com/vinceliuice/WhiteSur-icon-theme.git
cd WhiteSur-icon-theme
./install.sh

gsettings set org.gnome.desktop.interface icon-theme \"WhiteSur-dark\"
```

### Windows 11 Theme

#### تثبيت Windows 11 GTK Theme

```bash
# تحميل ثيم Windows 11
cd ~/Downloads
git clone https://github.com/yeyushengfan258/Win11OS-gtk-theme.git
cd Win11OS-gtk-theme

# تثبيت
./install.sh

# تطبيق الثيم
gsettings set org.gnome.desktop.interface gtk-theme \"Win11OS-dark\"
gsettings set org.gnome.desktop.wm.preferences theme \"Win11OS-dark\"

# تثبيت أيقونات Windows 11
cd ~/Downloads
git clone https://github.com/yeyushengfan258/Win11-icon-theme.git
cd Win11-icon-theme
./install.sh

gsettings set org.gnome.desktop.interface icon-theme \"Win11-dark\"
```

### Windows 10 Theme

```bash
# تثبيت ثيم Windows 10
cd ~/Downloads
git clone https://github.com/B00merang-Project/Windows-10.git
mkdir -p ~/.themes
cp -r Windows-10 ~/.themes/

gsettings set org.gnome.desktop.interface gtk-theme \"Windows-10\"
gsettings set org.gnome.desktop.wm.preferences theme \"Windows-10\"
```

### Windows 7 Theme

```bash
# تثبيت ثيم Windows 7 Aero
cd ~/Downloads
git clone https://github.com/B00merang-Artwork/Windows-7.git
mkdir -p ~/.themes
cp -r Windows-7 ~/.themes/

gsettings set org.gnome.desktop.interface gtk-theme \"Windows-7\"
gsettings set org.gnome.desktop.wm.preferences theme \"Windows-7\"
```

---

## 2. تطبيق ثيمات البوت (GRUB Themes)

### تثبيت المتطلبات

```bash
sudo apt update
sudo apt install grub2-common grub-customizer
```

### macOS GRUB Theme

```bash
# تحميل ثيم GRUB بنمط macOS
cd ~/Downloads
git clone https://github.com/ChrisTitusTech/Top-5-Bootloader-Themes.git
cd Top-5-Bootloader-Themes

# نسخ ثيم macOS
sudo cp -r themes/monterey /boot/grub/themes/

# تعديل إعدادات GRUB
sudo nano /etc/default/grub

# إضافة أو تعديل السطر التالي:
# GRUB_THEME=\"/boot/grub/themes/monterey/theme.txt\"

# تحديث GRUB
sudo update-grub
```

### Windows 11 GRUB Theme

```bash
# تحميل ثيم Windows 11
cd ~/Downloads
git clone https://github.com/Jacksaur/Gorgeous-GRUB.git
cd Gorgeous-GRUB

# نسخ ثيم Windows 11
sudo mkdir -p /boot/grub/themes
sudo cp -r windows11 /boot/grub/themes/

# تعديل إعدادات GRUB
sudo nano /etc/default/grub

# إضافة:
# GRUB_THEME=\"/boot/grub/themes/windows11/theme.txt\"

# تحديث GRUB
sudo update-grub
```

### Windows 10 GRUB Theme

```bash
cd ~/Downloads
git clone https://github.com/shvchk/poly-dark.git
sudo cp -r poly-dark /boot/grub/themes/

sudo nano /etc/default/grub
# GRUB_THEME=\"/boot/grub/themes/poly-dark/theme.txt\"

sudo update-grub
```

---

## 3. أوامر Python/FastAPI للتطبيق التلقائي

### مثال على تطبيق ثيم GTK من خلال Backend

```python
import subprocess

def apply_gtk_theme(theme_name):
    \"\"\"تطبيق ثيم GTK\"\"\"
    try:
        # تطبيق ثيم GTK
        subprocess.run([
            'gsettings', 'set', 
            'org.gnome.desktop.interface', 
            'gtk-theme', 
            theme_name
        ], check=True)
        
        # تطبيق ثيم النوافذ
        subprocess.run([
            'gsettings', 'set', 
            'org.gnome.desktop.wm.preferences', 
            'theme', 
            theme_name
        ], check=True)
        
        return {\"success\": True, \"message\": f\"Theme {theme_name} applied\"}
    except subprocess.CalledProcessError as e:
        return {\"success\": False, \"error\": str(e)}

def apply_icon_theme(icon_name):
    \"\"\"تطبيق ثيم الأيقونات\"\"\"
    try:
        subprocess.run([
            'gsettings', 'set', 
            'org.gnome.desktop.interface', 
            'icon-theme', 
            icon_name
        ], check=True)
        
        return {\"success\": True, \"message\": f\"Icon theme {icon_name} applied\"}
    except subprocess.CalledProcessError as e:
        return {\"success\": False, \"error\": str(e)}

def apply_grub_theme(theme_path):
    \"\"\"تطبيق ثيم GRUB (يتطلب sudo)\"\"\"
    try:
        # قراءة ملف GRUB الحالي
        grub_config = '/etc/default/grub'
        
        # تحديث إعدادات GRUB
        # ملاحظة: يتطلب صلاحيات root
        # يمكن استخدام PolicyKit أو sudoers لمنح الصلاحيات
        
        subprocess.run([
            'sudo', 'sed', '-i', 
            f's|^GRUB_THEME=.*|GRUB_THEME=\"{theme_path}\"|', 
            grub_config
        ], check=True)
        
        # تحديث GRUB
        subprocess.run(['sudo', 'update-grub'], check=True)
        
        return {\"success\": True, \"message\": \"GRUB theme applied\"}
    except subprocess.CalledProcessError as e:
        return {\"success\": False, \"error\": str(e)}
```

---

## 4. تخصيص الألوان والخطوط

### تغيير لون التمييز (Accent Color)

```bash
# تغيير لون التمييز في GNOME
gsettings set org.gnome.desktop.interface gtk-color-scheme \"selected_bg_color:#007AFF\"
```

### تغيير الخط

```bash
# تغيير خط الواجهة
gsettings set org.gnome.desktop.interface font-name \"Ubuntu 11\"

# تغيير خط العناوين
gsettings set org.gnome.desktop.wm.preferences titlebar-font \"Ubuntu Bold 11\"

# تغيير خط وحدة النص
gsettings set org.gnome.desktop.interface monospace-font-name \"Ubuntu Mono 11\"
```

---

## 5. الملاحظات المهمة

### الصلاحيات
- تطبيق ثيمات GTK لا يتطلب صلاحيات root
- تطبيق ثيمات GRUB **يتطلب صلاحيات root**
- يمكن استخدام PolicyKit لمنح الصلاحيات المطلوبة للتطبيق

### إعادة التشغيل
- ثيمات GTK تطبق فوراً
- ثيمات GRUB تحتاج إعادة تشغيل لرؤية التغييرات

### التوافق
- تأكد من توافق الثيم مع إصدار GNOME/Xfce المستخدم في Zorin OS
- بعض الثيمات قد تحتاج تثبيت اعتماديات إضافية

---

## 6. استكشاف الأخطاء

### الثيم لم يطبق
```bash
# إعادة تشغيل GNOME Shell (Alt+F2, ثم اكتب 'r')
# أو
killall gnome-shell
```

### GRUB لم يتغير
```bash
# التأكد من تحديث GRUB
sudo update-grub

# التحقق من مسار الثيم
cat /etc/default/grub | grep GRUB_THEME
```

### استعادة الإعدادات الافتراضية
```bash
# استعادة ثيم GTK الافتراضي
gsettings reset org.gnome.desktop.interface gtk-theme
gsettings reset org.gnome.desktop.wm.preferences theme

# استعادة GRUB الافتراضي
sudo sed -i '/GRUB_THEME=/d' /etc/default/grub
sudo update-grub
```

---

## المراجع
- [Zorin OS Documentation](https://help.zorin.com/)
- [GNOME Theming Guide](https://wiki.gnome.org/Projects/GnomeShell/Extensions)
- [GRUB Customization](https://help.ubuntu.com/community/Grub2/Displays)
"
