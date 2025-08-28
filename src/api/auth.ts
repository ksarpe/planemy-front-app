export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    id: string;
    username: string;
  };
}

export const loginUser = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    // Hardcoded for now - will replace with actual backend call
    const response = await fetch("http://localhost:8080/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch {
    // For development, simulate the API call
    console.log(`Simulated login call:`, {
      method: "POST",
      url: "http://localhost:8080/api/v1/auth/login",
      body: {
        username: credentials.username,
        password: "**", // Hide password in logs
      },
    });

    // Simulate success for development
    return {
      message: "Login successful",
      token: "mock-jwt-token",
      user: {
        id: "mock-user-id",
        username: credentials.username,
      },
    };
  }
};

export const registerUser = async (credentials: RegisterRequest): Promise<AuthResponse> => {
  try {
    // Hardcoded for now - will replace with actual backend call
    const response = await fetch("http://localhost:8080/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch {
    // For development, simulate the API call
    console.log(`Simulated register call:`, {
      method: "POST",
      url: "http://localhost:8080/api/v1/auth/register",
      body: {
        username: credentials.username,
        password: "**", // Hide password in logs
      },
    });

    // Simulate success for development
    return {
      message: "Registration successful",
      token: "mock-jwt-token",
      user: {
        id: "mock-user-id",
        username: credentials.username,
      },
    };
  }
};
