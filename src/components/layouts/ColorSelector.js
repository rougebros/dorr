import React, { useEffect } from 'react';
import { useLocalization } from './../toolkit/LocalizationContext'; // Import your localization

function ColorSelector({ selectedColor, setSelectedColor }) {
  const { translate } = useLocalization();
  const colors = {
    PAINs: { code: '#C81D11', label: translate('58','PAINs') },
    GAINs: { code: '#FAC710', label: translate('59','GAINs') },
    GODs: { code: '#FF6500', label:translate('60','Gs')  },
    THOUGHTs: { code: '#9510AC', label:translate('61','Thoughts')  },
    PROMISEs: { code: '#1C39BB', label: translate('62','PROMISEs') },
    DEEDs: { code: '#8FD14F', label: translate('63','DEEDs') },
  };


  useEffect(() => {
    const selectElement = document.querySelector('.color-selector');
    Array.from(selectElement.options).forEach((option) => {
      const colorCode = colors[option.value]?.code;
      if (colorCode) {
        option.style.backgroundColor = 'white'; // Default white background
        option.style.color = 'black'; // Default black text

        // Add hover effect for color
        option.onmouseenter = () => {
          option.style.backgroundColor = colorCode; // Change to the rate color on hover
          option.style.color = 'white'; // White text on hover
        };
        option.onmouseleave = () => {
          option.style.backgroundColor = 'white'; // Revert to white background
          option.style.color = 'black'; // Revert to black text
        };
      }
    });
  }, [selectedColor]);

  return (
    <select
      value={selectedColor}
      onChange={(e) => setSelectedColor(e.target.value)}
      className="color-selector"
    >
      {Object.entries(colors).map(([key, { code, label }]) => (
        <option key={key} value={code}>
          {label}
        </option>
      ))}
    </select>
  );
}

export default ColorSelector;
