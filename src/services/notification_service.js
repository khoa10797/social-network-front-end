import {baseRequest} from "../api/api";

export const countNotSeenByUserId = async (userId) => {
    let response = await baseRequest.get(`/notification/count/not_seen/${userId}`);
    return response.data;
}

export const getByUserId = async (userId) => {
    let response = await baseRequest.get(`/notification/${userId}`);
    return response.data;
}

export const seenNotification = async (userId) => {
    let response = await baseRequest.put(`/notification/seen/${userId}`);
    return response.data;
}