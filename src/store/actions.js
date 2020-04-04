import * as UserService from '../services/user';
import * as PostService from '../services/post';
import * as CommentService from '../services/comment';

export const getUserByIdAction = async ({commit}, userId) => {
    let response = await UserService.getById(userId);
    commit('SET_USER', response.data);
};

export const getPostByUserIdAction = async ({commit}, userId) => {
    let response = await PostService.getPostByUser(userId);
    commit('SET_POSTS_BY_USER_ID', response.data);
};

export const getCommentByPostIdAction = async ({commit}, postId) => {
    let response = await CommentService.getCommentByPost(postId);
    commit('SET_COMMENTS_BY_POST_ID', {postId: postId, comments: response.data});
};

export const addPostAction = async ({commit}, post) => {
    let response = await PostService.addPost(post);
    commit('ADD_POST', response.data);
};
