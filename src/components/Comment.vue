<template>
    <div class="container-comment">
        <div class="container-popup" :style="styleDisplayPopup" @click="closePopup">
        </div>

        <div class="parent-comment">
            <div class="card-image mr-10">
                <figure class="image is-40x40">
                    <router-link :to="{path: 'user', query: {userId: comment.user_owner.user_id}}">
                        <img class="is-rounded" :src="comment.user_owner.avatar" alt=""/>
                    </router-link>
                </figure>
            </div>

            <div class="right-parent-comment">
                <div class="container-comment-content" @mouseover="showActionComment = true">
                    <div class="comment-content">
                        <router-link :to="{path: 'user', query: {userId: comment.user_owner.user_id}}">
                            <p class="has-text-black is-text-decoration-line" style="font-size: 14px">
                                <span style="font-weight: 600">{{comment.user_owner.name}}</span>
                            </p>
                        </router-link>

                        <div v-html="comment.content" class="has-text-black">

                        </div>
                    </div>

                    <div v-if="showActionComment === true" class="action-comment-right">
                        <i v-if="user.user_id === comment.user_owner_id" @click="switchOpenMenuComment"
                           class="fas fa-ellipsis-h"></i>

                        <div v-if="showMenuComment === true"
                             class="menu-comment">
                            <ul class="menu-list">
                                <li>
                                    <a @click="deleteComment"><span>Xóa bình luận</span></a>
                                </li>
                                <li>
                                    <a><span>Chỉnh sửa</span></a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div v-if="comment.number_like !== undefined && comment.number_like > 0"
                         class="status-user-comment">
                        <img src="../assets/icons/icon-like.svg" alt=""/>
                        <span>{{comment.number_like}}</span>
                    </div>
                </div>

                <div class="action-comment-bottom">
                    <span v-if="comment.number_like !== undefined && comment.number_like > 0 && comment.user_status === 'like'"
                          @click="updateUserStatus">Bỏ thích</span>
                    <span v-else @click="updateUserStatus">Thích</span>
                    <span v-if="comment.parent_id === null" @click="openInputComment">Trả lời</span>
                </div>
            </div>
        </div>

        <div class="child-comment">
            <Comment v-for="childComment in comment.child_comments" :key="childComment.comment_id"
                     :comment="childComment"/>
        </div>

        <div v-if="comment.parent_id === null && showInputComment === true" class="input-reply-comment is-flex">
            <div class="mr-10">
                <figure class="image is-36x36">
                    <img class="is-rounded" :src="user.avatar" alt=""/>
                </figure>
            </div>

            <div class="container-input-comment">
                <b-input v-if="isLockPost" placeholder="Bài viết đã bị khóa" disabled rounded></b-input>
                <ckeditor v-else :editor="editor" v-model="valueReplyComment" :config="editorConfig"/>
            </div>

            <div v-if="isLockPost !== true" class="btn-send-comment is-flex" @click="sendChildComment()">
                <svg height="25px" width="25px" viewBox="0 0 24 24">
                    <path class="icon-send"
                          d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"
                          stroke="none"></path>
                </svg>
            </div>
        </div>
    </div>
</template>

<script>
    import CKEditor from "@ckeditor/ckeditor5-vue";
    import BalloonEditor from "@ckeditor/ckeditor5-build-balloon";

    export default {
        name: "Comment",
        props: {
            comment: {
                type: Object,
                default: {}
            },
            isLockPost: false
        },
        components: {
            'ckeditor': CKEditor.component,
            BalloonEditor
        },
        data() {
            return {
                showInputComment: false,
                showMenuComment: false,
                valueReplyComment: '',
                showPopup: false,
                showActionComment: false,
                editor: BalloonEditor,
                editorConfig: {
                    placeholder: 'Viết bình luận...'
                }
            }
        },
        computed: {
            styleDisplayPopup() {
                return this.showPopup === false ? {display: "none"} : {}
            },
            user() {
                return this.$store.state.user;
            }
        },
        methods: {
            sendChildComment: async function () {
                if (this.valueReplyComment.length > 0) {
                    await this.$store.dispatch('addChildCommentAction', {
                        'post_id': this.$props.comment.post_id,
                        'user_owner_id': this.$store.state.user.user_id,
                        'parent_id': this.$props.comment.comment_id,
                        'content': this.valueReplyComment
                    });
                    this.valueReplyComment = '';
                }
            }
            ,
            openInputComment: function () {
                this.showInputComment = true;
            }
            ,
            deleteComment: async function () {
                if (this.comment.parent_id !== undefined && this.comment.parent_id !== null) {
                    await this.$store.dispatch('removeChildCommentAction', {
                        postId: this.comment.post_id,
                        parentId: this.comment.parent_id,
                        commentId: this.comment.comment_id
                    });
                } else {
                    await this.$store.dispatch('removeCommentAction', {
                        postId: this.comment.post_id,
                        commentId: this.comment.comment_id
                    });
                }
            }
            ,
            updateUserStatus: async function () {
                let userStatus = this.comment.user_status === 'like' ? 'normal' : 'like';

                await this.$store.dispatch('updateUserStatusCommentAction', {
                    postId: this.comment.post_id,
                    parentId: this.comment.parent_id,
                    userComment: {
                        'user_id': this.$store.state.user.user_id,
                        'comment_id': this.comment.comment_id,
                        'user_status': userStatus
                    }
                })
            },
            switchOpenMenuComment: function () {
                this.showMenuComment = !this.showMenuComment
                this.showPopup = this.showMenuComment === true;
            },
            closePopup: function () {
                this.showMenuComment = false;
                this.showPopup = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container-comment {
        display: flex;
        flex-direction: column;
    }

    .parent-comment {
        display: flex;
        flex-direction: row;
        margin-top: 5px;
    }

    .container-comment-content {
        display: flex;
        position: relative;
    }

    .comment-content {
        display: flex;
        flex-direction: column;
        background-color: #f0f2f5;
        padding: 5px 10px;
        border-radius: 20px;
        position: relative;
    }

    .child-comment {
        margin-left: 48px;

        figure {
            height: 36px;
            width: 36px;
        }
    }

    .right-parent-comment {
        display: flex;
        flex-direction: column;
    }

    .action-comment-bottom {
        padding-left: 10px;

        span {
            font-size: 12px;
            font-weight: 700;
            margin-right: 5px;
            cursor: pointer;
        }
    }

    .input-reply-comment {
        align-items: center;
        margin-left: 50px;
        margin-right: 50px;
        padding: 10px;
    }

    .action-comment-right {
        position: relative;
        margin-left: 10px;
        display: flex;
        justify-content: center;
        align-items: center;

        :hover {
            cursor: pointer;
        }
    }

    .menu-comment {
        position: absolute;
        top: 50px;
        border-radius: 10px;
        background-color: #ffffff;
        box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        padding: 10px;
        width: 200px;
        height: 100px;

        span {
            font-weight: 600;
        }
    }

    .status-user-comment {
        position: absolute;
        bottom: -10px;
        right: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #ffffff;
        box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        padding: 0 2px;

        img {
            width: 16px;
            height: 16px;
            margin-right: 5px;
        }

        :hover {
            cursor: pointer;
        }

        span {
            font-size: 14px;
        }
    }
</style>
