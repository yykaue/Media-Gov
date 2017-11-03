<template>
    <div class="exponentAndAnalyze clear">
        <h2>被转载指数与转载量分析</h2>
        <!--文章转载指数及影响地域-->
        <articleCover></articleCover>
        <!--被装载量走势-->
        <bereproduceAnalysis></bereproduceAnalysis>
    </div>
</template>

<script>
    import articleCover from './articleCover.vue'
    import bereproduceAnalysis from './bereproduceAnalysis.vue'

    export default {
        name: 'exponentAndAnalyze',
        components: {
            articleCover,
            bereproduceAnalysis,
        }
    }
</script>

<style scoped>

</style>