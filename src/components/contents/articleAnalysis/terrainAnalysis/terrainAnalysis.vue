<template>
    <div class="terrainAnalysis clear">
        <h2>转载媒体地域分析</h2>
        <terrainPie></terrainPie>
        <terrainMap></terrainMap>
    </div>
</template>

<script>
    import terrainPie from './terrainPie.vue'
    import terrainMap from './terrainMap.vue'

    export default {
        name: 'terrainAnalysis',
        components: {terrainPie, terrainMap}
    }

</script>

<style scoped>

</style>
