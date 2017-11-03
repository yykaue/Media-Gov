<template>
    <div class="contents clear">
        <asides></asides>
        <mainbody></mainbody>
    </div>
</template>

<script>
    import asides from './aside.vue'
    import mainbody from './mainbody.vue'
    export default{
        name: 'contents',
        components: {asides, mainbody}
    }
</script>

<style scoped>
    .contents {
        background-color: #32312f;
    }
</style>
