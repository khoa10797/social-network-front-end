<template>
    <div>
        <Navbar/>
        <div class="container container-post-detail">
            <Post v-for="post in posts" :key="post.post_id" :post="post"/>
        </div>
    </div>
</template>

<script>
    import Navbar from "../components/Navbar";
    import Post from "../components/Post";
    import * as PostService from "../services/post_service";

    export default {
        name: "PostDetail",
        components: {
            Navbar,
            Post
        },
        props: {
            query: Object
        },
        data() {
            return {}
        },
        computed: {
            posts() {
                return this.$store.state.posts;
            }
        },
        mounted() {
            this.getPostById();
        },
        methods: {
            getPostById: async function () {
                let postId = this.$props.query.postId;
                let response = await PostService.getById(postId);
                await this.$store.dispatch('setPostAction', response.data);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container-post-detail {
        padding-top: 80px;
        max-width: 960px;
    }
</style>