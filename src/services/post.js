import {baseRequest} from "../api/api";

export const getPostByUser = async (userId) => {
  let response = await baseRequest.get(`/post/user/${userId}`);
  return response.data;
};

export const updateUserStatus = async (userPost) => {
  let response = await baseRequest.put('/post/user_status', userPost);
  return response.data
};
