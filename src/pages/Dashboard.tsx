import React, { useState } from 'react';
import { Menu, X, FileText, Users, Inbox, Calendar, Briefcase, Image, MessageSquare, Bell, Scroll, Trophy, Bus, GraduationCap, Building, Layers, ClipboardList } from 'lucide-react';

// Import your components
import BlogManager from '../components/blog/BlogManager';
import TeamManager from '../components/team/TeamManager';
import ApplicationManager from '../components/applications/ApplicationManager';
import CalendarManager from '../components/calendar/CalendarManager';
import GalleryManager from '../components/gallery/GalleryManager';
import CareerManager from '../components/career/CareerManager';
import PositionsManager from '../components/position/positionManager';
import FeedbackManager from '../components/feedback/FeedbackManager';
import PopupManager from '../components/popup/popupManager';
import ScrollManager from '../components/scroll/scrollManager';
import AchievementManager from '../components/achievements/achievementsManager';
import BusRoutesManager from '../components/busRoutes/BusRoutesManager';
import AlumniManager from '../components/alumni/AlumniManager';
import UniversitiesManager from '../components/universities/UniversitiesManager';
import BatchManager from '../components/batches/BatchManager';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('blog');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'applications', label: 'Applications', icon: Inbox },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'career', label: 'Career', icon: Briefcase },
    { id: 'positions', label: 'Positions', icon: ClipboardList }, // ✅ New tab
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'popup', label: 'Popup', icon: Bell },
    { id: 'scroll', label: 'Scroll', icon: Scroll },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'busRoutes', label: 'Bus Routes', icon: Bus },
    { id: 'alumni', label: 'Alumni', icon: GraduationCap },
    { id: 'universities', label: 'Universities', icon: Building },
    { id: 'batches', label: 'Batches', icon: Layers },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'blog': return <BlogManager />;
      case 'team': return <TeamManager />;
      case 'applications': return <ApplicationManager />;
      case 'calendar': return <CalendarManager />;
      case 'career': return <CareerManager />;
      case 'positions': return <PositionsManager />; // ✅ Render PositionsManager
      case 'gallery': return <GalleryManager />;
      case 'feedback': return <FeedbackManager />;
      case 'popup': return <PopupManager />;
      case 'scroll': return <ScrollManager />;
      case 'achievements': return <AchievementManager />;
      case 'busRoutes': return <BusRoutesManager />;
      case 'alumni': return <AlumniManager />;
      case 'universities': return <UniversitiesManager />;
      case 'batches': return <BatchManager />;
      default: return <BlogManager />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen && <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {navItems.find(item => item.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell size={20} className="text-gray-600" />
            </button>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="w-full h-full">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
