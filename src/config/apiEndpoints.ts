// config/apiEndpoints.ts - Configuration file for all dashboard endpoints

import { API_BASE_URL } from "../utils/constants.ts";

export const API_ENDPOINTS = {
  // Base configuration
  BASE_URL: API_BASE_URL,
  VERSION: 'v1',

  // Single endpoint approach (RECOMMENDED)
  DASHBOARD: {
    ALL_DATA: '/dashboard', // GET - Returns complete dashboard data
    // Query parameters: period, departmentId, jobId, dateFrom, dateTo, limit, offset
  },

  // Individual endpoints approach (if you prefer section-by-section)
  METRICS: '/dashboard/metrics', // GET - Returns dashboard metrics only
  CANDIDATES: '/candidates', // GET - Returns candidates with filtering
  INTERVIEWS: '/interviews', // GET - Returns interviews
  JOBS: '/jobs', // GET - Returns job postings
  ACTIVITY: '/activity', // GET - Returns recent activity
  ANALYTICS: {
    FUNNEL: '/analytics/hiring-funnel', // GET - Returns hiring funnel data
  },
  GOALS: '/goals/weekly', // GET - Returns weekly goals
  INSIGHTS: '/insights', // GET - Returns AI insights
};


// Environment-specific configurations
export const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3001/api/v1',
    timeout: 10000,
  },
  staging: {
    baseURL: 'https://api-staging.yourapp.com/v1',
    timeout: 15000,
  },
  production: {
    baseURL: 'https://api.yourapp.com/v1',
    timeout: 10000,
  },
};

// Error codes that your API might return
export const API_ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
};
