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
            <b-navbar-item class="custom-navbar-item" tag="div">
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
            </b-navbar-item>
        </template>
    </b-navbar>
</template>

<script>
    export default {
        name: "Navbar",
        computed: {
            user() {
                return this.$store.state.user;
            },
            userFirstName() {
                let s = this.user.name.split(' ');
                return s[s.length - 1];
            }
        },
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
        padding: 5px 10px;
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
</style>
