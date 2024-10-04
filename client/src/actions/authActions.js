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
import { setAccessToken, setRefreshToken, getAccessToken, getRefreshToken } from '../utils/tokenUtils';
import axiosInstance from '../pages/users/axiosInstance';
import { toast } from 'react-toastify';

// Register a User
export const registerUser = ({ name, email, password }) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_REQUEST }); // Dispatch request action

    const apiUrl = `${process.env.REACT_APP_API_URL}/api/v1/users/register`;
    const res = await axios.post(apiUrl, { name, email, password });

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
    const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
    dispatch({ type: REGISTER_FAIL, payload: errorMessage });
    return { success: false, message: errorMessage };
  }
};

// Send OTP to Email
export const sendOtp = (email) => async (dispatch) => {
  try {
    dispatch({ type: OTP_REQUEST }); // Dispatch OTP request action

    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/users/send-otp`, { email });

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
    const errorMessage = error.response?.data?.message || 'An error occurred while sending OTP.';
    dispatch({ type: OTP_SENT_FAILED, payload: errorMessage });
    return { success: false, message: errorMessage };
  }
};

// Verify OTP
export const verifyOtp = (email, otp) => async (dispatch) => {
  try {
    dispatch({ type: OTP_REQUEST }); // Dispatch OTP request action

    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/users/verify-otp`,
      { email, otp },
      { withCredentials: true }
    );

    if (res.data.success) {
      dispatch({ type: OTP_VERIFIED_SUCCESS, payload: res.data.message });
      setAccessToken(res.data.accessToken);
      setRefreshToken(res.data.refreshToken);
      return { success: true, message: res.data.message };
    } else {
      dispatch({
        type: OTP_VERIFIED_FAILED,
        payload: res.data.message || 'OTP verification failed.',
      });
      return { success: false, message: res.data.message || 'OTP verification failed.' };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'An error occurred during OTP verification.';
    dispatch({ type: OTP_VERIFIED_FAILED, payload: errorMessage });
    return { success: false, message: errorMessage };
  }
};

// Login User
export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST }); // Dispatch login request action

    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/users/login`,
      { email, password },
      { withCredentials: true }
    );

    if (res.data.success) {
      const { accessToken, refreshToken, user } = res.data.data;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      dispatch({ type: LOGIN_SUCCESS, payload: { user } });
      return { success: true };
    } else {
      dispatch({
        type: LOGIN_FAIL,
        payload: res.data.message || 'Login failed. Please try again.',
      });
      return { success: false, message: res.data.message || 'Login failed.' };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'An error occurred during login.';
    dispatch({ type: LOGIN_FAIL, payload: errorMessage });
    return { success: false, message: errorMessage };
  }
};

// Logout User
export const logout = () => (dispatch) => {
  Cookies.remove('jwt');
  Cookies.remove('refreshToken');
  dispatch({ type: LOGOUT });
};

// Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: USER_FORGOT_PASSWORD_REQUEST });
    const config = { headers: { 'Content-Type': 'application/json' } };

    await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/users/forgot-password`, { email }, config);
    dispatch({ type: USER_FORGOT_PASSWORD_SUCCESS });
    return { success: true, message: 'OTP sent to your email for verification!' };
  } catch (error) {
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
    dispatch({ type: USER_RESET_PASSWORD_REQUEST });
    const config = { headers: { 'Content-Type': 'application/json' } };

    await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/users/reset-password`, { email, newPassword }, config);
    dispatch({ type: USER_RESET_PASSWORD_SUCCESS });
    return { success: true, message: 'Password reset successful!' };
  } catch (error) {
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
    dispatch({ type: FETCH_PROFILE_REQUEST });
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/users/profile/${userId}`, {
      withCredentials: true,
    });

    dispatch({ type: FETCH_PROFILE_SUCCESS, payload: response.data.data });
  } catch (error) {
    if (error.response?.status === 401) {
      const refreshResponse = await dispatch(refreshAccessToken());
      if (refreshResponse.success) {
        const retryResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/users/profile/${userId}`, {
          withCredentials: true,
        });
        dispatch({ type: FETCH_PROFILE_SUCCESS, payload: retryResponse.data.data });
      } else {
        dispatch({ type: FETCH_PROFILE_FAIL, payload: "Session expired, please log in again." });
      }
    } else {
      dispatch({ type: FETCH_PROFILE_FAIL, payload: error.response?.data?.message || error.message });
    }
  }
};

// Update User Profile
export const updateUserProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });

    const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/v1/users/update-profile`, userData, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });

    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: response.data });
  } catch (error) {
    if (error.response?.status === 401) {
      const refreshResponse = await dispatch(refreshAccessToken());
      if (refreshResponse.success) {
        const retryResponse = await axios.put(`${process.env.REACT_APP_API_URL}/api/v1/users/update-profile`, userData, {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        });

        dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: retryResponse.data });
      } else {
        dispatch({ type: UPDATE_PROFILE_FAIL, payload: "Session expired, please log in again." });
      }
    } else {
      dispatch({ type: UPDATE_PROFILE_FAIL, payload: error.response?.data?.message || error.message });
    }
  }
};

// Delete User Account
export const deleteUserAccount = (userId, password) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ACCOUNT_REQUEST });

    await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/users/profile/${userId}`, {
      withCredentials: true,
      data: { password },
    });

    dispatch({ type: DELETE_ACCOUNT_SUCCESS }); // Dispatch success action
  } catch (error) {
    if (error.response?.status === 401) {
      const refreshResponse = await dispatch(refreshAccessToken());

      if (refreshResponse.success) {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/users/profile/${userId}`, {
          withCredentials: true,
          data: { password },
        });

        dispatch({ type: DELETE_ACCOUNT_SUCCESS }); // Dispatch success action
      } else {
        dispatch({ type: DELETE_ACCOUNT_FAIL, payload: "Session expired, please log in again." });
      }
    } else {
      dispatch({ type: DELETE_ACCOUNT_FAIL, payload: error.response?.data?.message || error.message });
    }
  }
};

// Refresh Access Token
export const refreshAccessToken = () => async () => {
  try {
    const res = await axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/v1/users/refresh-token`);

    if (res.data.success) {
      return { success: true, accessToken: res.data.accessToken };
    } else {
      return { success: false };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to refresh token.';
    return { success: false, message: errorMessage };
  }
};

// Upload Profile Image
export const uploadProfileImage = (file) => async (dispatch) => {
  const formData = new FormData();
  formData.append('profileImage', file);

  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/users/upload-profile-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });

    const profileImageUrl = response.data.profileImageUrl;

    dispatch(updateUserProfile({ profileImage: profileImageUrl })); // Dispatch action to update the user profile with the new image URL
    toast.success('Profile image updated successfully!');
    return profileImageUrl;
  } catch (error) {
    toast.error('Failed to upload image');
    throw error;
  }
};
