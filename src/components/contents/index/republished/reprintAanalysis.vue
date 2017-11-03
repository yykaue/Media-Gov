<template>
    <div class="reprintAnalysis clear">
        <h2>转载量分析</h2>
        <cityRatioAnalysis></cityRatioAnalysis>
        <cityRatioAnalysisPie></cityRatioAnalysisPie>
    </div>
</template>

<script>
    import cityRatioAnalysis from './cityRatioAnalysis.vue'
    import cityRatioAnalysisPie from './cityRatioAnalysisPie.vue'

    export default {
        name: 'reprintedAnalysis',
        components: {
            cityRatioAnalysis,
            cityRatioAnalysisPie
        }
    }
</script>

<style>
    .reprintAnalysis {
        margin-top: .37rem;
    }
</style>


