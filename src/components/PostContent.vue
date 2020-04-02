<template>
  <div class="post-content">
    <p class="has-text-black">{{content}}</p>
  </div>
</template>

<script>
  export default {
    name: "PostContent",
    props: {
      content: String
    }
  }
</script>

<style scoped>

  .post-content {
    padding: 10px;
  }

</style>
