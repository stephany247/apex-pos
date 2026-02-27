import { BASE_URL } from "@/constants";
import { authFetch } from "./auth";

export const createSale = async (data: any) => {
    const response = await authFetch(`${BASE_URL}/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("SALE RESPONSE:", result);

    if (!response.ok) {
        throw new Error(result.message || "Failed to create sale");
    }

    return result;
};