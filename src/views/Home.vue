<template>
    <div>
        <Navbar/>
        <div class="container container-list-post">
            <div class="custom-card card-header-post">
                <div>
                    <figure class="image is-40x40">
                        <router-link to="/">
                            <img v-if="user != null" class="is-rounded" :src="user.avatar" alt=""/>
                            <img v-else class="is-rounded" :src="DEFAULT_AVATAR" alt="DEFAULT_AVATAR"/>
                        </router-link>
                    </figure>
                </div>
                <div class="input-card-header-post">
                    <input @click="showAddPostModal = true" class="input is-rounded" type="text"
                           placeholder="Bạn đang nghĩ gì..." readonly>
                </div>
            </div>

            <Post v-for="post in posts" :key="post.post_id" :post="post"/>
        </div>

        <b-modal :active.sync="showAddPostModal" :width="600" scroll="keep">
            <div class="custom-modal custom-card">
                <div class="card-header justify-content-center">
                    <h1>Tạo bài viết</h1>
                </div>
                <div class="card-content">
                    <div class="is-flex">
                        <div>
                            <figure class="image is-40x40">
                                <router-link to="/">
                                    <img v-if="user != null" class="is-rounded" :src="user.avatar" alt=""/>
                                    <img v-else class="is-rounded" :src="DEFAULT_AVATAR" alt=""/>
                                </router-link>
                            </figure>
                        </div>
                        <div class="align-item-center">
                            <span v-if="user != null"><b>{{user.name}}</b></span>
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
                        <button class="button is-info" @click="sendPost">Đăng</button>
                    </div>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import Navbar from "../components/Navbar";
    import Post from "../components/Post";
    import firebase from "firebase";
    import {Constant} from "../commons/constant";
    import CKEditor from "@ckeditor/ckeditor5-vue";
    import BalloonEditor from "@ckeditor/ckeditor5-build-balloon";

    export default {
        name: "Home",
        components: {
            Navbar,
            Post,
            'ckeditor': CKEditor.component,
            BalloonEditor
        },
        data() {
            return {
                showAddPostModal: false,
                postContent: '',
                imageData: null,
                imageName: '',
                imagePreviewUrl: null,
                DEFAULT_AVATAR: Constant.DEFAULT_AVATAR,
                editor: BalloonEditor,
                editorConfig: {
                    placeholder: 'Bạn đang nghĩ gì...'
                }
            }
        },
        computed: {
            posts() {
                return this.$store.state.posts;
            },
            user() {
                return this.$store.state.user;
            }
        },
        mounted() {
            this.getUser();
            this.getPostByUser();
        },
        methods: {
            getUser: async function () {
                let user = localStorage.getItem('user');
                await this.$store.dispatch('setUserAction', JSON.parse(user));
            },
            getPostByUser: async function () {
                let user = JSON.parse(localStorage.getItem('user'));
                if (user === null) {
                    await this.$store.dispatch('getTrendingPostAction');
                } else {
                    await this.$store.dispatch('getPostByUserIdAction', this.user.user_id);
                }
            },
            sendPost: async function () {
                if (this.postContent.length > 0) {
                    await this.$store.dispatch('addPostAction', {
                        'user_owner_id': this.$store.state.user.user_id,
                        'content': this.postContent,
                        'images': [this.imagePreviewUrl]
                    }).then(result => {
                        this.postContent = '';
                        this.imageData = null;
                        this.imageName = '';
                        this.imagePreviewUrl = null;
                    });

                    this.showAddPostModal = false;
                }
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
            }
        }
    };
</script>

<style lang="scss" scoped>
    .container-list-post {
        margin-top: 30px;
        max-width: 640px;
    }

    .card-header-post {
        display: flex;
        padding: 10px 20px;

        input {
            background-color: #f0f2f5;
        }
    }

    .input-card-header-post {
        display: flex;
        width: 100%;
        align-items: center;
        padding-left: 10px;

        :hover {
            cursor: pointer;
        }
    }

    .card-header {
        padding-bottom: 10px;

        h1 {
            font-size: 1.25rem;
            font-weight: 700;
        }
    }

    .card-content {
        padding: 10px;

        .align-item-center {
            margin-left: 10px;
        }

        .field {
            margin-top: 10px;
            margin-bottom: 20px;


            .ck-blurred {
                border: none !important;
                box-shadow: none !important;
                -webkit-box-shadow: none !important;
            }
        }

        .button {
            width: 100%;
        }
    }

    .textarea-none-border {
        border: none;
        resize: none;
        box-shadow: none;
        -webkit-box-shadow: none !important;
    }

    .menu-bottom-popup-add-post {
        display: flex;
        align-items: center;
        justify-content: space-between;

        border: 1px solid #ced0d4;
        padding: 10px;
        border-radius: 10px;
        margin: 20px 0;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

        div > span {
            font-weight: 600;
        }
    }

    #fileInput {
        display: none;
    }

    .image-upload {
        position: relative;
    }

    .preview-image {
        position: relative;
    }

    .btn-upload-image {
        :hover {
            cursor: pointer;
        }
    }

    .btn-remove-image {
        width: 30px;
        height: 30px;
        background: #f0f2f5;;
        position: absolute;
        right: 5px;
        top: 5px;
        border-radius: 50%;

        display: flex;
        justify-content: center;
        align-items: center;

        :hover {
            cursor: pointer;
        }
    }
</style>
