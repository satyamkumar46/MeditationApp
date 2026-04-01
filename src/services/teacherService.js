/**
 * Teacher Service
 *
 * Handles all teacher-related API operations.
 * Encapsulates business logic and data transformation.
 */

import apiClient from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

const teacherService = {
  /**
   * Fetch all teachers
   * @returns {Promise<Array>} - Array of teacher objects
   */
  async getAllTeachers() {
    const response = await apiClient.get(ENDPOINTS.TEACHERS.LIST);
    return response.data;
  },

  /**
   * Fetch a single teacher by ID
   * @param {string|number} id - Teacher ID
   * @returns {Promise<Object>} - Teacher object
   */
  async getTeacherById(id) {
    const response = await apiClient.get(ENDPOINTS.TEACHERS.GET_BY_ID(id));
    return response.data;
  },
};

export default teacherService;
