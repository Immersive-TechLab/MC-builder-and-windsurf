import React, { useState, useEffect, useCallback } from "react";
import styles from "./MarketEvents.module.css";
import MarketCard from "./MarketCard";
import { getMarketEvent } from "../api/client";
import { useMarketEvent } from "../context/MarketEventContext";

// Default market events when no search is performed
const DEFAULT_EVENTS = [
  {
    id: 1,
    name: "COVID-19 Crash",
    start_date: "2020-03-01",
    end_date: "2020-03-31",
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/aadebd268b98a26923d13f32633ed33dc325714d?placeholderIfAbsent=true&apiKey=565aa3f054e94263bc85135737180db5",
    description: "Market dropped 34% but recovered within 6 months, marking the shortest bear market in history."
  },
  {
    id: 2,
    name: "2008 Financial Crisis",
    start_date: "2008-09-01",
    end_date: "2008-09-30",
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/d276de5288fb354b67ec28202b64a356b06464c8?placeholderIfAbsent=true&apiKey=565aa3f054e94263bc85135737180db5",
    description: "The S&P 500 fell 46.13% and took approximately 4 years to recover to previous levels."
  },
  {
    id: 3,
    name: "Dot-com Bubble",
    start_date: "2000-03-01",
    end_date: "2000-03-31",
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/c90539a552d778d3a3b8be0b778c219051eadffd?placeholderIfAbsent=true&apiKey=565aa3f054e94263bc85135737180db5",
    description: "Tech-heavy market collapse led to a 49.1% decline, taking 7 years to recover fully."
  }
];

const MarketEvents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [isSearching, setIsSearching] = useState(false);
  const { updateSelectedEvent } = useMarketEvent();
  // Input value state to hold temporary value before search
  const [inputValue, setInputValue] = useState("");

  // Function to handle event card click
  const handleEventClick = (event) => {
    updateSelectedEvent({
      name: event.name,
      start_date: event.start_date,
      end_date: event.end_date
    });
  };
  
  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId = null;
      return (query) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          if (query.trim() === "") {
            setEvents(DEFAULT_EVENTS);
            setIsSearching(false);
          } else {
            setIsSearching(true);
            try {
              // Use the getMarketEvent API for single market event details
              const event = await getMarketEvent(query);
              
              // Format the event to match our display needs
              const formattedEvent = {
                id: Date.now(), // Generate a unique ID
                name: event.name,
                start_date: event.start_date,
                end_date: event.end_date,
                description: event.description,
                // Use a default icon or generate one based on the event name
                icon: `https://cdn.builder.io/api/v1/image/assets/TEMP/${query.length % 3 === 0 ? 'aadebd268b98a26923d13f32633ed33dc325714d' : query.length % 3 === 1 ? 'd276de5288fb354b67ec28202b64a356b06464c8' : 'c90539a552d778d3a3b8be0b778c219051eadffd'}?placeholderIfAbsent=true&apiKey=565aa3f054e94263bc85135737180db5`
              };
              
              setEvents([formattedEvent]);
            } catch (error) {
              console.error('Error fetching market event:', error);
              setEvents([]);
            }
          }
        }, 300); // 300ms debounce delay
      };
    })(),
    []
  );
  
  // Handle search form submission
  const handleSearch = (e) => {
    // Prevent default form submission behavior
    if (e) e.preventDefault();
    
    // Only update searchQuery (which triggers the search) when form is submitted
    setSearchQuery(inputValue);
  };
  
  // Effect to trigger search when query changes
  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    }
  }, [searchQuery, debouncedSearch]);

  return (
    <section className={styles.eventsSection}>
      <div className={styles.eventsHeader}>
        <h2 className={styles.eventsTitle}>Popular Market Events</h2>
        <form onSubmit={handleSearch} className={styles.searchBar}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/8bae337066751a4c5381162c0a3701284a820484?placeholderIfAbsent=true&apiKey=565aa3f054e94263bc85135737180db5"
            alt=""
            className={styles.searchIcon}
          />
          <input
            type="text"
            placeholder="Search market events... (press Enter to search)"
            className={styles.searchInput}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </form>
      </div>

      <div className={styles.eventsGrid}>
        {isSearching && events.length === 0 ? (
          <p className={styles.noResults}>No events found</p>
        ) : (
          events.map((event) => (
            <MarketCard
              key={event.id}
              icon={event.icon}
              title={event.name}
              date={new Date(event.start_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              description={event.description}
              onClick={() => handleEventClick(event)}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default MarketEvents;
