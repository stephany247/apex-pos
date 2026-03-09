import { authFetch } from "./auth";
import { BASE_URL } from "@/constants";

export const getAnalytics = async (period: "day" | "week" | "month") => {
  const response = await authFetch(`${BASE_URL}/analytics?period=${period}`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch analytics");
  return result;
};