import React from 'react';
import { BookOpen, Users, FileText, Calendar, Image } from 'lucide-react';

export type TabType = 'blog' | 'team' | 'applications' | 'calendar' | 'gallery';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'blog' as TabType, name: 'Blog', icon: BookOpen },
  { id: 'team' as TabType, name: 'Team', icon: Users },
  { id: 'applications' as TabType, name: 'Applications', icon: FileText },
  { id: 'calendar' as TabType, name: 'Calendar', icon: Calendar },
  { id: 'gallery' as TabType, name: 'Gallery', icon: Image },
];

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
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
      </div>
    </nav>
  );
};

export default TabNavigation;