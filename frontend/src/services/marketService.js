const API_BASE_URL = '/api';

export const searchMarketEvents = async (query = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/market-events${query ? `?q=${query}` : ''}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching market events:', error);
    return [];
  }
};

// Default market events when no search is performed
export const DEFAULT_EVENTS = [
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
