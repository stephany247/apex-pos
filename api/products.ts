import { BASE_URL } from "@/constants";
import { authFetch } from "./auth";

export const createProduct = async (product: any) => {
  const token = localStorage.getItem("accessToken");

  const response = await authFetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create product");
  }

  return data;
};