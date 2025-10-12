/**
 * Test script for the AI Resume Analyzer API
 * Run this to test the API endpoints
 */

// Test the GET endpoint
async function testAPIStatus() {
  try {
    const response = await fetch("/api/analyze");
    const data = await response.json();
    console.log("API Status:", data);
    return true;
  } catch (error) {
    console.error("API Status Test Failed:", error);
    return false;
  }
}

// Test the POST endpoint with a sample file
async function testFileUpload() {
  // Create a sample text file for testing
  const sampleResumeText = `
John Doe
john.doe@email.com | (555) 123-4567 | LinkedIn: linkedin.com/in/johndoe

EDUCATION
Bachelor of Science in Computer Science
University of Technology, 2020-2024
GPA: 3.8/4.0

EXPERIENCE
Software Developer Intern
Tech Company Inc., Summer 2023
- Developed web applications using React and Node.js
- Collaborated with team of 5 developers
- Improved application performance by 30%

PROJECTS
Personal Portfolio Website
- Built responsive website using React and Tailwind CSS
- Implemented dark mode and mobile-first design
- Deployed on Vercel with CI/CD pipeline

SKILLS
Programming Languages: JavaScript, Python, Java, C++
Frameworks: React, Node.js, Express.js
Tools: Git, Docker, AWS, VS Code
`;

  // Convert text to a File object
  const file = new File([sampleResumeText], "sample-resume.txt", {
    type: "text/plain",
  });

  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "jobDescription",
    "Software Developer position at a tech startup"
  );

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Analysis failed");
    }

    const result = await response.json();
    console.log("Analysis Result:", result);
    return result;
  } catch (error) {
    console.error("File Upload Test Failed:", error);
    return null;
  }
}

// Export test functions
export { testAPIStatus, testFileUpload };
