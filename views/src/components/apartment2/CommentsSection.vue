<template>
  <b-container fluid>
    <b-row>
      <b-col cols="10">
        <h3 class="comments-title">users comments</h3>
      </b-col>
      <b-col>
        <b-button v-if="isAuth" size="md" variant="primary" class="btn-add-comment" v-b-toggle.openCommentSection>Add Comment</b-button>
      </b-col>
    </b-row>
    <b-collapse ref="openCommentSection" id="openCommentSection" class="mt-2">
      <b-card>
        <b-form-textarea id="commentArea" v-model="commentText" placeholder="Enter your comment" :rows="4" style="overflow:hidden"></b-form-textarea>
        <b-card-footer>
          <b-row>
            <b-col cols="auto">

              <b-button size="md" variant="success" class="btn-submmit-comment" @click="submitComment">Add Comment</b-button>
            </b-col>
            <b-col cols="auto">
              <b-alert :show="showAlert" variant="danger" class="error-msg">{{ errorMessage }}</b-alert>

            </b-col>
          </b-row>

        </b-card-footer>
      </b-card>
    </b-collapse>
    <b-card v-if="apartment.comments.length === 0" class="text-center mt-2">
      There are no comments yet.
    </b-card>

    <ul v-else>
      <li v-for="comment in apartment.comments">
        <b-card class="mt-2">
          <b-card-header>{{ new Date(comment.createdAt).toDateString() }}</b-card-header>
          <b-card-body>
            <p class="card-text">
              {{ comment.text }}
            </p>
            </b-card-body>
        </b-card>
      </li>
    </ul>

  </b-container>
</template>

<script>
  export default {
    props: ["apartment", "id", "isAuth"],
    data() {
      return {
        commentText: "",
        showAlert: false,
        errorMessage: "Comment must contain at least 10 letters."
      };
    },
    methods: {
      submitComment() {
        if (!this.isValidComment) {
          this.showAlert = true;
          return;
        }
        this.showAlert = false;
        this.$http
          .put(`apartments/${this.apartment._id}/comment`, {
            text: this.commentText
          })
          .then(res => {
            console.log(res.body);
            this.$emit("commentPosted", res.body.comments);
            this.$refs.openCommentSection.toggle();
          });
      }
    },
    computed: {
      isValidComment() {
        return this.commentText.length >= 10;
      }
    }
  };
</script>

<style scoped>
  ul {
    list-style: none;
    padding: 0;
  }
  .comments-title {
    margin-bottom: 15px;
    color: #ffa500;
    font-size: 25px;
    font-weight: 400;
  }

  .comments-title::after {
    background-color: #e5e6e7;
    content: "";
    display: block;
    width: 70px;
    height: 3px;
    margin: 3px 0 0 2px;
  }

  .btn-add-comment {
    float: right;
  }
  .btn-submmit-comment,
  .btn-add-comment {
    margin: 0;
    cursor: pointer;
  }
  .error-msg {
    margin: 0;
    line-height: 0.8;
  }
  .card-body{
    padding: 0 !important; 
  }
  .card-text {
    padding: 0.75rem 1.25rem;
  }
</style>
