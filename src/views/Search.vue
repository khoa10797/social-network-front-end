<template>
    <div>
        <Navbar/>

        <div class="container container-search">
            <Post v-for="post in posts" :key="post.post_id" :post="post"/>
        </div>
    </div>
</template>

<script>
    import Navbar from "../components/Navbar";
    import Post from "../components/Post";

    export default {
        name: "Search",
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
            this.getPostByIds();
        },
        methods: {
            getPostByIds: async function () {
                await this.$store.dispatch('searchPostByFilterAction', {content: this.$props.query.keyword});
            }
        }
    }
</script>

<style scoped>
    .container-search {
        padding-top: 80px;
        max-width: 960px;
    }


</style>