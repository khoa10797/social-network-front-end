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
        width: 36px;
        height: 36px;
    }

    .is-40x40 {
        width: 40px;
        height: 40px;
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
</style>
