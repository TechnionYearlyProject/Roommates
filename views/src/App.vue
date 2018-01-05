<template>
    <div>
        <header-section />
        <router-view />
        <footer-section />
    </div>
</template>

<script>
    import HeaderSection from '@/components/header-section/HeaderSection'
    import FooterSection from "@/components/footer-section/FooterSection";

    export default {
        name: "app",
        components: {
            FooterSection,
            HeaderSection
        }
    };
</script>

<style>

</style>
