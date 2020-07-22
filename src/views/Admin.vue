<template>
    <div>
        <div class="container-admin" v-if="roleUser === 'ADMIN'">
            <b-menu class="menu-admin">
                <b-menu-list label="Chủ đề">
                    <b-menu-item icon="information-outline" label="Chủ đề" :active="true"
                                 @click="showTopic"></b-menu-item>
                </b-menu-list>
                <b-menu-list label="Người dùng">
                    <b-menu-item icon="information-outline" label="Người dùng" @click="showUser"></b-menu-item>
                </b-menu-list>
            </b-menu>

            <div v-if="isShowTopic" class="container container-content">
                <div class="header-topic">
                    <h1 class="title">Danh sách chủ đề</h1>
                    <b-button type="is-success" @click="isShowAddTopicModal = true">Thêm chủ đề</b-button>
                </div>

                <b-table
                        :data="topics"
                        :mobile-cards="true">

                    <template slot-scope="props">
                        <b-table-column field="topic_id" label="ID">
                            {{ props.row.topic_id }}
                        </b-table-column>

                        <b-table-column field="name" label="Tên chủ đề">
                            {{ props.row.name }}
                        </b-table-column>

                        <b-table-column field="number_post" label="Số bài đăng" centered>
                            {{ props.row.number_post }}
                        </b-table-column>

                        <b-table-column field="number_follow" label="Số lượt theo dõi" centered>
                            {{ props.row.number_follow }}
                        </b-table-column>

                        <b-table-column field="" label="" centered>
                            <button class="button is-danger" @click="removeTopic(props.row.topic_id)">
                                <i class="fas fa-trash-alt btn-remove-topic"></i>
                                Xóa
                            </button>
                        </b-table-column>
                    </template>

                    <template slot="empty">
                        <section class="section">
                            <div class="content has-text-grey has-text-centered">
                                <p>
                                    <b-icon
                                            icon="emoticon-sad"
                                            size="is-large">
                                    </b-icon>
                                </p>
                                <p>Nothing here.</p>
                            </div>
                        </section>
                    </template>
                </b-table>
            </div>

            <div v-if="isShowUser" class="container container-content">
                <div class="header-topic" style="margin-bottom: 20px">
                    <h1 class="title">Danh sách người dùng</h1>
                </div>

                <b-table
                        :data="users"
                        :mobile-cards="true">

                    <template slot-scope="props">
                        <b-table-column field="user_id" label="ID">
                            {{ props.row.user_id }}
                        </b-table-column>

                        <b-table-column field="name" label="Tên người dùng">
                            {{ props.row.name }}
                        </b-table-column>

                        <b-table-column field="active" label="Trạng thái" centered>
                            {{ props.row.active }}
                        </b-table-column>

                        <b-table-column field="" label="" centered>
                            <button v-if="props.row.active" class="button is-danger"
                                    @click="lockUser(props.row.user_id, props.row.active, props.row)">
                                <i class="fas fa-lock" style="margin-right: 5px"></i>
                                Khóa
                            </button>
                            <button v-else class="button is-success"
                                    @click="lockUser(props.row.user_id, props.row.active, props.row)">
                                <i class="fas fa-lock-open" style="margin-right: 5px"></i>
                                Mở khóa
                            </button>
                        </b-table-column>
                    </template>

                    <template slot="empty">
                        <section class="section">
                            <div class="content has-text-grey has-text-centered">
                                <p>
                                    <b-icon
                                            icon="emoticon-sad"
                                            size="is-large">
                                    </b-icon>
                                </p>
                                <p>Nothing here.</p>
                            </div>
                        </section>
                    </template>
                </b-table>
            </div>

            <b-modal :active.sync="isShowAddTopicModal"
                     has-modal-card
                     trap-focus
                     :destroy-on-hide="false"
                     aria-role="dialog"
                     aria-modal>
                <div class="custom-card">
                    <div class="card-header justify-content-center">
                        <h1>Thêm chủ đề</h1>
                    </div>
                    <div class="card-content columns">
                        <div class="card-content-left column">
                            <b-field label="Tên chủ đề">
                                <b-input v-model="topicName"></b-input>
                            </b-field>
                            <b-field label="Giới thiệu">
                                <b-input v-model="topicIntro"></b-input>
                            </b-field>
                            <b-field label="Mô tả">
                                <b-input v-model="topicDescription"></b-input>
                            </b-field>
                        </div>

                        <div class="card-content-right column">
                            <b-field>
                                <b-upload v-model="topicAvatar">
                                    <a class="button is-primary">
                                        <b-icon icon="upload"></b-icon>
                                        <span>Ảnh đại diện</span>
                                    </a>
                                </b-upload>
                                <span class="file-name" v-if="topicAvatar">{{ topicAvatar.name }}</span>
                            </b-field>
                            <b-field>
                                <b-upload v-model="topicBackground">
                                    <a class="button is-primary">
                                        <b-icon icon="upload"></b-icon>
                                        <span>Ảnh nền</span>
                                    </a>
                                </b-upload>
                                <span class="file-name" v-if="topicBackground">{{ topicBackground.name }}</span>
                            </b-field>
                        </div>
                    </div>
                    <div class="card-footer">
                        <b-button type="is-primary" @click="addTopic">Lưu</b-button>
                    </div>
                </div>
            </b-modal>
        </div>

        <div v-else>
            <h1 class="title is-1">
                Bạn không có quyền thực hiện chức năng này
            </h1>
        </div>
    </div>
</template>

<script>
    import * as TopicService from "../services/topic_service";
    import * as UserService from "../services/user_service";
    import firebase from "firebase";

    export default {
        name: "Admin",
        components: {},
        data() {
            return {
                user: Object,
                roleUser: '',
                isShowAddTopicModal: false,
                topicAvatar: null,
                topicBackground: null,
                topics: [],
                users: [],
                topicName: '',
                topicIntro: '',
                topicDescription: '',
                isShowTopic: true,
                isShowUser: false
            }
        },
        mounted() {
            this.getUser().then(user => {
                this.getRoleUser();
            });
            this.getAllTopic();
            this.getAllUser();
        },
        methods: {
            getUser: async function () {
                let olduser = JSON.parse(localStorage.getItem('user'));
                let response = await UserService.getById(olduser.user_id);
                this.user = response.data;
            },
            getRoleUser: function () {
                this.roleUser = this.user.role_group_ids[0];
            },
            getAllTopic: async function () {
                TopicService.getAll().then(response => {
                    this.topics = response.data;
                });
            },
            getAllUser: async function () {
                this.users = (await UserService.getAll()).data;
            },
            addTopic: function () {
                let avatar = null;
                if (this.topicAvatar == null) {
                    this.$buefy.toast.open({
                        duration: 5000,
                        message: `Ảnh đại diện không được để trống!`,
                        type: 'is-danger'
                    });
                    return;
                }

                if (this.topicBackground == null) {
                    this.$buefy.toast.open({
                        duration: 5000,
                        message: `Ảnh nền không được để trống!`,
                        type: 'is-danger'
                    });
                    return;
                }

                let fileNameTopic = this.topicAvatar.name.split('.');
                this.imageName = fileNameTopic[0] + this.$moment(new Date()).format('YYYYMMDD_hhmmss') + '.' + fileNameTopic[1];

                const storageRef = firebase.storage().ref(`/images/${this.imageName}`);
                let uploadTask = storageRef.put(this.topicAvatar);

                uploadTask.on(`state_changed`, snapshot => {
                    }, error => {
                        console.log(error.message)
                    },
                    () => {
                        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                            avatar = url;

                            /**
                             * Lấy url avatar
                             */
                            let background = null;
                            let fileNameTopic = this.topicBackground.name.split('.');
                            this.imageName = fileNameTopic[0] + this.$moment(new Date()).format('YYYYMMDD_hhmmss') + '.' + fileNameTopic[1];

                            const storageRef = firebase.storage().ref(`/images/${this.imageName}`);
                            let uploadTask = storageRef.put(this.topicBackground);

                            uploadTask.on(`state_changed`, snapshot => {
                                }, error => {
                                    console.log(error.message)
                                },
                                () => {
                                    uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                                        background = url;

                                        /**
                                         *Lấy url background
                                         */
                                        TopicService.add({
                                            'name': this.topicName,
                                            'intro': this.topicIntro,
                                            'description': this.topicDescription,
                                            'avatar': avatar,
                                            'background_image': background
                                        }).then(response => {
                                            this.topicAvatar = null;
                                            this.topicBackground = null;
                                            this.topics = [];
                                            this.topicName = '';
                                            this.topicIntro = '';
                                            this.topicDescription = '';

                                            this.isShowAddTopicModal = false;
                                            this.getAllTopic();
                                            this.$buefy.toast.open({
                                                message: 'Thêm chủ đề công!',
                                                type: 'is-success'
                                            });
                                        })
                                    });
                                }
                            );
                        });
                    }
                );
            },
            removeTopic: async function (topicId) {
                this.$buefy.dialog.confirm({
                    title: 'Xóa bài đăng',
                    message: 'Bạn có chắc muốn <b>xóa</b> chủ đề này? Hành động này không thể khôi phục.',
                    cancelText: 'Hủy',
                    confirmText: 'Xóa chủ đề',
                    type: 'is-danger',
                    hasIcon: true,
                    onConfirm: async () => {
                        let topic = (await TopicService.getById(topicId)).data;

                        const storageRef = firebase.storage().ref();

                        /*Xóa avatar*/
                        let decodeAvatarUrl = decodeURIComponent(topic.avatar);
                        let imageAvatarName = (decodeAvatarUrl.split('/').pop()).split('?')[0];
                        let desertAvatarRef = storageRef.child(`images/${imageAvatarName}`);
                        try {
                            await desertAvatarRef.delete()
                        } catch (e) {
                            console.log(e)
                        }


                        /*Xóa ảnh nền*/
                        let decodeBackgroundUrl = decodeURIComponent(topic.background_image);
                        let imageBackgroundName = (decodeBackgroundUrl.split('/').pop()).split('?')[0];
                        let desertBackgroundRef = storageRef.child(`images/${imageBackgroundName}`);
                        try {
                            await desertBackgroundRef.delete();
                        } catch (e) {
                            console.log(e)
                        }

                        TopicService.remove(topicId).then(response => {
                            this.$buefy.toast.open({
                                message: 'Xóa chủ đề công!',
                                type: 'is-success'
                            });
                        });
                        await this.getAllTopic();
                    }
                });
            },
            showTopic: function () {
                this.isShowTopic = true;
                this.isShowUser = false;
            },
            showUser: function () {
                this.isShowUser = true;
                this.isShowTopic = false;
            },
            lockUser: async function (userId, active, row) {
                let updatedActive;
                if (active == null || active === false || active === undefined)
                    updatedActive = true;
                if (active === true) {
                    updatedActive = false;
                }

                let user = (await UserService.lockUser({
                    userId: userId,
                    active: updatedActive
                })).data;

                row.active = user.active;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .menu-admin {
        width: 256px;
        padding: 46px 18px;
    }

    .container-admin {
        display: flex;
    }

    .container-content {
        width: 100%;
        padding: 46px
    }

    .header-topic {
        display: flex;

        button {
            margin-left: 20px;
        }
    }

    .card-header {
        padding-bottom: 10px;

        h1 {
            font-size: 1.25rem;
            font-weight: 700;
        }
    }

    .card-footer {
        padding: 10px;
    }

    .card-content {
        display: flex;
        padding: 10px;
    }

    .custom-card {
        width: 960px;
    }

    .btn-remove-topic {
        margin-right: 5px;
    }
</style>