import { BASE_URL } from "@/constants";

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Signup failed");
  }

  return response.json();
};
