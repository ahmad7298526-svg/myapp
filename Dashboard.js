import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Monitor, HardDrive, Palette, TrendingUp } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalThemes: 0,
    desktopThemes: 0,
    bootThemes: 0,
    favorites: 0
  });
  const [recentThemes, setRecentThemes] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [themesRes, favoritesRes, appliedRes] = await Promise.all([
        axios.get(`${API}/themes`),
        axios.get(`${API}/favorites`),
        axios.get(`${API}/applied-themes`)
      ]);

      const themes = themesRes.data;
      setStats({
        totalThemes: themes.length,
        desktopThemes: themes.filter(t => t.category === 'desktop').length,
        bootThemes: themes.filter(t => t.category === 'boot').length,
        favorites: favoritesRes.data.length
      });

      setRecentThemes(appliedRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const statCards = [
    {
      title: "ثيمات سطح المكتب",
      value: stats.desktopThemes,
      icon: Monitor,
      color: "#007AFF",
      path: "/desktop-themes",
      testId: "stat-desktop-themes"
    },
    {
      title: "ثيمات البوت",
      value: stats.bootThemes,
      icon: HardDrive,
      color: "#10b981",
      path: "/boot-themes",
      testId: "stat-boot-themes"
    },
    {
      title: "المفضلة",
      value: stats.favorites,
      icon: Palette,
      color: "#f59e0b",
      path: "/favorites",
      testId: "stat-favorites"
    },
    {
      title: "مجموع الثيمات",
      value: stats.totalThemes,
      icon: TrendingUp,
      color: "#ef4444",
      testId: "stat-total-themes"
    }
  ];

  return (
    <Layout>
      <div className="p-8 md:p-12">
        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-3 tracking-tight"
            style={{ fontFamily: 'Outfit' }}
            data-testid="dashboard-title"
          >
            مرحباً بك في مركز الثيمات
          </h1>
          <p className="text-lg text-[#a1a1aa]">
            خصص مظهر نظام Zorin OS الخاص بك
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                data-testid={stat.testId}
                onClick={() => stat.path && navigate(stat.path)}
                className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_24px_rgba(255,255,255,0.05)] hover:border-white/20 ${
                  stat.path ? 'cursor-pointer active:scale-95' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Outfit' }}>
                  {stat.value}
                </h3>
                <p className="text-sm text-[#a1a1aa]">{stat.title}</p>
              </div>
            );
          })}
        </div>

        {/* Recent Applied Themes */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: 'Outfit' }}
            data-testid="recent-themes-title"
          >
            الثيمات المطبقة مؤخراً
          </h2>
          
          {recentThemes.length === 0 ? (
            <p className="text-[#a1a1aa] text-center py-8">لا توجد ثيمات مطبقة بعد</p>
          ) : (
            <div className="space-y-3">
              {recentThemes.map((theme, index) => (
                <div
                  key={index}
                  data-testid={`recent-theme-${index}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300"
                >
                  <div>
                    <h4 className="font-medium mb-1">{theme.theme_name}</h4>
                    <p className="text-sm text-[#a1a1aa]">
                      {theme.category === 'desktop' ? 'سطح المكتب' : 'البوت'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#a1a1aa]">
                      {new Date(theme.applied_at).toLocaleDateString('ar')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

