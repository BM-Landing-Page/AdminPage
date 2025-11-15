import React from 'react';
import { BookOpen, Users, FileText, Calendar, Image, MessageSquare } from 'lucide-react';

export type TabType = 'blog' | 'team' | 'applications' | 'calendar' | 'gallery' | 'career' | 'feedback' | 'popup' 
  | 'scroll' | 'achievements' | 'busRoutes' | 'alumni' | 'universities' | 'batches';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'busRoutes' as TabType, name: 'Bus Routes', icon: Users },
  { id: 'alumni' as TabType, name: 'Alumni', icon: Users },
  { id: 'universities' as TabType, name: 'Universities', icon: Image },
  { id: 'batches' as TabType, name: 'Batches', icon: FileText },
  { id: 'blog' as TabType, name: 'Blog', icon: BookOpen },
  { id: 'team' as TabType, name: 'Team', icon: Users },
  { id: 'applications' as TabType, name: 'Applications', icon: FileText },
  { id: 'calendar' as TabType, name: 'Calendar', icon: Calendar },
  { id: 'career' as TabType, name: 'Career', icon: Users }, 
  { id: 'gallery' as TabType, name: 'Gallery', icon: Image },
  { id: 'feedback' as TabType, name: 'Feedback', icon: MessageSquare },
  { id: 'popup' as TabType, name: 'Popup', icon: MessageSquare },
  { id: 'scroll' as TabType, name: 'Scroll', icon: MessageSquare },
  { id: 'achievements' as TabType, name: 'Achievements', icon: Users },
];

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Desktop View - Hidden on mobile */}
        <div className="hidden md:flex items-center justify-center gap-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 shadow-sm border-2 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white border-blue-600 scale-105'
                    : 'bg-gray-50 text-gray-600 border-transparent hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile View - Horizontal Scrollable */}
        <div className="md:hidden">
          <div className="flex overflow-x-auto scrollbar-hide gap-2 py-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-full font-semibold text-xs transition-all duration-200 min-w-[80px] shadow-sm border-2 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white border-blue-600 scale-105'
                      : 'bg-gray-50 text-gray-600 border-transparent hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="whitespace-nowrap">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </nav>
  );
};

export default TabNavigation;