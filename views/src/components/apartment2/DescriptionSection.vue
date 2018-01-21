<template>
  <b-container>
    <b-row>
      <div>
        <h4 class="description-title">Description</h4>

        <p class="description">
          {{ apartment.description }}
        </p>
      </div>

    </b-row>
  </b-container>
</template>

<script>
  export default {
    props: ['apartment']
  };
</script>

<style>
.description-title{
  padding-left: 15px;
  margin-bottom: 15px;
  color: #FFA500;
  font-size: 18px;
  font-weight: 400;
}

.description-title::after {
  background-color: #E5E6E7;
  content: "";
  display: block;
  width:30px;
  height:3px;
  margin: 3px 0 0 2px;
}

.description {
  padding: 0 15px 1em;
  margin: 0;
  font-size: 15px;
  line-height: 1.6180em
}
</style>
