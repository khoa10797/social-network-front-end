import {baseRequest} from "../api/api";

export const countNotSeenByUserId = async (userId) => {
    let response = await baseRequest.get(`/notification/count/not_seen/${userId}`)
    return response.data;
}