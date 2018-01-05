<template>
    <div>
        <div class="container">
            <add-apartment-form1 :info="info1" :isReadOnly="true" />
            <hr>
            <add-apartment-form2 :info="info2" :isReadOnly="true" />
            <hr>
            <add-apartment-form3 :info="info3" :isReadOnly="true" />
        </div>
    </div>
</template>

<script>
    import AddApartmentForm1 from "@/components/add-apartment/AddApartmentForm1.vue";
    import AddApartmentForm2 from "@/components/add-apartment/AddApartmentForm2.vue";
    import AddApartmentForm3 from "@/components/add-apartment/AddApartmentForm3.vue";

    export default {
        props: ['info1', 'info2', 'info3'],
        components: {
            AddApartmentForm1,
            AddApartmentForm2,
            AddApartmentForm3
        }
    };
</script>

<style scoped>
    input {
        vertical-align: middle;
    }

    .s-icon {
        display: inline-block;
        width: 30px;
        text-align: center;
        color: #777;
        font-size: 300%;
        margin-right: 10px;

        /* secrets to align text and icons */
        line-height: 120%;
        vertical-align: middle;
        margin-top: -5px;
    }
</style>
