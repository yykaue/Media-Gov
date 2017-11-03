<template>
    <div class="ratioAnalysisPie fl">
        <div class="title">
            <span>"稿源单位"/"非稿源单位"被转载占比分析</span>
        </div>

        <div class="minbody rel">
            <!--加载中-->
            <div class="loading" :class="{block:LL==1}"></div>
            <!--暂无数据-->
            <div class="noData" :class="{block:NN==1}"></div>
            <div id="ratioAnalysisPie-l"></div>

        </div>
        <div class="sourcerate" :class="{block:LL==0}">
            <span>稿源单位</span>
            <div class="ratio">{{sourcerate}}</div>
        </div>
        <div class="unsourcerate" :class="{block:LL==0}">
            <span>非稿源单位</span>
            <div class="ratio">{{unsourcerate}}</div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'

    export default {
        data(){
            return {
                sourcerate: '-',
                unsourcerate: '-',
                LL:1,
                NN:0,
                eChart:'',
            }
        },
        created(){
            this.ratioAnalysisPie({
                starttime: this.$store.state.datas.starttime,
                endtime: this.$store.state.datas.endtime,
                webtype: this.$store.state.datas.webtype,
            })
        },
        methods: {
            ratioAnalysisPie: function (option) {
                $.ajax({
                    type: "GET",
                    url: this.$store.state.datas.url + 'webType/newReprintedrate?starttime=' + option.starttime + '&endtime=' + option.endtime + '&webtype=' + option.webtype,
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: "json",
                    success: function (data) {
                        if (data.result == 1) {
                            this.LL=0;
                            this.NN=0;
                            var data = data.data[0];
                            this.sourcerate = data.sourcerate;      //稿源占比
                            this.unsourcerate = data.unsourcerate;  //非稿源占比
                            var op = {
                                dom: document.getElementById('ratioAnalysisPie-l'),
                                data: [data.source, data.unsource]
                            };
                            this.setEchart(op);
                        }else{
                            this.LL=0;
                            this.NN=1;
                        }
                    }.bind(this)
                });
            },
            setEchart: function (op) {
                var myChart = echarts.init(op.dom);
                this.eChart=myChart;

                var option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: {c} ({d}%)"
                    },
                    color: ['#609bc5', '#927496'],
                    legend: {
                        orient: 'horizontal', //列表的横纵排列样式
                        color: '#fff',
                        inactiveColor: '#fff', //图例关闭时的颜色
                        x: '30%',
                        y: "10%",
                        data: ['稿源单位', '非稿源单位'],
                        itemGap: 40,       //图例之间的距离
                        itemWidth: 10,     //每个图例标识宽度
                        itemHeight: 10,    //图例标识的高度
                        textStyle: {       //图例标识旁边的文字的样式
                            color: '#fff',
                            fontSize: '12'
                        }
                    },
                    series: [
                        {
                            name: '被转载占比分析',
                            type: 'pie',
                            radius: ['50%', '60%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {    //设置中心位子文字的样式
                                        fontSize: '20',
//                  fontWeight: 'bold',
                                        color: '#fff'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: [
                                {value: op.data[0], name: '稿源单位'},
                                {value: op.data[1], name: '非稿源单位'}
                            ]
                        }
                    ]
                };
                myChart.setOption(option);

                window.addEventListener("resize", function () {
                    var time = null;
                    clearTimeout(time);
                    time = setTimeout(function () {
                        myChart.resize();
                    }, 300);
                });
            }
        },
        computed: {
            datasChange(){
                return this.$store.state.datas
            }
        },
        watch: {
            //对datas监听
            datasChange: {
                handler: function (val, oldVal) {
                    //清除echarts
                    if(this.eChart){
                        this.eChart.clear();
                    }
                    this.LL=1;
                    this.NN=0;

                    this.ratioAnalysisPie({
                        starttime: val.starttime,
                        endtime: val.endtime,
                        webtype: val.webtype,
                    });
                },
                deep: true
            },

        }

    }
</script>

<style scoped>
    .ratioAnalysisPie {
        position: relative;
        margin-left: .12rem;
        color: #fff;
        font-size: .12rem;
    }

    .title {
        width: 4.4rem;
        height: .51rem;
        background-color: rgba(67, 61, 54, 0.7);
        line-height: .51rem;
        font-size: .16rem;
        color: #fff;
    }

    .title span {
        margin-left: .27rem;
    }

    .ratioAnalysisPie .minbody{
        width: 4.4rem;
        height: 4.9rem;
        padding: 0 !important;
    }
    #ratioAnalysisPie-l {
        /*position: relative;*/
        width: 4.4rem;
        height: 4.9rem;
    }

    .sourcerate {
        text-align: center;
        position: absolute;
        bottom: .4rem;
        left: 1rem;
        display: none;
    }

    .unsourcerate {
        text-align: center;

        position: absolute;
        bottom: .4rem;
        right: 1rem;
        display: none;
    }

    .ratio {
        width: .98rem;
        height: .34rem;
        border: .01rem solid #696055;
        margin-top: .1rem;
        text-align: center;
        line-height: .34rem;
        font-size: .2rem;
    }

    .sourcerate .ratio {
        color: #609bc5;
    }

    .unsourcerate .ratio {
        color: #927496;
    }
</style>
