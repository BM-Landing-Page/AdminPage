// src/pages/dashboard
import React, { useState } from 'react';
import Header from '../components/layout/Header';
import TabNavigation, { TabType } from '../components/layout/TabNavigation';
import BlogManager from '../components/blog/BlogManager';
import TeamManager from '../components/team/TeamManager';
import ApplicationManager from '../components/applications/ApplicationManager';
import CalendarManager from '../components/calendar/CalendarManager';
import GalleryManager from '../components/gallery/GalleryManager';
import CareerManager from '../components/career/CareerManager';
import FeedbackManager from '../components/feedback/FeedbackManager';
import PopupManager from '../components/popup/PopupManager';

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
      case 'career':
        return <CareerManager />;
      case 'gallery':
        return <GalleryManager />;
      case 'feedback':
        return <FeedbackManager />;
      case 'popup':
        return <PopupManager />;
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