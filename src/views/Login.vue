<template>
    <section class="hero is-fullheight">
        <div class="hero-body">
            <div class="container has-text-centered">
                <div class="column is-4 is-offset-4">
                    <h3 class="title has-text-black">Đăng nhập</h3>
                    <hr class="login-hr">
                    <p class="subtitle has-text-black">Vui lòng đăng nhập để tiếp tục.</p>
                    <div class="box">
                        <div class="justify-content-center">
                            <figure class="image is-128x128">
                                <img class="is-rounded" src="../assets/icons/majinbuu.png" alt="">
                            </figure>
                        </div>
                        <form>
                            <div class="field">
                                <div class="control">
                                    <input class="input is-large" type="text" placeholder="Tên tài khoản" autofocus="">
                                </div>
                            </div>

                            <div class="field">
                                <div class="control">
                                    <input class="input is-large" type="password" placeholder="Mật khẩu">
                                </div>
                            </div>
                            <div class="field">
                                <b-checkbox>Lưu tài khoản</b-checkbox>
                            </div>
                            <button class="button is-block is-info is-large is-fullwidth">Đăng nhập<i
                                    class="fa fa-sign-in" aria-hidden="true"></i></button>
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
    export default {
        name: "Login"
    }
</script>

<style lang="scss" scoped>

</style>
