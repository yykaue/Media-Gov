<template>
    <div class="outputAnalysis clear">
        <h2>发稿量分析</h2>
        <!--发稿量分析-->
        <analysis></analysis>
        <!--pcTop10-->
        <pcTop></pcTop>
    </div>
</template>

<script>
    import analysis from './analysis.vue'
    import pcTop from './pcTop.vue'

    export default {
        name: 'outputAnalysiss',
        components: {
            analysis,
            pcTop,
        }
    }


</script>

