// src/services/reportService.js
import apiClient from './api'; // Import the configured axios instance

/**
 * Fetches the details of a specific report.
 * @param {string|number} reportId - The ID of the report to fetch.
 * @returns {Promise<object>} - Promise resolving to the report data object.
 */
export const fetchReportDetail = (reportId) => {
  if (!reportId) {
    return Promise.reject(new Error("Report ID is required."));
  }
  console.log(`Fetching report detail for ID: ${reportId}`);
  // Calls GET /api/reports/{reportId}/
  return apiClient.get(`/reports/${reportId}/`);
};

/**
 * Fetches a list of reports (e.g., for MyReports page).
 * @param {object} params - Object with query parameters (page, ordering, search, player, etc.)
 * @returns {Promise<object>} - Promise resolving to the API response (e.g., { count, next, previous, results })
 */
export const fetchReports = (params) => {
    console.log("Fetching reports with params:", params);
    // Calls GET /api/reports/ with parameters
    return apiClient.get('/reports/', { params });
};

// TODO: Add functions for creating, updating, deleting reports later
// export const createReport = (reportData) => apiClient.post('/reports/', reportData);
// export const updateReport = (reportId, reportData) => apiClient.put(`/reports/${reportId}/`, reportData);
// export const deleteReport = (reportId) => apiClient.delete(`/reports/${reportId}/`);

