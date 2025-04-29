/**
 * API Client for Market Confidence app
 * Centralized module for all API calls according to project rules
 */

// Use environment variable for API URL
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/**
 * Generic request handler for API calls
 * @param {string} endpoint - API endpoint path
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data
 */
async function apiRequest(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${error.message}`);
    throw error;
  }
}

/**
 * Get multiple market events with optional search query
 * @param {string} query - Optional search term
 * @returns {Promise<Array>} Market events matching query
 */
export const getMarketEvents = async (query = '') => {
  try {
    const queryParam = query ? `?q=${encodeURIComponent(query)}` : '';
    return await apiRequest(`/market-events${queryParam}`);
  } catch (error) {
    console.error('Error fetching market events:', error);
    return { events: [] };
  }
};

/**
 * Get a single market event by search query
 * @param {string} query - Search term for the market event
 * @returns {Promise<Object>} Single market event data with name, dates, and description
 */
export const getMarketEvent = async (query) => {
  try {
    if (!query || query.trim() === '') {
      throw new Error('Search query is required');
    }
    
    const queryParam = `?query=${encodeURIComponent(query)}`;
    return await apiRequest(`/market-event${queryParam}`);
  } catch (error) {
    console.error('Error fetching market event:', error);
    throw error;
  }
};

/**
 * Search for funds matching the provided query
 * @param {string} query - Search term
 * @returns {Promise<Array>} Funds matching query
 */
export const searchFunds = async (query) => {
  try {
    return await apiRequest(`/funds?query=${encodeURIComponent(query)}`);
  } catch (error) {
    console.error('Error searching funds:', error);
    return { funds: [] };
  }
};

/**
 * Get graph data for selected holdings
 * @param {Array<object|string>} holdings - List of holdings (objects or ticker strings)
 * @param {string} startDate - Optional start date (YYYY-MM-DD)
 * @param {string} endDate - Optional end date (YYYY-MM-DD)
 * @param {number} defaultPurchaseValue - Default purchase value if not specified
 * @returns {Promise<Object>} Historical price data
 */
export const getGraphData = async (holdings, startDate = null, endDate = null, defaultPurchaseValue = 10000) => {
  try {
    // Ensure holdings are proper objects with ticker and purchase_value
    const formattedHoldings = holdings.map(holding => {
      // If holding is already a proper object with ticker and purchase_value, use it
      if (typeof holding === 'object' && holding.ticker && holding.purchase_value) {
        return holding;
      }
      
      // If holding is a string (ticker), convert it to a proper object
      return {
        ticker: typeof holding === 'string' ? holding : holding.ticker,
        purchase_value: holding.purchase_value || defaultPurchaseValue
      };
    });
    
    const payload = { 
      holdings: formattedHoldings
    };
    
    // Add date range if provided
    if (startDate) payload.start_date = startDate;
    if (endDate) payload.end_date = endDate;
    
    return await apiRequest('/graph-data', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error('Error fetching graph data:', error);
    return { data: [] };
  }
};
