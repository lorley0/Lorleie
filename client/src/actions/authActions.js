import axios from 'axios';
import Cookies from 'js-cookie';
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  OTP_REQUEST,
  OTP_SENT_SUCCESS,
  OTP_SENT_FAILED,
  OTP_VERIFIED_SUCCESS,
  OTP_VERIFIED_FAILED,
  LOGOUT,
  USER_FORGOT_PASSWORD_REQUEST,
  USER_FORGOT_PASSWORD_SUCCESS,
  USER_FORGOT_PASSWORD_FAIL,
  USER_RESET_PASSWORD_REQUEST,
  USER_RESET_PASSWORD_SUCCESS,
  USER_RESET_PASSWORD_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  DELETE_ACCOUNT_REQUEST,
  DELETE_ACCOUNT_SUCCESS,
  DELETE_ACCOUNT_FAIL,
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAIL,
} from './types';
import { setAccessToken, setRefreshToken } from '../utils/tokenUtils';
import axiosInstance from '../pages/users/axiosInstance';

// Register a User
export const registerUser = ({ name, email, password }) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_REQUEST }); // Dispatch request action

    // Construct API URL
    const apiUrl = `${process.env.REACT_APP_API_URL}/api/v1/users/register`;

    // Send registration request to the backend
    const res = await axios.post(apiUrl, { name, email, password });

    // Check for success response
    if (res.data.success) {
      dispatch({ type: REGISTER_SUCCESS, payload: res.data });
      return { success: true };
    } else {
      dispatch({
        type: REGISTER_FAIL,
        payload: res.data.message || 'Registration failed. Please try again.',
      });
      return { success: false, message: res.data.message || 'Registration failed.' };
    }
  } catch (error) {
    // Handle any errors that occur during registration
    const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
    dispatch({ type: REGISTER_FAIL, payload: errorMessage });
    return { success: false, message: errorMessage };
  }
};

// Send OTP to Email
export const sendOtp = (email) => async (dispatch) => {
  try {
    dispatch({ type: OTP_REQUEST }); // Dispatch OTP request action

    // Send OTP request to the backend
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/users/send-otp`, { email });

    // Check for success response
    if (res.data.success) {
      dispatch({ type: OTP_SENT_SUCCESS, payload: res.data.message });
      return { success: true, message: res.data.message };
    } else {
      dispatch({
        type: OTP_SENT_FAILED,
        payload: res.data.message || 'Failed to send OTP.',
      });
      return { success: false, message: res.data.message || 'Failed to send OTP.' };
    }
  } catch (error) {
    // Handle errors during sending OTP
    const errorMessage = error.response?.data?.message || 'An error occurred while sending OTP.';
    dispatch({ type: OTP_SENT_FAILED, payload: errorMessage });
    return { success: false, message: errorMessage };
  }
};

// Verify OTP
export const verifyOtp = (email, otp) => async (dispatch) => {
  try {
    dispatch({ type: OTP_REQUEST }); // Dispatch OTP request action

    // Verify OTP with the backend
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/users/verify-otp`,
      { email, otp },
      { withCredentials: true } // Include credentials
    );

    // Check for success response
    if (res.data.success) {
      dispatch({ type: OTP_VERIFIED_SUCCESS, payload: res.data.message });
      setAccessToken(res.data.accessToken); // Save access token
      setRefreshToken(res.data.refreshToken); // Save refresh token
      return { success: true, message: res.data.message };
    } else {
      dispatch({
        type: OTP_VERIFIED_FAILED,
        payload: res.data.message || 'OTP verification failed.',
      });
      return { success: false, message: res.data.message || 'OTP verification failed.' };
    }
  } catch (error) {
    // Handle errors during OTP verification
    const errorMessage = error.response?.data?.message || 'An error occurred during OTP verification.';
    dispatch({ type: OTP_VERIFIED_FAILED, payload: errorMessage });
    return { success: false, message: errorMessage };
  }
};

// Login User
export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST }); // Dispatch login request action

    // Send login request
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/users/login`,
      { email, password },
      { withCredentials: true } // Include credentials
    );

    // Check for success response
    if (res.data.success) {
      const { accessToken, refreshToken, user } = res.data.data; // Extract tokens and user
      setAccessToken(accessToken); // Save access token
      setRefreshToken(refreshToken); // Save refresh token
      dispatch({ type: LOGIN_SUCCESS, payload: { user } }); // Dispatch login success action
      return { success: true };
    } else {
      dispatch({
        type: LOGIN_FAIL,
        payload: res.data.message || 'Login failed. Please try again.',
      });
      return { success: false, message: res.data.message || 'Login failed.' };
    }
  } catch (error) {
    // Handle errors during login
    const errorMessage = error.response?.data?.message || 'An error occurred during login.';
    dispatch({ type: LOGIN_FAIL, payload: errorMessage });
    return { success: false, message: errorMessage };
  }
};

// Logout User
export const logout = () => (dispatch) => {
  // Remove tokens from cookies
  Cookies.remove('jwt'); // Remove access token
  Cookies.remove('refreshToken'); // Remove refresh token

  // Dispatch logout action
  dispatch({ type: LOGOUT });
};

// Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: USER_FORGOT_PASSWORD_REQUEST }); // Dispatch request action
    const config = { headers: { 'Content-Type': 'application/json' } };

    // Send forgot password request
    await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/users/forgot-password`, { email }, config);

    dispatch({ type: USER_FORGOT_PASSWORD_SUCCESS }); // Dispatch success action
    return { success: true, message: 'OTP sent to your email for verification!' };
  } catch (error) {
    // Handle errors during forgot password request
    dispatch({
      type: USER_FORGOT_PASSWORD_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    return { success: false, message: error.response?.data?.message || error.message };
  }
};

// Reset Password
export const resetPassword = (email, newPassword) => async (dispatch) => {
  try {
    dispatch({ type: USER_RESET_PASSWORD_REQUEST }); // Dispatch request action
    const config = { headers: { 'Content-Type': 'application/json' } };

    // Send reset password request
    await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/users/reset-password`, { email, newPassword }, config);

    dispatch({ type: USER_RESET_PASSWORD_SUCCESS }); // Dispatch success action
    return { success: true, message: 'Password reset successful!' };
  } catch (error) {
    // Handle errors during reset password request
    dispatch({
      type: USER_RESET_PASSWORD_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    return { success: false, message: error.response?.data?.message || error.message };
  }
};

// Fetch User Profile by ID
export const fetchUserProfile = (userId) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_PROFILE_REQUEST }); // Dispatch request action

    // Fetch user profile
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/users/profile/${userId}`, {
      withCredentials: true, // Include credentials
    });

    dispatch({ type: FETCH_PROFILE_SUCCESS, payload: response.data.data }); // Dispatch success action
  } catch (error) {
    if (error.response?.status === 401) {
      // If access token expired, try refreshing
      const refreshResponse = await dispatch(refreshAccessToken());

      if (refreshResponse.success) {
        // Retry fetching profile after refreshing token
        const retryResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/users/profile/${userId}`, {
          withCredentials: true,
        });

        dispatch({ type: FETCH_PROFILE_SUCCESS, payload: retryResponse.data.data }); // Dispatch success action
      } else {
        // Handle token refresh failure
        dispatch({ type: FETCH_PROFILE_FAIL, payload: "Session expired, please log in again." });
      }
    } else {
      // Handle other errors
      dispatch({ type: FETCH_PROFILE_FAIL, payload: error.response?.data?.message || error.message });
    }
  }
};

// Update User Profile
export const updateUserProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST }); // Dispatch request action

    // Update user profile
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/v1/users/update-profile`, userData, {
      withCredentials: true, // Include credentials
      headers: { 'Content-Type': 'application/json' },
    });

    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: response.data }); // Dispatch success action
  } catch (error) {
    if (error.response?.status === 401) {
      // If access token expired, try refreshing
      const refreshResponse = await dispatch(refreshAccessToken());

      if (refreshResponse.success) {
        // Retry updating profile after refreshing token
        const retryResponse = await axios.put(`${process.env.REACT_APP_API_URL}/api/v1/users/update-profile`, userData, {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        });

        dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: retryResponse.data }); // Dispatch success action
      } else {
        // Handle token refresh failure
        dispatch({ type: UPDATE_PROFILE_FAIL, payload: "Session expired, please log in again." });
      }
    } else {
      // Handle other errors
      dispatch({ type: UPDATE_PROFILE_FAIL, payload: error.response?.data?.message || error.message });
    }
  }
};

// Delete User Account
export const deleteUserAccount = (userId, password) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ACCOUNT_REQUEST }); // Dispatch request action

    // Delete user account
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/users/profile/${userId}`, {
      withCredentials: true, // Include credentials
      data: { password },
    });

    dispatch({ type: DELETE_ACCOUNT_SUCCESS }); // Dispatch success action
  } catch (error) {
    if (error.response?.status === 401) {
      // If access token expired, try refreshing
      const refreshResponse = await dispatch(refreshAccessToken());

      if (refreshResponse.success) {
        // Retry account deletion after refreshing token
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/users/profile/${userId}`, {
          withCredentials: true,
          data: { password },
        });

        dispatch({ type: DELETE_ACCOUNT_SUCCESS }); // Dispatch success action
      } else {
        // Handle token refresh failure
        dispatch({ type: DELETE_ACCOUNT_FAIL, payload: "Session expired, please log in again." });
      }
    } else {
      // Handle other errors
      dispatch({ type: DELETE_ACCOUNT_FAIL, payload: error.response?.data?.message || error.message });
    }
  }
};

// Refresh Access Token
export const refreshAccessToken = () => async () => {
  try {
    const res = await axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/v1/users/refresh-token`);

    if (res.data.success) {
      // Return new access token
      return { success: true, accessToken: res.data.accessToken };
    } else {
      // Handle refresh token failure
      return { success: false };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to refresh token.';
    return { success: false, message: errorMessage };
  }
};
