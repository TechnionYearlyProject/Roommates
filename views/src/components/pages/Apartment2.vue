<template>
<b-container style="padding-top:40px">
  <b-container>
    <b-row>
      <b-col md="8" class="main-box">
        <image-gallery :apartment="apartment" style="margin-bottom:20px;"></image-gallery>
        <data-section :apartment="apartment" style="margin-bottom:20px;"></data-section>
        <tags-section :apartment="apartment"></tags-section>
        <hr>
        <description-section :apartment="apartment"></description-section>
      </b-col>
      <b-col>
        <publisher-section :publisher="publisher"></publisher-section>
        <interested-section :apartment="apartment" :expressedInterest="expressedInterest" :isAuth="isAuth" @interestedExpress="expressInterest"></interested-section>
        <share-buttons></share-buttons>
      </b-col>
    </b-row>
  </b-container>

    <comments-section :apartment="apartment" :isAuth="isAuth" @commentPosted="afterComment"></comments-section>

  </b-container>
</template>

<script>
  import ImageGallery from "@/components/apartment2/ImageGallery.vue";
  import DataSection from "@/components/apartment2/DataSection.vue";
  import TagsSection from "@/components/apartment2/TagsSection.vue";
  import DescriptionSection from "@/components/apartment2/DescriptionSection.vue";
  import PublisherSection from "@/components/apartment2/PublisherSection.vue";
  import InterestedSection from "@/components/apartment2/InterestedSection.vue";
  import CommentsSection from "@/components/apartment2/CommentsSection.vue";
  import InterestedBanner from "@/components/interested/InterestedBanner.vue";
  import ShareButtons from "@/components/apartment2/ShareButtons.vue";

  export default {
    data() {
      return {
        id: this.$route.params.id,
        apartment: [],
        publisher: [],
        isAuth: false,
        expressedInterest: false
      };
    },
    methods: {
      expressInterest(apartment) {
        this.expressedInterest = !this.expressedInterest;
        this.apartment = apartment;
      },
      afterComment(comments) {
        this.apartment.comments = comments;
      }
    },
    async created() {
      this.isAuth = this.$auth.isAuthenticated();
      await this.$http
        .get(`apartments`, { params: { id: this.id } })
        .then(res => {
          this.apartment = res.body.results[0];
          console.log(this.apartment);
        });
      await this.$http.get(`users/${this.apartment._createdBy}`).then(res => {
        console.log(res);
        this.publisher = res.body.user;
      });

      if(this.apartment._interested.includes(this.publisher._id)) {
        this.expressedInterest = true;
      }
    },
    components: {
      InterestedBanner,
      ImageGallery,
      DataSection,
      TagsSection,
      DescriptionSection,
      PublisherSection,
      InterestedSection,
      CommentsSection,
      ShareButtons
    }
  };
</script>

<style scoped>

  li {
    display: inline-block;
    width: 300px;
  }

  .icon {
    width: 30px;
    text-align: center;
    color: #777;
    font-size: 100px;
    margin: 0 10px;
    line-height: 120%;
    vertical-align: middle;
    margin-top: -5px;
  }

  .border_r {
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }

  .main-box {
    background-color: #fcfcfc;
    margin-bottom: 50px;
  }
</style>
