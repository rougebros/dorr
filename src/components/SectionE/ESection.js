import React, { useState } from 'react';
import './ESection.css';
import keplerImage from './../../files/media/kepler.png'; // Import the map image
import twitterIcon from './../../files/media/twitter.png'; // Import the actual Twitter icon
import instagramIcon from './../../files/media/instagram.png'; // Import the actual Instagram icon
import facebookIcon from './../../files/media/facebook.png'; // Import the actual Facebook icon
import tiktokIcon from './../../files/media/tiktok.png'; // Import the actual TikTok icon
import { useLocalization } from '../toolkit/LocalizationContext';

const ESection = () => {
  const [selectedTab, setSelectedTab] = useState(null); // Track selected tab
  const { translate } = useLocalization();
  // Handle tab click
  const handleTabClick = (tab) => {
    setSelectedTab(tab); // Update selected tab
  };

  return (
    <div className="e-section-container">
      {/* Sidebar only appears after clicking an item */}
      {selectedTab && (
        <div className="e-sidebar">
          <div
            className={`e-tab-sidebar ${selectedTab === 'map' ? 'active' : ''}`}
            onClick={() => handleTabClick('map')}
          >
            🗺️
            <span className="tab-description">{translate('23', 'Map')}</span>
          </div>
          <div
            className={`e-tab-sidebar ${selectedTab === 'chats' ? 'active' : ''}`}
            onClick={() => handleTabClick('chats')}
          >
            💬
            <span className="tab-description">{translate('24', 'Chats')}</span>
          </div>
          <div
            className={`e-tab-sidebar ${selectedTab === 'tasks' ? 'active' : ''}`}
            onClick={() => handleTabClick('tasks')}
          >
            📋
            <span className="tab-description">{translate('25', 'Tasks')}</span>
          </div>
          <div
            className={`e-tab-sidebar ${selectedTab === 'social' ? 'active' : ''}`}
            onClick={() => handleTabClick('social')}
          >
            📱
            <span className="tab-description">{translate('26', 'Social')}</span>
          </div>
        </div>
      )}

      <div className="e-content">
        {/* Show large icons initially */}
        {!selectedTab && (
          <div className="e-large-icons">
            <div className="e-item" onClick={() => handleTabClick('map')}>
              <span className="large-icon">🗺️</span>
              <span className="e-icon-text">{translate('23', 'Map')}</span>
            </div>
            <div className="e-item" onClick={() => handleTabClick('chats')}>
              <span className="large-icon">💬</span>
              <span className="e-icon-text">{translate('24', 'Tasks')}</span>
            </div>
            <div className="e-item" onClick={() => handleTabClick('tasks')}>
              <span className="large-icon">📋</span>
              <span className="e-icon-text">{translate('25', 'Tasks')}</span>
            </div>
            <div className="e-item" onClick={() => handleTabClick('social')}>
              <span className="large-icon">📱</span>
              <span className="e-icon-text">{translate('26', 'Social')}</span>
            </div>
          </div>
        )}

        {/* Content based on selected tab */}
        {selectedTab === 'map' && (
          <div className="tab-content-inner map-container">
            <img src={keplerImage} className="map-image" alt="Map" />
          </div>
        )}

        {selectedTab === 'chats' && (
          <div className="tab-content-inner scrollable-content">
            <div className="chat-item">
              <strong>John Doe:</strong> Hey, can we schedule the cleaning for 3 pm? The office needs to be ready for tomorrow’s meeting.
            </div>
            <div className="chat-item">
              <strong>Jane Smith (Cleaner):</strong> Sure, I'll start at 3 pm. Are there any specific areas you want me to focus on?
            </div>
            <div className="chat-item">
              <strong>John Doe:</strong> Yes, the conference room and kitchen. Please make sure to sanitize all surfaces and clean the windows.
            </div>
            <div className="chat-item">
              <strong>Bob Lee (Cleaner):</strong> I noticed an issue with the vacuum earlier. It's not picking up debris properly. Should I bring a new one, or can we get it fixed?
            </div>
            <div className="chat-item">
              <strong>John Doe:</strong> If it’s not working, feel free to bring a new one. We don’t have time for repairs right now.
            </div>
            <div className="chat-item">
              <strong>Anne Cruz (Cleaner):</strong> The tools are ready for tomorrow. I'll make sure the cleaning supplies are stocked and the windows are cleaned as requested.
            </div>
            <div className="chat-item">
              <strong>GPT-4o:</strong> I’ve added a summary of the requested tasks: 1) Clean conference room, 2) Sanitize kitchen, 3) Clean windows. Let me know if I missed anything.
            </div>
            <div className="chat-item">
              <strong><span className="g-icon">👑 G:</span></strong> Don't forget to inspect the floors closely. Often, missed corners can create a bad impression. And remember, quality is more important than speed.
            </div>
            <div className="chat-item">
              <strong>Jane Smith (Cleaner):</strong> Got it, I’ll make sure to pay extra attention to the corners. Thanks for the reminder!
            </div>
            <div className="chat-item">
              <strong>John Doe:</strong> Sounds great! Let me know when everything is done. I'll inspect the rooms before the end of the day.
            </div>
            <div className="chat-item">
              <strong>Bob Lee (Cleaner):</strong> Will do. If there's any issue, I’ll let you know right away.
            </div>
            <div className="chat-item">
              <strong>Anne Cruz (Cleaner):</strong> I'll send a photo of the conference room once I’m done. Should be all good by 5 pm.
            </div>
            <div className="chat-item">
              <strong>GPT-4o:</strong> Task list updated with Bob’s equipment issue and Anne’s conference room completion by 5 pm.
            </div>
          </div>
        )}

        {selectedTab === 'tasks' && (
          <div className="tab-content-inner scrollable-content">
            <div className="task-item">
              Clean the floor. <span>💜</span>
            </div>
            <div className="task-item">
              Dispose of garbage. <span>💜💙</span>
            </div>
            <div className="task-item">
              Sanitize all surfaces. <span>💜💙</span>
            </div>
            <div className="task-item">
              Finalize checklist and mark completed items. <span>💜💙❌</span>
            </div>
            <div className="task-item">
              Organize cleaning supplies. <span>💜💙💚</span>
            </div>
            <div className="task-item">
              Take picture after completion. <span>💜💙</span>
            </div>
            <div className="task-item">
              Send receipts to this email <span>💜💙</span>
            </div>
          </div>
        )}

        {selectedTab === 'social' && (
          <div className="tab-content-inner">
            {/* Social media icons at the top */}
            <div className="social-tab-icons">
              <img src={twitterIcon} alt="Twitter" />
              <img src={instagramIcon} alt="Instagram" />
              <img src={facebookIcon} alt="Facebook" />
              <img src={tiktokIcon} alt="TikTok" />
            </div>

            {/* Social media feeds */}
            <div className="scrollable-content">
              <div className="feed-item">
                <strong>Twitter:</strong> @JohnDoe - "Excited for the launch of our new product! #launchday"
                <img src={twitterIcon} alt="Twitter Icon" className="social-icon" />
              </div>
              <div className="feed-item">
                <strong>Instagram:</strong> @JaneSmith - "Vacation vibes 🌴 #beachlife"
                <img src={instagramIcon} alt="Instagram Icon" className="social-icon" />
              </div>
              <div className="feed-item">
                <strong>Facebook:</strong> John Lee shared an event: "Join us for a community clean-up this weekend!"
                <img src={facebookIcon} alt="Facebook Icon" className="social-icon" />
              </div>
              <div className="feed-item">
                <strong>TikTok:</strong> @CreativeMind - "Watch me transform this room in just 10 minutes! 🛠️ #DIY"
                <img src={tiktokIcon} alt="TikTok Icon" className="social-icon" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ESection;
