import {baseRequest} from "../api/api";

export const getUserById = async (userId) => {
  let response = await baseRequest.get(`/user/${userId}`);
  return response.data;
};
