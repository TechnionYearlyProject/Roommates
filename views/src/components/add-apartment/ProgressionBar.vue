<template>
    <div>
        <div class="row">
            <div class="col-md-12">
                <div class="progress" style="margin-top:20px; margin-bottom:20px;">
                    <div :class="{ one: true, 'bg-warning': (progression*25 >= 25), 'no-color':(progression*25 < 25) }"></div>
                    <div :class="{ two: true, 'bg-warning': (progression*25 >= 50), 'no-color':(progression*25 < 50) }"></div>
                    <div :class="{ three: true, 'bg-warning': (progression*25 >= 75), 'no-color':(progression*25 < 75) }"></div>
                    <div class="progress-bar bg-warning" :style="{ width: (progression * 25) + '%' }"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['progression']
    }
</script>

<style scoped>
    .one,
    .two,
    .three {
        position: absolute;
        margin-top: -10px;
        z-index: 0;
        height: 40px;
        width: 40px;
        border-radius: 25px;
    }

    .one {
        left: 25%;
    }

    .two {
        left: 48%;
    }

    .three {
        left: 72%;
    }

    .progress {
        z-index: 1;
    }

    .no-color {
        background-color: inherit;
    }

    .bg-warning {
        transition: all .5s ease;
    }
</style>
