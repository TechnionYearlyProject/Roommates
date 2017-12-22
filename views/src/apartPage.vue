<template>
<div class="apartPage">
    <div class="container">
        <div class="row">
            <div class="col-sm">
                <img src="https://37b3a77d7df28c23c767-53afc51582ca456b5a70c93dcc61a759.ssl.cf3.rackcdn.com/1024x768/54850_3971_001.jpg"
                    width="500" height="auto"/>
                    <p><br></p>
                <div class="card" style="width: 20rem;">
                    <div class="card-header">
                        apartment information:
                    </div>
                    <div class="card-body">
                    <ul class="list-group list-group-flush">
                    <li class="list-group-item">address: {{apartment.address.city}},{{apartment.address.street}}, no. {{apartment.address.houseNumber}}, entrance {{apartment.address.entranceNumber}}</li>
                    </ul>
                    <p class="card-text"></p>
                    </div>
                </div>
            </div>
            <div class="col-sm">
                <div class="card" style="width: 20rem;">
                    <div class="card-header">
                        publisher
                    </div>
                <img class="card-img-top" 
                src="https://images.pexels.com/photos/428339/pexels-photo-428339.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb" alt="Card image cap">
                    <div class="card-body">
                    <h4 class="card-title">publisher info:</h4>
                    <ul class="list-group list-group-flush">
                    <li class="list-group-item">{{auther.firstName}} {{auther.lastName}}</li>
                    <li class="list-group-item">contact info:<br>
                    cell number: {{auther.contactInfo.cellNumber}}<br>
                    e-mail address: {{auther.contactInfo.eMail}}
                    </li>
                    </ul>
                    <p class="card-text"></p>
                    </div>
                </div>
                <div class="card" style="width: 20rem;">
                    <div class="card-header">
                        interested users:
                    </div>
                    <img class="card-img-top" 
                        <div class="card-body">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item" v-for="user in users">{{user.firstName}} {{user.lastName}}
                            <a href="#" class="btn btn-secondry btn-sm" >user info</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <div class="card" style="width: 60rem;">
        <div class="card-header">
            description:
        </div>
        <div class="card-body">
            <p class="card-text">{{apartment.description}}</p>
        </div>
    </div>

    <div class="card" style="width: 60rem;">
        <div class="card-header">
            users comment:
        </div>
        <div class="card-body">
            <ul class="list-group list-group-flush">
                <li class="list-group-item" v-for="comment in apartment.comments">
                    {{comment.comment}} at: {{comment.writenAt}}
                </li>
            </ul>
            <p class="card-text"></p>
        </div>
    </div>

</div>


</div>



</template>


<<script>

export default {
  name: 'apartPage',
  data(){
      return{
          title: 'hi there',
          auther:{
                  firstName:'chanan',
                  lastName:'ben tal',
                  _id:'1',
                  img:"https://images.pexels.com/photos/428339/pexels-photo-428339.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb",
                  contactInfo:{
                      cellNumber: '054-4204942',
                      eMail: 'chananbental@gmail.com'
                  }
          },
          users: [
              {
                  firstName:'chanan',
                  lastName:'ben tal',
                  _id:'1'
              },
              {
                  firstName:'hanan',
                  lastName:'ben-tal',
                  _id:'2'
              },
              {
                  firstName:'khanan',
                  lastName:'ben tal',
                  _id:'3'
              },
              {
                  firstName:'gabi',
                  lastName:'ben-tal',
                  _id:'4'
              },
          ],
          apartment:{
            _id:'1',
            createdBy:'1',
            address:{  
                state:'Israel',
                city:'chaifa',
                street:'shalom alychem',
                houseNumber:18,
                entranceNumber:1,
            },
            floor: 1,
            totalFloors: 4,
            description:"a very nice place",
            price: 1200,
            images:[
                "chrome://theme/IDR_PRODUCT_LOGO",
                "chrome://theme/IDR_PRODUCT_LOGO",
                "chrome://theme/IDR_PRODUCT_LOGO"
            ],
            comments:[
                {
                    commentBy:'4',
                    writenAt:"2017-01-01",
                    comment:" i had a look around and i realy like the place"
                },
                {
                    commentBy:'2',
                    writenAt:"2017-01-01",
                    comment:" i lived here for a year, realy recommend"
                },
                {
                    commentBy:'3',
                    writenAt:"2017-01-01",
                    comment:" the landlord is very nice"
                },
            ]
          }
      }
  }
}
</script>


<<style scoped>
bode{
  position: relative;
};
</style>
