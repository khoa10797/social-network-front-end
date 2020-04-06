import {baseRequest} from "../api/api";

export const getById = async (userId) => {
  let response = await baseRequest.get(`/user/${userId}`);
  return response.data;
};
