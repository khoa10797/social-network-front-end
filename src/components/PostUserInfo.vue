<template>
    <div class="container-user-info">
        <div class="card-image mr-10">
            <figure class="image is-40x40">
                <router-link :to="{path: 'user', query: {userId: user.user_id}}">
                    <img class="is-rounded" :src="user.avatar" alt=""/>
                </router-link>
            </figure>
        </div>

        <div>
            <router-link :to="{path: 'user', query: {userId: user.user_id}}">
                <p class="has-text-black is-text-decoration-line">
                    <b>{{user.name}}</b>
                </p>
            </router-link>

            <router-link to="/">
                <p class="is-size-7 has-text-grey is-text-decoration-line">{{calculatingTime}}</p>
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PostUserInfo",
        props: {
            user: Object,
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
                    return `${date.getDate()} tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;

                return `${date.getDate()} tháng ${date.getMonth() + 1} lúc ${date.getHours()}:${date.getMinutes()}`;
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
