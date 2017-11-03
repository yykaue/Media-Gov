<template>
    <div class="cityBarChart fl">
        <div class="tops">
            <span>{{titleName}}网站被转载量分析</span>
        </div>
        <div class="minbody rel">
            <!--加载中-->
            <div class="loading" :class="{block:LL==1}"></div>
            <!--暂无数据-->
            <div class="noData" :class="{block:NN==1}"></div>
            <div id="beReprintedAnalysis"></div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import VueResource from 'vue-resource';

    Vue.use(VueResource);
    export default{

        data(){
            return {
                screenWidth: document.body.clientWidth,
                titleName: '中央主要',
                LL:1,
                NN:0,
                eChart:'',
            }
        },

        created(){
            switch (this.$store.state.datas.webtype) {
                case 1:
                    this.titleName = '中央主要';
                    break;
                case 2:
                    this.titleName = '省级';
                    break;
                case 3:
                    this.titleName = '城市级';
                    break;
                case 4:
                    this.titleName = '全国行业';
                    break;
            }
            this.beReprintedAnalysis({
                starttime: this.$store.state.datas.starttime,
                endtime: this.$store.state.datas.endtime,
                webtype: this.$store.state.datas.webtype,
            })
        },
        methods: {
            beReprintedAnalysis: function (options) {
                $.ajax({
                    type: "GET",
                    url: this.$store.state.datas.url + 'webType/beReprintedAnalysis?starttime=' + options.starttime + '&endtime=' + options.endtime + '&webtype=' + options.webtype,
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: "json",
                    success: function (data) {
                        if (data.result == 1) {

                            this.LL=0;
                            this.NN=0;
                            var xData =[],datas1=[];
                            this.$store.state.reprintObj.webid=[];
                            this.$store.state.reprintObj.webname=[];
                            for (var i = 0; i < data.data.length; i++) {
                                xData.push(data.data[i].webname);
                                datas1.push(data.data[i].beReprintCount);
                                this.$store.state.reprintObj.webid.push(parseInt(data.data[i].webid));
                                this.$store.state.reprintObj.webname.push(data.data[i].webname);
                            }


                            var op = {
                                dom: document.getElementById('beReprintedAnalysis'),
                                data: [xData, datas1],
                                lines: [false, 0, 100],
                                color: ['#ac8961']
                            };
                            this.setECharts(op);


                        }else{
                            this.LL=0;
                            this.NN=1;
                        }
                    }.bind(this)
                });
            },
            setECharts: function (op) {
                var myChart1 = echarts.init(op.dom);
                this.eChart=myChart1;

                var option = {

                    tooltip: {
                        borderColor: '#BE915A',
                        borderWidth: 1,
                        trigger: "axis",
                        axisPointer: {
                            type: "shadow",
                            textStyle: {
                                color: "#fff"
                            }
                        },
                    },
                    /*legend: {
                        x: '28%',
                        top: '0%',
                        textStyle: {
                            color: '#fff',
                        },
                        data: [
                            {
                                name: '稿源单位',
                                textStyle: {
                                    fontSize: 12,
                                    fontWeight: 'bolder',
                                    color: '#fff'
                                },
                                icon: 'image://../../../../static/img/icon-03-01.png'
                            },
                        ]
                    },*/
                    grid: {
                        top:'5%',
                        left: '3%',
                        right: '0%',
                        bottom: '11%',
//                                    borderWidth: 0,
                        containLabel: true,
                        textStyle: {
                            color: "#fff"
                        }
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            data: op.data[0],
                            axisTick: {
                                show: false,
                                alignWithLabel: true
                            },
                            axisLine: {
                                show: false,
                                lineStyle: {
                                    color: 'rgba(192,172,155,0.5)'
                                }
                            },
                            splitLine: {
                                show: false
                            },

                            splitArea: {
                                show: false
                            },
                            axisLabel: {
                                interval: 0,
                                rotate: 45,
                                textStyle: {
                                    color: '#fff'
                                },
                            },
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            position: 'left',
                            axisLabel: {//字体
                                formatter: '{value}',
                                interval: 12,
                                textStyle: {
                                    color: '#fff'
                                }
                            },
                            splitLine: {//Y轴横线
                                show: true,
                                lineStyle: {
                                    color: 'rgba(171,153,136,0.3)',
                                    type: 'solid',
                                    width: 1
                                }
                            },
                            axisLine: {//Y轴竖线
                                show: false,
                                lineStyle: {
                                    color: 'rgba(192,172,155,0.5)',
                                }
                            },
                            axisTick: {
                                show: true,
                                length: 5,
                                lineStyle: {
                                    color: 'rgba(187,152,112,0.5)',
                                    type: 'solid',
                                    width: 1
                                }
                            },
                            splitArea: {
                                "show": false
                            },
                        },
                    ],

                    //下面移动条
                    /*dataZoom: [
                        {
                            show: op.lines[0],
                            height: 12,
                            xAxisIndex: [0],
                            bottom: 0,
                            start: op.lines[1],
                            end: op.lines[2],
                            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                            handleSize: '110%',
                            handleStyle: {
                                color: "#6cf",
                            },
                            textStyle: {
                                color: "#fff"
                            },
                            borderColor: "#fff"

                        },
                        {
                            type: "inside",
                            show: false,
                            height: 15,
                            start: 1,
                            end: 35
                        }
                    ],*/

                    series: [
                        {
                            name: '被转载量',
                            type: 'bar',
                            stack: 'sum',//柱状图叠加
                            barMaxWidth: 14,
//                                        barGap: "10%",
                            yAxis: 1,
                            itemStyle: {
                                normal: {
                                    color: op.color[0],
                                    barBorderRadius: 7,
                                    label: {
                                        show: false,
                                        textStyle: {
                                            color: "#fff"
                                        },
                                        position: "insideTop",
                                        formatter: function (p) {
                                            return p.value > 0 ? (p.value) : '';
                                        }
                                    }
                                }
                            },
                            data: op.data[1]
                        },
                    ]
                };

                myChart1.setOption(option);
                myChart1.resize();
                window.addEventListener("resize", function () {

                    var time = null;
                    clearTimeout(time);
                    time = setTimeout(function () {
                        myChart1.resize();
                    }, 300);

                });
            },

        },
        computed: {
            datasChange(){
                return this.$store.state.datas
            }
        },
        watch: {
            datasChange: {
                handler: function (val, oldVal) {
                    //清除echarts
                    if(this.eChart){
                        this.eChart.clear();
                    }
                    this.LL=1;
                    this.NN=0;
                    //titleName
                    switch (val.webtype) {
                        case 1:
                            this.titleName = '中央主要';
                            break;
                        case 2:
                            this.titleName = '省级';
                            break;
                        case 3:
                            this.titleName = '城市级';
                            break;
                        case 4:
                            this.titleName = '全国行业';
                            break;
                    }
                    this.beReprintedAnalysis({
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
    .cityBarChart{
        width: 7.26rem;
    }
    #beReprintedAnalysis{
        width:6.76rem;
        height:4.4rem;
    }

</style>
