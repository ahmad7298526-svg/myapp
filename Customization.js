import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import axios from "axios";
import { toast } from "sonner";
import { Save } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Customization = () => {
  const [settings, setSettings] = useState({
    accent_color: '#007AFF',
    icon_theme: 'default',
    font_family: 'default',
    font_size: 11
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/customization`);
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/customization`, settings);
      toast.success('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      toast.error('فشل حفظ الإعدادات');
    } finally {
      setLoading(false);
    }
  };

  const accentColors = [
    { name: 'أزرق', value: '#007AFF' },
    { name: 'أخضر', value: '#10b981' },
    { name: 'برتقالي', value: '#f59e0b' },
    { name: 'أحمر', value: '#ef4444' },
    { name: 'بنفسجي', value: '#8b5cf6' },
    { name: 'وردي', value: '#ec4899' }
  ];

  const iconThemes = [
    { name: 'افتراضي', value: 'default' },
    { name: 'Papirus', value: 'papirus' },
    { name: 'Numix', value: 'numix' },
    { name: 'Adwaita', value: 'adwaita' }
  ];

  const fontFamilies = [
    { name: 'افتراضي', value: 'default' },
    { name: 'Ubuntu', value: 'ubuntu' },
    { name: 'Roboto', value: 'roboto' },
    { name: 'Noto Sans', value: 'noto-sans' }
  ];

  return (
    <Layout>
      <div className="p-8 md:p-12">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl md:text-5xl font-bold mb-3 tracking-tight"
            style={{ fontFamily: 'Outfit' }}
            data-testid="customization-title"
          >
            التخصيص
          </h1>
          <p className="text-lg text-[#a1a1aa]">
            خصص الألوان والأيقونات والخطوط حسب ذوقك
          </p>
        </div>

        <div className="max-w-3xl">
          {/* Accent Color */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <Label className="text-lg font-medium mb-4 block" style={{ fontFamily: 'Outfit' }}>
              لون التمييز
            </Label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {accentColors.map((color) => (
                <button
                  key={color.value}
                  data-testid={`color-${color.value}`}
                  onClick={() => setSettings({ ...settings, accent_color: color.value })}
                  className={`relative h-16 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
                    settings.accent_color === color.value
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-[#09090b]'
                      : ''
                  }`}
                  style={{ backgroundColor: color.value }}
                >
                  <span className="absolute inset-x-0 bottom-0 text-xs text-white bg-black/50 backdrop-blur-sm py-1 rounded-b-xl">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Icon Theme */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <Label className="text-lg font-medium mb-4 block" style={{ fontFamily: 'Outfit' }}>
              ثيم الأيقونات
            </Label>
            <Select
              value={settings.icon_theme}
              onValueChange={(value) => setSettings({ ...settings, icon_theme: value })}
            >
              <SelectTrigger data-testid="icon-theme-select" className="w-full bg-black/50 border-white/10 focus:border-white/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconThemes.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Family */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <Label className="text-lg font-medium mb-4 block" style={{ fontFamily: 'Outfit' }}>
              الخط
            </Label>
            <Select
              value={settings.font_family}
              onValueChange={(value) => setSettings({ ...settings, font_family: value })}
            >
              <SelectTrigger data-testid="font-family-select" className="w-full bg-black/50 border-white/10 focus:border-white/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Size */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <Label className="text-lg font-medium" style={{ fontFamily: 'Outfit' }}>
                حجم الخط
              </Label>
              <span className="text-sm text-[#a1a1aa]">{settings.font_size}px</span>
            </div>
            <Slider
              data-testid="font-size-slider"
              value={[settings.font_size]}
              onValueChange={(value) => setSettings({ ...settings, font_size: value[0] })}
              min={9}
              max={16}
              step={1}
              className="w-full"
            />
          </div>

          {/* Save Button */}
          <Button
            data-testid="save-customization-btn"
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-white text-black hover:bg-white/90 rounded-full font-medium py-6 text-lg transition-all duration-300 active:scale-95"
          >
            {loading ? (
              <span>جاري الحفظ...</span>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                حفظ الإعدادات
              </>
            )}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Customization;

