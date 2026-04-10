import { useState } from "react";
import { Heart, Eye, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ThemeCard = ({ theme, onFavoriteToggle, onApply }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(theme.is_favorite);
  const [isApplying, setIsApplying] = useState(false);

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    try {
      if (isFavorite) {
        await axios.delete(`${API}/favorites/${theme.id}`);
        toast.success("تم الإزالة من المفضلة");
      } else {
        await axios.post(`${API}/favorites/${theme.id}`);
        toast.success("تمت الإضافة إلى المفضلة");
      }
      setIsFavorite(!isFavorite);
      if (onFavoriteToggle) onFavoriteToggle();
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const response = await axios.post(`${API}/themes/${theme.id}/apply`);
      toast.success(response.data.message);
      if (onApply) onApply();
    } catch (error) {
      toast.error("فشل تطبيق الثيم");
    } finally {
      setIsApplying(false);
    }
  };

  const handlePreview = async () => {
    try {
      await axios.post(`${API}/themes/${theme.id}/preview`);
      toast.info(`معاينة ثيم ${theme.name}`);
    } catch (error) {
      toast.error("فشل معاينة الثيم");
    }
  };

  return (
    <div
      data-testid={`theme-card-${theme.id}`}
      className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_24px_rgba(255,255,255,0.05)] hover:border-white/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        <img
          src={theme.image_url}
          alt={theme.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? "scale-105" : "scale-100"
          }`}
        />
        
        {/* Favorite Button */}
        <button
          data-testid={`favorite-btn-${theme.id}`}
          onClick={handleFavoriteToggle}
          className="absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md bg-black/50 border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>

        {/* OS Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full backdrop-blur-md bg-black/50 border border-white/20">
          <span className="text-xs font-medium text-white">{theme.os_type}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'Outfit' }}>
          {theme.name}
        </h3>
        <p className="text-sm text-[#a1a1aa] mb-4">{theme.description}</p>

        {/* Tags */}
        {theme.tags && theme.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {theme.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-[#a1a1aa]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            data-testid={`apply-btn-${theme.id}`}
            onClick={handleApply}
            disabled={isApplying}
            className="flex-1 bg-white text-black hover:bg-white/90 rounded-full font-medium transition-all duration-300 active:scale-95"
          >
            {isApplying ? (
              <span>جاري التطبيق...</span>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                تطبيق
              </>
            )}
          </Button>
          <Button
            data-testid={`preview-btn-${theme.id}`}
            onClick={handlePreview}
            className="flex-1 backdrop-blur-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-full font-medium transition-all duration-300 active:scale-95"
          >
            <Eye className="w-4 h-4 mr-2" />
            معاينة
          </Button>
        </div>
      </div>
    </div>
  );
};
