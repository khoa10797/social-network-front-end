import {baseRequest} from "../api/api";

export const getById = async (topicId) => {
    let response = await baseRequest.get(`/topic/${topicId}`);
    return response.data;
};

export const updateUserStatus = async (userTopic) => {
    let response = await baseRequest.put('topic/user_status', userTopic);
    return response.data;
}