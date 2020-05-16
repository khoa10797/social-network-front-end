import {baseRequest} from "../api/api";

export const getCommentByPost = async (postId) => {
    let response = await baseRequest.get(`/comment/post/${postId}`);
    return response.data;
};

export const sendComment = async (comment) => {
    let response = await baseRequest.post('/comment', comment);
    return response.data;
};

export const deleteComment = async (commentId) => {
    await baseRequest.delete(`/comment/${commentId}`);
};

export const updateUserStatus = async (userComment) => {
    let response = await baseRequest.put('/comment/user_status', userComment);
    return response.data;
};