<template>
  <div id="control_panel_container" class="centralize_div">
    <div id="user_greeting">
        <h1> Control Panel </h1>
        <p>Welcome {{user.firstName}} {{user.lastName}}!</p>
    </div>
    <div class="centralize_div">
      <ul class = "menu_items">
        <li class="menu_item" v-for="action in actions">
          <app-card :card_details="action"></app-card>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
    import card from "@/components/card/card.vue"
    export default {
        name: 'user-panel',
         props: [
          'id'
         ],
         data: function() {
            return {
              user: null,
              actions: []
            };
        },
        components: {
            appCard: card
        },
        async created(){
          await this.$http
                          .get("users/" + this.id)
                          .then(res => this.setUserData(res, this))
                          .catch(e => alert(e.toString()));
          this.actions = [
                    {
                        title: "New Apartment",
                        text: "Expose your asset to our community",
                        img: "@/../static/images/user_panel/actions_menu/add.png",
                        linkText: "Add Apartment",
                        link: { name: 'add-apartment-page' }
                    },
                    {
                        title: "My apartments",
                        text: "Control your ads in the site",
                        img: "@/../static/images/user_panel/actions_menu/manage.png",
                        linkText: "Manage Apartments"
                    },
                    {
                        title: "Interested",
                        text: "Track all your saved ads",
                        img: "@/../static/images/user_panel/actions_menu/interested.png",
                        linkText: "My Interests"
                    },
                    {
                        title: "Hobbies",
                        text: "Improve the matching",
                        img: "@/../static/images/user_panel/actions_menu/hobbie.png",
                        linkText: "Select Hobbies",
                        link: { name: 'select-hobbies', params: { id: this.user._id } }
                    },
                    {
                        title: "Information",
                        text: "Change your profile information",
                         img: "@/../static/images/user_panel/actions_menu/edit.png",
                        linkText: "Edit information"
                    },
                    {
                        title: "Profile",
                        text: "Your public profile available for all users",
                         img: "@/../static/images/user_panel/actions_menu/profile.png",
                        linkText: "View profile",
                        link: { name: 'user-profile', params: { id: this.user._id } }
                    }]
        },
        methods: {
          setUserData(responseFromServer, pThis){
            pThis.user = responseFromServer.body.user;
          }
        }
    }
</script>

<style scoped>
.menu_items {
    list-style-type: none;
    padding: 0;
    overflow: hidden;
}
.centralize_div{
  display:table-cell; 
  vertical-align:middle; 
  text-align:center;
}

.menu_item{
    display: inline-block;
}
</style>
