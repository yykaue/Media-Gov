<template>
    <div class="mainbody">
        <div class="mask">
            <!--选择时间-->
            <settimes></settimes>

            <router-view></router-view>
            <!--四个主页-->
            <!--<indexs></indexs>-->
            <!--单个网站分析-->
            <!--<singleWeb></singleWeb>-->
        </div>
    </div>
</template>

<script>
    import settimes from './settime.vue'

    //    import indexs from './index/indexs.vue'
    //    import singleWeb from './singleWeb/singleWeb.vue'
    export default {
        name: 'mainbody',
        components: {
            settimes,
//            indexs,
//            singleWeb,
        },
        mounted: function () {
            //临时登录
//            this.isTest();
            //登录状态判断
            this.isBack({
                starttime: this.$store.state.datas.starttime,
                endtime: this.$store.state.datas.endtime,
            });


        },
        updated: function () {
            var docEl = window.document.documentElement;
            var width = docEl.getBoundingClientRect().width;
            if (width > 1440) {
                width = 1440;
            } else if (width <= 1000) {
                width = 1000;
            }
            var rem = width / 14.4;
            docEl.style.fontSize = rem + 'px';
        },
        methods: {
            isGoArtic: function () {
                if (localStorage.getItem('goTo') == 1) {
                    this.$router.push({path: '/articleAnalysis'});
                } else if (localStorage.getItem('goTo') == 2) {
                    this.$router.push({path: '/search'});
                } else if (localStorage.getItem('goTo') == 3) {
                    this.$router.push({path: '/listMore'});
                } else {
                    this.$router.push({path: '/indexs'});
                }

            },
            isTest: function () {
                $.ajax({
                    type: "GET",
                    url: this.$store.state.datas.url + 'jusfoun-entmedia/ctLogin/LonginStatus?loginName=wangxinban&passWord=123456',
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: "json",
                    success: function (data) {

                    }.bind(this)
                });
            },
            isBack: function (op) {
                $.ajax({
                    type: "GET",
                    url: this.$store.state.datas.url + 'webType/PCTopAnalysis?starttime='+op.starttime+'&endtime='+op.endtime+'&webtype=1',
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: "json",
                    success: function (data) {
                        if (data.result == 1) {
                            this.isGoArtic();
                        } else {
//                            alert()
                            var exits = this.$store.state.exitUrl;
                            window.location.href = exits;
                        }
                    }.bind(this)
                });
            }

        }
    }
</script>

<style scoped>

</style>