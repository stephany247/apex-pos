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

export const getSales = async () => {
  const response = await authFetch(`${BASE_URL}/sales`);

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return response.json();
};

export const updateSale = async (
  id: string,
  data: {
    items: {
      productId: string;
      name: string;
      quantity: number;
      unitPrice: number;
    }[];
    payment: "cash" | "card" | "transfer";
  },
) => {
  const response = await authFetch(`${BASE_URL}/sales/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update sale");
  }

  return result;
};

export const deleteSale = async (id: string) => {
  const response = await authFetch(`${BASE_URL}/sales/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete sale");
  }

  return result;
};