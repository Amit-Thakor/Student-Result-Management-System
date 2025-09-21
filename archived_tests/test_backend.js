// Simple test script to verify backend API
const testLogin = async () => {
  try {
    console.log('Testing backend API...');
    
    // Test admin login
    const adminResponse = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@school.edu',
        password: 'password'
      })
    });
    
    const adminData = await adminResponse.json();
    console.log('Admin login response:', adminData);
    
    // Test student login
    const studentResponse = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'john.smith@student.edu',
        password: 'password'
      })
    });
    
    const studentData = await studentResponse.json();
    console.log('Student login response:', studentData);
    
    // Test invalid credentials
    const invalidResponse = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'invalid@test.com',
        password: 'wrong'
      })
    });
    
    const invalidData = await invalidResponse.json();
    console.log('Invalid login response:', invalidData);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testLogin();
