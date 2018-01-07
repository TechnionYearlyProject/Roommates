<template>
    <b-button-group>
        <b-button size="lg" variant="primary"
                  v-for="tag in tags" :key="tag">{{ tag.name }}
        </b-button>
    </b-button-group>
</template>

<script>
    import bButton from 'bootstrap-vue/es/components/button/button';

    export default {
         props: [
          'tags'
        ],
        components:{
          bButton
        }
    }
</script>

<style scoped>

.btn-primary, .btn-primary:hover, .btn-primary:active, .btn-primary.active {
    color: #fff !important;
    background-color: #fdc600 !important;
    border-color: #fdc600 !important;
    margin: 5px;
}

</style>