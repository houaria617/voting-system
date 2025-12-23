import API from '../api/axiosConfig';
import Swal from 'sweetalert2';

class AuthService {
  // ✅ LOGIN
  async login(emailOrUsername, password) {
    try {
      console.log('🔐 Logging in:', emailOrUsername);
      
      const response = await API.post('/auth/login', {
        email: emailOrUsername,
        password
      });

      // ✅ SAVE TOKEN WITH CORRECT KEY
      const token = response.data.token;
      const user = response.data.user;

      console.log('✅ Login successful, saving token');
      localStorage.setItem('token', token); // ← KEY: 'token' (not 'authToken')
      localStorage.setItem('user', JSON.stringify(user));

      return {
        success: true,
        message: 'Login successful',
        user
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      console.error('❌ Login error:', errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  // ✅ SIGNUP
  async signup(name, email, password) {
    try {
      console.log('📝 Signing up:', email);
      
      const response = await API.post('/auth/register', {
        name,
        email,
        password,
        role: 'VOTER' // ← Changed from 'ADMIN' to 'VOTER'
      });

      const token = response.data.token;
      const user = response.data.user;

      console.log('✅ Signup successful, saving token');
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return {
        success: true,
        message: 'Signup successful',
        user
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Signup failed';
      console.error('❌ Signup error:', errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  // ✅ LOGOUT
  async logout() {
    try {
      console.log('🚪 Logging out');
      await API.post('/auth/logout');
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('pendingPollId');

      return { success: true, message: 'Logged out' };
    } catch (err) {
      // Clear anyway
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('pendingPollId');
      
      return { success: true, message: 'Logged out' };
    }
  }

  // ✅ CHECK IF LOGGED IN
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const isAuth = !!token;
    console.log('🔍 Auth check:', isAuth ? 'LOGGED IN' : 'NOT LOGGED IN');
    return isAuth;
  }

  // ✅ GET CURRENT USER
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // ✅ GET TOKEN
  getToken() {
    return localStorage.getItem('token');
  }

  // ✅ FORGOT PASSWORD
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

  // ✅ RESET PASSWORD
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

export default new AuthService();