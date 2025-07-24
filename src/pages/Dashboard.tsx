import React, { useState } from 'react';
import Header from '../components/layout/Header';
import TabNavigation, { TabType } from '../components/layout/TabNavigation';
import BlogManager from '../components/blog/BlogManager';
import TeamManager from '../components/team/TeamManager';
import ApplicationManager from '../components/applications/ApplicationManager';
import CalendarManager from '../components/calendar/CalendarManager';
import GalleryManager from '../components/gallery/GalleryManager';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('blog');

  const renderContent = () => {
    switch (activeTab) {
      case 'blog':
        return <BlogManager />;
      case 'team':
        return <TeamManager />;
      case 'applications':
        return <ApplicationManager />;
      case 'calendar':
        return <CalendarManager />;
      case 'gallery':
        return <GalleryManager />;
      default:
        return <BlogManager />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;