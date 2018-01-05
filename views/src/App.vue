<template>
    <div>
        <header-section />
        <router-view />
    </div>
</template>

<script>
    import HeaderSection from '@/components/header-section/HeaderSection'

    export default {
        name: "app",
        components: { HeaderSection }
    };
</script>

<style>

</style>
