<template>
    <section class="hero is-fullheight">
        <div class="hero-body">
            <div class="container has-text-centered">
                <div class="column is-4 is-offset-4">
                    <h3 class="title has-text-black">Đăng nhập</h3>
                    <div class="box">
                        <div class="justify-content-center logo-login">
                            <figure class="image is-128x128">
                                <img class="is-rounded" src="../assets/icons/majinbuu.png" alt="">
                            </figure>
                        </div>
                        <div>
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
                        </div>
                    </div>
                    <p class="has-text-grey">
                        <router-link :to="{path: 'sign_up', query: {}}">
                            Đăng kí
                        </router-link> &nbsp;·&nbsp;
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
                try {
                    let response = await UserService.login({
                        'user_name': this.userName,
                        'password': this.password
                    });

                    if (response.status_code === 200) {
                        localStorage.setItem('access_token', response.data.access_token);
                        localStorage.setItem('user', JSON.stringify(response.data.user))
                        await this.$router.push({path: '/'})
                    }
                } catch (ex) {
                    this.$buefy.toast.open({
                        duration: 5000,
                        message: ex.response.data.error,
                        position: 'is-top',
                        type: 'is-danger'
                    });
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
