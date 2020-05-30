<template>
    <div>
        <b-navbar :fixed-top="true">
            <template slot="brand">
                <b-navbar-item tag="router-link" :to="{ path: '/' }">
                    <img class="logo" src="../assets/images/majinbuu.png" alt="Ma bư"/>
                </b-navbar-item>
            </template>
            <template slot="start">
                <b-navbar-item>
                    <b-field>
                        <b-input placeholder="Tìm kiếm" type="search" icon="magnify" rounded></b-input>
                    </b-field>
                </b-navbar-item>
            </template>

            <template slot="end">
                <b-navbar-item v-if="user != null" class="custom-navbar-item" tag="div">
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

                <div class="new-noti">
                    <h6 class="title is-6 titl-list-noti">Mới</h6>
                    <div class="list-noti">
                        <div v-for="noti in this.newNoti" :key="noti.id" class="noti-item">
                            <router-link :to="{path: 'post', query: {postId: noti.post_id}}">
                                <div>
                                    <figure class="image">
                                        <img class="is-rounded" :src="noti.publisher.avatar" alt=""/>
                                    </figure>
                                </div>
                                <div class="noti-content">
                                    <p><b>{{noti.publisher.name}}</b> {{genContentNotification(noti)}}</p>
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

    export default {
        name: "Navbar",
        data() {
            return {
                numberNoti: 0,
                isDisplayNotiContainer: false,
                newNoti: [],
                oldNoti: []
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
                        let newNoti = [];
                        let oldNoti = [];
                        notifications.forEach(item => {
                            newNoti.push(item);
                        });
                        this.newNoti = newNoti;
                    }
                }
            },
            genContentNotification: function (notification) {
                let content = "";
                if (notification.type === "ADD_COMMENT") {
                    content += "đã bình luận về bài viết của ";
                }
                content += notification.subscriber_id === this.user.user_id ? "bạn" : notification.owner_post.name;
                return content;
            }
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
    }

    .btn-user-right {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 2px 10px;
        border-radius: 20px;
        margin-right: 10px;

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
