// src/components/Footer.js
import React from 'react';
import homeIcon from '../../files/icons/home.svg';
import alertsIcon from '../../files/icons/alerts.svg';
import calendarIcon from '../../files/icons/calendar.svg';
import peersIcon from '../../files/icons/peers.svg';
import chatIcon from '../../files/icons/chat.svg';
import './Footer.css'; // Ensure you have CSS for footer styles

function Footer() {
  return (
    <footer className="App-footer">
      <img src={alertsIcon} className="App-footer-icon" alt="Alerts" />
      <img src={calendarIcon} className="App-footer-icon" alt="Calendar" />
      <img src={homeIcon} className="App-footer-icon" alt="Home" />
      <img src={peersIcon} className="App-footer-icon" alt="Peers" />
      <img src={chatIcon} className="App-footer-icon" alt="Chat" />
    </footer>
  );
}

export default Footer;
