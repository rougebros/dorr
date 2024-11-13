import React, { useState } from 'react';
import { MdNotifications, MdNotificationsOff, MdNotificationsActive, MdTimer } from 'react-icons/md';
import { FaHeart } from 'react-icons/fa';
import './NotificationCenter.css';
import { useLocalization } from '../toolkit/LocalizationContext';

const bellColors = {
  red: '#FF4500',
  yellow: '#FFD700',
  blue: '#1E90FF',
  green: '#32CD32',
  purple: '#9370DB',
  orange: '#FFA500',
};

const notifications = [
  { color: 'red', icon: '🚐', tag: '#transport #van', description: 'Van transport schedule update' },
  { color: 'yellow', icon: '💻', tag: '#education #online_courses', description: 'New course available on AI' },
  { color: 'blue', icon: '🩺', tag: '#health #checkup', description: 'Upcoming health checkup reminder' },
  { color: 'green', icon: '🌿', tag: '#environment #recycling', description: 'Recycling event this weekend' },
  { color: 'purple', icon: '🤝', tag: '#community #volunteer', description: 'Volunteer opportunities' },
  { color: 'orange', icon: '📝', tag: '#employment #job_seeking', description: 'Job fair this month' },
  { color: 'red', icon: '🚸', tag: '#safety #laborkids', description: 'Safety regulations update' },
  { color: 'yellow', icon: '🛒', tag: '#shop #groceries', description: 'Discount on groceries' },
  { color: 'blue', icon: '🔧', tag: '#repair #electronics', description: 'Electronics repair needed' },
  { color: 'green', icon: '🏕️', tag: '#travel #camping', description: 'Camping site reservation info' },
];

function NotificationCenter() {
  const [mutedItems, setMutedItems] = useState(new Set());
  const [statuses, setStatuses] = useState({});
  const { translate } = useLocalization();

  const toggleStatus = (index, type) => {
    setStatuses((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [type]: prev[index]?.[type] ? null : type,
      },
    }));
  };

  const toggleThirdHeart = (index) => {
    setStatuses((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        green: prev[index]?.green ? null : prev[index]?.red ? 'green' : 'red',
        red: prev[index]?.red ? null : prev[index]?.green ? 'red' : null,
      },
    }));
  };

  const toggleMute = (index) => {
    setMutedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="notification-center">
      {notifications.map((notif, index) => (
        <div key={index} className={`notification-item ${notif.color}`}>
          <div
            className="bell-icon"
            style={{ backgroundColor: bellColors[notif.color] }}
            onClick={() => toggleMute(index)}
          >
            {mutedItems.has(index) ? <MdNotificationsOff size={24} /> : <MdNotifications size={24} />}
          </div>
          <div className="notification-content">
            <h3>{notif.tag}</h3>
            <p>{notif.description}</p>
            <div className="heart-icons">
              <div className="heart-container">
                <FaHeart
                  className={`heart-icon ${statuses[index]?.purple ? 'purple' : 'gray'}`}
                  onClick={() => toggleStatus(index, 'purple')}
                  title={translate('61', '💜 THOUGHTs')}
                />
                <div className="underline purple-line"></div>
              </div>
              <div className="heart-container">
                <FaHeart
                  className={`heart-icon ${statuses[index]?.blue ? 'blue' : 'gray'}`}
                  onClick={() => statuses[index]?.purple && toggleStatus(index, 'blue')}
                  title={translate('62', '💙 PROMISEs')}
                />
                <div className="underline blue-line"></div>
              </div>
              <div className="heart-container">
                <FaHeart
                  className={`heart-icon ${
                    statuses[index]?.green ? 'green' : statuses[index]?.red ? 'red' : 'gray'
                  }`}
                  onClick={() => statuses[index]?.blue && toggleThirdHeart(index)}
                  title={translate('63', '💚 DEEDs')}
                />
                <div className="underline green-line"></div>
              </div>
            </div>
          </div>
          <div className="notification-icon">
            <span>{notif.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotificationCenter;
