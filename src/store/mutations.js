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
