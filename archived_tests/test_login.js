const fetch = require("node-fetch");

async function testLogin() {
  try {
    console.log("Testing login API...");

    // Test admin login
    const adminResponse = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@school.edu",
        password: "password",
      }),
    });

    const adminData = await adminResponse.json();
    console.log("Admin login:", adminData.success ? "SUCCESS" : "FAILED");
    console.log("Admin response:", adminData);

    // Test student login
    const studentResponse = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "john.smith@student.edu",
        password: "password",
      }),
    });

    const studentData = await studentResponse.json();
    console.log("Student login:", studentData.success ? "SUCCESS" : "FAILED");
    console.log("Student response:", studentData);
  } catch (error) {
    console.error("Login test failed:", error.message);
  }
}

testLogin();
