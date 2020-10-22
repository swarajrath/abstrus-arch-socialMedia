import axios from "axios";
import { setAlert } from "./alertActions";
import { setLoading, clearLoading } from "./loadingActions";
import {
  GET_PROFILE,
  CLEAR_PROFILE,
  GET_USER_TWEETS,
  CLEAR_TWEETS,
  PROFILE_UPDATED,
  PROFILE_FOLLOWED,
  PROFILE_UNFOLLOWED,
  FOLLOW_LOADED,
} from "./actionTypes";

export const getProfile = (id) => async (dispatch) => {
  dispatch(setLoading());
  dispatch({
    type: CLEAR_PROFILE,
  });
  dispatch({
    type: CLEAR_TWEETS,
  });
  try {
    const respProfile = await axios.get(`/api/v1/users/${id}/profile`);
    dispatch({
      type: GET_PROFILE,
      payload: respProfile.data.data,
    });
    const respTweet = await axios.get(
      `/api/v1/users/${id}/tweets?sort=-createdAt`
    );
    dispatch({
      type: GET_USER_TWEETS,
      payload: respTweet.data.data,
    });
  } catch (error) {
    console.log(error);
    dispatch(setAlert(true, error.response.data.message));
  }
  dispatch(clearLoading());
};

export const updateProfile = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  try {
    const resp = await axios.patch("/api/v1/profile/me", formData, config);
    dispatch({
      type: PROFILE_UPDATED,
      payload: resp.data.data,
    });
    dispatch(setAlert(false, `Profile updated`, 3000));
    return true;
  } catch (error) {
    console.log(error);
    dispatch(setAlert(true, error.response.data.message));
    return false;
  }
};

export const follow = (userId) => async (dispatch) => {
  try {
    const resp = await axios.patch(`/api/v1/users/${userId}/profile/follow`);
    dispatch({
      type: PROFILE_FOLLOWED,
      payload: resp.data.data,
    });
    dispatch(setAlert(false, `User followed`, 3000));
  } catch (error) {
    console.log(error);
    dispatch(setAlert(true, error.response.data.message));
  }
};

export const unfollow = (userId) => async (dispatch) => {
  try {
    const resp = await axios.patch(`/api/v1/users/${userId}/profile/unfollow`);
    dispatch({
      type: PROFILE_UNFOLLOWED,
      payload: resp.data.data,
    });
    dispatch(setAlert(false, `User unfollowed`, 3000));
  } catch (error) {
    console.log(error);
    dispatch(setAlert(true, error.response.data.message));
  }
};

export const getFollow = (profileId) => async (dispatch) => {
  dispatch(setLoading());
  dispatch({ type: CLEAR_PROFILE });
  try {
    const resp = await axios.get(`/api/v1/profile/${profileId}`);
    dispatch({
      type: FOLLOW_LOADED,
      payload: resp.data.data,
    });
  } catch (error) {
    console.log(error);
    dispatch(setAlert(true, error.response.data.message));
  }
  dispatch(clearLoading());
};
