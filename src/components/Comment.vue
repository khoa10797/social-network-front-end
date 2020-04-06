<template>
  <div class="container-comment">
    <div class="parent-comment">
      <div class="card-image mr-10">
        <figure class="image is-40x40">
          <router-link to="/">
            <img class="is-rounded" :src="require(`@/assets/images/${comment.user.avatar}`)" alt=""/>
          </router-link>
        </figure>
      </div>

      <div class="right-parent-comment">
        <div class="comment-content">
          <router-link to="/">
            <p class="has-text-black is-text-decoration-line">
              <b>{{comment.user.name}}</b>
            </p>
          </router-link>

          <p class="has-text-black">
            {{comment.content}}
          </p>
        </div>

        <div class="action-comment">
          <span>Thích</span>
          <span @click="openInputComment()">Trả lời</span>
        </div>
      </div>
    </div>

    <div class="child-comment">
      <Comment v-for="childComment in comment.child_comments" :key="childComment.comment_id" :comment="childComment"/>
    </div>

    <div v-if="comment.parent_id === null && showInputComment === true" class="input-reply-comment is-flex">
      <div class="mr-10">
        <figure class="image is-36x36">
          <img class="is-rounded" :src="require(`@/assets/images/majinbuu.png`)" alt=""/>
        </figure>
      </div>

      <ResizableInput
        style="background-color: #f0f2f5"
        placeholder="Viết phản hồi..."
        v-model="valueReplyComment"
        rows="1"
      />

      <div class="btn-send-comment is-flex" @click="sendChildComment()">
        <svg height="25px" width="25px" viewBox="0 0 24 24">
          <path class="icon-send"
                d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"
                stroke="none"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
  import * as CommentService from '../services/comment_service';
  import ResizableInput from "./ResizableInput";

  export default {
    name: "Comment",
    props: {
      comment: {
        type: Object,
        default: {}
      }
    },
    components: {
      ResizableInput
    },
    data() {
      return {
        showInputComment: false,
        valueReplyComment: ''
      }
    },
    methods: {
      sendChildComment: function () {
        if (this.valueReplyComment.length > 0) {
          CommentService.sendComment({
            'post_id': this.$props.comment.post_id,
            'user_id': this.$props.comment.user.user_id,
            'parent_id': this.$props.comment.comment_id,
            'content': this.valueReplyComment
          }).then(response => {
            this.valueReplyComment = '';
          });
        }
      },
      openInputComment: function () {
        this.showInputComment = true;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container-comment {
    display: flex;
    flex-direction: column;
  }

  .parent-comment {
    display: flex;
    flex-direction: row;
    margin-top: 5px;
  }

  .comment-content {
    display: flex;
    flex-direction: column;
    background-color: #f0f2f5;
    padding: 5px 10px;
    border-radius: 20px;
  }

  .child-comment {
    margin-left: 48px;

    figure {
      height: 36px;
      width: 36px;
    }
  }

  .right-parent-comment {
    display: flex;
    flex-direction: column;
  }

  .action-comment {
    padding-left: 10px;

    span {
      font-size: 12px;
      font-weight: 700;
      margin-right: 5px;
      cursor: pointer;
    }
  }

  .input-reply-comment {
    align-items: center;
    margin-left: 50px;
    margin-right: 50px;
    padding: 10px;
  }
</style>
