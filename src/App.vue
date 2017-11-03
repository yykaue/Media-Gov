<template>
    <div id="app">
        <headers></headers>
        <contentsaa></contentsaa>
        <Footers></Footers>
        <div id="toTop" @click="toTop"></div>
    </div>
</template>

<script>

    import headers from './components/header.vue'
    import contentsaa from './components/contents/contents.vue'
    import Footers from './components/footer.vue'
    export default {
        name: 'app',
        components: {headers, contentsaa, Footers},
        mounted:function () {
            this.windowScroll();
        },
        methods: {
            toTop(){
                $(function () {
                    $('body').animate({scrollTop: 0}, 700);
                });
            },
            windowScroll(){
                $(window).scroll(function () {
//                        获取窗口的滚动条的垂直位置
                    var s = $(window).scrollTop();
//                        当窗口的滚动条的垂直位置大于页面的最小高度时，让返回顶部元素渐现，否则渐隐
//                        console.log(s);
                    if (s < 600) {
                        $("#toTop").fadeOut(200);
                    } else {
                        $("#toTop").fadeIn(200);
                    }

                });
            }
        }
    }
</script>

<style>
    #app {
        min-width: 1000px;
        max-width: 1440px;
        margin: 0 auto;
    }

    #toTop {
        width: 0.4rem;
        height: 0.4rem;
        background: #000;
        position: fixed;
        z-index: 100;
        right: 0.4rem;
        bottom: 0.5rem;
        background: url("../static/img/icon-toTop.png") center center no-repeat;
        background-size: 0.4rem 0.4rem;
        cursor: pointer;
        display: none;
    }

    .hover {
        display: none;
    }
</style>
