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
                        <b-tabs v-model="activeTab">
                            <b-tab-item label="Bài viết">
                            </b-tab-item>

                            <b-tab-item label="Người dùng">
                            </b-tab-item>
                        </b-tabs>
                    </div>
                </div>
            </div>

            <div>
                <div v-if="activeTab === 0">
                    <Post v-for="post in posts" :key="post.post_id" :post="post"/>
                </div>

                <div v-if="activeTab === 1">
                    <h1 class="title is-1">Giới thiệu</h1>
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
                topic: Object
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
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container-topic {
        margin-top: 20px;
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