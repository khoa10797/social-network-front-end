<template>
    <div>
        <Navbar/>
        <div class="container container-list-post">
            <div class="menu-topic">
                <ul class="menu-list">
                    <li v-for="topic in allTopic" :key="topic.topic_id">
                        <div>
                            <router-link :to="{path: 'topic', query: {topicId: topic.topic_id}}">
                                <div class="custom-menu-item">
                                    <img v-if="topic.icon != null && topic.icon !== undefined" :src="topic.icon" alt="">
                                    <img v-else :src="DEFAULT_AVATAR" alt="">
                                    <span>{{topic.name}}</span>
                                </div>
                            </router-link>
                        </div>
                    </li>
                </ul>
            </div>

            <div>
                <div v-if="user != null" class="custom-card card-header-post">
                    <div>
                        <figure class="image is-40x40">
                            <router-link to="/">
                                <img v-if="user != null" class="is-rounded" :src="user.avatar" alt=""/>
                                <img v-else class="is-rounded" :src="DEFAULT_AVATAR" alt="DEFAULT_AVATAR"/>
                            </router-link>
                        </figure>
                    </div>
                    <div class="input-card-header-post">
                        <input v-if="user.active !== false" @click="showAddPostModal = true" class="input is-rounded"
                               type="text"
                               placeholder="Bạn đang nghĩ gì..." readonly>
                        <input v-else class="input is-rounded"
                               type="text"
                               placeholder="Tài khoản đã bị khóa..." readonly>
                    </div>
                </div>

                <Post v-for="post in posts" :key="post.post_id" :post="post"/>
            </div>
        </div>

        <b-modal :active.sync="showAddPostModal" :width="600" scroll="keep">
            <div class="custom-modal custom-card">
                <div class="card-header justify-content-center">
                    <h1>Bạn đang nghĩ gì</h1>
                </div>
                <div class="card-content">
                    <div class="is-flex" style="justify-content: space-between">
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

                        <div class="choose-topic">
                            <b-select placeholder="Chọn chủ đề" size="is-small" v-model="topicId" rounded>
                                <option v-for="item in chooseTopic" :value="item.topic_id">
                                    {{item.name}}
                                </option>
                            </b-select>
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
    import * as TopicService from "../services/topic_service";

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
                postTitle: '',
                imageData: null,
                imageName: '',
                imagePreviewUrl: null,
                DEFAULT_AVATAR: Constant.DEFAULT_AVATAR,
                editor: BalloonEditor,
                editorConfig: {
                    placeholder: 'Nhập nội dung...'
                },
                topicId: '',
                chooseTopic: [],
                allTopic: []
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
            this.getPostByUser().then(user => {
                this.getTopic();
            })
        },
        methods: {
            getPostByUser: async function () {
                let user = JSON.parse(localStorage.getItem('user'));
                if (user === null) {
                    await this.$store.dispatch('getTrendingPostAction');
                } else {
                    await this.$store.dispatch('getSuggestPost', {});
                }
            },
            sendPost: async function () {
                if (this.postContent.length > 0) {
                    console.log(this.topicId)
                    debugger
                    await this.$store.dispatch('addPostAction', {
                        'topic_id': this.topicId,
                        'user_owner_id': this.$store.state.user.user_id,
                        'title': this.postTitle,
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
            },
            getTopic: async function () {
                this.chooseTopic = (await TopicService.getAll()).data;
                this.allTopic = (await TopicService.getAll()).data;
            }
        }
    };
</script>

<style lang="scss" scoped>
    .container-list-post {
        display: grid;
        grid-template-columns: 250px 1fr;
        padding-top: 80px;
        max-width: 950px;
        grid-column-gap: 20px;
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

    .textarea-none-border {
        border: none;
        resize: none;
        box-shadow: none;
        -webkit-box-shadow: none !important;
    }

    .menu-topic {

        .menu-list {
            .custom-menu-item {
                display: grid;
                grid-template-columns: 30px 1fr;
                grid-column-gap: 20px;
                align-items: center;
                height: 100%;
                border-radius: 5px;
                padding: 0 10px;

                span {
                    font-weight: 500;
                }
            }

            li {

                > div {

                    padding: 10px 0;

                }

                :hover {
                    cursor: pointer;
                    background-color: #e4e6eb;
                }
            }

            a {
                padding: unset;
                height: 100%;
                border-radius: 5px;
            }
        }
    }

    .choose-topic {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<style lang="scss">
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
</style>
