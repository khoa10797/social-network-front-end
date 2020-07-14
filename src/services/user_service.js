import {baseRequest} from "../api/api";

export const getById = async (userId) => {
    let response = await baseRequest.get(`/user/${userId}`);
    return response.data;
};

export const login = async (userRequest) => {
    let response = await baseRequest.post('/user/login', userRequest);
    return response.data;
};

export const followUser = async (userFollow) => {
    let response = await baseRequest.put(`/user/follow`, userFollow);
    return response.data;
};

export const getFollower = async (userId) => {
    let response = await baseRequest.get(`/user/follower/${userId}`);
    return response.data;
};

export const add = async (user) => {
    let response = await baseRequest.post('/user', user);
    return response.data;
}
