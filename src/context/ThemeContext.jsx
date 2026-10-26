import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('sachivalayam_contrast') === 'true';
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('sachivalayam_font_size') || 'normal';
  });

  useEffect(() => {
    localStorage.setItem('sachivalayam_contrast', String(highContrast));
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('sachivalayam_font_size', fontSize);
    document.body.classList.remove('font-size-normal', 'font-size-large', 'font-size-xlarge');
    document.body.classList.add(`font-size-${fontSize}`);
  }, [fontSize]);

  const toggleHighContrast = () => setHighContrast(prev => !prev);

  const cycleFontSize = () => {
    setFontSize(prev => {
      if (prev === 'normal') return 'large';
      if (prev === 'large') return 'xlarge';
      return 'normal';
    });
  };

  return (
    <ThemeContext.Provider value={{ highContrast, toggleHighContrast, fontSize, cycleFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
