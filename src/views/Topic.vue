<template>
    <div>
        <Navbar/>
        <div class="container container-topic">
            <div class="container-header-topic">
                <div class="background-topic" v-bind:style="{'background-image': `url('${topic.background_image}')`}">
                    <div class="avatar-topic">
                        <figure class="image">
                            <img class="is-rounded" :src="topic.avatar" alt=""/>
                        </figure>
                    </div>
                </div>
                <div class="card card-header-topic">
                    <div>
                        <h1 class="title title-topic">{{topic.name}}</h1>
                        <h6 class="subtitle is-6">{{topic.intro}}</h6>
                    </div>

                    <div class="description">
                        <p>{{topic.description}}</p>
                    </div>

                    <div class="menu-header">
                        <div class="topic-info-header">
                            <span>100 bài viết</span>
                        </div>
                        <div class="topic-info-header">
                            <span>{{topic.number_follow}} người theo dõi</span>
                        </div>
                        <div>
                            <button class="button is-primary" @click="updateUserStatus">
                                <div v-if="topic.user_status === 'follow'">
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
                        </div>
                    </div>

                    <div class="navbar-menu-topic">
                        <b-tabs v-model="activeTab" @change="changeTab">
                            <b-tab-item label="Bài viết">
                            </b-tab-item>

                            <b-tab-item label="Người dùng">
                            </b-tab-item>
                        </b-tabs>
                    </div>
                </div>
            </div>

            <div class="container-content">
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
            </div>
        </div>
    </div>
</template>

<script>
    import Navbar from "../components/Navbar";
    import Post from "../components/Post";
    import * as TopicService from "../services/topic_service";

    export default {
        name: "Topic",
        components: {
            Navbar,
            Post
        },
        props: {
            query: Object
        },
        data() {
            return {
                activeTab: 0,
                topic: Object,
                followers: []
            }
        },
        computed: {
            posts() {
                return this.$store.state.posts;
            }
        },
        mounted() {
            this.getPostByTopic();
        },
        methods: {
            getTopic: async function () {
                let topicId = this.$props.query.topicId;
                let response = await TopicService.getById(topicId);
                this.topic = response.data;
            },
            getPostByTopic: async function () {
                await this.getTopic();
                await this.$store.dispatch('getPostByTopicIdAction', this.topic.topic_id);
            },
            updateUserStatus: async function () {
                let userStatus = '';
                let updatedNumberFollow = 0;
                if (this.topic.user_status === 'follow') {
                    userStatus = 'unfollow';
                    updatedNumberFollow = -1;
                } else {
                    userStatus = 'follow';
                    updatedNumberFollow = 1;
                }

                await TopicService.updateUserStatus({
                    'user_id': this.$store.state.user.user_id,
                    'topic_id': this.topic.topic_id,
                    'user_status': userStatus
                });

                this.topic.number_follow += updatedNumberFollow;
                this.topic.user_status = userStatus;
            },
            changeTab: async function () {
                if (this.activeTab === 1) {
                    let response = await TopicService.getFollowerByTopicId(this.topic.topic_id);
                    this.followers = response.data;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container-topic {
        padding-top: 80px;
        max-width: 960px;
    }

    .title-topic {
        font-weight: 700;
        margin-top: 20px;
    }

    .container-header-topic {
        .background-topic {
            position: relative;
            height: 300px;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            background-position: center center;
            background-size: cover;
            background-repeat: no-repeat;

            .avatar-topic {
                position: absolute;
                z-index: 1000;
                bottom: -30px;
                left: 30px;
                background: #ffffff;
                width: 180px;
                height: 180px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            img {
                width: 170px;
                height: 170px;
            }
        }

        .card-header-topic {
            padding: 20px;
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;

            .description {
                margin-top: 10px;

                p {
                    color: #0a0a0a !important;
                }
            }
        }
    }

    .menu-header {
        margin-top: 20px;
        display: flex;
        align-items: center;

        .topic-info-header {
            margin-right: 20px;

            span {
                font-weight: 500;
            }
        }
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
</style>

<style lang="scss">
    .navbar-menu-topic {
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