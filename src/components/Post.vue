<template>
    <div class="custom-card card">
        <div v-if="showMenuPost" class="menu-post">
            <ul class="menu-list">
                <li>
                    <a @click="confirmDeletePostDialog">
                        <i class="far fa-trash-alt"></i>
                        <span>Xóa bài</span>
                    </a>
                </li>
                <li>
                    <a>
                        <i class="far fa-edit"></i>
                        <span>Chỉnh sửa</span>
                    </a>
                </li>
            </ul>
        </div>

        <div class="post-top">
            <div class="post-header">
                <PostUserInfo :avatar="post.user_owner.avatar" :user-name="post.user_owner.name"
                              :time="post.created_at"/>
                <div class="btn-menu-post" @click="showMenuPost = !showMenuPost">
                    <div>
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            </div>

            <div v-html="postContent" class="post-content has-text-black">

            </div>
        </div>

        <ImageGrid :images="post.images"/>

        <div class="post-info">
            <div>
                <router-link v-if="post.number_like > 0" :to="{path: '/abcd', query: {postId: post.post_id}}"
                             class="has-text-grey">
                    <i class="far fa-thumbs-up" style="font-size: 18px"></i>
                    {{post.number_like}}
                </router-link>
            </div>

            <div>
                <router-link v-if="post.number_comment > 0" :to="{path: '/abcd', query: {postId: post.post_id}}"
                             class="has-text-grey">
                    {{post.number_comment}} bình luận
                </router-link>
            </div>
        </div>

        <div class="container-action-post">
            <div class="action-post">
                <div class="columns is-mobile">
                    <button class="column button is-white" v-on:click="updateUserStatus">
                        <i class=" fas fa-thumbs-up" :style="styleBtnLikePost"></i>
                        Thích
                    </button>
                    <button class="column button is-white" v-on:click="loadComment">
                        <i class="far fa-comment"></i> Bình luận
                    </button>
                    <button class="column button is-white">
                        <i class="far fa-share-square"></i> Chia sẻ
                    </button>
                </div>
            </div>
        </div>

        <div v-if="showInputComment" class="container-comment">
            <div class="input-comment is-flex">
                <div class="mr-10">
                    <figure class="image is-40x40">
                        <img class="is-rounded" :src="post.user_owner.avatar" alt=""/>
                    </figure>
                </div>

                <ResizableInput
                        style="background-color: #f0f2f5"
                        placeholder="Viết bình luận..."
                        v-model="valueComment"
                        rows="1"
                />

                <div class="btn-send-comment is-flex" @click="sendComment">
                    <svg height="30px" width="30px" viewBox="0 0 24 24">
                        <path class="icon-send"
                              d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"
                              stroke="none"></path>
                    </svg>
                </div>
            </div>
            <div class="list-item">
                <Comment v-for="comment in comments" :key="comment.comment_id" :comment="comment"/>
            </div>
        </div>
    </div>
</template>

<script>
    import PostUserInfo from "./PostUserInfo";
    import ImageGrid from "./ImageGrid";
    import Comment from "./Comment";
    import ResizableInput from "./ResizableInput";

    export default {
        name: "Post",
        components: {
            PostUserInfo,
            ImageGrid,
            Comment,
            ResizableInput
        },
        props: {
            post: Object
        },
        data() {
            return {
                valueComment: '',
                showMenuPost: false,
                showInputComment: false,
                postContent: ''
            }
        },
        methods: {
            loadComment: async function () {
                await this.$store.dispatch('getCommentByPostIdAction', this.post.post_id);
                this.showInputComment = true;
            },
            sendComment: async function () {
                if (this.valueComment.length > 0) {
                    await this.$store.dispatch('addCommentAction', {
                        'post_id': this.$props.post.post_id,
                        'user_owner_id': this.$props.post.user_owner.user_id,
                        'content': this.valueComment
                    });
                    this.valueComment = '';
                }
            },
            updateUserStatus: async function () {
                let userStatus = this.$props.post.user_status === 'like' ? 'normal' : 'like';

                await this.$store.dispatch('updateUserStatusPostAction', {
                    'user_id': this.$store.state.user.user_id,
                    'post_id': this.$props.post.post_id,
                    'user_status': userStatus
                });
            },
            confirmDeletePostDialog: function () {
                this.showMenuPost = false;
                this.$buefy.dialog.confirm({
                    title: 'Xóa bài đăng',
                    message: 'Bạn có chắc muốn <b>xóa</b> bài đăng này? Hành động này không thể khôi phục.',
                    cancelText: 'Hủy',
                    confirmText: 'Xóa bài',
                    type: 'is-danger',
                    hasIcon: true,
                    onConfirm: () => {
                        this.$store.dispatch('removePostAction', this.post.post_id).then(result => {
                            this.$buefy.toast.open({
                                message: 'Xóa bài thành công!',
                                type: 'is-success'
                            });
                        }).catch(error => {
                            console.log(error)
                            if (error.code === 500) {
                                this.$buefy.toast.open({
                                    message: 'Có lỗi xảy ra!',
                                    type: 'is-danger'
                                });
                            } else {
                                this.$buefy.toast.open({
                                    message: error.message,
                                    type: 'is-danger'
                                });
                            }
                        })
                    }
                })
            }
        },
        computed: {
            comments() {
                let post = this.$store.state.posts.find(it => it.post_id === this.post.post_id);
                return post ? post.comments : [];
            },
            styleBtnLikePost() {
                return this.post.user_status === 'like' ? {color: "#2078F4"} : {}
            }
        },
        mounted() {
            this.postContent = this.post.content;
        }
    };
</script>

<style lang="scss" scoped>
    .list-item {
        padding-left: 20px;
        padding-right: 20px;
    }

    .post-top {
        padding: 0 10px;
    }

    .post-info {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 10px 20px;
    }

    .container-action-post {
        padding: 0 20px;
    }

    .action-post {
        border-top: #ced0d4 1px solid;
        border-bottom: #ced0d4 1px solid;

        .columns {
            margin: 0;
        }

        .button {
            padding: 0;
        }
    }

    .container-comment {
        display: flex;
        flex-direction: column;
    }

    .input-comment {
        align-items: center;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 10px;
    }

    .post-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .post-content {
        padding: 10px;
    }

    .btn-menu-post {
        position: relative;
        margin-right: 10px;

        div {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 30px;
            height: 30px;
            border: none;
            padding: unset;
            border-radius: 50%;
            -webkit-box-shadow: none !important;
        }

        :hover {
            background: #f0f2f5;
            cursor: pointer;
        }
    }

    .menu-post {
        position: absolute;
        width: 300px;
        right: 20px;
        top: 60px;
        padding: 10px;
        z-index: 1000;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.1);

        .menu-list {
            i {
                margin-right: 20px;
                font-size: 18px;
                width: 15px;
            }

            span {
                font-weight: 700;
            }
        }
    }
</style>
