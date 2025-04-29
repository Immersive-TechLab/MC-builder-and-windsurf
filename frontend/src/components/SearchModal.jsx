"use client";
import React, { useState, useEffect } from "react";
import styles from "./SearchModal.module.css";

// Mock funds data - same as in MarketChart.jsx
const mockFunds = [
  {
    id: "sp500",
    name: "S&P 500 Index",
    ticker: "SPX",
    type: "Index",
    description: "Large-cap U.S. equities"
  },
  {
    id: "qqq",
    name: "Invesco QQQ Trust",
    ticker: "QQQ",
    type: "ETF",
    description: "Tech-heavy Nasdaq 100 index"
  },
  {
    id: "dji",
    name: "Dow Jones Industrial Average",
    ticker: "DJI",
    type: "Index",
    description: "30 prominent companies listed on U.S. exchanges"
  },
  {
    id: "voo",
    name: "Vanguard S&P 500 ETF",
    ticker: "VOO",
    type: "ETF",
    description: "Low-cost S&P 500 index ETF"
  },
  {
    id: "vti",
    name: "Vanguard Total Stock Market ETF",
    ticker: "VTI",
    type: "ETF",
    description: "Total U.S. stock market exposure"
  }
];

const SearchModal = ({ isOpen, onClose, onSelectFund }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Handle search input changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults(mockFunds);
      return;
    }
    
    const filtered = mockFunds.filter(fund => 
      fund.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      fund.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fund.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(filtered);
  }, [searchQuery]);

  // Initialize with all funds visible
  useEffect(() => {
    setSearchResults(mockFunds);
  }, [isOpen]);

  // Reset search when opening modal
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Handle fund selection
  const handleFundSelect = (fund) => {
    onSelectFund(fund);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Search Market Funds</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by name, ticker or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
        
        <div className={styles.searchResults}>
          {searchResults.length > 0 ? (
            searchResults.map(fund => (
              <div 
                key={fund.id} 
                className={styles.searchResultItem}
                onClick={() => handleFundSelect(fund)}
              >
                <div className={styles.fundTicker}>{fund.ticker}</div>
                <div className={styles.fundName}>{fund.name}</div>
                <div className={styles.fundType}>{fund.type}</div>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>No funds found matching your search.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
