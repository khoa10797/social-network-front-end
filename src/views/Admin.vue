<template>
    <div class="container-admin">
        <b-menu class="menu-admin">
            <b-menu-list label="Chủ đề">
                <b-menu-item icon="information-outline" label="Chủ đề" :active="true"></b-menu-item>
            </b-menu-list>
            <b-menu-list label="Người dùng">
                <b-menu-item label="Người dùng"></b-menu-item>
            </b-menu-list>
        </b-menu>

        <div class="container container-content">
            <div class="header-topic">
                <h1 class="title">Danh sách chủ đề</h1>
                <b-button type="is-success" @click="isShowAddTopicModal = true">Thêm chủ đề</b-button>
            </div>

            <!--<section>
                <b-table :data="topics">
                    <template slot-scope="props">
                        <template v-for="column in columns">
                            <b-table-column :key="column.topic_id" v-bind="column">
                                <template
                                        v-if="column.searchable && !column.numeric"
                                        slot="searchable"
                                        slot-scope="props">
                                    <b-input
                                            v-model="props.filters[props.column.field]"
                                            placeholder="Tìm kiếm..."
                                            icon="magnify"
                                            size="is-small"/>
                                </template>
                                {{ props.row[column.field] }}
                            </b-table-column>
                        </template>
                    </template>
                </b-table>
            </section>-->

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
                        <i class="fas fa-trash-alt btn-remove-topic" @click="removeTopic(props.row.topic_id)"></i>
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
</template>

<script>
    import * as TopicService from "../services/topic_service";
    import firebase from "firebase";

    export default {
        name: "Admin",
        components: {},
        data() {
            return {
                isShowAddTopicModal: false,
                topicAvatar: null,
                topicBackground: null,
                topics: [],
                topicName: '',
                topicIntro: '',
                topicDescription: '',
                columns: [
                    {
                        field: 'topic_id',
                        label: 'ID',
                        searchable: true,
                    },
                    {
                        field: 'name',
                        label: 'Tên chủ đề',
                        searchable: true,
                    },
                    {
                        field: 'number_post',
                        label: 'Số bài đăng',
                        numeric: true,
                        centered: true
                    },
                    {
                        field: 'number_follow',
                        label: 'Số Lượt theo dõi',
                        numeric: true,
                        centered: true
                    }
                ]
            }
        },
        mounted() {
            this.getAllTopic();
        },
        methods: {
            getAllTopic: function () {
                TopicService.getAll().then(response => {
                    this.topics = response.data;
                });
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
                        this.getAllTopic();
                    }
                })
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
        color: red;
    }
</style>