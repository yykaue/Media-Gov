<template>
    <div class="indexs">
        <!--传播力指数分析-->
        <transmissibilitys></transmissibilitys>
        <!--发稿量分析-->
        <outputAnalysiss></outputAnalysiss>
        <!--转载量分析-->
        <reprintAnalysiss></reprintAnalysiss>
        <!--被转载量分析-->
        <reprintedAnalysiss></reprintedAnalysiss>
        <!--热词分析-->
        <hotwordAnalysiss></hotwordAnalysiss>
    </div>
</template>

<script>
    import Vue from 'vue'
    import transmissibilitys from './transmissibilitys/transmissibility.vue'
    import outputAnalysiss from './outputAnalysis/outputAnalysis.vue'
    import reprintAnalysiss from './republished/reprintAanalysis.vue'
    import reprintedAnalysiss from './reprintedAnalysiss/reprintedAnalysis.vue'
    import hotwordAnalysiss from './wordCloud/hotwordAnalysis.vue'
    export default {
        name: 'indexs',
        components: {
            transmissibilitys,
            outputAnalysiss,
            reprintAnalysiss,
            reprintedAnalysiss,
            hotwordAnalysiss
        }
    }
</script>

<style scoped>

</style>