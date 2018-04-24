<template>
    <v-container grid-list-lg style="overflow: hidden; height:100%;">
        <v-layout column fill-height>
            <v-flex v-if="isVerified" ref="addComments" style="min-height: 60px; max-height: 180px; overflow-y: auto;">
                <v-layout fill-height>
                    <v-text-field v-model="text" label="Add a comment" :error-messages="errorMessages" :loading="loading" :disabled="!isVerified || loading" multi-line auto-grow hide-details :rows="1" :row-height="1" />
                    <v-btn color="secondary" :loading="loading" :disabled="!isVerified || loading" @click="addComment">
                        <v-icon>send</v-icon>
                    </v-btn>
                </v-layout>
            </v-flex>
            <v-divider v-if="isVerified" class="my-3" />
            <v-flex ref="chat" style="overflow-y: auto; height: 100%">
                <transition-group name="scale-transition" tag="v-flex" mode="out-in">
                    <v-flex xs11 v-if="hasComments" v-for="(comment, i) in comments" :key="`comment-${commentsList.length - i}`" :class="{ 'offset-xs1': isMyComments(comment) }">
                        <div class="text-xs-left caption"> {{ formatCommentTime(comment.createdAt) }} </div>
                        <v-card :color="isMyComments(comment) ? myCommentColor : hisCommentColor" class="white--text">
                            <v-card-title>

                                <div>
                                    <div class="body-2">
                                        {{ isMyComments(comment) ? 'You' : 'user'}}
                                    </div>
                                    <div class="body-1">
                                        {{ comment.text }}
                                    </div>
                                </div>
                            </v-card-title>
                        </v-card>
                    </v-flex>
                </transition-group>
                <div v-if="!hasComments()" class="text-xs-center">No comments</div>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
      props: {
        comments: {
          type: Array,
          default: [],
          required: true
        },
        minLength: {
          type: Number,
          default: 10
        },
        onComment: {
          type: Function,
          default: () => new Promise.resolve() // eslint-disable-line
        }
      },
      data() {
        return {
          commentsList: null,
          text: null,
          errorMessages: [],
          loading: false,
          myCommentColor: 'green lighten-2',
          hisCommentColor: 'blue lighten-2'
        };
      },
      methods: {
        isMyComments(comment) {
          return this.isVerified && comment._createdBy === this.getUser._id;
        },
        hasComments() {
          return this.comments.length > 0;
        },
        formatCommentTime(date) {
          const time = (Date.now() - date) / 1000;
          if (time < 60) {
            return 'just now';
          } else if (time >= 60 && time < 3600) {
            return `${Math.floor(time / 60)} minutes ago`;
          } else if (time >= 3600 && time < 86400) {
            return `${Math.floor(time / 3600)} hours ago`;
          }
          return `${Math.floor(time / 86400)} days ago`;
        },
        addComment() {
          if (this.text.length < this.minLength) {
            this.errorMessages = ['Your comment is too short'];
            return;
          }
          this.loading = true;
          this.errorMessages = [];
          const comment = {
            text: this.text,
            _createdBy: this.getUser._id,
            createdAt: Date.now()
          };
          this.text = null;
          this.goToTop();
          this.onComment(comment)
            .then(() => {
              this.commentsList.unshift(comment);
              this.$emit('commentAdded', comment);
            })
            .catch((error) => {
              // eslint-disable-next-line
              console.log(error);
            })
            .then(() => {
              this.loading = false;
            });
        },
        goToTop() {
          this.$nextTick(() => {
            this.$refs.chat.scrollTop = 0;
          });
        }
      },
      computed: {
        ...mapGetters(['isVerified', 'getUser'])
      },
      created() {
        this.commentsList = this.comments;
      }
    };
</script>

<style scoped src="../../assets/costum-scrollbar.css">

</style>
