// src/constants/apiRoutes.jsx
const API_ENDPOINTS = {
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
  GET_TRANSACTION_DETAIL: (id) => `/transactions/${id}`,
  DELETE_TRANSACTION: (id) => `/transactions/${id}`,

  // Dashboard
  DASHBOARD_SUMMARY: "/dashboard/summary",
};

export default API_ENDPOINTS;
