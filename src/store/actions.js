import * as UserService from '../services/user_service';
import * as PostService from '../services/post_service';
import * as CommentService from '../services/comment_service';
import {Constant} from "../commons/constant";

export const setUserAction = async ({commit}, user) => {
    commit('SET_USER', user);
};

export const getPostByUserIdAction = async ({commit}, userId) => {
    let response = await PostService.getByUser(userId);
    commit('SET_POSTS_BY_USER_ID', response.data);
};

export const getTrendingPostAction = async ({commit}) => {
    let response = await PostService.getTrendingPost();
    commit('SET_POSTS_BY_USER_ID', response.data);
};

export const getCommentByPostIdAction = async ({commit}, postId) => {
    let response = await CommentService.getCommentByPost(postId);
    commit('SET_COMMENTS_BY_POST_ID', {postId: postId, comments: response.data});
};

export const addPostAction = async ({commit}, post) => {
    let response = await PostService.add(post);
    commit('ADD_POST', response.data);
};

export const removePostAction = async ({commit}, postId) => {
    await PostService.remove(postId);
    commit('REMOVE_POST', postId);
};

export const updateUserStatusPost = async ({commit, state}, {postId, userStatus}) => {
    let post = state.posts.find(it => it.post_id === postId);
    post.user_status = userStatus;
    if (Constant.USER_STATUS.LIKE === userStatus) {
        post.number_like++;
    } else {
        post.number_like--;
    }
    commit('UPDATE_POST', {postId: postId, post: post});
};

export const addComment = async ({commit, state}, {postId, comment}) => {
    let post = state.posts.find(it => it.post_id === postId);
    post.comments.push(comment);
    post.number_comment++;
    commit('UPDATE_POST', {postId: postId, post: post});
};

export const addChildComment = async ({commit, state}, {postId, parentId, comment}) => {
    let post = state.posts.find(it => it.post_id === postId);
    let parentComment = post.comments.find(item => item.comment_id === parentId);
    parentComment.child_comments.push(comment);
    post.number_comment++;
    commit('UPDATE_POST', {postId: postId, post: post});
}
