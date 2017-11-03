<template>
    <div class="reprintedAnalysis clear">
        <h2>被转载量分析</h2>
        <cityBarChart></cityBarChart>
        <topMedia></topMedia>
    </div>
</template>

<script>
    import cityBarChart from './cityBarChart.vue'
    import topMedia from './topMedia.vue'
    export default {
        name: 'reprintedAnalysis',
        components: {cityBarChart, topMedia}
    }
</script>

<style>
    .reprintedAnalysis {
        margin-top: .37rem;
    }
</style>
