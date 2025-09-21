// Test the exact same API call that the frontend makes
const testFrontendAPI = async () => {
  console.log('Testing frontend API call...');
  
  const API_BASE = 'http://localhost:8000';
  
  try {
    // Test admin login exactly as frontend does
    console.log('Making request to:', `${API_BASE}/auth/login`);
    
    const requestData = {
      email: 'admin@school.edu',
      password: 'password'
    };
    
    console.log('Request data:', requestData);
    
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response text:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Success response:', data);
    
    // Test the API client wrapper
    console.log('\n--- Testing API Client Wrapper ---');
    
    // Simulate the API client request method
    const apiRequest = async (endpoint, options = {}) => {
      const url = `${API_BASE}${endpoint}`;
      
      const config = {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      };
      
      console.log("API Request config:", {
        url,
        method: config.method || 'GET',
        headers: config.headers,
        body: options.body
      });
      
      const response = await fetch(url, config);
      console.log("API Response status:", response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Network error" }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log("API Response data:", responseData);
      
      return responseData;
    };
    
    // Test login through API client
    const loginResponse = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
    
    console.log('API Client login successful:', loginResponse);
    
  } catch (error) {
    console.error('Test failed:', error);
    console.error('Error stack:', error.stack);
  }
};

// Run the test
testFrontendAPI();
