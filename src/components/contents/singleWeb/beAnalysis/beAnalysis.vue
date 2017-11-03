<template>
    <div class="beAnalysis">
        <h2>被转载量分析</h2>
        <!--被转载量走势-->
        <trend></trend>
        <!--各网站类型被转载量占比-->
        <webProportion></webProportion>
    </div>
</template>

<script>
    import trend from './trend.vue'
    import webProportion from './webProportion/webProportion.vue'


    export default{
        name: 'beAnalysis',
        components: {
            trend,
            webProportion,
        }
    }

</script>