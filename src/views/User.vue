<template>
    <div>
        <Navbar/>
        <div class="container container-user">
            <div class="card custom-card-header">
                <div class="align-item-center">
                    <div class="avatar-user">
                        <figure class="image is-128x128">
                            <img class="is-rounded" :src="viewedUser.avatar" alt=""/>
                        </figure>
                    </div>

                    <div>
                        <h1 class="title custom-title">{{viewedUser.name}}</h1>
                        <h5 class="subtitle is-5">{{viewedUser.intro}}</h5>
                    </div>
                </div>

                <div class="user-description">
                    <p>{{viewedUser.description}}</p>
                </div>

                <div class="menu-header">
                    <button v-if="user.user_id !== viewedUser.user_id" class="button is-primary is-small is-rounded"
                            @click="followUser">
                        <div v-if="viewedUser.user_status === 'follow'">
                                    <span class="icon is-small">
                                        <i class="fas fa-check"></i>
                                    </span>
                            <span>Đã theo dõi</span>
                        </div>
                        <div v-else>
                                    <span class="icon is-small">
                                        <i class="fas fa-plus-square"></i>
                                    </span>
                            <span>Theo dõi</span>
                        </div>
                    </button>

                    <div class="topic-info-header">
                        <span>{{numberPost}} bài viết</span>
                    </div>

                    <div class="topic-info-header">
                        <span>2 người theo dõi</span>
                    </div>
                </div>

                <div class="navbar-menu-user">
                    <b-tabs v-model="activeTab">
                        <b-tab-item label="Bài viết">
                        </b-tab-item>

                        <b-tab-item label="Người dùng">
                        </b-tab-item>

                        <b-tab-item label="Chủ đề">
                        </b-tab-item>

                        <b-tab-item v-if="user.user_id === viewedUser.user_id" label="Đã lưu" @click="getBookmarkPost">
                        </b-tab-item>
                    </b-tabs>
                </div>
            </div>

            <div>
                <div v-if="activeTab === 0">
                    <Post v-for="post in posts" :key="post.post_id" :post="post"/>
                </div>

                <div v-if="activeTab === 1">
                    <div class="card custom-card container-follower">
                        <div v-for="follower in followers" :key="follower.user_id">
                            <div class="follower">
                                <div>
                                    <figure class="image">
                                        <img :src="follower.avatar" alt="">
                                    </figure>
                                    <router-link :to="{path: 'user', query: {userId: follower.user_id}}">
                                        <p class="has-text-black is-text-decoration-line">
                                            <b>{{follower.name}}</b>
                                        </p>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="activeTab === 2">
                    <div class="card custom-card container-follower">
                        <div v-for="topic in topics" :key="topic.topic_id">
                            <div class="follower">
                                <div>
                                    <figure class="image">
                                        <img :src="topic.avatar" alt="">
                                    </figure>
                                    <router-link :to="{path: 'topic', query: {topicId: topic.topic_id}}">
                                        <p class="has-text-black is-text-decoration-line">
                                            <b>{{topic.name}}</b>
                                        </p>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="activeTab === 3">
                    <Post v-for="post in bookmarkPosts" :key="post.post_id" :post="post"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Navbar from "../components/Navbar";
    import Post from "../components/Post";
    import * as UserService from "../services/user_service";
    import * as TopicService from "../services/topic_service";
    import * as PostService from "../services/post_service";
    import {bookmarkPost} from "../services/post_service";

    export default {
        name: "User",
        components: {
            Navbar,
            Post
        },
        props: {
            query: Object
        },
        data() {
            return {
                viewedUser: Object,
                activeTab: 0,
                followers: [],
                topics: [],
                numberPost: null,
                bookmarkPosts: []
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
            this.getUser().then(user => {
                this.getPostByUser();
                this.getFollower();
                this.countNumberPost();
                this.getTopicFollow();
                this.getBookmarkPost();
            })
        },
        methods: {
            getUser: async function () {
                let userId = this.$props.query.userId;
                let response = await UserService.getById(userId);
                this.viewedUser = response.data;
            },
            getPostByUser: async function () {
                await this.$store.dispatch('getPostByUserIdAction', this.viewedUser.user_id);
            },
            getFollower: async function () {
                let userId = this.viewedUser.user_id;
                let response = await UserService.getFollower(userId);
                this.followers = response.data;
            },
            getTopicFollow: async function () {
                let userId = this.viewedUser.user_id;
                let response = await TopicService.getByUserFollow(userId);
                this.topics = response.data;
            },
            countNumberPost: async function () {
                let userId = this.viewedUser.user_id;
                let response = await PostService.countByUserOwner(userId);
                this.numberPost = response.data;
            },
            followUser: async function () {
                let userStatus = '';
                let updatedNumberFollow = 0;
                if (this.viewedUser.user_status === 'follow') {
                    userStatus = 'unfollow';
                    updatedNumberFollow = -1;
                } else {
                    userStatus = 'follow';
                    updatedNumberFollow = 1;
                }

                await UserService.followUser({
                    'user_id': this.$store.state.user.user_id,
                    'followed_user_id': this.viewedUser.user_id,
                    'user_status': userStatus
                });

                this.viewedUser.number_follow += updatedNumberFollow;
                this.viewedUser.user_status = userStatus;
            },
            getBookmarkPost: async function () {
                if (this.user.user_id !== this.viewedUser.user_id) {
                    return;
                }

                let response = await PostService.getBookmarkPost(this.user.user_id);
                this.bookmarkPosts = response.data;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container-user {
        padding-top: 80px;
        max-width: 960px;
    }

    .custom-card-header {
        padding: 20px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
    }

    .custom-title {
        font-weight: 700;
    }

    .avatar-user {
        margin-right: 20px;
    }

    .user-description {
        margin-top: 20px;
    }

    .container-follower {
        display: flex;
        flex-wrap: wrap;
        padding-left: 10px;
        padding-right: 10px;

        .follower {
            height: 100%;
            border-radius: 10px;
            box-shadow: 0 0 2px #0000001a;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;

            > div {
                display: flex;
                justify-content: center;
                align-items: center;

                span {
                    font-weight: 700;
                    color: #0a0a0a !important
                }
            }

            figure {
                width: 80px;
                height: 80px;
                margin-right: 20px;
            }
        }

        > div {
            height: 110px;
            width: 50%;
            padding: 5px;
        }
    }

    .menu-header {
        margin-top: 20px;
        display: flex;
        align-items: center;

        .topic-info-header {
            margin-left: 20px;

            span {
                font-weight: 500;
            }
        }
    }
</style>

<style lang="scss">
    .navbar-menu-user {
        margin-top: 20px;
        border-top: 1px solid #dbdbdb;

        .b-tabs {
            .tabs {
                span {
                    font-weight: 500;
                }
            }

            .tab-content {
                display: none;
            }

            .is-active {
                a {
                    border-bottom-width: 3px;
                    border-bottom-color: #3273dc;
                    border-bottom-style: solid;
                }
            }

            ul {
                border: none;

                a {
                    border: none;
                }
            }
        }
    }
</style>