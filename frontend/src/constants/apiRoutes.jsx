// src/constants/apiRoutes.js
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",

  // User/Profile
  USER_SESSION: "/users/session",
  USER_PROFILE: "/users/profile",
  USER_UPDATE: "/users/update",

  // Transactions
  GET_TRANSACTIONS: "/transactions",
  CREATE_TRANSACTION: "/transactions/create",

  // Dashboard
  DASHBOARD_SUMMARY: "/dashboard/summary",
};

export default API_ENDPOINTS;