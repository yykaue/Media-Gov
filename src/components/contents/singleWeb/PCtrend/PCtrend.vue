<template>
    <div class="PCtrend">
        <h2>PC传播力指数走势</h2>
        <div class="minbody rel">
            <!--加载中-->
            <div class="loading" :class="{block:LL==1}"></div>
            <!--暂无数据-->
            <div class="noData" :class="{block:NN==1}"></div>
            <div id="vagilityExponentTrend"></div>
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
                LL:1,
                NN:0,
                eChart:'',
            }
        },

        created(){
            this.vagilityExponentTrend({
                starttime: this.$store.state.datas.starttime,
                endtime: this.$store.state.datas.endtime,
                Wid: this.$store.state.obj.wid,
            })
        },
        methods: {
            // PC传播力指数走势
            vagilityExponentTrend: function (options) {
                $.ajax({
                    type: "GET",
                    url: this.$store.state.datas.url + 'jusfoun-entmedia/newurlsBtime/vagilityExponentTrend?starttime=' + options.starttime + '&endtime=' + options.endtime + '&Wid=' + options.Wid,
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: "json",
                    success: function (data) {
                        if (data.result == 1) {

                            this.LL=0;
                            this.NN=0;
                            var xData = [], datas1 = [];
                            for (var i = 0; i < data.data.length; i++) {
                                xData.push(data.data[i].time);
                                datas1.push(data.data[i].count);
                            }


                            var op = {
                                dom: document.getElementById('vagilityExponentTrend'),
                                data: [xData, datas1],
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
                        padding: [13, 15, 13, 15],
                        formatter: function (params, ticket, callback) {
                            var res = '<span style="font-size: 15px;">'+params[0].name + '统计</span><br/>' + params[0].seriesName + '： ' +params[0].value;
                            return res;
                        },
                        textStyle:{
                            fontSize:12,
                        },
                        axisPointer: {
                            type: "line",
                            textStyle: {
                                color: "#fff",
                            }
                        },
                    },
                    legend: {
                        x: '45%',
                        top: '0%',
                        textStyle: {
                            color: '#fff',
                        },
                        data: [
                            {
                                name: '传播力指数',
                                textStyle: {
                                    fontSize: 12,
                                    fontWeight: 'bolder',
                                    color: '#fff'
                                },
                                icon: 'image://../../../../../static/img/icon-04-01.png'
                            }
                        ]
                    },
                    grid: {
                        left: '0',
                        right: '3%',
                        bottom: '0%',
//                                    borderWidth: 0,
                        containLabel: true,
                        textStyle: {
                            color: "#fff"
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisTick: {
                            show: true,
                            alignWithLabel: true,
                            inside: true,
                            lineStyle: {
                                color: '#b09879',
                                width: 2,
                            }
                        },
                        axisLabel: {
                            interval: 1,//间隔显示
                        },
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: '#fff',
                            }
                        },
                        data: op.data[0]
                    },
                    yAxis: {
                        type: 'value',
//                        boundaryGap: [0, '100%']
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
                                color: 'rgba(170,152,136,0.3)',
                                type: 'solid',
                                width: 1
                            }
                        },
                        axisLine: {//Y轴竖线
                            show: false,
                            lineStyle: {
                                color: '#fff'
                            }
                        },
                        axisTick: {
                            show: true,
                            length: 5,
                            lineStyle: {
                                color: 'rgba(181,153,117,0.6)',
                                type: 'solid',
                                width: 5
                            }
                        },
                        splitArea: {
                            "show": false
                        },
                    },

                    /*dataZoom: [
                     {
                     type: 'inside',
                     start: 0,
                     end: 10
                     },
                     {
                     start: 0,
                     end: 10,
                     handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                     handleSize: '80%',
                     handleStyle: {
                     color: '#fff',
                     shadowBlur: 3,
                     shadowColor: 'rgba(0, 0, 0, 0.6)',
                     shadowOffsetX: 2,
                     shadowOffsetY: 2
                     }
                     }
                     ],*/

                    series: [
                        {
                            name: '传播力指数',
                            type: 'line',
                            smooth: true,
                            symbol: 'image://../../../../../static/img/icon-circle01.png',
                            symbolSize: 10,
                            showSymbol: false,
                            sampling: 'average',
                            itemStyle: {
                                normal: {
                                    color: '#e34a3a'
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: '#FF3A2F'
                                    }, {
                                        offset: 1,
                                        color: 'transparent'
                                    }])
                                }
                            },
                            data: op.data[1]
                        }
                    ]
                };


                /*var option = {

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
                 legend: {
                 x: '28%',
                 top: '0%',
                 textStyle: {
                 color: '#fff',
                 },
                 data: [
                 {
                 name: '被转载量',
                 textStyle: {
                 fontSize: 12,
                 fontWeight: 'bolder',
                 color: '#fff'
                 },
                 icon: 'image:../../../../../static/img/icon-line03.png'
                 },
                 ]
                 },
                 grid: {
                 top: '5%',
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
                 /!*dataZoom: [
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
                 ],*!/

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
                 };*/

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
            },
            objChange(){
                return this.$store.state.obj
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
                    this.vagilityExponentTrend({
                        starttime: val.starttime,
                        endtime: val.endtime,
                        Wid: this.$store.state.obj.wid,
                    });

                },
                deep: true
            },
            objChange: {
                handler: function (val, oldVal) {
                    //清除echarts
                    if(this.eChart){
                        this.eChart.clear();
                    }
                    this.LL=1;
                    this.NN=0;
                    this.vagilityExponentTrend({
                        starttime: this.$store.state.datas.starttime,
                        endtime: this.$store.state.datas.endtime,
                        Wid: val.wid,
                    });

                },
                deep: true
            },

        }

    }


</script>

<style scoped>
    #vagilityExponentTrend {
        width: 12.28rem;
        height: 3.9rem;
    }

</style>