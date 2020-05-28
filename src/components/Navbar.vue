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
                    <div class="custom-notification" @click="openPopupNoti">
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

                <div class="not-seen-noti">
                    <h6 class="title is-6">Chưa xem</h6>

                </div>

                <div class="seen-noti">

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
                seenNoti: [],
                notSeenNoti: []
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
            openPopupNoti: async function () {
                this.isDisplayNotiContainer = !this.isDisplayNotiContainer
                if (this.isDisplayNotiContainer === true) {
                    let response = await NotificationService.getByUserId(this.user.user_id);
                    let notifications = response.data;
                    notifications.for(item => {
                        if (item.isSeen === false)
                            this.notSeenNoti.push(item);
                        else
                            this.seenNoti.push(item);
                    });
                }
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
        padding-left: 10px;
        padding-right: 10px;
        display: flex;
        flex-direction: column;
    }

    .not-seen-noti {
        margin-top: 20px;
    }

    .seen-noti {

    }
</style>
