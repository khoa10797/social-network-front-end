<template>
    <div>
        <Navbar/>
        <div class="container container-list-post">
            <div class="custom-card card-header-post">
                <div>
                    <figure class="image is-40x40">
                        <router-link to="/">
                            <img class="is-rounded" :src="require(`@/assets/images/${user.avatar}`)" alt=""/>
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

        <b-modal :active.sync="showAddPostModal" :width="500" scroll="keep">
            <div class="custom-modal custom-card">
                <div class="card-header justify-content-center">
                    <h1> Tạo bài viết</h1>
                </div>
                <div class="card-content">
                    <div class="is-flex">
                        <div>
                            <figure class="image is-40x40">
                                <router-link to="/">
                                    <img class="is-rounded" :src="require(`@/assets/images/${user.avatar}`)" alt=""/>
                                </router-link>
                            </figure>
                        </div>
                        <div class="align-item-center">
                            <span><b>{{user.name}}</b></span>
                        </div>
                    </div>

                    <div class="field">
                        <div class="control">
                                <textarea class="textarea textarea-none-border"
                                          placeholder="Bạn đang nghĩ gì thế?"
                                          v-model="postContent">
                                </textarea>
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

    export default {
        name: "Home",
        components: {
            Navbar,
            Post
        },
        data() {
            return {
                showAddPostModal: false,
                postContent: ''
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
                await this.$store.dispatch('getUserByIdAction', '5e5bc9c6958dba414452a851');
            },
            getPostByUser: async function () {
                await this.$store.dispatch('getPostByUserIdAction', '5e5bc9c6958dba414452a851');
            },
            sendPost: async function () {
                if (this.postContent.length > 0) {
                    await this.$store.dispatch('addPostAction', {
                        'user_id': this.$store.state.user.user_id,
                        'content': this.postContent
                    });
                    this.showAddPostModal = false;
                    this.postContent = '';
                }
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
        padding: 20px 10px;

        .align-item-center {
            margin-left: 10px;
        }

        .field {
            margin-top: 10px;
            margin-bottom: 20px;
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
</style>
