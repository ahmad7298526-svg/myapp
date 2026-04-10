import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import ThemeCard from "@/components/ThemeCard";
import axios from "axios";
import { Loader2 } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DesktopThemes = () => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const response = await axios.get(`${API}/themes?category=desktop`);
      setThemes(response.data);
    } catch (error) {
      console.error('Error fetching themes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredThemes = filter === 'all'
    ? themes
    : themes.filter(t => t.os_type === filter);

  return (
    <Layout>
      <div className="p-8 md:p-12">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl md:text-5xl font-bold mb-3 tracking-tight"
            style={{ fontFamily: 'Outfit' }}
            data-testid="desktop-themes-title"
          >
            ثيمات سطح المكتب
          </h1>
          <p className="text-lg text-[#a1a1aa]">
            اختر وطبق ثيم سطح المكتب المفضل لديك
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {['all', 'macOS', 'Windows'].map((filterOption) => (
            <button
              key={filterOption}
              data-testid={`filter-${filterOption}`}
              onClick={() => setFilter(filterOption)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
                filter === filterOption
                  ? 'bg-white text-black'
                  : 'backdrop-blur-xl bg-white/5 border border-white/10 text-[#a1a1aa] hover:text-white hover:border-white/20'
              }`}
            >
              {filterOption === 'all' ? 'الكل' : filterOption}
            </button>
          ))}
        </div>

        {/* Themes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredThemes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                onFavoriteToggle={fetchThemes}
                onApply={fetchThemes}
              />
            ))}
          </div>
        )}

        {!loading && filteredThemes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#a1a1aa]">لا توجد ثيمات متاحة</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DesktopThemes;

