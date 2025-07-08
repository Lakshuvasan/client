import { storage } from "../storage";

// Initialize certification data
const certificationData = [
  {
    name: "AWS Certified Solutions Architect - Associate",
    provider: "Amazon Web Services",
    category: "cloud computing",
    description: "Most popular cloud certification, excellent for beginners to intermediate level. Validates ability to design distributed applications and systems on AWS.",
    prepTime: "3-6 months prep",
    examFee: "$150 exam fee",
    difficulty: "intermediate",
    icon: "fab fa-aws",
    iconColor: "text-orange-600",
    tags: ["aws", "cloud", "architecture", "solutions", "associate"]
  },
  {
    name: "Microsoft Azure Fundamentals (AZ-900)",
    provider: "Microsoft",
    category: "cloud computing",
    description: "Perfect entry point for Microsoft's cloud ecosystem. Covers basic cloud concepts and Azure services.",
    prepTime: "1-3 months prep",
    examFee: "$99 exam fee",
    difficulty: "beginner",
    icon: "fab fa-microsoft",
    iconColor: "text-blue-600",
    tags: ["azure", "cloud", "fundamentals", "microsoft", "beginner"]
  },
  {
    name: "Google Cloud Professional Cloud Architect",
    provider: "Google Cloud",
    category: "cloud computing",
    description: "Growing in popularity, especially for data and ML workloads. Validates ability to design and manage Google Cloud solutions.",
    prepTime: "4-8 months prep",
    examFee: "$200 exam fee",
    difficulty: "advanced",
    icon: "fab fa-google",
    iconColor: "text-blue-500",
    tags: ["gcp", "google cloud", "architecture", "professional", "data", "ml"]
  },
  {
    name: "CompTIA Security+",
    provider: "CompTIA",
    category: "cybersecurity",
    description: "Industry standard entry-level cybersecurity certification. Perfect for beginners wanting to start in cybersecurity.",
    prepTime: "2-4 months prep",
    examFee: "$370 exam fee",
    difficulty: "beginner",
    icon: "fas fa-shield-alt",
    iconColor: "text-red-500",
    tags: ["comptia", "security", "cybersecurity", "entry-level", "foundation"]
  },
  {
    name: "Certified Ethical Hacker (CEH)",
    provider: "EC-Council",
    category: "cybersecurity",
    description: "Learn to think like a hacker to better defend against attacks. Covers penetration testing and ethical hacking.",
    prepTime: "3-6 months prep",
    examFee: "$1,199 exam fee",
    difficulty: "intermediate",
    icon: "fas fa-user-secret",
    iconColor: "text-gray-600",
    tags: ["ethical hacking", "penetration testing", "ceh", "ec-council"]
  },
  {
    name: "CISSP (Certified Information Systems Security Professional)",
    provider: "ISC2",
    category: "cybersecurity",
    description: "Advanced cybersecurity certification for experienced professionals. Requires 5 years of experience.",
    prepTime: "6-12 months prep",
    examFee: "$749 exam fee",
    difficulty: "advanced",
    icon: "fas fa-lock",
    iconColor: "text-red-700",
    tags: ["cissp", "isc2", "advanced", "security professional", "management"]
  },
  {
    name: "Project Management Professional (PMP)",
    provider: "PMI",
    category: "project management",
    description: "Gold standard for project management. Recognized globally and increases earning potential significantly.",
    prepTime: "3-6 months prep",
    examFee: "$405-555 exam fee",
    difficulty: "intermediate",
    icon: "fas fa-tasks",
    iconColor: "text-green-600",
    tags: ["pmp", "pmi", "project management", "professional", "leadership"]
  },
  {
    name: "Certified ScrumMaster (CSM)",
    provider: "Scrum Alliance",
    category: "project management",
    description: "Learn agile project management with Scrum framework. Great for tech project managers.",
    prepTime: "1-2 months prep",
    examFee: "$995-1,395 exam fee",
    difficulty: "beginner",
    icon: "fas fa-users",
    iconColor: "text-blue-500",
    tags: ["scrum", "agile", "scrummaster", "project management", "tech"]
  },
  {
    name: "Certified Data Scientist",
    provider: "Data Science Council of America",
    category: "data science",
    description: "Comprehensive data science certification covering statistics, machine learning, and data analysis.",
    prepTime: "6-12 months prep",
    examFee: "$300 exam fee",
    difficulty: "advanced",
    icon: "fas fa-chart-bar",
    iconColor: "text-purple-500",
    tags: ["data science", "machine learning", "statistics", "analytics", "python"]
  },
  {
    name: "Tableau Desktop Specialist",
    provider: "Tableau",
    category: "data science",
    description: "Entry-level certification for data visualization using Tableau. Perfect for business analysts.",
    prepTime: "2-3 months prep",
    examFee: "$100 exam fee",
    difficulty: "beginner",
    icon: "fas fa-chart-line",
    iconColor: "text-orange-500",
    tags: ["tableau", "data visualization", "business intelligence", "analytics"]
  },
  {
    name: "Microsoft Certified: Azure Data Scientist Associate",
    provider: "Microsoft",
    category: "data science",
    description: "Focuses on machine learning and AI on Azure platform. Great for cloud-based data science.",
    prepTime: "4-6 months prep",
    examFee: "$165 exam fee",
    difficulty: "intermediate",
    icon: "fab fa-microsoft",
    iconColor: "text-blue-600",
    tags: ["azure", "data science", "machine learning", "ai", "microsoft", "cloud"]
  },
  {
    name: "Certified Kubernetes Administrator (CKA)",
    provider: "Cloud Native Computing Foundation",
    category: "devops",
    description: "Validates skills in Kubernetes administration. Essential for modern container orchestration.",
    prepTime: "4-6 months prep",
    examFee: "$395 exam fee",
    difficulty: "intermediate",
    icon: "fas fa-dharmachakra",
    iconColor: "text-blue-400",
    tags: ["kubernetes", "containers", "devops", "orchestration", "cncf"]
  },
  {
    name: "Docker Certified Associate",
    provider: "Docker",
    category: "devops",
    description: "Validates containerization skills with Docker. Foundation for modern application deployment.",
    prepTime: "2-4 months prep",
    examFee: "$195 exam fee",
    difficulty: "intermediate",
    icon: "fab fa-docker",
    iconColor: "text-blue-500",
    tags: ["docker", "containers", "devops", "deployment", "microservices"]
  },
  {
    name: "Salesforce Administrator",
    provider: "Salesforce",
    category: "business applications",
    description: "Most in-demand CRM certification. Great for non-technical professionals entering tech.",
    prepTime: "2-3 months prep",
    examFee: "$200 exam fee",
    difficulty: "beginner",
    icon: "fab fa-salesforce",
    iconColor: "text-blue-400",
    tags: ["salesforce", "crm", "administrator", "business", "non-technical"]
  },
  {
    name: "Oracle Certified Professional Java Developer",
    provider: "Oracle",
    category: "software development",
    description: "Validates Java programming skills. Essential for enterprise Java development.",
    prepTime: "4-8 months prep",
    examFee: "$245 exam fee",
    difficulty: "intermediate",
    icon: "fab fa-java",
    iconColor: "text-red-600",
    tags: ["java", "programming", "oracle", "development", "enterprise"]
  }
];

// Initialize the storage with certification data
export function initializeCertifications() {
  certificationData.forEach(cert => {
    storage.addCertification(cert);
  });
}

// Call initialization
initializeCertifications();
