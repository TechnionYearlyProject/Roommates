<template>
  <b-container fluid>
    <b-row>
      <b-col cols="10">
        <h3 class="comments-title">users comments</h3>
      </b-col>
      <b-col>
        <b-button v-if="isAuth" size="md" variant="primary" class="btn-add-comment" @click="">Add Comment</b-button>
      </b-col>
    </b-row>
<b-card v-if="comments.length === 0" class="text-center">
      There are no comments yet.
    </b-card>
    <b-card v-else class="text-center">
      <ul>
        <li v-for="comment in comments">
          {{ comment }}
        </li>
      </ul>
      
    </b-card>
    

  </b-container>
</template>

<script>
  export default {
    props: ["comments", "id", "isAuth"]
  };
</script>

<style>
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
    margin: 0;
    cursor: pointer;
  }
</style>
