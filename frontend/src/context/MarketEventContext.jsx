import React, { createContext, useState, useContext } from 'react';

const MarketEventContext = createContext();

export function MarketEventProvider({ children }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const updateSelectedEvent = (event) => {
    setSelectedEvent(event);
  };

  return (
    <MarketEventContext.Provider value={{ selectedEvent, updateSelectedEvent }}>
      {children}
    </MarketEventContext.Provider>
  );
}

export function useMarketEvent() {
  const context = useContext(MarketEventContext);
  if (!context) {
    throw new Error('useMarketEvent must be used within a MarketEventProvider');
  }
  return context;
}
