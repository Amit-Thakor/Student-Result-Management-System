const fetch = require("node-fetch");

async function testAPI() {
  try {
    console.log("Testing API endpoints...");

    // Test students endpoint
    const studentsResponse = await fetch("http://localhost:8000/students");
    const studentsData = await studentsResponse.json();
    console.log("Students:", studentsData.success ? "SUCCESS" : "FAILED");

    // Test courses endpoint
    const coursesResponse = await fetch("http://localhost:8000/courses");
    const coursesData = await coursesResponse.json();
    console.log("Courses:", coursesData.success ? "SUCCESS" : "FAILED");

    // Test dashboard endpoint
    const dashboardResponse = await fetch(
      "http://localhost:8000/results/dashboard"
    );
    const dashboardData = await dashboardResponse.json();
    console.log("Dashboard:", dashboardData.success ? "SUCCESS" : "FAILED");

    console.log("API test completed!");
  } catch (error) {
    console.error("API test failed:", error.message);
  }
}

testAPI();
