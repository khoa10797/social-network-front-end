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

                <div class="navbar-menu-user">
                    <b-tabs v-model="activeTab">
                        <b-tab-item label="Dòng thời gian">
                        </b-tab-item>

                        <b-tab-item label="Giới thiệu">
                        </b-tab-item>

                        <b-tab-item label="Bài viết">
                        </b-tab-item>
                    </b-tabs>
                </div>
            </div>

            <div class="card">
                <div v-if="activeTab === 0">
                    <!--<h1 class="title is-1">Dòng thời gian</h1>-->
                    <Post v-for="post in posts" :key="post.post_id" :post="post"/>
                </div>

                <div v-if="activeTab === 1">
                    <h1 class="title is-1">Giới thiệu</h1>
                </div>

                <div v-if="activeTab === 2">
                    <h1 class="title is-1">Bài viết</h1>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Navbar from "../components/Navbar";
    import Post from "../components/Post";
    import * as UserService from "../services/user_service";

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
                activeTab: 0
            }
        },
        computed: {
            posts() {
                return this.$store.state.posts;
            }
        },
        mounted() {
            this.getPostByUser();
        },
        methods: {
            getUser: async function () {
                let userId = this.$props.query.userId;
                let response = await UserService.getById(userId);
                this.viewedUser = response.data;
            },
            getPostByUser: async function () {
                await this.getUser();
                await this.$store.dispatch('getPostByUserIdAction', this.viewedUser.user_id);
            },
        }
    }
</script>

<style lang="scss" scoped>
    .container-user {
        margin-top: 20px;
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