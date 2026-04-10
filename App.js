import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import DesktopThemes from "@/pages/DesktopThemes";
import BootThemes from "@/pages/BootThemes";
import Customization from "@/pages/Customization";
import Favorites from "@/pages/Favorites";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/desktop-themes" element={<DesktopThemes />} />
          <Route path="/boot-themes" element={<BootThemes />} />
          <Route path="/customization" element={<Customization />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

