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


export const getProducts = async (params: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  isActive?: boolean;
  stockStatus?: "soldOut" | "lowStock";
}) => {
  const query = new URLSearchParams();

  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));
  if (params.category) query.append("category", params.category);
  if (params.search) query.append("search", params.search);
  if (params.isActive !== undefined)
    query.append("isActive", String(params.isActive));
  if (params.stockStatus)
    query.append("stockStatus", params.stockStatus);

  const response = await authFetch(
    `${BASE_URL}/products?${query.toString()}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch products");
  }

  return data;
};