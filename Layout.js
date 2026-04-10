import { Link, useLocation } from "react-router-dom";
import { Monitor, HardDrive, Palette, Heart, Settings } from "lucide-react";

const Layout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "لوحة التحكم", icon: Monitor, testId: "nav-dashboard" },
    { path: "/desktop-themes", label: "ثيمات سطح المكتب", icon: Monitor, testId: "nav-desktop-themes" },
    { path: "/boot-themes", label: "ثيمات البوت", icon: HardDrive, testId: "nav-boot-themes" },
    { path: "/customization", label: "التخصيص", icon: Palette, testId: "nav-customization" },
    { path: "/favorites", label: "المفضلة", icon: Heart, testId: "nav-favorites" },
  ];

  return (
    <div className="flex min-h-screen bg-[#09090b]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#121214] border-r border-white/10 sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold" style={{ fontFamily: 'Outfit' }}>OS Theme Hub</h1>
              <p className="text-xs text-[#a1a1aa]">Zorin OS</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  data-testid={item.testId}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-white text-black"
                      : "text-[#a1a1aa] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-[#a1a1aa] mb-1">الإصدار</p>
            <p className="text-sm font-medium">v1.0.0</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;

