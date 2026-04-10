import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import ThemeCard from "@/components/ThemeCard";
import axios from "axios";
import { Loader2 } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BootThemes = () => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const response = await axios.get(`${API}/themes?category=boot`);
      setThemes(response.data);
    } catch (error) {
      console.error('Error fetching themes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-8 md:p-12">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl md:text-5xl font-bold mb-3 tracking-tight"
            style={{ fontFamily: 'Outfit' }}
            data-testid="boot-themes-title"
          >
            ثيمات البوت
          </h1>
          <p className="text-lg text-[#a1a1aa]">
            خصص مظهر شاشة الإقلاع (GRUB Bootloader)
          </p>
        </div>

        {/* Info Banner */}
        <div className="backdrop-blur-xl bg-[#007AFF]/10 border border-[#007AFF]/20 rounded-2xl p-6 mb-8">
          <p className="text-sm text-white">
            <strong>ملاحظة:</strong> تطبيق ثيمات البوت يتطلب صلاحيات المدير (root). سيتم تحديث GRUB تلقائياً بعد التطبيق.
          </p>
        </div>

        {/* Themes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {themes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                onFavoriteToggle={fetchThemes}
                onApply={fetchThemes}
              />
            ))}
          </div>
        )}

        {!loading && themes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#a1a1aa]">لا توجد ثيمات متاحة</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BootThemes;

