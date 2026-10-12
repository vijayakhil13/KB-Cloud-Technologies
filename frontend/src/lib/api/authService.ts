// This is a simplified version - in a real app, you'd use axios or fetch
// For demonstration purposes, we'll simulate API calls

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface LoginResponse {
  user: User;
  accessToken: string;
}

export const authService = {
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<{ user: User }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real app, this would make a POST request to /api/auth/register
    // For now, we'll simulate a successful response
    return {
      user: {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'customer',
      },
    };
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<LoginResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real app, this would make a POST request to /api/auth/login
    // For now, we'll simulate a successful response
    return {
      user: {
        id: '1',
        email: credentials.email,
        firstName: 'John',
        lastName: 'Doe',
        role: 'customer',
      },
      accessToken: 'mock-access-token-' + Math.random().toString(36).substr(2, 9),
    };
  },

  logout: async (): Promise<{ message: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real app, this would make a POST request to /api/auth/logout
    return {
      message: 'Logged out successfully',
    };
  },

  refreshToken: async (): Promise<{ accessToken: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real app, this would make a POST request to /api/auth/refresh
    // with the refresh token cookie
    return {
      accessToken: 'new-mock-access-token-' + Math.random().toString(36).substr(2, 9),
    };
  },

  getMe: async (): Promise<{ user: User }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real app, this would make a GET request to /api/auth/me
    return {
      user: {
        id: '1',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'customer',
      },
    };
  },
};

export default authService;