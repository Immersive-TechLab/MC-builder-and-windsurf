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
 * Get market events with optional search query
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
 * @param {Array<string>} holdings - List of tickers
 * @param {string} startDate - Optional start date (YYYY-MM-DD)
 * @param {string} endDate - Optional end date (YYYY-MM-DD)
 * @returns {Promise<Object>} Historical price data
 */
export const getGraphData = async (holdings, startDate = null, endDate = null) => {
  try {
    const payload = { holdings };
    
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
