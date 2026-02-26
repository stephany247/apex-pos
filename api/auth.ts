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


export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  const response = await fetch(
    `${BASE_URL}/auth/refresh`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Session expired");
  }

  localStorage.setItem("accessToken", data.data.accessToken);

  return data.data.accessToken;
};


export const authFetch = async (url: string, options: any = {}) => {
  let token = localStorage.getItem("accessToken");

  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  // If token expired
  if (response.status === 401) {
    try {
      token = await refreshAccessToken();

      // Retry original request
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      localStorage.clear();
      window.location.reload();
      throw new Error("Session expired");
    }
  }

  return response;
};