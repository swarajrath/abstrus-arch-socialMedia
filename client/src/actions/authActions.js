import {
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
  SIGNUP_SUCCESS,
  SIGNUP_FAILED,
  USER_DELETED,
} from "./actionTypes";
import axios from "axios";

import { setTokenHeader } from "../util/auth";
import { setAlert } from "./alertActions";
import { connectSocket, disposeSocket } from "./socketActions";

const config = {
  headers: {
    "Content-type": "application/json",
  },
};

export const login = (formData) => async (dispatch) => {
  try {
    const resp = await axios.post("/api/v1/users/login", formData, config);
    dispatch({ type: LOGIN_SUCCESS, payload: resp.data.data });
    dispatch(loadUser());
    dispatch(setAlert(false, `Login success`, 3000));
  } catch (error) {
    console.log(error);
    dispatch({
      type: LOGIN_FAILED,
    });
    dispatch(setAlert(true, error.response.data.message));
  }
};

export const signup = (formData) => async (dispatch) => {
  try {
    const resp = await axios.post("/api/v1/users/register", formData, config);
    dispatch({
      type: SIGNUP_SUCCESS,
      payload: resp.data.data,
    });
    dispatch(loadUser());
    dispatch(setAlert(false, `Signup success`, 3000));
  } catch (error) {
    console.log(error);
    dispatch({
      type: SIGNUP_FAILED,
    });
    dispatch(setAlert(true, error.response.data.message, 10000));
  }
};

export const loadUser = () => async (dispatch) => {
  try {
    setTokenHeader(localStorage.jwtToken);
    const resp = await axios.get("/api/v1/users/loadMe");
    dispatch({
      type: USER_LOADED,
      payload: resp.data.data,
    });
    dispatch(connectSocket(resp.data.data.user.id));
    dispatch(setAlert(false, `Welcome, ${resp.data.data.user.handle}`, 3000));
  } catch (error) {
    console.log(error);
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
  dispatch(disposeSocket());
  dispatch(setAlert(false, `Logout success`, 3000));
};

export const deleteUser = (password) => async (dispatch) => {
  console.log(password);
  const deleteConfig = {
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      password,
    },
  };
  try {
    await axios.delete("/api/v1/users/deleteme", deleteConfig);
    dispatch({
      type: USER_DELETED,
    });
    dispatch(setAlert(false, `Account deleted`, 3000));
  } catch (error) {
    console.log(error);
    dispatch(setAlert(true, error.response.data.message));
  }
};
