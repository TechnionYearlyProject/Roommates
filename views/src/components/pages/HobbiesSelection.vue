<template>
<div id="hobbies_selection_container" class="centralize_div">
    <h1> Help us improve the results! </h1>
    <b-form @submit="onSubmit" @reset="onReset">
      <b-form-group label="Choose your hobbies:">
        <br>
        <b-form-checkbox-group id="hobbiescbs" name="hobbies" stacked v-model="user.hobbies" :options="tags" class="hobbie_item">
        </b-form-checkbox-group>
      </b-form-group>
      <br>
      <b-button type="submit" variant="primary">SAVE</b-button>
      <b-button type="reset" variant="primary">CANCEL</b-button>
    </b-form>
</div>
</template>

<script>
    import bButton from 'bootstrap-vue/es/components/button/button';
    import formCheckbox from 'bootstrap-vue/es/components';
    export default {
        name: 'select-hobbies',
         data: function() {
            return {
              user:
                {
                  firstName: 'Adi',
                  lastName: 'Omari',
                  birthdate: 1435479435,
                  gender: 'male',
                  mobilephone: '0542312213',
                  image: 'src/assets/imgs/apartments/1.jpg',
                  about: 'I am a mentor',
                  hobbies: [1,3],
                  _publishedApartments: [1],
                  _interestedApartments: [2],
                  email: 'adi@gmail.com'
                },
                tags: [
                    {
                       value: 1,
                       text: "Tag1"
                    },
                    {
                       value: 2,
                       text: "Tag2"
                    },
                    {
                       value: 3,
                       text: "Tag3"
                    },
                    {
                       value: 4,
                       text: "Tag4"
                    },
                    
                ]
            };
        },
        components:{
            bButton,
            formCheckbox
        },
        methods: {
            onSubmit (evt) {
              evt.preventDefault();
              alert(JSON.stringify(this.user.hobbies));
            },
            onReset (evt) {
              evt.preventDefault();
               alert("Canceled");
            }
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

.hobbie_item{
    display: inline-block;
}

</style>
