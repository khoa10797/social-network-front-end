<template>
    <div class="custom-card card">
        <div class="container-popup" :style="styleDisplayPopup" @click="closePopup">
        </div>

        <div v-if="showMenuPost" class="menu-post">
            <ul class="menu-list">
                <li v-if="user.user_id === post.user_owner.user_id">
                    <a @click="confirmDeletePostDialog">
                        <i class="far fa-trash-alt"></i>
                        <span>Xóa bài</span>
                    </a>
                </li>
                <li v-if="user.user_id === post.user_owner.user_id" @click="showUpdatePost">
                    <a>
                        <i class="far fa-edit"></i>
                        <span>Chỉnh sửa</span>
                    </a>
                </li>
                <li v-if="user.user_id !== post.user_owner.user_id">
                    <a @click="bookmarkPost">
                        <i class="far fa-bookmark"></i>
                        <span v-if="isBookmarkPost">Bỏ lưu bài viết</span>
                        <span v-else>Lưu bài viết</span>
                    </a>
                </li>
                <li v-if="roleUser === 'ADMIN' || user.user_id === post.user_owner.user_id">
                    <a @click="lockPost">
                        <i v-if="isLockPost" class="fas fa-lock-open"></i>
                        <i v-else class="fas fa-lock"></i>
                        <span v-if="isLockPost">Mở khóa bài viết</span>
                        <span v-else>Khóa bài viết</span>
                    </a>
                </li>
            </ul>
        </div>

        <div class="post-top">
            <div class="post-header">
                <PostUserInfo :user="post.user_owner" :time="post.created_at"/>
                <div class="btn-menu-post" @click="switchOpenMenuPost">
                    <div>
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            </div>

            <div v-if="post.title !== undefined && post.title != null">
                <h4 class="title is-4">{{post.title}}</h4>
            </div>

            <div v-html="postContent" class="post-content has-text-black">

            </div>
        </div>

        <div class="card-image">
            <img :src="post.images[0]" @click="showLightBox" alt=""/>
        </div>
        <LightBox ref="lightbox" :media="lightBoxMedia" :showLightBox="isShowLightBox"></LightBox>

        <div class="container-action-post">
            <div class="action-post">
                <div>
                    <button v-if="user.active !== false" class="button is-white" v-on:click="updateUserStatus">
                        <svg v-if="post.user_status === 'like'" width="24px" height="24px" viewBox="0 0 24 24">
                            <g id="upvote" stroke-width="1.8" stroke="#2e69ff" fill="#2e69ff" fill-rule="evenodd"
                               stroke-linejoin="round">
                                <polygon points="12 4 3 15 9 15 9 20 15 20 15 15 21 15"></polygon>
                            </g>
                        </svg>
                        <svg v-else width="24px" height="24px" viewBox="0 0 24 24">
                            <g id="upvote" stroke-width="1.5" stroke="#666" fill="none" fill-rule="evenodd"
                               stroke-linejoin="round">
                                <polygon points="12 4 3 15 9 15 9 20 15 20 15 15 21 15"></polygon>
                            </g>
                        </svg>
                        {{post.number_like}}
                    </button>
                    <button v-else class="button is-white" disabled>
                        <svg v-if="post.user_status === 'like'" width="24px" height="24px" viewBox="0 0 24 24">
                            <g id="upvote" stroke-width="1.8" stroke="#2e69ff" fill="#2e69ff" fill-rule="evenodd"
                               stroke-linejoin="round">
                                <polygon points="12 4 3 15 9 15 9 20 15 20 15 15 21 15"></polygon>
                            </g>
                        </svg>
                        <svg v-else width="24px" height="24px" viewBox="0 0 24 24">
                            <g id="upvote" stroke-width="1.5" stroke="#666" fill="none" fill-rule="evenodd"
                               stroke-linejoin="round">
                                <polygon points="12 4 3 15 9 15 9 20 15 20 15 15 21 15"></polygon>
                            </g>
                        </svg>
                        {{post.number_like}}
                    </button>
                    <button class="button is-white" v-on:click="loadComment">
                        <svg width="24px" height="24px" viewBox="0 0 24 24">
                            <g id="comment" class="icon_svg-stroke icon_svg-fill" stroke="#666" stroke-width="1.5"
                               fill="none" fill-rule="evenodd">
                                <path d="M12.0711496,18.8605911 C16.1739904,18.8605911 19.5,15.7577921 19.5,11.9302955 C19.5,8.102799 16.1739904,5 12.0711496,5 C7.96830883,5 4.64229922,8.102799 4.64229922,11.9302955 C4.64229922,13.221057 5.02055525,14.429401 5.67929998,15.4641215 C5.99817082,15.9649865 4.1279592,18.5219189 4.56718515,18.9310749 C5.02745574,19.3598348 7.80252458,17.6358115 8.37002246,17.9406001 C9.45969688,18.5258363 10.7235179,18.8605911 12.0711496,18.8605911 Z"></path>
                            </g>
                        </svg>
                        {{post.number_comment}}
                    </button>
                </div>

                <!--<div>
                    <button class="button is-white">
                        <svg width="24px" height="24px" viewBox="0 0 24 24">
                            <g id="downvote" class="icon_svg-stroke icon_svg-fill" stroke="#666" fill="none"
                               stroke-width="1.5" fill-rule="evenodd" stroke-linejoin="round">
                                <polygon
                                        transform="translate(12.000000, 12.000000) rotate(-180.000000) translate(-12.000000, -12.000000) "
                                        points="12 4 3 15 9 15 9 20 15 20 15 15 21 15"></polygon>
                            </g>
                        </svg>
                    </button>
                </div>-->
            </div>
        </div>

        <div v-if="showInputComment" class="container-comment">
            <div class="input-comment is-flex">
                <div class="mr-10">
                    <figure class="image is-40x40">
                        <img class="is-rounded" :src="user.avatar" alt=""/>
                    </figure>
                </div>

                <div class="container-input-comment">
                    <b-input v-if="user.active === false" placeholder="Tài khoản đã bị khóa" disabled rounded></b-input>
                    <div v-else>
                        <b-input v-if="isLockPost" placeholder="Bài viết đã bị khóa" disabled rounded></b-input>
                        <ckeditor v-else :editor="editor" v-model="valueComment"
                                  :config="editorConfig"/>
                    </div>
                </div>

                <div v-if="isLockPost !== true && user.active !== false" class="btn-send-comment is-flex"
                     @click="sendComment">
                    <svg height="30px" width="30px" viewBox="0 0 24 24">
                        <path class="icon-send"
                              d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"
                              stroke="none"></path>
                    </svg>
                </div>
            </div>
            <div class="list-item">
                <Comment v-for="comment in comments" :key="comment.comment_id"
                         :comment="comment" :is-lock-post="isLockPost"/>
            </div>
        </div>

        <b-modal :active.sync="showEditPostModal" :width="600" scroll="keep">
            <div class="custom-modal custom-card">
                <div class="card-header justify-content-center">
                    <h1>Chỉnh sửa bài viết</h1>
                </div>
                <div class="card-content">
                    <div class="is-flex">
                        <div>
                            <figure class="image is-40x40">
                                <router-link to="/">
                                    <img v-if="post.user_owner != null" class="is-rounded" :src="post.user_owner.avatar"
                                         alt=""/>
                                    <img v-else class="is-rounded" :src="DEFAULT_AVATAR" alt=""/>
                                </router-link>
                            </figure>
                        </div>
                        <div class="align-item-center">
                            <span v-if="post.user_owner != null"><b>{{post.user_owner.name}}</b></span>
                        </div>
                    </div>

                    <div class="field">
                        <ckeditor :editor="editor" v-model="postContent" :config="editorConfig"/>
                    </div>

                    <div class="image-upload">
                        <input id="fileInput" type="file" @change="previewImage" accept="image/*"></input>

                        <div class="preview-image">
                            <div v-if="imagePreviewUrl != null" class="btn-remove-image" @click="removeImage">
                                <i class="fas fa-times"></i>
                            </div>
                            <img :src="imagePreviewUrl" alt="">
                        </div>
                    </div>

                    <div class="menu-bottom-popup-add-post">
                        <div>
                            <span>Thêm vào bài viết</span>
                        </div>
                        <div class="btn-upload-image">
                            <label for="fileInput">
                                <figure>
                                    <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 32 32"
                                    >
                                        <path
                                                class="path1"
                                                d="M9.5 19c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5-6.5 2.91-6.5 6.5zM30 8h-7c-0.5-2-1-4-3-4h-8c-2 0-2.5 2-3 4h-7c-1.1 0-2 0.9-2 2v18c0 1.1 0.9 2 2 2h28c1.1 0 2-0.9 2-2v-18c0-1.1-0.9-2-2-2zM16 27.875c-4.902 0-8.875-3.973-8.875-8.875s3.973-8.875 8.875-8.875c4.902 0 8.875 3.973 8.875 8.875s-3.973 8.875-8.875 8.875zM30 14h-4v-2h4v2z"
                                        ></path>
                                    </svg>
                                </figure>
                            </label>
                        </div>
                    </div>

                    <div>
                        <button class="button is-info" @click="updatePost">Sửa</button>
                    </div>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import PostUserInfo from "./PostUserInfo";
    import Comment from "./Comment";
    import CKEditor from "@ckeditor/ckeditor5-vue";
    import BalloonEditor from "@ckeditor/ckeditor5-build-balloon";
    import firebase from "firebase";
    import LightBox from "vue-image-lightbox";
    import {Constant} from "../commons/constant";
    import * as PostService from '../services/post_service';

    export default {
        name: "Post",
        components: {
            PostUserInfo,
            Comment,
            'ckeditor': CKEditor.component,
            BalloonEditor,
            LightBox
        },
        props: {
            post: Object
        },
        data() {
            return {
                valueComment: '',
                showMenuPost: false,
                showInputComment: false,
                postContent: '',
                showPopup: false,
                showEditPostModal: false,
                imagePreviewUrl: null,
                imageName: '',
                DEFAULT_AVATAR: Constant.DEFAULT_AVATAR,
                editor: BalloonEditor,
                editorConfig: {
                    placeholder: 'Viết bình luận...'
                },
                lightBoxMedia: [],
                isShowLightBox: false,
                isBookmarkPost: false,
                roleUser: '',
                isLockPost: false
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
                        'user_owner_id': this.$store.state.user.user_id,
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
                            console.log(error);
                            switch (error.status) {
                                case 500:
                                    this.$buefy.toast.open({
                                        message: 'Có lỗi xảy ra!',
                                        type: 'is-danger'
                                    });
                                    return
                                case 401:
                                    this.$buefy.toast.open({
                                        message: 'Bạn không có quyền thực hiện chức năng này!',
                                        type: 'is-danger'
                                    });
                                    return;
                                default:
                                    this.$buefy.toast.open({
                                        message: error.message,
                                        type: 'is-danger'
                                    });
                            }
                        })
                    }
                })
            },
            switchOpenMenuPost: function () {
                this.showMenuPost = !this.showMenuPost
                this.showPopup = this.showMenuPost === true;
            },
            closePopup: function () {
                this.showMenuPost = false;
                this.showPopup = false;
            },
            previewImage: function (event) {
                this.imageData = event.target.files[0];
                this.uploadImage();
            },
            uploadImage: function () {
                let fileName = this.imageData.name.split('.');
                this.imageName = fileName[0] + this.$moment(new Date()).format('YYYYMMDD_hhmmss') + '.' + fileName[1];

                const storageRef = firebase.storage().ref(`/images/${this.imageName}`);
                let uploadTask = storageRef.put(this.imageData);

                uploadTask.on(`state_changed`, snapshot => {
                    }, error => {
                        console.log(error.message)
                    },
                    () => {
                        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                            this.imagePreviewUrl = url;
                        });
                    }
                );
            },
            removeImage: function () {
                const storageRef = firebase.storage().ref();
                let desertRef = storageRef.child(`images/${this.imageName}`);
                desertRef.delete().then(() => {
                    this.imagePreviewUrl = null;
                }).catch(function (error) {
                    console.log(error)
                });
            },
            updatePost: async function () {
                if (this.postContent.length > 0) {
                    await this.$store.dispatch('updatePostAction', {
                        'post_id': this.post.post_id,
                        'user_owner_id': this.$store.state.user.user_id,
                        'title': this.postTitle,
                        'content': this.postContent,
                        'images': [this.imagePreviewUrl]
                    }).then(result => {
                        this.imageData = null;
                        this.imageName = '';
                        this.post.images = [this.imagePreviewUrl];
                        this.imagePreviewUrl = null;
                    });

                    this.showEditPostModal = false;
                }
            },
            showUpdatePost: function () {
                this.showEditPostModal = true;
                this.showMenuPost = false;
                this.showPopup = false
                if (this.post.images !== undefined && this.post.images !== null && this.post.images[0] !== undefined && this.post.images[0] !== null) {
                    this.imagePreviewUrl = this.post.images[0];
                    this.imageName = decodeURIComponent(this.imagePreviewUrl.split('?')[0].split('images')[1]);
                }
            },
            showLightBox() {
                this.$refs.lightbox.showImage(0)
            },
            bookmarkPost: async function () {
                let bookmark = true;
                if (this.post.bookmark === true) {
                    bookmark = false;
                }

                await PostService.bookmarkPost({
                    'user_id': this.user.user_id,
                    'post_id': this.post.post_id,
                    'bookmark': bookmark
                });

                this.showMenuPost = false;
                this.isBookmarkPost = bookmark;
            },
            getRoleUser: function () {
                this.roleUser = this.user.role_group_ids[0];
            },
            getLock: function () {
                this.isLockPost = this.post.lock;
            },
            lockPost: async function () {
                let lock = true;
                if (this.isLockPost)
                    lock = false

                await PostService.lockPost({
                    postId: this.post.post_id,
                    lock: lock
                });
                this.isLockPost = lock;
                this.showMenuPost = false;
            }
        },
        computed: {
            comments() {
                let post = this.$store.state.posts.find(it => it.post_id === this.post.post_id);
                return post ? post.comments : [];
            },
            styleDisplayPopup() {
                return this.showPopup === false ? {display: "none"} : {}
            },
            user() {
                return this.$store.state.user;
            }
        },
        mounted() {
            this.getRoleUser();
            this.getLock();
            this.isBookmarkPost = this.post.bookmark;
            this.postContent = this.post.content;
            this.post.images.forEach(item => {
                this.lightBoxMedia.push({thumb: item, src: item});
            });
        }
    };
</script>

<style lang="scss" scoped>
    .list-item {
        padding-left: 15px;
        padding-right: 15px;
    }

    .post-top {
        padding: 0 5px;
    }

    .container-action-post {
        padding: 0 15px;
    }

    .action-post {
        display: flex;
        justify-content: space-between;
    }

    .container-comment {
        display: flex;
        flex-direction: column;
    }

    .input-comment {
        align-items: center;
        padding-left: 15px;
        padding-right: 15px;
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

    .custom-card {
        h1 {
            font-size: 1.25rem;
            font-weight: 700;
        }
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

    .card-image {
        max-height: 400px;
        overflow: hidden;
        height: 100%;

        :hover {
            cursor: pointer;
        }

        img {
            margin: 0 auto;
            display: block;
        }

    }
</style>

<style lang="scss">
    .ck {
        border-radius: 20px !important;
        border: none !important;
        box-shadow: none !important;
    }

    .ck.ck-editor__editable_inline > :first-child {
        margin-top: 6px;
    }

    .ck.ck-editor__editable_inline > :last-child {
        margin-bottom: 6px;
    }

    .container-input-comment {
        border-radius: 20px;
        border: 1px solid #ced0d4;
        width: 100%;
    }

    .vue-lb-thumbnail-wrapper {
        display: none;
    }
</style>
