<template>
<b-Container>
<b-card>
  <div class="centralize_div" v-if="appliedSuccesfully === false">
      <h1> Help us improve the results! </h1>
      <b-form @submit="onSubmit" @reset="onReset">
        <b-alert variant="secondary" :show="appliedSuccesfully">Saved</b-alert>
        <b-alert variant="danger" :show="errors">An error occured, could not save changes</b-alert>
        <b-form-group label="Choose your hobbies:">
          <br>
          <b-form-checkbox-group id="hobbiescbs" name="hobbies" v-model="currTags" :options="tags">
          </b-form-checkbox-group>
        </b-form-group>
        <br>
        <b-button type="submit" variant="primary">SAVE</b-button>
        <b-button type="reset" variant="primary">CANCEL</b-button>
        <loading :show="showLoading" label="Loading..."></loading>
      </b-form>
  </div>
  <div class="centralize_div" v-if="appliedSuccesfully === true">
      <UserPanelGeneralSuccess labelText="Your hobbies have been updated successfully!" ></UserPanelGeneralSuccess>
  </div>
   
</b-card>
</b-Container>
</template>

<script>
    import bButton from 'bootstrap-vue/es/components/button/button'
    import bForm from 'bootstrap-vue/es/components/form/form'
    import bFormGroup from 'bootstrap-vue/es/components/form-group/form-group'
    import bFormCheckboxGroup from 'bootstrap-vue/es/components/form-checkbox/form-checkbox-group'
    import bFormCheckbox from 'bootstrap-vue/es/components/form-checkbox/form-checkbox'
    import bCard from 'bootstrap-vue/es/components/card/card';
    import bContainer from 'bootstrap-vue/es/components/layout/container';
    import bAlert from 'bootstrap-vue/es/components/alert/alert';
    import loading from "vue-full-loading";
    import UserPanelGeneralSuccess from "@/components/user-panel/UserPanelGeneralSuccess.vue";
    export default {
        name: 'select-hobbies',
        props: [
          'user'
        ],
        data: function() {
            return {
              currTags: [],
              tags: [],
              appliedSuccesfully: false,
              errors: false,
              showLoading: false
            };
        },
        components:{
            bButton,
            bForm, bFormGroup, bFormCheckboxGroup, bFormCheckbox, bCard, bContainer, loading, UserPanelGeneralSuccess
        },
        async created() {
          await this.$http
                          .get("users/tags")
                          .then(res => this.setAvailableTags(res, this))
                          .catch(e => console.log(e));

          this.currTags = this.user.hobbies;
        },
        methods: {
            onSubmit (evt) {
              evt.preventDefault();
              this.appliedSuccesfully = false;
              this.errors = false;
              this.showLoading = true;
              this.$http.patch("users/self",  {hobbies: this.currTags}, {headers: {'x-auth': this.$auth.getToken() }})
                          .then(res => {this.appliedSuccesfully = true; this.showLoading = false;})
                          .catch(e => {console.log(e); this.errors = true; this.showLoading=false;});
            },
            onReset (evt) {
              evt.preventDefault();
              this.$router.push({ name: 'user-panel', params: { id: this.id } })         
            },
            setAvailableTags(responseFromServer, pThis) {
              responseFromServer.body.tags.forEach(function(obj) {
                  var tag = {
                              value: obj._id,
                              text: obj.name
                            };
                  pThis.tags.push(tag);
              });
            },
            setCurTags(responseFromServer, pThis) {
              pThis.currTags = responseFromServer.body.user.hobbies;
            },
          }
    }
  
</script>

<style scoped>

.centralize_div{
  display:block; 
  vertical-align:middle; 
  text-align:center;
  margin: 0 auto;
}


</style>
