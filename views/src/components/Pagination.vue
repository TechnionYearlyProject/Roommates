<template>
    <ul class="pagination">
        <li class="page-item"><a class="page-link" href="#">First</a></li>
        <li v-for="p in (end - start + 1)"
            :class="{ 'page-item': true, active: current == p - 1 + start }"
        ><a class="page-link" href="#">{{ p - 1 + start }}</a></li>
        <li class="page-item"><a class="page-link" href="#">Last</a></li>
    </ul>
</template>

<script>
    export default {
        name: "pagination",
        props: [ 'start', 'end', 'current' ]
    }
</script>

<style scoped>
    .pagination {
        display: inline-flex;
    }

    a {
        color: #c72d2d !important;
    }

    .active a {
        background-color: #c72d2d !important;
        color: #fff !important;
        border: 1px solid #ddd !important;
    }
</style>