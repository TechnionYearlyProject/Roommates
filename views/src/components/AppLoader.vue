<template>
    <v-layout app row justify-center>
        <v-dialog v-model="loading" persistent content-class="elevation-0">
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

</style>
