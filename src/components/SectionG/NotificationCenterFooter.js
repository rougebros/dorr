import React from 'react';
import { MdNotificationsActive, MdNotifications, MdCheck, MdTimer } from 'react-icons/md';
import './NotificationCenterFooter.css';
import { useLocalization } from '../toolkit/LocalizationContext';

const NotificationCenterFooter = () => {
  const { translate } = useLocalization();

  return (
    <div className="notification-footer">
      <div className="notification-footer-item current-tab pending-icon">
        <MdNotificationsActive size={40} />
        <span className="pending-text">{translate('196', 'Pending')}</span>
      </div>
      <div className="notification-footer-item accepted-icon">
        <div className="icon-with-check">
          <MdNotifications size={40} />
          <MdCheck size={16} className="check-icon" />
        </div>
        <span>{translate('197', 'Accepted')}</span>
      </div>
      <div className="notification-footer-item time-off-icon">
        <MdTimer size={40} />
        <span>{translate('198', 'Time Off')}</span>
      </div>
    </div>
  );
};

export default NotificationCenterFooter;
