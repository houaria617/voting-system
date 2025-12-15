import API from '../api/axiosConfig';
import Swal from 'sweetalert2';

// ✅ ALL BUSINESS LOGIC HERE (Not in components!)
class AuthService {
  // LOGIN
  async login(emailOrUsername, password) {
    try {
      // Call backend API
      const response = await API.post('/auth/login', {
        email: emailOrUsername, // Backend expects 'email'
        password
      });

      // Save token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return {
        success: true,
        message: 'Login successful',
        user: response.data.user
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  // SIGNUP
  async signup(name, email, password) {
    try {
      const response = await API.post('/auth/register', {
        name,
        email,
        password,
        role: 'ADMIN' // or 'VOTER'
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return {
        success: true,
        message: 'Signup successful',
        user: response.data.user
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Signup failed';
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  // LOGOUT
  async logout() {
    try {
      // Call backend to blacklist token
      await API.post('/auth/logout');

      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (err) {
      // Still clear local storage even if API fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      return {
        success: true,
        message: 'Logged out'
      };
    }
  }

  // CHECK IF USER IS LOGGED IN
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // GET CURRENT USER
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // GET TOKEN
  getToken() {
    return localStorage.getItem('token');
  }

  // FORGOT PASSWORD
  async forgotPassword(email) {
    try {
      const response = await API.post('/auth/forgot-password', { email });
      return {
        success: true,
        message: response.data.message || 'Reset link sent'
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send reset link';
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  // RESET PASSWORD
  async resetPassword(token, newPassword) {
    try {
      const response = await API.post('/auth/reset-password', { token, newPassword });
      return {
        success: true,
        message: response.data.message || 'Password reset successfully'
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to reset password';
      return {
        success: false,
        message: errorMessage
      };
    }
  }
}

// Export as singleton
export default new AuthService();
