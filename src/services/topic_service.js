import {baseRequest} from "../api/api";

export const getById = async (topicId) => {
    let response = await baseRequest.get(`/topic/${topicId}`);
    return response.data;
};