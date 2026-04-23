import apiClient from "../api/apiClient";


export const fetchUsersFromApi = async () => {
  try {
    const res= await apiClient.get("/auth/profile");
    return res;
  } catch (error) {
    return {success:false, message:error.message};
  }
};

export const updateProfileApi = async (data) => {
  try {
    const res= await apiClient.put("/user/update-profile",data);
    return res;
  } catch (error) {
    return {success:false, message:error.message};
  }
};

export const addSession = async (minutes) => {

    if (!minutes || minutes <= 0) {
    return { success: false, message: "Invalid minutes" };
  }
    try {
        
        const res= await apiClient.post("/user/session",{minutes});
        return res;
    } catch (error) {
        return {success:false, message:error.message || "Something went wrong",};
    }
};

export const getHistory = async () => {
   try {
    
    const res= await apiClient.get("/user/history");
    return res;
   } catch (error) {
    return { success: false, message: error.message };
   }
};

export const followUser = async (teacherId) => {
  try {
    
    const res= await apiClient.post("/user/toggle-follow",{teacherId});
    return res;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const fetchUserStats = async () => {
  try {
    const res= await apiClient.get("/user/stats");
    return res;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
