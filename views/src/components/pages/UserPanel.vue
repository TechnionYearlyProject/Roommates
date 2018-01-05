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
                  hobbies: [1,2,3],
                  _publishedApartments: [1],
                  _interestedApartments: [2],
                  email: 'adi@gmail.com'
                },
                actions: [
                    {
                        title: "New Apartment",
                        text: "Expose your asset to our community",
                        img: "@/../static/images/user_panel/actions_menu/add.png",
                        linkText: "Add Apartment"
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
                        linkText: "Select Hobbies"
                    },
                    {
                        title: "Information",
                        text: "Change your profile information",
                         img: "@/../static/images/user_panel/actions_menu/edit.png",
                        linkText: "Edit information"
                    }
                ]
            };
        },
        components: {
            appCard: card
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
