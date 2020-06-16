<template>
    <div class="container-navbar">
        <b-navbar :fixed-top="true">
            <template slot="brand">
                <b-navbar-item tag="router-link" :to="{ path: '/' }">
                    <img class="logo" src="../assets/images/majinbuu.png" alt="Ma bư"/>
                </b-navbar-item>
            </template>
            <template slot="start">
                <b-autocomplete
                        v-model="keyWord"
                        rounded
                        :data="filterData"
                        placeholder="Tìm kiếm"
                        icon="magnify"
                        clearable
                        :loading="isFetching"
                        @typing="getAsyncData"
                        @select="option => selected = option">

                    <template slot="header">
                        <router-link :to="{path: '/search', query: {keyword: this.keyWord}}">
                            <span> Tìm kiếm cho {{keyWord}}</span>
                        </router-link>
                    </template>

                    <template slot="empty">Không có kết quả nào</template>

                    <template slot-scope="props">
                        <div class="media">
                            <div class="media-left">
                                <img v-if="props.option.images.length > 0" :src="props.option.images[0]" alt="">
                                <i v-else class="fas fa-images"></i>
                            </div>
                            <div class="media-content" v-html="props.option.content">

                            </div>
                        </div>
                    </template>
                </b-autocomplete>
            </template>

            <template slot="end">
                <b-navbar-item v-if="user != null" class="custom-navbar-item" tag="div">
                    <router-link :to="{path: 'user', query: {userId: user.user_id}}">
                        <div class="btn-user-right">
                            <div>
                                <figure class="image is-32x32">
                                    <img class="is-rounded" :src="user.avatar" alt=""/>
                                </figure>
                            </div>
                            <div>
                                <span>{{userFirstName}}</span>
                            </div>
                        </div>
                    </router-link>
                    <div class="custom-notification" @click="switchPopupNoti">
                        <div>
                            <i class="fas fa-bell"></i>
                        </div>
                        <div v-if="numberNoti > 0" class="number-noti">
                            {{numberNoti}}
                        </div>
                    </div>
                </b-navbar-item>
            </template>
        </b-navbar>
        <div class="container-popup" :style="styleDisplayNoti">
            <div class="close-container-noti" @click="isDisplayNotiContainer = false">

            </div>
            <div class="container-noti">
                <div>
                    <h4 class="title is-4 font-w700">Thông báo</h4>
                </div>

                <div v-if="this.newNotifications.length > 0" class="new-noti">
                    <h6 class="title is-6 titl-list-noti">Mới</h6>
                    <div class="list-noti">
                        <div v-for="noti in this.newNotifications" :key="noti.id" class="noti-item">
                            <router-link :to="{path: 'post', query: {postId: noti.post_id}}">
                                <div>
                                    <figure class="image">
                                        <img class="is-rounded" :src="noti.publisher.avatar" alt=""/>
                                    </figure>
                                </div>
                                <div class="noti-content">
                                    <p>
                                        <b>{{noti.publisher.name}}</b> {{genNotificationType(noti)}} <b>{{genNotificationOwner(noti)}}</b>
                                    </p>
                                </div>
                            </router-link>
                        </div>
                    </div>
                </div>

                <div v-if="this.oldNotifications.length > 0" class="old-noti">
                    <h6 class="title is-6 titl-list-noti">Trước đó</h6>
                    <div class="list-noti">
                        <div v-for="noti in this.oldNotifications" :key="noti.id" class="noti-item">
                            <router-link :to="{path: 'post', query: {postId: noti.post_id}}">
                                <div>
                                    <figure class="image">
                                        <img class="is-rounded" :src="noti.publisher.avatar" alt=""/>
                                    </figure>
                                </div>
                                <div class="noti-content">
                                    <p>
                                        <b>{{noti.publisher.name}}</b> {{genNotificationType(noti)}} <b>{{genNotificationOwner(noti)}}</b>
                                    </p>
                                </div>
                            </router-link>
                        </div>
                    </div>
                </div>

                <div class="old-noti">

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as NotificationService from "../services/notification_service";
    import * as PostService from "../services/post_service";
    import {Constant} from '../commons/constant';
    import {debounce} from "lodash";

    export default {
        name: "Navbar",
        data() {
            return {
                numberNoti: 0,
                isDisplayNotiContainer: false,
                newNotifications: [],
                oldNotifications: [],
                keyWord: '',
                filterData: [],
                selected: null,
                isFetching: false
            }
        },
        computed: {
            user() {
                return this.$store.state.user;
            },
            userFirstName() {
                let s = this.user.name.split(' ');
                return s[s.length - 1];
            },
            styleDisplayNoti() {
                return this.isDisplayNotiContainer === false ? {display: "none"} : {}
            }
        },
        mounted() {
            this.getUser();
            this.countNotification();
        },
        methods: {
            getUser: async function () {
                let user = localStorage.getItem('user');
                await this.$store.dispatch('setUserAction', JSON.parse(user));
            },
            countNotification: function () {
                if (this.user != null) {
                    setInterval(() => {
                        NotificationService.countNotSeenByUserId(this.user.user_id).then(respone => {
                            this.numberNoti = respone.data.count;
                        })
                    }, 10000)
                }
            },
            switchPopupNoti: async function () {
                this.isDisplayNotiContainer = !this.isDisplayNotiContainer
                if (this.isDisplayNotiContainer === true) {
                    await NotificationService.seenNotification(this.user.user_id);
                    this.numberNoti = 0;

                    let response = await NotificationService.getByUserId(this.user.user_id);
                    let notifications = response.data;
                    if (notifications.length > 0) {
                        let newNotifications = [];
                        let oldNotifications = [];
                        let currentTime = new Date().getTime()
                        notifications.forEach(item => {
                            if (currentTime - item.created_at <= Constant.ONE_HOURS) {
                                newNotifications.push(item);
                            } else {
                                oldNotifications.push(item);
                            }
                        });


                        this.newNotifications = newNotifications;
                        this.oldNotifications = oldNotifications;
                    }
                }
            },
            genNotificationType: function (notification) {
                let content = "";
                switch (notification.type) {
                    case Constant.NOTIFICATION_TYPE.ADD_COMMENT:
                        content += "đã bình luận về bài viết của ";
                        break
                    case Constant.NOTIFICATION_TYPE.LIKE_POST:
                        content += "đã thích bài viết của ";
                        break
                }
                return content;
            },
            genNotificationOwner: function (notification) {
                return notification.owner_post.user_id === this.user.user_id ? "bạn" : notification.owner_post.name;
            },
            getAsyncData: debounce(function (name) {
                if (!name.length) {
                    this.filterData = [];
                    return;
                }
                this.isFetching = true;
                PostService.searchByFilter({content: name}).then(({data}) => {
                    this.filterData = [];
                    data.forEach(item => {
                        this.filterData.push(item);
                    });
                }).catch((error) => {
                    this.filterData = [];
                    console.log(error);
                }).finally(() => {
                    this.isFetching = false;
                });

            }, 500)
        }
    };
</script>

<style lang="scss" scoped>
    .logo {
        max-height: 3rem;
    }

    .custom-navbar-item {
        :hover {
            background: #f0f2f5;
            cursor: pointer;
        }

        a {
            color: #050505 !important;
            border-radius: 20px;
            margin-right: 10px;
        }
    }

    .btn-user-right {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 2px 10px;
        border-radius: 20px;

        .image {
            margin-right: 10px;
        }

        img {
            max-height: 32px;
        }

        span {
            font-weight: bold;
        }
    }

    .custom-notification {
        position: relative;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #e4e6eb;
        display: flex;
        justify-content: center;
        align-items: center;

        .number-noti {
            position: absolute;
            width: 20px;
            height: 20px;
            background: red;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            left: 25px;
            bottom: 25px;
            color: #ffffff;
            font-size: 12px;
            font-weight: 700;
        }

        i {
            font-size: 18px;
        }
    }

    .close-container-noti {
        height: 100%;
        width: calc(100% - 400px);
        position: absolute;
    }

    .container-noti {
        position: absolute;
        z-index: 1000;
        width: 360px;
        height: 90%;
        background: #ffffff;
        right: 40px;
        top: 55px;
        box-shadow: 0 12px 28px 0 #00000033;
        border-radius: 10px;
        padding-top: 20px;
        padding-left: 5px;
        padding-right: 5px;
        display: flex;
        flex-direction: column;
    }

    .new-noti {
        margin-top: 20px;
    }

    .old-noti {
        margin-top: 20px;
    }

    .titl-list-noti {
        margin-left: 10px;
        margin-bottom: 5px;
    }

    .list-noti {
        display: flex;
        flex-direction: column;

        .noti-item {
            display: flex;
            padding: 10px;
            border-radius: 10px;

            .image {
                width: 56px;
                height: 56px;
            }
        }

        a {
            display: flex;
            color: #050505 !important;
            border-radius: 10px;
        }

        :hover {
            background: #f0f2f5;
            cursor: pointer;
        }
    }

    .noti-content {
        margin-left: 10px;
        font-size: .9375rem;
    }

</style>

<style lang="scss">
    .container-navbar {
        .navbar-start {
            display: flex;
            justify-content: center;
            align-items: center;

            .control {
                width: 300px;
            }
        }
    }

    .media {
        .media-left {
            img {
                width: 48px;
                height: 48px;
            }

            i {
                font-size: 48px;
            }
        }

        .media-content {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
</style>
