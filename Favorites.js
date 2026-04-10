import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import ThemeCard from "@/components/ThemeCard";
import axios from "axios";
import { Loader2 } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${API}/favorites`);
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
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
            data-testid="favorites-title"
          >
            المفضلة
          </h1>
          <p className="text-lg text-[#a1a1aa]">
            الثيمات المفضلة لديك
          </p>
        </div>

        {/* Favorites Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <p className="text-[#a1a1aa] mb-2">لا توجد ثيمات مفضلة بعد</p>
            <p className="text-sm text-[#a1a1aa]">استكشف الثيمات وأضف المفضلة لديك</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                onFavoriteToggle={fetchFavorites}
                onApply={fetchFavorites}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Favorites;

