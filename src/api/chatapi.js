import apiClient from "./apiClient";

export const sendMessageToAI = async (message) => {
  try {
    const response = await apiClient.post("/api/chat", {
      message,
    });
    return response.data;
  } catch (error) {
    console.log("AI CHAT ERROR:", error);
    throw error;
  }
};
