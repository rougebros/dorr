import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CalendarModal.css';

const CalendarModal = ({ selectedDate, onDateChange, onClose }) => {
  return (
    <div className="calendar-modal-overlay" onClick={onClose}>
      <div className="calendar-modal-content" onClick={e => e.stopPropagation()}>
        <h3>Select a Date</h3>
        <DatePicker
          selected={selectedDate}
          onChange={onDateChange}
          showTimeSelect
          dateFormat="Pp"
          inline
        />
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CalendarModal;
