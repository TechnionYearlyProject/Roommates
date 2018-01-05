<template>
    <span class="price-tag">
        <icon name="tag" scale="5.5" />
        <span>{{ value.toLocaleString() }} ₪</span>
    </span>
</template>

<script>
    import Icon from 'vue-awesome/components/Icon'

    export default {
        name: "price-tag",
        props: {
            value: Number
        },
        components: {
            Icon
        }
    }
</script>

<style scoped>
    .price-tag {
        color: #fdc600;
        margin-top: 5px;
        transform: rotate(-37deg) scale(1.1);
    }

    .price-tag span {
        position: absolute;
        top: 35px;
        left: 13px;
        transform: rotate(45deg);
        color: #fff;
        font-size: 15px;
        font-weight: bold;
        display: inline-block;
        width: 53px;
        height: 25px;
        overflow: visible;
        text-align: center;
        white-space: nowrap;
    }
</style>