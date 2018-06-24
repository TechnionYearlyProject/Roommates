<template>
<v-container>
<v-card>
  <v-card-title primary-title><span class="title">Contributors</span>
  <v-spacer/>
  <a href="https://github.com/TechnionYearlyProject/Roommates" style="text-decoration:none">Visit our GitHub repository<v-icon class="ml-1">mdi-github-box</v-icon></a>
  </v-card-title>
  <v-container grid-list-xl>
    <v-layout wrap row>
      <template v-for="(contributor, i) in v">
        <v-flex xs12 sm12 md6>
          <v-card class="grey lighten-4">
            <v-container fluid grid-list-lg>
              <v-layout row>
                <v-flex xs7>
                  <div>
                    <div class="headline">{{ contributor.name }}</div>
                    <v-divider class="mb-3"/>
                    <div>Software Engineering student in Technion</div>
                  </div>
                </v-flex>
                <v-flex xs5>
                  <img :src="contributor.image" height="125px">
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </template>
    </v-layout>
  </v-container>
</v-card>
</v-container>
</template>

<script>
import contributors from '../assets/contributors';
import colorGenerator from '../assets/colorGenerator';

export default {
  data() {
    return {
      v: contributors,
      generateColor: colorGenerator
    }
  }
};
</script>

<style scoped>
img {
    border-radius: 5px;
    width: 100px;
    float: right;
}
</style>
