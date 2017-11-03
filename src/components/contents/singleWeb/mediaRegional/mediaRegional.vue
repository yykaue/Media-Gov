<template>
    <div class="mediaRegional clear">
        <h2>转载媒体地域分析</h2>
        <areaPie></areaPie>
        <areaMap></areaMap>
    </div>
</template>

<script>
    import areaPie from './areaPie.vue'
    import areaMap from './areaMap.vue'
    export default {
        name: 'mediaRegional',
        data () {
            return {
                msg: ''
            }
        },
        components: {areaPie, areaMap}
    }
</script>

<style scoped>

</style>
