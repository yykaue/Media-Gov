<template>
    <div class="webProportion clear">
        <div class="tops">
            <span>各网站类型被转载量占比</span>
        </div>
        <websPie></websPie>
        <websBar></websBar>

    </div>
</template>

<script>
    import websPie from './websPie.vue'
    import websBar from './websBar.vue'


    export default{
        name: 'webProportion',
        components: {
            websPie,
            websBar,
        }
    }
</script>

<style scoped>
    .webProportion {
        margin-top: 0.4rem;
    }
</style>
