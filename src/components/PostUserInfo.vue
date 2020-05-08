<template>
  <div class="container-user-info">
    <div class="card-image mr-10">
      <figure class="image is-40x40">
        <router-link to="/">
          <img class="is-rounded" :src="avatar" alt=""/>
        </router-link>
      </figure>
    </div>

    <div>
      <router-link to="/">
        <p class="has-text-black is-text-decoration-line">
          <b>{{userName}}</b>
        </p>
      </router-link>

      <router-link to="/">
        <p class="is-size-7 has-text-grey	is-text-decoration-line">{{calculatingTime}}</p>
      </router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: "PostUserInfo",
    props: {
      avatar: String,
      userName: String,
      time: Number
    },
    computed: {
      calculatingTime() {
        let currentDate = new Date();

        let seconds = Math.round((currentDate.getTime() - this.time) / 1000);
        if (seconds < 60)
          return "Vừa xong";

        let minutes = Math.floor(seconds / 60);
        if (minutes < 60)
          return `${minutes} phút`;

        let hours = Math.floor(minutes / 60);
        if (hours < 24)
          return `${hours} giờ`;

        let date = new Date(this.time);
        if (date.getFullYear() < currentDate.getFullYear())
          return `${date.getDate()} tháng ${date.getMonth()}, ${date.getFullYear()}`;

        return `${date.getDate()} tháng ${date.getMonth()} lúc ${date.getHours()}:${date.getMinutes()}`;
      }
    }
  }
</script>

<style scoped>
  .container-user-info {
    display: flex;
    flex-direction: row;
    padding: 10px;
  }
</style>
