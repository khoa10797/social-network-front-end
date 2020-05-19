<template>
    <div>
        <Navbar/>
        <div class="container container-topic">
            <div class="container-header-topic">
                <div class="background-topic">
                    <div class="avatar-topic">
                        <figure class="image">
                            <img class="is-rounded" :src="topic.avatar" alt=""/>
                        </figure>
                    </div>
                </div>
                <div class="card card-header-topic">
                    <div>
                        <h1 class="title title-topic">{{topic.name}}</h1>
                        <h6 class="subtitle is-6">{{topic.intro}}</h6>
                    </div>

                    <div class="description">
                        <p>{{topic.description}}</p>
                    </div>

                    <div class="menu-header">
                        <div class="total-post">
                            <span>100 bài viết</span>
                        </div>
                        <div>
                            <button class="button is-primary">Theo dõi</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Navbar from "../components/Navbar";

    export default {
        name: "Topic",
        components: {
            Navbar
        },
        props: {
            query: Object
        },
        data() {
            return {
                topic: {
                    "topic_id": "5ec3f62112c8d847d47a2acf",
                    "name": "Công nghệ thông tin",
                    "intro": "Lĩnh vực công nghệ",
                    "description": "Nơi tập trung các bài viết liên quan đến công nghệ thông tin và ứng dụng của nó trong đời sống",
                    "avatar": "https://firebasestorage.googleapis.com/v0/b/social-network-66b92.appspot.com/o/app_images%2Favatar_IT_topic.jpg?alt=media&token=0b4de802-c982-4aa0-9ee9-034424138bc7",
                    "background_image": "https://firebasestorage.googleapis.com/v0/b/social-network-66b92.appspot.com/o/app_images%2Fbackground_IT_topic.jpg?alt=media&token=b40bb80a-3aa8-4791-9d1b-1fa83f071d39",
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container-topic {
        margin-top: 20px;
        max-width: 960px;
    }

    .title-topic {
        font-weight: 700;
        margin-top: 20px;
    }

    .container-header-topic {
        .background-topic {
            position: relative;
            height: 300px;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            background-image: url("https://firebasestorage.googleapis.com/v0/b/social-network-66b92.appspot.com/o/app_images%2Fbackground_IT_topic.jpg?alt=media&token=b40bb80a-3aa8-4791-9d1b-1fa83f071d39");
            background-position: center center;
            background-size: cover;
            background-repeat: no-repeat;

            .avatar-topic {
                position: absolute;
                z-index: 1000;
                bottom: -30px;
                left: 30px;
                background: #ffffff;
                width: 180px;
                height: 180px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            img {
                width: 170px;
                height: 170px;
            }
        }

        .card-header-topic {
            padding: 20px;
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;

            .description {
                margin-top: 10px;

                p {
                    color: #0a0a0a !important;
                }
            }
        }
    }

    .menu-header {
        margin-top: 10px;
        display: flex;
        align-items: center;

        .total-post {
            margin-right: 20px;

            span {
                font-weight: 500;
            }
        }
    }
</style>