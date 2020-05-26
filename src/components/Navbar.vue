<template>
    <b-navbar>
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
                <div class="custom-notification">
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
</template>

<script>
    import * as NotificationService from "../services/notification_service";

    export default {
        name: "Navbar",
        data() {
            return {
                numberNoti: 0
            }
        },
        computed: {
            user() {
                return this.$store.state.user;
            },
            userFirstName() {
                let s = this.user.name.split(' ');
                return s[s.length - 1];
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
                setInterval(() => {
                    NotificationService.countNotSeenByUserId(this.user.user_id).then(respone => {
                        this.numberNoti = respone.data.count;
                    })
                }, 10000)
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
</style>
