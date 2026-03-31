import { CvType, OpportunityType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Engineering Configurations
import { technologyEngineeringEmployment } from "../../features/cv/helpers/configs/language/en/technology-engineering/employment";
import { technologyEngineeringInternship } from "../../features/cv/helpers/configs/language/en/technology-engineering/internship";
import { technologyEngineeringExchangeProgram } from "../../features/cv/helpers/configs/language/en/technology-engineering/exchange-program";
import { technologyEngineeringScholarship } from "../../features/cv/helpers/configs/language/en/technology-engineering/scholarship";

// Marketing & Strategy Configurations
import { marketingStrategyEmployment } from "../../features/cv/helpers/configs/language/en/marketing-strategy/employment";
import { marketingStrategyInternship } from "../../features/cv/helpers/configs/language/en/marketing-strategy/internship";
import { marketingStrategyExchangeProgram } from "../../features/cv/helpers/configs/language/en/marketing-strategy/exchange-program";
import { marketingStrategyScholarship } from "../../features/cv/helpers/configs/language/en/marketing-strategy/scholarship";

// Finance & Projects Configurations
import { financeProjectsEmployment } from "../../features/cv/helpers/configs/language/en/finance-projects/employment";
import { financeProjectsInternship } from "../../features/cv/helpers/configs/language/en/finance-projects/internship";
import { financeProjectsExchangeProgram } from "../../features/cv/helpers/configs/language/en/finance-projects/exchange-program";
import { financeProjectsScholarship } from "../../features/cv/helpers/configs/language/en/finance-projects/scholarship";

// Management & Business Configurations
import { managementBusinessEmployment } from "../../features/cv/helpers/configs/language/en/management-business/employment";
import { managementBusinessInternship } from "../../features/cv/helpers/configs/language/en/management-business/internship";
import { managementBusinessExchangeProgram } from "../../features/cv/helpers/configs/language/en/management-business/exchange-program";
import { managementBusinessScholarship } from "../../features/cv/helpers/configs/language/en/management-business/scholarship";

// Science Configurations
import { scienceEmployment } from "../../features/cv/helpers/configs/language/en/science/employment";
import { scienceInternship } from "../../features/cv/helpers/configs/language/en/science/internship";
import { scienceExchangeProgram } from "../../features/cv/helpers/configs/language/en/science/exchange-program";
import { scienceScholarship } from "../../features/cv/helpers/configs/language/en/science/scholarship";

// Social Media Configurations
import { socialMediaEmployment } from "../../features/cv/helpers/configs/language/en/social-media/employment";
import { socialMediaInternship } from "../../features/cv/helpers/configs/language/en/social-media/internship";
import { socialMediaExchangeProgram } from "../../features/cv/helpers/configs/language/en/social-media/exchange-program";
import { socialMediaScholarship } from "../../features/cv/helpers/configs/language/en/social-media/scholarship";

// Education Configurations
import { educationEmployment } from "../../features/cv/helpers/configs/language/en/education/employment";
import { educationInternship } from "../../features/cv/helpers/configs/language/en/education/internship";
import { educationExchangeProgram } from "../../features/cv/helpers/configs/language/en/education/exchange-program";
import { educationScholarship } from "../../features/cv/helpers/configs/language/en/education/scholarship";

// Design & Creativity Configurations
import { designCreativityEmployment } from "@/features/cv/helpers/configs/language/en/design-creativity/employment";
import { designCreativityInternship } from "@/features/cv/helpers/configs/language/en/design-creativity/internship";
import { designCreativityExchangeProgram } from "@/features/cv/helpers/configs/language/en/design-creativity/exchange-program";
import { designCreativityScholarship } from "@/features/cv/helpers/configs/language/en/design-creativity/scholarship";

// --- 1. BASE SECTION MAPPING (GENERAL STRUCTURE) ---
// --- 1. BASE SECTION MAPPING (Synchronized with DB Enum) ---
const baseSectionsMap = {
  CONTACT: {
    id: "CONTACT",
    title: "Contact Information",
    icon: "User",
    fields: [
      {
        name: "fullName",
        label: "Full Name",
        type: "text",
        required: true,
        tip: "Your name as it appears on your ID",
        example: "Alex J. Doe",
      },
      {
        name: "address",
        label: "Location",
        type: "text",
        required: false,
        tip: "City and Country",
        example: "Mexico City, Mexico",
      },
      {
        name: "linkedin",
        label: "LinkedIn",
        type: "text",
        required: false,
        tip: "Link to your professional profile (e.g. linkedin.com/in/username)",
        example: "linkedin.com/in/alexdoe",
      },
      {
        name: "phone",
        label: "Phone",
        type: "text",
        required: true,
        tip: "Number with country code (+52...)",
        example: "+52 5512345678",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        tip: "Use a professional email address",
        example: "alex.doe@email.com",
      },
      {
        name: "summary",
        label: "Professional Summary",
        tip: "Brief 3-4 line summary about your background and goals",
        type: "textarea",
        example:
          "Digital strategist with 8+ years of experience leading multidisciplinary teams. Specialized in process optimization and digital transformation with a focus on measurable results and business scalability.",
        required: false,
      },
    ],
  },
  EXPERIENCE: {
    id: "EXPERIENCE",
    title: "Work Experience",
    icon: "Briefcase",
    multiple: true,
    fields: [
      {
        name: "company",
        label: "Company / Organization",
        type: "text",
        required: true,
        tip: "Legal or commonly known company name",
        example: "Global Solutions Inc.",
      },
      {
        name: "location",
        label: "Location",
        type: "text",
        required: true,
        tip: "City and country (or specify 'Remote')",
        example: "Remote / Madrid, Spain",
      },
      {
        name: "position",
        label: "Position or Role",
        type: "text",
        required: true,
        tip: "Exact name of your position",
        example: "Senior Project Manager",
      },
      {
        name: "duration",
        label: "Period",
        type: "text",
        required: true,
        tip: "Start and end month/year (or 'Present')",
        example: "March 2021 - Present",
      },
      {
        name: "responsibilities",
        label: "Achievements and Responsibilities",
        type: "textarea",
        required: true,
        tip: "Use bullet points to describe your quantifiable impacts and main tasks",
        example:
          "• Increased operational efficiency by 20% through agile methodologies.\n• Managed an annual budget of $500k USD.",
      },
    ],
  },
  EDUCATION: {
    id: "EDUCATION",
    title: "Academic Background",
    icon: "GraduationCap",
    multiple: true,
    fields: [
      {
        name: "title",
        label: "Degree / Major",
        type: "text",
        required: true,
        tip: "Official name of your degree or major",
        example: "Bachelor in Business Administration",
      },
      {
        name: "institution",
        label: "Educational Institution",
        type: "text",
        required: true,
        tip: "Full name of the university or school",
        example: "National Autonomous University",
      },
      {
        name: "location",
        label: "Location",
        type: "text",
        required: true,
        tip: "City where the institution is located",
        example: "Santiago, Chile",
      },
      {
        name: "year",
        label: "Year of Completion",
        type: "text",
        required: true,
        tip: "Graduation year (or 'In progress / Expected 202X')",
        example: "2019",
      },
      {
        name: "honors",
        label: "Honors (Optional)",
        type: "text",
        required: false,
        tip: "Honors, top of class, or academic awards",
        example: "Honorable Mention for Academic Excellence",
      },
    ],
  },
  SKILLS: {
    id: "SKILLS",
    title: "Skills",
    icon: "Languages",
    fields: [
      {
        name: "technical",
        label: "Technical Skills",
        type: "tags",
        required: false,
        tip: "Software, languages, methodologies, or specific tools",
        example: "Python, SQL, Data Analysis, AWS",
      },
      {
        name: "soft",
        label: "Soft Skills",
        type: "tags",
        required: false,
        tip: "Interpersonal and management skills",
        example: "Assertive Communication, Teamwork, Problem Solving",
      },
      {
        name: "languages",
        label: "Languages",
        type: "tags",
        required: false,
        tip: "Tell the language and your proficiency level (e.g. B2, C1)",
        example: "English (C1 - Advanced), French (B2 - Intermediate)",
      },
    ],
  },
  PROJECTS: {
    id: "PROJECTS",
    title: "Featured Projects",
    icon: "Code",
    multiple: true,
    fields: [
      {
        name: "title",
        label: "Project Name",
        type: "text",
        required: false,
        tip: "Descriptive title of the project",
        example: "Inventory Management System for E-commerce",
      },
      {
        name: "description",
        label: "Project Description",
        type: "textarea",
        required: false,
        tip: "Briefly explain the objective and outcome of the project",
        example:
          "Developed an integrated solution for real-time inventory control using a microservices architecture.",
      },
      {
        name: "technologies",
        label: "Technologies Used",
        type: "text",
        required: false,
        tip: "List main tools used",
        example: "React, PostgreSQL, Docker",
      },
      {
        name: "duration",
        label: "Development Time",
        type: "text",
        required: false,
        tip: "Months or weeks duration of the project",
        example: "6 months (2023)",
      },
    ],
  },
  VOLUNTEERING: {
    id: "VOLUNTEERING",
    title: "Volunteering and Causes",
    icon: "Heart",
    multiple: true,
    fields: [
      {
        name: "organization",
        label: "Organization",
        type: "text",
        required: false,
        tip: "Name of the NGO or foundation",
        example: "Alliance for Digital Literacy",
      },
      {
        name: "position",
        label: "Role / Function",
        type: "text",
        required: false,
        tip: "Your position within the organization",
        example: "Volunteer Instructor",
      },
      {
        name: "responsibilities",
        label: "Summary of Work",
        type: "textarea",
        required: false,
        tip: "Briefly describe your social contribution",
        example: "• Basic training in office tools for seniors in rural areas.",
      },
    ],
  },
  CERTIFICATIONS: {
    id: "CERTIFICATIONS",
    title: "Certifications and Licenses",
    icon: "Award",
    multiple: true,
    fields: [
      {
        name: "name",
        label: "Certification Name",
        type: "text",
        required: false,
        tip: "Official name of the certificate",
        example: "Google Data Analytics Professional Certificate",
      },
      {
        name: "issuer",
        label: "Issuing Entity",
        type: "text",
        required: false,
        tip: "Who issued the certification (company or institution)",
        example: "Coursera / Google",
      },
      {
        name: "date",
        label: "Issue Date",
        type: "text",
        required: false,
        tip: "Month and year obtained",
        example: "August 2023",
      },
    ],
  },
  ACHIEVEMENTS: {
    id: "ACHIEVEMENTS",
    title: "Awards and Recognitions",
    icon: "Trophy",
    multiple: true,
    fields: [
      {
        name: "title",
        label: "Award Title",
        type: "text",
        required: false,
        tip: "Name of the award or recognition",
        example: "Employee of the Year 2022",
      },
      {
        name: "description",
        label: "Additional Details",
        type: "textarea",
        required: false,
        tip: "Context on why you received this achievement",
        example: "Awarded for exceeding annual sales targets by 40%.",
      },
    ],
  },
  INTERESTS: {
    id: "INTERESTS",
    title: "Hobbies and Interests",
    icon: "Star",
    multiple: true,
    fields: [
      {
        name: "title",
        label: "Activity",
        type: "text",
        required: false,
        tip: "Hobby or personal interest",
        example: "Landscape Photography",
      },
      {
        name: "description",
        label: "Brief Comment",
        type: "textarea",
        required: false,
        tip: "Optional: Explain why you are passionate about it",
        example:
          "Interest in capturing natural environments and digital post-processing techniques.",
      },
    ],
  },
};

const ALL_SECTION_IDS = [
  "CONTACT",
  "EXPERIENCE",
  "EDUCATION",
  "SKILLS",
  "PROJECTS",
  "VOLUNTEERING",
  "CERTIFICATIONS",
  "ACHIEVEMENTS",
  "INTERESTS",
  "COMPLEMENTS",
];

// --- 2. JSON BUILDER FUNCTION ---
function buildFullSectionJson(customConfig: any) {
  // Map over the MASTER list to ensure ALL are present
  return ALL_SECTION_IDS.map((id) => {
    const base = baseSectionsMap[id];
    if (!base) return null;

    return {
      ...base,
      fields: base.fields.map((field: any) => {
        const fieldPath = `${id.toLowerCase()}.${field.name}`;
        return {
          ...field,
          // If the specific config has data for this field, use it.
          // Otherwise, keep the default from baseSectionsMap.
          required: customConfig.requiredFields?.[fieldPath] ?? field.required,
          example: customConfig.examples?.[fieldPath] ?? field.example,
          tip: customConfig.tips?.[fieldPath] ?? field.tip,
        };
      }),
    };
  }).filter(Boolean);
}

// --- 3. IMPORT OF SPECIFIC CONFIGURATIONS (SIMULATED) ---
// Here I assume you have access to the objects you provided before.
// For the complete script, I group them in a big list.

async function main() {
  const allConfigs = [
    // TECHNOLOGY & ENGINEERING
    {
      type: CvType.TECHNOLOGY_ENGINEERING,
      opp: OpportunityType.EMPLOYMENT,
      data: technologyEngineeringEmployment,
    },
    {
      type: CvType.TECHNOLOGY_ENGINEERING,
      opp: OpportunityType.INTERNSHIP,
      data: technologyEngineeringInternship,
    },
    {
      type: CvType.TECHNOLOGY_ENGINEERING,
      opp: OpportunityType.EXCHANGE_PROGRAM,
      data: technologyEngineeringExchangeProgram,
    },
    {
      type: CvType.TECHNOLOGY_ENGINEERING,
      opp: OpportunityType.SCHOLARSHIP,
      data: technologyEngineeringScholarship,
    },
    {
      type: CvType.TECHNOLOGY_ENGINEERING,
      opp: OpportunityType.STARTUP,
      data: technologyEngineeringScholarship,
    },

    // MARKETING & STRATEGY
    {
      type: CvType.MARKETING_STRATEGY,
      opp: OpportunityType.EMPLOYMENT,
      data: marketingStrategyEmployment,
    },
    {
      type: CvType.MARKETING_STRATEGY,
      opp: OpportunityType.INTERNSHIP,
      data: marketingStrategyInternship,
    },
    {
      type: CvType.MARKETING_STRATEGY,
      opp: OpportunityType.EXCHANGE_PROGRAM,
      data: marketingStrategyExchangeProgram,
    },
    {
      type: CvType.MARKETING_STRATEGY,
      opp: OpportunityType.SCHOLARSHIP,
      data: marketingStrategyScholarship,
    },
    {
      type: CvType.MARKETING_STRATEGY,
      opp: OpportunityType.STARTUP,
      data: marketingStrategyScholarship,
    },

    // FINANCE & PROJECTS
    {
      type: CvType.FINANCE_PROJECTS,
      opp: OpportunityType.EMPLOYMENT,
      data: financeProjectsEmployment,
    },
    {
      type: CvType.FINANCE_PROJECTS,
      opp: OpportunityType.INTERNSHIP,
      data: financeProjectsInternship,
    },
    {
      type: CvType.FINANCE_PROJECTS,
      opp: OpportunityType.EXCHANGE_PROGRAM,
      data: financeProjectsExchangeProgram,
    },
    {
      type: CvType.FINANCE_PROJECTS,
      opp: OpportunityType.SCHOLARSHIP,
      data: financeProjectsScholarship,
    },
    {
      type: CvType.FINANCE_PROJECTS,
      opp: OpportunityType.STARTUP,
      data: financeProjectsScholarship,
    },

    // MANAGEMENT & BUSINESS
    {
      type: CvType.MANAGEMENT_BUSINESS,
      opp: OpportunityType.EMPLOYMENT,
      data: managementBusinessEmployment,
    },
    {
      type: CvType.MANAGEMENT_BUSINESS,
      opp: OpportunityType.INTERNSHIP,
      data: managementBusinessInternship,
    },
    {
      type: CvType.MANAGEMENT_BUSINESS,
      opp: OpportunityType.EXCHANGE_PROGRAM,
      data: managementBusinessExchangeProgram,
    },
    {
      type: CvType.MANAGEMENT_BUSINESS,
      opp: OpportunityType.SCHOLARSHIP,
      data: managementBusinessScholarship,
    },
    {
      type: CvType.MANAGEMENT_BUSINESS,
      opp: OpportunityType.STARTUP,
      data: managementBusinessScholarship,
    },

    // SCIENCE
    { type: CvType.SCIENCE, opp: OpportunityType.EMPLOYMENT, data: scienceEmployment },
    { type: CvType.SCIENCE, opp: OpportunityType.INTERNSHIP, data: scienceInternship },
    { type: CvType.SCIENCE, opp: OpportunityType.EXCHANGE_PROGRAM, data: scienceExchangeProgram },
    { type: CvType.SCIENCE, opp: OpportunityType.SCHOLARSHIP, data: scienceScholarship },
    { type: CvType.SCIENCE, opp: OpportunityType.STARTUP, data: scienceScholarship },

    // SOCIAL MEDIA
    { type: CvType.SOCIAL_MEDIA, opp: OpportunityType.EMPLOYMENT, data: socialMediaEmployment },
    { type: CvType.SOCIAL_MEDIA, opp: OpportunityType.INTERNSHIP, data: socialMediaInternship },
    {
      type: CvType.SOCIAL_MEDIA,
      opp: OpportunityType.EXCHANGE_PROGRAM,
      data: socialMediaExchangeProgram,
    },
    { type: CvType.SOCIAL_MEDIA, opp: OpportunityType.SCHOLARSHIP, data: socialMediaScholarship },
    { type: CvType.SOCIAL_MEDIA, opp: OpportunityType.STARTUP, data: socialMediaScholarship },

    // EDUCATION
    { type: CvType.EDUCATION, opp: OpportunityType.EMPLOYMENT, data: educationEmployment },
    { type: CvType.EDUCATION, opp: OpportunityType.INTERNSHIP, data: educationInternship },
    {
      type: CvType.EDUCATION,
      opp: OpportunityType.EXCHANGE_PROGRAM,
      data: educationExchangeProgram,
    },
    { type: CvType.EDUCATION, opp: OpportunityType.SCHOLARSHIP, data: educationScholarship },
    { type: CvType.EDUCATION, opp: OpportunityType.STARTUP, data: educationScholarship },

    // DESIGN & CREATIVITY
    {
      type: CvType.DESIGN_CREATIVITY,
      opp: OpportunityType.EMPLOYMENT,
      data: designCreativityEmployment,
    },
    {
      type: CvType.DESIGN_CREATIVITY,
      opp: OpportunityType.INTERNSHIP,
      data: designCreativityInternship,
    },
    {
      type: CvType.DESIGN_CREATIVITY,
      opp: OpportunityType.EXCHANGE_PROGRAM,
      data: designCreativityExchangeProgram,
    },
    {
      type: CvType.DESIGN_CREATIVITY,
      opp: OpportunityType.SCHOLARSHIP,
      data: designCreativityScholarship,
    },
    {
      type: CvType.DESIGN_CREATIVITY,
      opp: OpportunityType.STARTUP,
      data: designCreativityScholarship,
    }, // Using scholarship as fallback if you don't have startup yet
  ];

  console.log("🚀 Starting CV configuration loading...");

  for (const item of allConfigs) {
    const fullSectionsJson = buildFullSectionJson(item.data);

    await prisma.cvSectionConfiguration.upsert({
      where: {
        cvType_opportunityType: {
          cvType: item.type,
          opportunityType: item.opp,
        },
      },
      update: {
        sections: fullSectionsJson as any,
      },
      create: {
        cvType: item.type,
        opportunityType: item.opp,
        sections: fullSectionsJson as any,
      },
    });
  }

  console.log("✅ Process completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Error in seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
