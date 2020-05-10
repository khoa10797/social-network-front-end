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

export const updateUserStatusPostAction = async ({commit, state}, userPost) => {
    let response = await PostService.updateUserStatus(userPost);
    let userPostResponse = response.data;

    let post = state.posts.find(it => it.post_id === userPostResponse.post_id);
    post.user_status = userPostResponse.user_status;
    if (Constant.USER_STATUS.LIKE === userPostResponse.user_status) {
        post.number_like++;
    } else {
        post.number_like--;
    }
    commit('UPDATE_POST', {postId: userPost.post_id, post: post});
};

export const addCommentAction = async ({commit, state}, comment) => {
    let response = await CommentService.sendComment(comment);
    let commentResponse = response.data;

    let post = state.posts.find(it => it.post_id === commentResponse.post_id);
    post.comments.push(commentResponse);
    post.number_comment++;
    commit('UPDATE_POST', {postId: comment.post_id, post: post});
};

export const addChildCommentAction = async ({commit, state}, comment) => {
    let response = await CommentService.sendComment(comment);
    let commentResponse = response.data;

    let post = state.posts.find(it => it.post_id === commentResponse.post_id);
    let parentComment = post.comments.find(item => item.comment_id === commentResponse.parent_id);
    parentComment.child_comments.push(commentResponse);
    post.number_comment++;
    commit('UPDATE_POST', {postId: commentResponse.parent_id, post: post});
}

export const deleteCommentAction = async ({commit, state}, {postId, commentId}) => {
    await CommentService.deleteComment(commentId);
}
