import React from 'react';
import { MdDashboard, MdNotifications, MdAutoAwesome } from 'react-icons/md'; // Icons for Dashboard, GPT Voice, and Notifications
import './Footer.css';
import { useLocalization } from '../toolkit/LocalizationContext';

const Footer = ({ activeTab, setActiveTab }) => {
  const { translate } = useLocalization();

  return (
    <footer className="main-footer">
      {/* Dashboard Section */}
      <div
        className={`main-footer-item ${activeTab === 'dashboard' ? 'active' : ''}`}
        onClick={() => setActiveTab('dashboard')}
      >
        <MdDashboard size={30} className="main-footer-icon" />
        <span>{translate('195', 'Dashboard')}</span>
      </div>

      {/* GPT Voice Section */}
      <div className="main-footer-item">
        <MdAutoAwesome size={35} className="main-footer-icon" />
        <span>{translate('200', 'Chat GPT')}</span>
      </div>

      {/* Notifications Section */}
      <div
        className={`main-footer-item ${activeTab === 'notifications' ? 'active' : ''}`}
        onClick={() => setActiveTab('notifications')}
      >
        <MdNotifications size={30} className="main-footer-icon" />
        <span>{translate('12', 'Notifications')}</span>
      </div>
    </footer>
  );
};

export default Footer;
