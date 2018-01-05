<template>
    <footer class="box">
        <b-container class="grid">
            <b-row>
                <b-col cols="5">
                    <h3>About Us</h3>
                    <roommates-logo class="logo" />
                    <p>
                        We are a young team....
                    </p>
                </b-col>
                <b-col>
                    <h3>Useful Links</h3>
                    <b-nav vertical>
                        <b-nav-item>First Link</b-nav-item>
                        <b-nav-item>Second Link</b-nav-item>
                        <b-nav-item>Third Link</b-nav-item>
                        <b-nav-item>Fourth Link</b-nav-item>
                    </b-nav>
                </b-col>
                <b-col class="contact-us">
                    <h3>Contact Us</h3>
                    You can contact us via social media:
                    <b-container class="social">
                        <b-row no-gutters>
                            <b-link v-for="(media, name) in socialMedia" :key="name"
                                    :href="media.href" v-b-tooltip.hover.top="media.name">
                                <b-col>
                                    <icon :name="name" :scale="1.7 * media.scale" />
                                </b-col>
                            </b-link>
                        </b-row>
                    </b-container>
                </b-col>
            </b-row>
        </b-container>
    </footer>
</template>

<script>
    import RoommatesLogo from "@/components/roommates-logo/RoommatesLogo"
    import bContainer from 'bootstrap-vue/es/components/layout/container'
    import bRow from 'bootstrap-vue/es/components/layout/row'
    import bCol from 'bootstrap-vue/es/components/layout/col'
    import bLink from 'bootstrap-vue/es/components/link/link'
    import bNav from 'bootstrap-vue/es/components/nav/nav'
    import bNavItem from 'bootstrap-vue/es/components/nav/nav-item'
    import Icon from 'vue-awesome/components/Icon'

    export default {
        name: "footer-section",
        components: {
            RoommatesLogo,
            bContainer, bRow, bCol, bLink,
            bNav, bNavItem,
            Icon
        },
        data() {
            return {
                socialMedia: {
                    facebook: {
                        name: 'Facebook',
                        href: '#',
                        scale: 1
                    },
                    instagram: {
                        name: 'Instagram',
                        href: '#',
                        scale: 1.19
                    },
                    'google-plus': {
                        name: 'Google+',
                        href: '#',
                        scale: 1.4
                    },
                    twitter: {
                        name: 'Twitter',
                        href: '#',
                        scale: 1.15
                    },
                }
            }
        }
    }
</script>

<style scoped>
    footer {
        border: none;
        border-top: #ddd solid 1px;
        padding: 25px 0;
        margin-top: 100px;
        background-color: #e6e6e6;
        font-size: 15px;
    }

    .container {
        padding: 0;
    }

    h3 {
        text-align: left;
        margin: 0 0 20px;
        padding: 0 0 10px;
        letter-spacing: 2px;
        font-size: 23px;
        font-weight: 400;
        text-transform: uppercase;
        border-bottom: #fdc600 solid 2px;
    }

    .logo {
        margin-bottom: 10px;
    }

    a.nav-link {
        color: #999;
        text-transform: uppercase;
    }

    .nav-item:first-child a.nav-link {
        padding-top: 0;
    }

    .nav-item:not(:first-child) {
        border-top: rgba(253, 198, 0, 0.8) dotted 1px;
    }

    .contact-us {
        text-align: center;
        font-size: 20px;
    }

    .social {
        width: 85%;
        margin-top: 35px;
        text-align: center;
    }

    .social a {
        color: #999;
        transition: color 0.3s;
    }

    .social a:hover {
        color: #555;
    }
</style>