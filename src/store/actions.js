import * as UserService from '../services/user';
import * as PostService from '../services/post';
import * as CommentService from '../services/comment';

export const setUser = async ({commit}, userId) => {
  let response = await UserService.getUserById(userId);
  commit('SET_USER', response.data);
};

export const setPostByUser = async ({commit}, userId) => {
  let response = await PostService.getPostByUser(userId);
  commit('SET_POSTS_BY_USER_ID', response.data);
};

export const setCommentByPost = async ({commit}, postId) => {
  let response = await CommentService.getCommentByPost(postId);
  commit('SET_COMMENTS_BY_POST_ID', {postId: postId, comments: response.data});
};
