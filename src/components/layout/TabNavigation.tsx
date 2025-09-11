import React from 'react';
import { BookOpen, Users, FileText, Calendar, Image, MessageSquare } from 'lucide-react';

export type TabType = 'blog' | 'team' | 'applications' | 'calendar' | 'gallery' | 'career' | 'feedback' | 'popup';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'blog' as TabType, name: 'Blog', icon: BookOpen },
  { id: 'team' as TabType, name: 'Team', icon: Users },
  { id: 'applications' as TabType, name: 'Applications', icon: FileText },
  { id: 'calendar' as TabType, name: 'Calendar', icon: Calendar },
  { id: 'career' as TabType, name: 'Career', icon: Users }, 
  { id: 'gallery' as TabType, name: 'Gallery', icon: Image },
  { id: 'feedback' as TabType, name: 'Feedback', icon: MessageSquare },
  { id: 'popup' as TabType, name: 'Popup', icon: MessageSquare },
];

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop View - Hidden on mobile */}
        <div className="hidden md:flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
          <div className="flex overflow-x-auto scrollbar-hide space-x-1 py-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex-shrink-0 flex flex-col items-center space-y-1 py-3 px-4 rounded-lg font-medium text-xs transition-colors duration-200 min-w-[80px] ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
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