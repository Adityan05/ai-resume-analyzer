/**
 * Parse extracted resume text into structured JSON format
 * @param {string} text - Raw resume text
 * @returns {Object} Structured resume data
 */
export function parseResumeText(text) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const resume = {
    Name: "",
    Contact: "",
    Sections: {
      Education: "",
      Experience: "",
      Projects: "",
      Skills: "",
    },
  };

  // Extract name (usually first line or first few lines)
  if (lines.length > 0) {
    resume.Name = lines[0];
  }

  // Extract contact information (email, phone, address)
  const contactInfo = [];
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex =
    /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/;
  const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9-]+/i;
  const githubRegex = /github\.com\/[a-zA-Z0-9-]+/i;

  for (const line of lines.slice(0, 10)) {
    // Check first 10 lines for contact info
    if (emailRegex.test(line)) {
      contactInfo.push(line.match(emailRegex)[0]);
    }
    if (phoneRegex.test(line)) {
      contactInfo.push(line.match(phoneRegex)[0]);
    }
    if (linkedinRegex.test(line)) {
      contactInfo.push(line.match(linkedinRegex)[0]);
    }
    if (githubRegex.test(line)) {
      contactInfo.push(line.match(githubRegex)[0]);
    }
  }

  resume.Contact = contactInfo.join(", ");

  // Extract sections based on common keywords
  const sectionKeywords = {
    Education: [
      "education",
      "academic",
      "university",
      "college",
      "degree",
      "bachelor",
      "master",
      "phd",
      "gpa",
      "graduated",
    ],
    Experience: [
      "experience",
      "employment",
      "work history",
      "professional",
      "career",
      "job",
      "position",
      "role",
    ],
    Projects: [
      "projects",
      "portfolio",
      "personal projects",
      "side projects",
      "github",
      "repository",
    ],
    Skills: [
      "skills",
      "technical skills",
      "technologies",
      "programming",
      "languages",
      "tools",
      "software",
      "expertise",
    ],
  };

  let currentSection = null;
  const sectionContent = {
    Education: [],
    Experience: [],
    Projects: [],
    Skills: [],
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();

    // Check if this line indicates a new section
    for (const [sectionName, keywords] of Object.entries(sectionKeywords)) {
      if (keywords.some((keyword) => line.includes(keyword))) {
        currentSection = sectionName;
        break;
      }
    }

    // If we're in a section, add content
    if (currentSection && lines[i].length > 0) {
      sectionContent[currentSection].push(lines[i]);
    }
  }

  // Convert arrays to strings and clean up
  for (const [sectionName, content] of Object.entries(sectionContent)) {
    resume.Sections[sectionName] = content.join("\n").trim();
  }

  // If no structured sections found, try to extract from the entire text
  if (!resume.Sections.Education && !resume.Sections.Experience) {
    // Fallback: try to identify sections by common patterns
    const textLower = text.toLowerCase();

    // Look for education patterns
    const educationMatch = textLower.match(
      /(education|academic|university|college|degree).*?(?=experience|skills|projects|$)/s
    );
    if (educationMatch) {
      resume.Sections.Education = educationMatch[0];
    }

    // Look for experience patterns
    const experienceMatch = textLower.match(
      /(experience|employment|work history|professional).*?(?=education|skills|projects|$)/s
    );
    if (experienceMatch) {
      resume.Sections.Experience = experienceMatch[0];
    }

    // Look for skills patterns
    const skillsMatch = textLower.match(
      /(skills|technical|technologies|programming).*?(?=education|experience|projects|$)/s
    );
    if (skillsMatch) {
      resume.Sections.Skills = skillsMatch[0];
    }

    // Look for projects patterns
    const projectsMatch = textLower.match(
      /(projects|portfolio|github).*?(?=education|experience|skills|$)/s
    );
    if (projectsMatch) {
      resume.Sections.Projects = projectsMatch[0];
    }
  }

  return resume;
}

/**
 * Clean and format resume data
 * @param {Object} resume - Raw resume data
 * @returns {Object} Cleaned resume data
 */
export function cleanResumeData(resume) {
  const cleaned = { ...resume };

  // Clean up each section
  for (const [key, value] of Object.entries(cleaned.Sections)) {
    if (typeof value === "string") {
      // Remove extra whitespace and normalize
      cleaned.Sections[key] = value
        .replace(/\s+/g, " ")
        .replace(/\n\s*\n/g, "\n")
        .trim();
    }
  }

  // Clean name and contact
  cleaned.Name = cleaned.Name.trim();
  cleaned.Contact = cleaned.Contact.trim();

  return cleaned;
}
