<template>
<div id="hobbies_selection_container" class="centralize_div">
    <h1> Help us improve the results! </h1>
    <b-form @submit="onSubmit" @reset="onReset">
      <b-form-group label="Choose your hobbies:">
        <br>
        <b-form-checkbox-group id="hobbiescbs" name="hobbies" v-model="currTags" :options="tags">
        </b-form-checkbox-group>
      </b-form-group>
      <br>
      <b-button type="submit" variant="primary">SAVE</b-button>
      <b-button type="reset" variant="primary">CANCEL</b-button>
    </b-form>
</div>
</template>

<script>
    import bButton from 'bootstrap-vue/es/components/button/button'
    import bForm from 'bootstrap-vue/es/components/form/form'
    import bFormGroup from 'bootstrap-vue/es/components/form-group/form-group'
    import bFormCheckboxGroup from 'bootstrap-vue/es/components/form-checkbox/form-checkbox-group'
    import bFormCheckbox from 'bootstrap-vue/es/components/form-checkbox/form-checkbox'

    export default {
        name: 'select-hobbies',
        props: [
          'id'
        ],
        data: function() {
            return {
              currTags: [],
              tags: []
            };
        },
        components:{
            bButton,
            bForm, bFormGroup, bFormCheckboxGroup, bFormCheckbox
        },
        async created() {
          await this.$http
                          .get("users/tags")
                          .then(res => this.setAvailableTags(res, this))
                          .catch(e => console.log(e));
          await this.$http
                          .get("users/" + this.id)
                          .then(res => this.setCurTags(res, this))
                          .catch(e => console.log(e));

        },
        methods: {
            onSubmit (evt) {
              evt.preventDefault();
              this.$http.patch("/users/self", {
                              hobbies: this.currTags
                           })
                          .then(res => console.log(JSON.stringify(res.body)))
                          .catch(e => console.log(e));
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
