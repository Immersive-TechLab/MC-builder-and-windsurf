import React, { createContext, useContext, useState, useEffect } from 'react';
import { getGraphData } from '../api/client';

// Create the context
export const PortfolioContext = createContext();

// Create a custom hook to use the portfolio context
export const usePortfolio = () => useContext(PortfolioContext);

// Helper function to get a date relative to today based on the selected timeframe
const getRelativeDate = (timeFrame) => {
  const endDate = new Date();
  const startDate = new Date();
  
  switch(timeFrame) {
    case '6M':
      startDate.setMonth(endDate.getMonth() - 6);
      break;
    case '1Y':
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    case '5Y':
      startDate.setFullYear(endDate.getFullYear() - 5);
      break;
    case '10Y':
      startDate.setFullYear(endDate.getFullYear() - 10);
      break;
    default:
      startDate.setFullYear(endDate.getFullYear() - 1);
  }
  
  return startDate.toISOString().split('T')[0];
};

export const PortfolioProvider = ({ children }) => {
  // Portfolio state with default S&P 500 ETF
  const [portfolio, setPortfolio] = useState([
    {
      name: "S&P 500 ETF",
      ticker: "SPY",
      type: "ETF",
      amount: 10000,
      currency: "USD"
    }
  ]);

  // Graph data state
  const [graphData, setGraphData] = useState(null);
  const [isLoadingGraph, setIsLoadingGraph] = useState(false);
  const [startDate, setStartDate] = useState(getRelativeDate('1Y'));
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]); // Today

  // Add investment to portfolio
  const addInvestment = (fund) => {
    const newInvestment = {
      ...fund,
      amount: 100, // Default amount as specified in requirements
      currency: "USD"
    };
    
    setPortfolio(prev => [...prev, newInvestment]);
  };

  // Remove investment from portfolio
  const removeInvestment = (index) => {
    setPortfolio(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  // Reset portfolio to default state
  const resetPortfolio = () => {
    setPortfolio([
      {
        name: "S&P 500 ETF",
        ticker: "SPY",
        type: "ETF",
        amount: 500,
        currency: "USD"
      }
    ]);
  };

  // Update investment amount
  const updateInvestmentAmount = (index, newAmount) => {
    setPortfolio(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        amount: parseFloat(newAmount) || 0
      };
      return updated;
    });
  };

  // Calculate total investment
  const totalInvestment = portfolio.reduce(
    (sum, item) => sum + parseFloat(item.amount), 
    0
  );

  // Update graph data when portfolio, start date, or end date changes
  useEffect(() => {
    // If portfolio is empty, use fallback
    if (portfolio.length === 0) {
      setPortfolio([
        {
          name: "S&P 500 ETF",
          ticker: "SPY",
          type: "ETF",
          amount: 500,
          currency: "USD"
        }
      ]);
      return;
    }
    
    // Extract holdings with ticker and purchase_value for API call
    const holdings = portfolio.map(item => ({
      ticker: item.ticker,
      purchase_value: parseFloat(item.amount) || 10000
    })).filter(item => Boolean(item.ticker));
    console.log("Loading graph data for holdings:", holdings, "from", startDate, "to", endDate);
    
    // Fetch updated graph data
    const updateGraphData = async () => {
      setIsLoadingGraph(true);
      try {
        // Make API call to get graph data
        const data = await getGraphData(holdings, startDate, endDate);
        console.log("Raw API response:", data);
        
        if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
          console.log("No data received from API");
          setGraphData({ data: [] });
        } else {
          // Transform the real API data to have a single portfolioValue field
          const transformedData = data.data.map(item => {
            // Convert the date
            const transformedItem = { date: item.date };
            
            // Calculate the combined portfolio value for this date
            // This assumes the backend returns an object with ticker values for each date
            const tickerValues = Object.keys(item).filter(key => key !== 'date');
            const totalValue = tickerValues.reduce((sum, ticker) => sum + (parseFloat(item[ticker]) || 0), 0);
            
            transformedItem.portfolioValue = totalValue;
            return transformedItem;
          });
          
          setGraphData({ data: transformedData });
          console.log("Graph data processed successfully:", transformedData.length, "data points");
        }
      } catch (error) {
        console.error("Error updating graph data:", error);
        setGraphData({ data: [] });
        console.log("Error occurred, no fallback data will be used");
      } finally {
        setIsLoadingGraph(false);
      }
    };
    
    updateGraphData();
  }, [portfolio, startDate, endDate]);

  // This function now uses the helper defined above
  
  // Set timeframe based on predefined periods
  const setTimeFrame = (timeFrame) => {
    // Update start date based on the selected timeframe
    setStartDate(getRelativeDate(timeFrame));
    // End date is always today
    setEndDate(new Date().toISOString().split('T')[0]);
  };

  // Set a custom timeframe based on event dates
  const setEventTimeframe = (eventStartDate, eventEndDate) => {
    if (eventStartDate && eventEndDate) {
      // Set the exact dates from the event
      setStartDate(eventStartDate);
      setEndDate(eventEndDate);
      console.log(`Setting custom timeframe: ${eventStartDate} to ${eventEndDate}`);
    }
  };

  // Context value
  const value = {
    portfolio,
    graphData,
    isLoadingGraph,
    totalInvestment,
    startDate,
    endDate,
    setTimeFrame, // This now sets both startDate and endDate based on timeframe
    setEventTimeframe, // Set custom timeframe based on event dates
    setStartDate, // Direct setter for more control if needed
    setEndDate,   // Direct setter for more control if needed
    addInvestment,
    removeInvestment,
    resetPortfolio,
    updateInvestmentAmount
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
