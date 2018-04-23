<template>
    <div>
        <header-section />
        <router-view />
        <footer-section />

        <chat />
    </div>
</template>

<script>
    import HeaderSection from '@/components/header-section/HeaderSection'
    import FooterSection from "@/components/footer-section/FooterSection";
    import Chat from "@/components/chat/Chat";

    export default {
        name: "app",
        components: {
            Chat,
            FooterSection,
            HeaderSection
        }
    };
</script>

<style>

</style>
