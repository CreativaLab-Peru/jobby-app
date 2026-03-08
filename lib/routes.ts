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

    admin: {
      cv: {
        root: "/admin/cv",
        detail: (cvId: string) => `/admin/cv/${cvId}`,
        edit: (cvId: string) => `/admin/cv/${cvId}/edit`,
      },
      evaluations: {
        root: "/admin/evaluations",
        detail: (evaluationId: string) => `/admin/evaluations/${evaluationId}`,
        edit: (evaluationId: string) => `/admin/evaluations/${evaluationId}/edit`,
      },
      opportunities: {
        root: "/admin/opportunities",
        detail: (id: string, cvId: string) => `/admin/opportunities/${id}?cvId=${cvId}`,
        edit: (id: string, cvId: string) => `/admin/opportunities/${id}/edit?cvId=${cvId}`,
      },
      payments: {
        root: "/admin/payments",
        detail: (paymentId: string) => `/admin/payments/${paymentId}`,
        edit: (paymentId: string) => `/admin/payments/${paymentId}/edit`,
      },
      plans: {
        root: "/admin/plans",
        detail: (planId: string) => `/admin/plans/${planId}`,
        edit: (planId: string) => `/admin/plans/${planId}/edit`,
      },
      creditPackages: {
        root: "/admin/credit-packages",
        detail: (packageId: string) => `/admin/credit-packages/${packageId}`,
        edit: (packageId: string) => `/admin/credit-packages/${packageId}/edit`,
      },
      balances: {
        root: "/admin/balances",
        detail: (balanceId: string) => `/admin/balances/${balanceId}`,
        edit: (balanceId: string) => `/admin/balances/${balanceId}/edit`,
      },
      complaints: {
        root: "/admin/complaints",
        detail: (complaintId: string) => `/admin/complaints/${complaintId}`,
      },
      jobs: {
        root: "/admin/jobs",
        detail: (jobId: string) => `/admin/jobs/${jobId}`,
      },
      interviews: {
        root: "/admin/interviews",
        detail: (sessionId: string) => `/admin/interviews/${sessionId}`,
      },
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
