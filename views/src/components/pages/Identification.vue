<template>
    <b-container fluid class="container grid">
        <b-row>
            <b-col md="6" order-md="1" class="mb-3">
                <login-form />
            </b-col>
            <b-col md="6" order-md="2">
                <register-form />
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import RegisterForm from "@/components/identification/RegisterForm.vue"
    import LoginForm from "@/components/identification/LoginForm.vue"
    import bContainer from 'bootstrap-vue/es/components/layout/container'
    import bRow from 'bootstrap-vue/es/components/layout/row'
    import bCol from 'bootstrap-vue/es/components/layout/col'

    export default {
        components: {
            RegisterForm,
            LoginForm,
            bContainer, bRow, bCol
        }
    }
</script>

<style scoped>
    .container {
        margin-top: 5%;
        padding: 0;
    }
</style>
