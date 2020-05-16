import {baseRequest} from "../api/api";
import firebase from "firebase";

export const getByUser = async (userId) => {
    let response = await baseRequest.get(`/post/user/${userId}`);
    return response.data;
};

export const updateUserStatus = async (userPost) => {
    let response = await baseRequest.put('/post/user_status', userPost);
    return response.data
};

export const add = async (post) => {
    let response = await baseRequest.post('/post', post);
    return response.data;
};

export const getById = async (postId) => {
    let response = await baseRequest.get(`/post/${postId}`);
    return response.data;
};

export const remove = async (postId) => {
    let post = (await getById(postId)).data;

    const storageRef = firebase.storage().ref();
    post.images.forEach(image => {
        let decodeImageUrl = decodeURIComponent(image);
        let imageName = (decodeImageUrl.split('/').pop()).split('?')[0];

        let desertRef = storageRef.child(`images/${imageName}`);
        desertRef.delete();
    });

    let response = await baseRequest.delete(`/post/${postId}`);

    return response.status;
};

export const getTrendingPost = async () => {
    let response = await baseRequest.get('/post/trending');
    return response.data;
};