<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<style lang="scss">
    @import "~bulma/sass/utilities/_all";

    $primary: #00d1b2;

    @import "~bulma";
    @import "~buefy/src/scss/buefy";
    @import "~vue-image-lightbox/dist/vue-image-lightbox.min.css";
</style>

<style lang="scss">
    #app {
        background-color: #f0f2f5;
        padding-bottom: 20px;
    }

    .is-text-decoration-line :hover {
        text-decoration-line: underline;
    }

    .mr-10 {
        margin-right: 10px;
    }

    .is-36x36 {
        width: 36px !important;
        height: 36px !important;
    }

    .is-40x40 {
        width: 40px !important;
        height: 40px !important;
    }

    .icon-send {
        fill: #3578E5;
    }

    .btn-send-comment {
        margin-left: 10px;
        font-size: 25px;
        color: #3578E5;

        :hover {
            cursor: pointer;
        }
    }

    .custom-card {
        background-color: #ffffff;
        border-radius: 10px;
        padding: 10px 0;
        margin: 15px 0;
        position: relative;
    }

    .justify-content-center {
        display: flex;
        justify-content: center;
    }

    .align-item-center {
        display: flex;
        align-items: center;
    }


    .container-popup {
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        z-index: 100;
    }

    .z-index-200 {
        z-index: 200;
    }

    .font-w700 {
        font-weight: 700;
    }

    .scroll {
        overflow-y: auto;
        max-height: calc(100vh)
    }

    .scroll::-webkit-scrollbar {
        width: 4px;
    }

    .scroll::-webkit-scrollbar-thumb {
        background-color: transparent;
    }

    .scroll:hover::-webkit-scrollbar-thumb {
        background-color: #f0f0f0;
    }
</style>

<!--override property buefy-->
<style lang="scss">
    .modal-card {
        border-radius: 20px;
    }

    .modal-card-head {
        background-color: #ffffff !important;
    }

    .modal-card-foot {
        background-color: #ffffff !important;
    }

    .title {
        color: #050505 !important;
    }
</style>
