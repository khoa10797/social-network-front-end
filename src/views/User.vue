<template>
    <div>
        <Navbar/>
        <div class="container container-user">
            <div class="card custom-card-header">
                <div class="align-item-center">
                    <div class="avatar-user">
                        <figure class="image is-128x128">
                            <img class="is-rounded" :src="user.avatar" alt=""/>
                        </figure>
                    </div>

                    <div>
                        <h1 class="title custom-title">{{user.name}}</h1>
                        <h5 class="subtitle is-5">{{user.intro}}</h5>
                    </div>
                </div>

                <div class="user-description">
                    <p>{{user.description}}</p>
                </div>

                <div class="navbar-menu-user">
                    <b-tabs v-model="activeTab">
                        <b-tab-item label="Dòng thời gian">
                            Dòng thời gian
                        </b-tab-item>

                        <b-tab-item label="Giới thiệu">
                            Giới thiệu
                        </b-tab-item>

                        <b-tab-item label="Bài viết">
                            Bài viết
                        </b-tab-item>
                    </b-tabs>
                </div>
            </div>

            <div>

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
                user: Object,
                activeTab: 0
            }
        },
        mounted() {
            this.getUser();
        },
        methods: {
            getUser: async function () {
                let userId = this.$props.query.userId;
                let response = await UserService.getById(userId);
                this.user = response.data;
            },
            getPostByUser: async function () {
                let user = JSON.parse(localStorage.getItem('user'));
                if (user === null) {
                    await this.$store.dispatch('getTrendingPostAction');
                } else {
                    await this.$store.dispatch('getPostByUserIdAction', this.user.user_id);
                }
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

        .tabs {
            span {
                font-weight: 500;
            }
        }
    }
</style>