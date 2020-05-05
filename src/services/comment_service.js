import {baseRequest} from "../api/api";

export const getCommentByPost = async (postId) => {
    let response = await baseRequest.get(`/comment/post/${postId}`);
    return response.data;
};

export const sendComment = async (comment) => {
    let response = await baseRequest.post('/comment', comment);
    return response.data;
};
