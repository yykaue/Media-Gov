<template>
    <div class="singleWeb">
        <!--传播力指数及仪表盘-->
        <exponent></exponent>
        <!--PC传播力指数走势-->
        <PCtrend></PCtrend>
        <!--发稿量分析-->
        <analysis></analysis>
        <!--被转载量分析-->
        <beAnalysis></beAnalysis>
        <!--原创文章排行-->
        <articleRanking></articleRanking>
        <!--转载媒体地域分析-->
        <mediaRegional></mediaRegional>
    </div>
</template>

<script>
    import exponent from './exponent/exponent.vue'
    import PCtrend from './PCtrend/PCtrend.vue'
    import analysis from './analysis/analysis.vue'
    import beAnalysis from './beAnalysis/beAnalysis.vue'
    import articleRanking from './articleRanking/articleRanking.vue'
    import mediaRegional from './mediaRegional/mediaRegional.vue'

    export default{
        name: 'singleWeb',
        components: {
            exponent,
            PCtrend,
            analysis,
            beAnalysis,
            articleRanking,
            mediaRegional,
        },
        created(){
//            this.getCookie();
            this.getLocalStorage();
        },
        methods:{
            /*getCookie:function () {
                var that=this;
                var arr1=document.cookie.split('; ');
                var arr2=[];
                for(var i=0;i<arr1.length;i++){
                    arr2.push(arr1[i].split('='));
                }
                arr2.forEach(function (item) {
                    if(item[0]=='webname'){
                        that.$store.state.obj.webname=item[1]
                    }
                    if(item[0]=='wid'){
                        that.$store.state.obj.wid=item[1]
                    }
                });
            },*/
            getLocalStorage:function () {
                this.$store.state.obj.webname=localStorage.getItem('webname');
                this.$store.state.obj.wid=localStorage.getItem('wid');
            }
        },
        computed: {
            contentChange(){
                return this.$store.state.content
            }
        },
        watch:{
            contentChange: {
                handler: function (val, oldVal) {
                    this.getLocalStorage();
                },
                deep: true
            },
        }
    }

</script>