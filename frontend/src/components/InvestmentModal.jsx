import React, { useState, useEffect, useRef } from "react";
import styles from "./InvestmentModal.module.css";
import { searchFunds } from "../api/client";

const InvestmentModal = ({ isOpen, onClose, onSelectFund, existingFunds = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  // Focus the search input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle search input changes
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length > 2) {
      setIsLoading(true);
      try {
        const data = await searchFunds(query);
        setSearchResults(data.funds || []);
      } catch (error) {
        console.error("Error searching funds:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Check if a fund is already in portfolio
  const isInPortfolio = (fund) => {
    return existingFunds.some(existing => 
      existing.ticker === fund.ticker || existing.name === fund.name
    );
  };

  // Handle selecting a fund
  const handleSelectFund = (fund) => {
    if (!isInPortfolio(fund)) {
      onSelectFund(fund);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} ref={modalRef}>
        <div className={styles.modalHeader}>
          <h2>Add Investment</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.searchContainer}>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search funds by name or ticker..."
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.resultsContainer}>
          {isLoading ? (
            <div className={styles.loadingMessage}>Searching...</div>
          ) : searchResults.length > 0 ? (
            <ul className={styles.resultsList}>
              {searchResults.map((fund) => (
                <li 
                  key={fund.ticker || fund.name}
                  className={`${styles.resultItem} ${isInPortfolio(fund) ? styles.disabled : ''}`}
                  onClick={() => !isInPortfolio(fund) && handleSelectFund(fund)}
                >
                  <div className={styles.fundInfo}>
                    <div className={styles.fundName}>{fund.name}</div>
                    <div className={styles.fundTicker}>{fund.ticker}</div>
                  </div>
                  <div className={styles.fundType}>{fund.type}</div>
                  {isInPortfolio(fund) && (
                    <div className={styles.alreadyAdded}>Already in portfolio</div>
                  )}
                </li>
              ))}
            </ul>
          ) : searchQuery.trim().length > 2 ? (
            <div className={styles.noResults}>No funds found. Try a different search term.</div>
          ) : (
            <div className={styles.searchPrompt}>
              Type at least 3 characters to search for funds
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentModal;
