import type { SectionConfig } from "../../../../types";

export const technologyEngineeringScholarship: SectionConfig = {
  sections: [
    "personal",
    "education",
    "projects",
    "achievements",
    "skills",
  ],

  // Education optional for scholarships
  requiredFields: {
    // Summary optional in all CVs
    "personal.summary": false,
    "education.level": false,
    "education.title": false,
    "education.institution": false,
    "education.location": false,
    "education.year": false,
  },

  examples: {
    // Personal - Summary
    "personal.summary":
      "Systems Engineering student with a weighted GPA of 16.5/20 and a strong interest in artificial intelligence and machine learning. I am seeking a scholarship to deepen applied research and contribute to the development of technological solutions that generate social and academic impact.",

    // Education
    "education.title":
        "Systems Engineering and Informatics",
    "education.institution":
        "National University of San Antonio Abad of Cusco",
    "education.location":
        "Cusco, Peru",
    "education.year":
        "Expected July 2026",
    "education.honors":
        "Top Third (Top 10%), Highest Grade in Advanced Algorithms Course, Academic Excellence Scholarship 2023",

    // Projects
    "projects.title":
        "Student Dropout Prediction System with ML",
    "projects.description":
        "Developed a predictive model using machine learning algorithms (Random Forest, XGBoost) to identify students at risk of academic dropout. Processed historical data of 5,000+ students and achieved 87% accuracy. The project was presented at the student research congress and received an honorable mention.",
    "projects.technologies":
        "Python, Scikit-learn, Pandas, NumPy, Jupyter Notebook, TensorFlow, Matplotlib",
    "projects.duration":
        "6 months (March 2024 - August 2024)",

    // Achievements
    "achievements.title":
        "PRONABEC Academic Excellence Scholarship Winner",
    "achievements.description":
        "Selected among over 5,000 national applicants to receive a full university scholarship based on academic merit and student leadership. Maintained a GPA above 16/20 throughout all academic terms and actively participated in student technology organizations.",
    "achievements.date":
        "January 2023",

    // Skills
    "skills.technical":
        "Python, Java, C++, JavaScript, Machine Learning, Deep Learning, TensorFlow, PyTorch, Scikit-learn, SQL, Git, LaTeX, Jupyter",
    "skills.soft":
        "Critical thinking, Academic research, Scientific writing, Data analysis, Self-directed learning, Perseverance, Student leadership",
    "skills.languages":
        "Spanish (Native), English (Advanced - B2/C1), German (Basic - A2)",
  },
};