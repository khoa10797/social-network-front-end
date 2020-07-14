<template>
    <section class="hero is-fullheight">
        <div class="hero-body">
            <div class="container">
                <div class="column is-three-fifths is-offset-one-fifth">
                    <h3 class="title has-text-black has-text-centered">Đăng kí tài khoản</h3>
                    <div class="box">
                        <div class="justify-content-center logo-login">
                            <figure class="image is-128x128">
                                <img class="is-rounded" src="../assets/icons/majinbuu.png" alt="">
                            </figure>
                        </div>
                        <div>
                            <div class="sign-up-content columns">
                                <div class="column">
                                    <b-field label="Tên tài khoản">
                                        <b-input v-model="userName"></b-input>
                                    </b-field>

                                    <b-field label="Mật khẩu">
                                        <b-input type="password" value="iwantmytreasure" password-reveal
                                                 v-model="password">
                                        </b-input>
                                    </b-field>
                                </div>

                                <div class="column">
                                    <b-field label="Tên người dùng">
                                        <b-input v-model="name"></b-input>
                                    </b-field>

                                    <b-field label="Ngày sinh">
                                        <b-datepicker
                                                :show-week-number="false"
                                                placeholder="Click để chọn ngày..."
                                                icon="calendar-today"
                                                trap-focus
                                                v-model="dateOfBirth">
                                        </b-datepicker>
                                    </b-field>
                                </div>
                            </div>

                            <button class="button is-block is-info is-large is-fullwidth" v-on:click="signUp">
                                Đăng kí<i class="fa fa-sign-in" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import * as UserService from '../services/user_service';

    export default {
        name: "SignUp",
        data() {
            return {
                userName: '',
                password: '',
                name: '',
                dateOfBirth: null
            }
        },
        methods: {
            signUp: async function () {
                let year = this.dateOfBirth.getFullYear();
                let month = this.dateOfBirth.getMonth() + 1;
                let date = this.dateOfBirth.getDate();

                if (month < 10)
                    month = '0' + month;
                if (date < 10)
                    date = '0' + date;

                let userResponse = (await UserService.add({
                    'user_name': this.userName,
                    'password': this.password,
                    'name': this.name,
                    'date_of_birth': year + '' + month + '' + date
                })).data;

                let response = await UserService.login({
                    'user_name': userResponse.user_name,
                    'password': this.password
                });

                if (response.status_code === 200) {
                    localStorage.setItem('access_token', response.data.access_token);
                    localStorage.setItem('user', JSON.stringify(response.data.user))
                    await this.$router.push({path: '/'})
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .sign-up-content {
        margin-top: 10px;
    }
</style>