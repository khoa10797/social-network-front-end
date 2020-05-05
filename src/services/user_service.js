import {baseRequest} from "../api/api";

export const getById = async (userId) => {
    let response = await baseRequest.get(`/user/${userId}`);
    return response.data;
};

export const login = async (userRequest) => {
    let response = await baseRequest.post('/user/login', userRequest);
    return response.data;
}
