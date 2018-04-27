<template>
    <v-layout app row justify-center>
        <v-dialog dark v-model="loading" persistent fullscreen content-class="loading-dialog">
            <v-container fill-height>
                <v-layout row justify-center align-center>
                    <v-progress-circular indeterminate :size="70" :width="7" color="purple"></v-progress-circular>
                </v-layout>
            </v-container>
        </v-dialog>
    </v-layout>
</template>

<script>
    export default {
      props: {
        loading: {
          type: Boolean,
          default: false
        }
      }
    };
</script>

<style scoped>
    .loading-dialog {
      background-color: #303030;
    }
</style>
