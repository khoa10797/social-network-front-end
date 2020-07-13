import {baseRequest} from "../api/api";

export const getById = async (topicId) => {
    let response = await baseRequest.get(`/topic/${topicId}`);
    return response.data;
};

export const updateUserStatus = async (userTopic) => {
    let response = await baseRequest.put('/topic/user_status', userTopic);
    return response.data;
};

export const getFollowerByTopicId = async (topicId) => {
    let response = await baseRequest.get(`/topic/${topicId}/follower`);
    return response.data;
};

export const getAll = async () => {
    let response = await baseRequest.get('/topic');
    return response.data;
};

export const add = async (topic) => {
    let response = await baseRequest.post('/topic', topic);
    return response.data;
};

export const remove = async (topicId) => {
    let response = await baseRequest.delete(`/topic/${topicId}`);
    return response.data;
}