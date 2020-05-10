import Vue from 'vue';
import state from "./state";

export const SET_USER = (state, user) => {
    state.user = user;
};

export const SET_POSTS_BY_USER_ID = (state, posts) => {
    state.posts = posts;
};

export const SET_COMMENTS_BY_POST_ID = (state, {postId, comments}) => {
    Vue.set(state.posts.find(item => item.post_id === postId), 'comments', comments)
};

export const ADD_POST = (state, post) => {
    state.posts.push(post);
};

export const REMOVE_POST = (state, postId) => {
    state.posts = state.posts.filter(item => item.post_id !== postId);
};

export const UPDATE_POST = (state, {postId, post}) => {
    let postIndex = state.posts.findIndex(item => item.post_id === postId);
    state.posts[postIndex] = post;
};
