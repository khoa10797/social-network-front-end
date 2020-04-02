<template>
    <div>
        <Navbar/>
        <div class="container list-post">
            <Post v-for="post in posts" :key="post.post_id" :post="post"/>
        </div>
    </div>
</template>

<script>
    import Navbar from "../components/Navbar";
    import Post from "../components/Post";

    export default {
        name: "Home",
        components: {
            Navbar,
            Post
        },
        computed: {
            posts() {
                return this.$store.state.posts;
            },
            user() {
                return this.$store.state.user;
            }
        },
        mounted() {
            this.getUser();
            this.getPostByUser();
        },
        methods: {
            getUser() {
                this.$store.dispatch('setUser', '5e5bc9c6958dba414452a851');
            },
            getPostByUser() {
                this.$store.dispatch('setPostByUser', '5e5bc9c6958dba414452a851');
            }
        }
    };
</script>

<style lang="scss" scoped>
    .list-post {
        max-width: 666px;
    }
</style>
