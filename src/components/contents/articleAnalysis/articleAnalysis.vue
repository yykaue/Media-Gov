<template>
    <div class="articleAnalysis">
        <!--被转载指数与转载量分析-->
        <exponentAndAnalyze></exponentAndAnalyze>
        <!--文章传播路径分析-->
        <travelPath></travelPath>
        <!--文章被转载分析-->
        <articleReproduceAnalysis></articleReproduceAnalysis>
        <!--转载媒体地域分析-->
        <terrainAnalysis></terrainAnalysis>

    </div>
</template>

<script>
    import exponentAndAnalyze from './exponentAndAnalyze/exponentAndAnalyze.vue'
    import travelPath from './travelPath/travelPath.vue'
    import articleReproduceAnalysis from './articleReproduceAnalysis/articleReproduceAnalysis.vue'
    import terrainAnalysis from './terrainAnalysis/terrainAnalysis.vue'

    export default{
        name: 'articleAnalysis',
        components: {
            exponentAndAnalyze,
            travelPath,
            articleReproduceAnalysis,
            terrainAnalysis
        },
        created(){
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
                    if(item[0]=='nid'){
                        that.$store.state.obj.nid=item[1]
                    }
                });
            },*/
            getLocalStorage:function () {
                this.$store.state.obj.webname=localStorage.getItem('webname');
                this.$store.state.obj.wid=localStorage.getItem('wid');
                this.$store.state.obj.nid=localStorage.getItem('nid');
            }
        }
    }

</script>
<style scoped>

</style>