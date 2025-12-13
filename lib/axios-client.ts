import axios from "axios";

const JOBBY_MATCH_URL = process.env.JOBBY_MATCH_URL;

export const axiosClient = {
  get: (route: string, config = {}) => {
    return axios.get(`${JOBBY_MATCH_URL}${route}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...config,
    });
  },

  post: (route: string, data: any, config = {}) => {
    return axios.post(`${JOBBY_MATCH_URL}${route}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      ...config,
    });
  },

  put: (route: string, data: any, config = {}) => {
    return axios.put(`${JOBBY_MATCH_URL}${route}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      ...config,
    });
  },

  delete: (route: string, config = {}) => {
    return axios.delete(`${JOBBY_MATCH_URL}${route}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...config,
    });
  }
};
