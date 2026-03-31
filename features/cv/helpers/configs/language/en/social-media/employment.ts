import type { SectionConfig } from "../../../../types";

export const socialMediaEmployment: SectionConfig = {
  sections: [
    "personal",
    "education",
    "experience",
    "achievements",
    "certifications",
    "skills",
  ],
  requiredFields: {
    "personal.summary": false,
    "education.level": false,
    "education.title": false,
    "education.institution": false,
    "education.location": false,
    "education.year": false,
  },
  examples: {
    // Personal
    "personal.summary":
      "Digital content creator with over 5 years of experience in social media and influencer marketing. Specialized in audiovisual production and storytelling, with a combined audience of over 500K followers. Passionate about creating authentic content that connects brands with audiences in a meaningful way.",

    // Education
    "education.title": "Bachelor’s in Audiovisual Communication",
    "education.institution": "Universidad Carlos III de Madrid",
    "education.location": "Madrid, Spain",
    "education.year": "Graduated June 2018",
    "education.honors":
      "Honors in Digital Production, Academic Excellence Scholarship",

    // Experience
    "experience.company": "Independent Content Creator",
    "experience.location": "Madrid, Spain",
    "experience.position": "Content Creator & Influencer",
    "experience.duration": "March 2019 - Present",
    "experience.responsibilities":
      "• Grew audience to 300K on Instagram and 200K on TikTok with lifestyle and tech content.\n• Collaborated with 50+ brands (Nike, Samsung, Zara), generating campaigns with an average ROI of 350%.\n• Produced 1,000+ pieces of content with an engagement rate of 8.5% (above industry average of 3%).\n• Generated annual revenue of €120,000 through partnerships, advertising, and personal products.",

    // Achievements
    "achievements.title": "Best Emerging Creator Award - Influencer Awards Spain",
    "achievements.description":
      "Recognized for innovation in content formats and authentic audience engagement. Viral campaign with 5M views highlighted as a case study in digital marketing events.",
    "achievements.date": "October 2023",

    // Certifications
    "certifications.name":
      "Certification in Digital Marketing and Social Media",
    "certifications.issuer": "Google Digital Garage & Meta Blueprint",
    "certifications.date": "2021",

    // Skills
    "skills.technical":
      "Adobe Premiere Pro, Final Cut Pro, Photoshop, Lightroom, CapCut, Canva, Instagram Insights, TikTok Analytics, SEO, Google Analytics, Copywriting",
    "skills.soft":
      "Creativity, Storytelling, Community Management, Brand Negotiation, Content Planning, Trend Adaptability, Persuasive Communication",
    "skills.languages":
      "Spanish (Native), English (Advanced - C1), Portuguese (Basic)",
  },
};