<template>
    <div class="exponent clear">
        <!--仪表盘-->
        <instrument></instrument>
        <!--右侧信息总览等-->
        <rest></rest>
    </div>
</template>

<script>
    import instrument from './instrument.vue'
    import rest from './rest.vue'
    export default {
        name: 'exponent',
        components: {
            instrument,
            rest,
        },
    }
</script>

<style scoped>
    .exponent {
        margin-top: 0.4rem;
        width: 12.78rem;
    }
</style>