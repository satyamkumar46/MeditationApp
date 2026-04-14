import apiClient from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

const teacherService = {
  async getAllTeachers() {
    const response = await apiClient.get(ENDPOINTS.TEACHERS.LIST);
    return response.data;
  },

  async getTeacherById(id) {
    const response = await apiClient.get(ENDPOINTS.TEACHERS.GET_BY_ID(id));
    return response.data;
  },
};

export default teacherService;
