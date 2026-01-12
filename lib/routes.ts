export const routes = {
  auth: {
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
  },

  app: {
    dashboard: "/dashboard",

    cv: {
      root: "/cv",
      detail: (cvId: string) => `/cv/${cvId}`,
      edit: (cvId: string) => `/cv/${cvId}/edit`,
      preview: (cvId: string) => `/cv/${cvId}/preview`,
    },

    evaluations: {
      root: "/evaluations",
      detail: (id: string) => `/evaluations/${id}`,
    },

    opportunities: {
      root: "/opportunities",
      detail: (id: string) => `/opportunities/${id}`,
    },

    profile: {
      root: "/profile",
      byUsername: (username: string) => `/profile/${username}`,
    },

    settings: "/settings",
    billing: "/billing",
    complaints: "/complaints",
    process: "/process",
  },

  website: {
    home: "/",
    companies: "/empresas",
    experts: "/expertos",
    institutions: "/instituticiones",
    pro: "/pro",
    terms: "/terms-and-conditions",
  },
} as const;
