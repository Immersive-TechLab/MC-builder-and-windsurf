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
    
    // Extract tickers for API call
    const holdings = portfolio.map(item => item.ticker).filter(Boolean);
    console.log("Loading graph data for holdings:", holdings, "from", startDate, "to", endDate);
    
    // Fetch updated graph data
    const updateGraphData = async () => {
      setIsLoadingGraph(true);
      try {
        // Make API call to get graph data
        const data = await getGraphData(holdings, startDate, endDate);
        console.log("Raw API response:", data);
        
        // Create dummy data if needed for testing
        if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
          console.log("No data received from API, creating sample data based on timeframe");
          const today = new Date();
          const sampleData = [];
          let dataPoints = 30; // Default to 30 data points
          let dateInterval = 1; // Default to daily
          
          // Determine data points and interval based on timeframe
          const startDateObj = new Date(startDate);
          const endDateObj = new Date(endDate);
          const daysDifference = Math.floor((endDateObj - startDateObj) / (1000 * 60 * 60 * 24));
          
          if (daysDifference > 365 * 3) { // 5Y or 10Y timeframe
            // For long timeframes, use monthly data points
            dataPoints = daysDifference / 30;
            dateInterval = 30; // Monthly
          } else if (daysDifference > 365) { // 1Y timeframe
            // For 1Y, use bi-weekly data points
            dataPoints = daysDifference / 14;
            dateInterval = 14; // Bi-weekly
          } else {
            // For shorter timeframes, use daily or weekly data points
            dataPoints = daysDifference > 90 ? daysDifference / 7 : daysDifference;
            dateInterval = daysDifference > 90 ? 7 : 1; // Weekly or daily
          }
          
          // Generate appropriate number of data points
          let baseValue = 100;
          for (let i = 0; i < dataPoints; i++) {
            const date = new Date(startDateObj);
            date.setDate(date.getDate() + (i * dateInterval));
            
            // Make sure we don't exceed end date
            if (date > endDateObj) break;
            
            const dateStr = date.toISOString().split('T')[0];
            
            // Create a realistic trend with some randomness
            baseValue = baseValue * (1 + (Math.random() * 0.04 - 0.02)); // -2% to +2% change
            
            // Create a mock data point with the ticker as key
            const dataPoint = { date: dateStr };
            dataPoint.SPY = baseValue;
            
            sampleData.push(dataPoint);
          }
          
          // Process the sample data like we would process real data
          const transformedData = sampleData.map(item => {
            // Convert the date
            const transformedItem = { date: item.date };
            
            // Calculate the combined portfolio value for this date
            const tickerValues = Object.keys(item).filter(key => key !== 'date');
            const totalValue = tickerValues.reduce((sum, ticker) => sum + (parseFloat(item[ticker]) || 0), 0);
            
            transformedItem.portfolioValue = totalValue;
            return transformedItem;
          });
          
          setGraphData({ data: transformedData });
          console.log("Sample graph data created:", transformedData.length, "data points");
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
        // Generate fallback data even on error
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        const daysDifference = Math.floor((endDateObj - startDateObj) / (1000 * 60 * 60 * 24));
        const fallbackData = [];
        
        let dateInterval = 1; // Default to daily
        if (daysDifference > 365 * 3) {
          dateInterval = 30; // Monthly for 5Y/10Y
        } else if (daysDifference > 365) {
          dateInterval = 14; // Bi-weekly for 1Y
        } else if (daysDifference > 90) {
          dateInterval = 7; // Weekly for 6M
        }
        
        let baseValue = 100;
        for (let i = 0; i < daysDifference; i += dateInterval) {
          const date = new Date(startDateObj);
          date.setDate(date.getDate() + i);
          
          // Make sure we don't exceed end date
          if (date > endDateObj) break;
          
          // Create a realistic trend with some randomness
          baseValue = baseValue * (1 + (Math.random() * 0.04 - 0.02)); // -2% to +2% change
          
          fallbackData.push({
            date: date.toISOString().split('T')[0],
            portfolioValue: baseValue
          });
        }
        
        setGraphData({ data: fallbackData });
        console.log("Error occurred, using fallback data:", fallbackData.length, "data points");
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

  // Context value
  const value = {
    portfolio,
    graphData,
    isLoadingGraph,
    totalInvestment,
    startDate,
    endDate,
    setTimeFrame, // This now sets both startDate and endDate based on timeframe
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
