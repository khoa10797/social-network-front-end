<template>
    <section class="hero is-fullheight">
        <div class="hero-body">
            <div class="container has-text-centered">
                <div class="column is-4 is-offset-4">
                    <h3 class="title has-text-black">Đăng nhập</h3>
                    <hr class="login-hr">
                    <p class="subtitle has-text-black">Vui lòng đăng nhập để tiếp tục.</p>
                    <div class="box">
                        <div class="justify-content-center logo-login">
                            <figure class="image is-128x128">
                                <img class="is-rounded" src="../assets/icons/majinbuu.png" alt="">
                            </figure>
                        </div>
                        <form>
                            <div class="field">
                                <div class="control">
                                    <input class="input is-large" type="text" placeholder="Tên tài khoản" autofocus=""
                                           v-model="userName">
                                </div>
                            </div>

                            <div class="field">
                                <div class="control">
                                    <input class="input is-large" type="password" placeholder="Mật khẩu"
                                           v-model="password">
                                </div>
                            </div>
                            <div class="field">
                                <b-checkbox>Lưu tài khoản</b-checkbox>
                            </div>
                            <button class="button is-block is-info is-large is-fullwidth" v-on:click="login">
                                Đăng nhập<i class="fa fa-sign-in" aria-hidden="true"></i>
                            </button>
                        </form>
                    </div>
                    <p class="has-text-grey">
                        <a href="../">Đăng kí</a> &nbsp;·&nbsp;
                        <a href="../">Quên mật khẩu</a> &nbsp;·&nbsp;
                        <a href="../">Trợ giúp</a>
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import * as UserService from '../services/user_service';

    export default {
        name: "Login",
        data() {
            return {
                userName: '',
                password: ''
            }
        },
        methods: {
            login: async function () {
                let response = await UserService.login({
                    'user_name': this.userName,
                    'password': this.password
                });

                if (response.access_token !== undefined) {
                    localStorage.setItem('access_token', response.access_token);
                    window.location.href = "/";
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .logo-login {
        margin-bottom: 10px;
    }
</style>
