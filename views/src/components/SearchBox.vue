<template>
    <div id="search-box">
        <button type="button" class="btn btn-default btn-sm">
            <i class="fa fa-filter" aria-hidden="true"></i>
        </button>
        <input type="text" placeholder="Enter Location..."/>
        <button type="button" class="btn btn-default btn-sm">
            <i class="fa fa-search" aria-hidden="true"></i>
        </button>
    </div>
</template>

<script>
    export default {
        name: "search-box"
    }
</script>

<style scoped>
    #search-box {
        width: 360px;
        margin: 20px auto 0;
        font-size: 0;
    }

    #search-box input {
        width: 300px;
        padding: 4px 5px;
        border: solid 1px #c72d2d;
        border-right-width: 0;
        font-size: 16px;
    }

    #search-box button {
        display: inline-block;
        background: #c72d2d;
        margin: -14px 0 0;
        color: #fff;
        border-radius: 3px 0 0 3px;
        width: 30px;
        height: 34px;
        border: none;
        outline: none;
    }

    #search-box button:last-child {
        background: #fff;
        color: #c72d2d;
        border: solid 1px #c72d2d;
        border-left-width: 0;
        border-radius: 0 3px 3px 0;
    }
</style>