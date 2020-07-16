import * as UserService from '../services/user_service';
import * as PostService from '../services/post_service';
import * as CommentService from '../services/comment_service';
import * as TopicService from '../services/topic_service';
import {Constant} from "../commons/constant";

export const setUserAction = async ({commit}, user) => {
    commit('SET_USER', user);
};

export const getPostByUserIdAction = async ({commit}, userId) => {
    let response = await PostService.getByUser(userId);
    commit('SET_POSTS', response.data);
};

export const getSuggestPost = async ({commit}) => {
    let response = await PostService.getSuggestPost();
    commit('SET_POSTS', response.data);
};

export const searchPostByFilterAction = async ({commit}, postFilter) => {
    let response = await PostService.searchByFilter(postFilter);
    commit('SET_POSTS', response.data);
};

export const getTrendingPostAction = async ({commit}) => {
    let response = await PostService.getTrendingPost();
    commit('SET_POSTS', response.data);
};

export const getCommentByPostIdAction = async ({commit}, postId) => {
    let response = await CommentService.getCommentByPost(postId);
    commit('SET_COMMENTS_BY_POST_ID', {postId: postId, comments: response.data});
};

export const addPostAction = async ({commit}, post) => {
    let response = await PostService.add(post);
    commit('ADD_POST', response.data);
};

export const updatePostAction = async ({commit}, post) => {
    let response = await PostService.updatePost(post);
    commit('UPDATE_POST', {postId: response.data.post_id, post: response.data});
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
    if (parentComment.child_comments === undefined || parentComment.child_comments === null) {
        parentComment.child_comments = [];
    }
    parentComment.child_comments.push(commentResponse);
    post.number_comment++;
    commit('UPDATE_POST', {postId: commentResponse.post_id, post: post});
}

export const removeCommentAction = async ({commit, state}, {postId, commentId}) => {
    await CommentService.deleteComment(commentId);

    let post = state.posts.find(it => it.post_id === postId);
    let comment = post.comments.find(item => item.comment_id === commentId);

    let numberChildComment = 0;
    if (comment.child_comments !== null && comment.child_comments !== undefined) {
        numberChildComment = comment.child_comments.length;
    }

    post.comments = post.comments.filter(item => item.comment_id !== commentId);
    post.number_comment -= (numberChildComment + 1);
    commit('UPDATE_POST', {postId: postId, post: post});
}

export const removeChildCommentAction = async ({commit, state}, {postId, parentId, commentId}) => {
    await CommentService.deleteComment(commentId);

    let post = state.posts.find(it => it.post_id === postId);
    let parentCommentIndex = post.comments.findIndex(item => item.comment_id === parentId);
    let parentComment = post.comments[parentCommentIndex];

    parentComment.child_comments = parentComment.child_comments.filter(item => item.comment_id !== commentId);
    post.comments[parentCommentIndex] = parentComment;
    post.number_comment--;
    commit('UPDATE_POST', {postId: postId, post: post});
}

export const updateUserStatusCommentAction = async ({commit, state}, {postId, parentId, userComment}) => {
    let response = await CommentService.updateUserStatus(userComment);
    let userCommentResponse = response.data;

    let post = state.posts.find(it => it.post_id === postId);
    if (parentId !== undefined && parentId !== null) {
        let parentCommentIndex = post.comments.findIndex(item => item.comment_id === parentId);
        let parentComment = post.comments[parentCommentIndex];
        let commentIndex = parentComment.child_comments.findIndex(item => item.comment_id === userComment.comment_id);
        let comment = parentComment.child_comments[commentIndex];
        comment.user_status = userCommentResponse.user_status;

        if (Constant.USER_STATUS.LIKE === userCommentResponse.user_status) {
            comment.number_like++;
        } else {
            comment.number_like--;
        }

        parentComment[commentIndex] = comment;
        post.comments[parentCommentIndex] = parentComment;
    } else {
        let commentIndex = post.comments.findIndex(item => item.comment_id === userComment.comment_id);
        let comment = post.comments[commentIndex];
        comment.user_status = userCommentResponse.user_status;
        if (Constant.USER_STATUS.LIKE === userCommentResponse.user_status) {
            comment.number_like++;
        } else {
            comment.number_like--;
        }

        post.comments[commentIndex] = comment;
    }

    commit('UPDATE_POST', {postId: postId, post: post});
};

export const getPostByTopicIdAction = async ({commit}, topicId) => {
    let response = await PostService.getByTopicId(topicId);
    commit('SET_POSTS', response.data);
};

export const setPostAction = async ({commit}, post) => {
    let posts = [post];
    commit('SET_POSTS', posts);
};

/*
export const bookmarkPostAction = async ({commit, state}, userPost) => {
    let userPostResponse = (await PostService.bookmarkPost(userPost)).data;
    let postId = userPostResponse.post_id;
    let post = state.posts.find(it => it.post_id === postId);
    post.bookmark = userPostResponse.bookmark;

    commit('UPDATE_POST', {postId: postId, post: post});
};*/
