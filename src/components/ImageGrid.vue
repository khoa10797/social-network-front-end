<template>
    <div class="card-image">
        <img v-for="(image, index) in images" v-bind:key="index" :src="image" alt=""/>
    </div>
</template>

<script>
    export default {
        name: "ImageGrid",
        props: {
            images: Array
        }
    }
</script>

<style scoped>

</style>
