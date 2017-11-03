<template>
    <div class="analysis clear">
        <h2>发稿量分析</h2>
        <div class="minbody minbodyLeft rel">
            <!--加载中-->
            <div class="loading" :class="{block:LL==1}"></div>
            <!--暂无数据-->
            <div class="noData" :class="{block:NN==1}"></div>
            <div id="analysisLeft"></div>
        </div>
        <div class="minbody minbodyRight rel">
            <!--加载中-->
            <div class="loading" :class="{block:LL==1}"></div>
            <!--暂无数据-->
            <div class="noData" :class="{block:NN==1}"></div>
            <div id="analysisRight"></div>
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
                eChart1:'',
                eChart2:'',
            }
        },

        created(){
            this.analysis({
                starttime: this.$store.state.datas.starttime,
                endtime: this.$store.state.datas.endtime,
                Wid: this.$store.state.obj.wid,
            })
        },

        methods: {
            // 发稿量分析
            analysis: function (options) {
                $.ajax({
                    type: "GET",
                    url: this.$store.state.datas.url + 'jusfoun-entmedia/newurlsBtime/analysis?starttime=' + options.starttime + '&endtime=' + options.endtime + '&Wid=' + options.Wid,
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: "json",
                    success: function (data) {
                        if (data.result == 1) {

                            this.LL=0;
                            this.NN=0;
                            //左图
                            var xData = [], datas1 = [], datas2 = [], datas3 = [];
                            for (var i = 0; i < data.data[1].totallist.length; i++) {
                                xData.push(data.data[1].totallist[i].time);
                                datas1.push(data.data[1].totallist[i].count);
                                datas2.push(data.data[1].originalylist[i].count);
                                datas3.push(data.data[1].republishedlist[i].count);
                            }
                            var op1 = {
                                dom: document.getElementById('analysisLeft'),
                                data: [xData, datas1, datas2, datas3],
                            };
                            this.setECharts1(op1);

                            //右图
                            var op2 = {
                                dom: document.getElementById('analysisRight'),
                                data: [data.data[0].totalcount,data.data[0].originalycount,data.data[0].republishedcount],
                            };
                            this.setECharts2(op2);

                        }else{
                            this.LL=0;
                            this.NN=1;
                        }
                    }.bind(this)
                });
            },
            setECharts1: function (op) {
                var that = this;
                var myChart1 = echarts.init(op.dom);

                this.eChart1=myChart1;

                var option = {
                    tooltip: {
                        borderColor: '#BE915A',
                        borderWidth: 1,
                        padding: [13, 15, 13, 15],
                        trigger: "axis",
                        formatter: function (params, ticket, callback) {
                            var res = '<span style="font-size: 15px;">' + params[0].name + '统计</span><br/>'
                                    + params[0].seriesName + '： ' + that.format_number(params[0].value) + '<br/>'
                                    + params[1].seriesName + '： ' + that.format_number(params[1].value) + '<br/>'
                                    + params[2].seriesName + '： ' + that.format_number(params[2].value);
                            return res;
                        },
                        textStyle: {
                            fontSize: 12,
                        },
                        axisPointer: {
                            snap: true,
                            type: "line",
                            textStyle: {
                                color: "#fff"
                            }
                        },
                    },
                    legend: {
                        x: '37%',
                        top: '0%',
                        textStyle: {
                            color: '#fff',
                        },
                        data: [
                            {
                                name: '发稿量',
                                textStyle: {
                                    fontSize: 12,
                                    fontWeight: 'bolder',
                                    color: '#fff'
                                },
                                icon: 'image://../../../../../static/img/icon-05-01.png'
                            },
                            {
                                name: '原创量',
                                textStyle: {
                                    fontSize: 12,
                                    fontWeight: 'bolder',
                                    color: '#fff'
                                },
                                icon: 'image://../../../../../static/img/icon-05-02.png'
                            },
                            {
                                name: '转载量',
                                textStyle: {
                                    fontSize: 12,
                                    fontWeight: 'bolder',
                                    color: '#fff'
                                },
                                icon: 'image://../../../../../static/img/icon-05-03.png'
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
                            length: 3,
                            lineStyle: {
                                color: 'rgba(187,166,149,0.3)',
                                width: 3,
                            }
                        },
                        axisLabel: {//标签设置
                            textStyle: {
                                color: '#fff',
                            },
                            interval: 2,//间隔显示
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: 'rgba(187,166,149,0.3)',
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
                            show: false,
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
                            show: false,
                            length: 5,
                            lineStyle: {
                                color: 'rgba(181,153,117,0.6)',
                                type: 'solid',
                                width: 1
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
                            name: '发稿量',
                            type: 'line',
                            smooth: true,
                            symbol: 'image://../../../../../static/img/icon-circle02.png',
                            symbolSize: 10,
                            showSymbol: false,
                            sampling: 'average',
                            itemStyle: {
                                normal: {
                                    color: '#bd976a'
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: '#685233'
                                    }, {
                                        offset: 1,
                                        color: 'transparent'
                                    }])
                                }
                            },
                            data: op.data[1]
                        },
                        {
                            name: '原创量',
                            type: 'line',
                            smooth: true,
                            symbol: 'image://../../../../../static/img/icon-circle03.png',
                            symbolSize: 10,
                            showSymbol: false,
                            sampling: 'average',
                            itemStyle: {
                                normal: {
                                    color: '#927496'
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: '#435c6b'
                                    }, {
                                        offset: 1,
                                        color: 'transparent'
                                    }])
                                }
                            },
                            data: op.data[2]
                        },
                        {
                            name: '转载量',
                            type: 'line',
                            smooth: true,
                            symbol: 'image://../../../../../static/img/icon-circle04.png',
                            symbolSize: 10,
                            showSymbol: false,
                            sampling: 'average',
                            itemStyle: {
                                normal: {
                                    color: '#609bc5'
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: '#60a3d2'
                                    }, {
                                        offset: 1,
                                        color: 'transparent'
                                    }])
                                }
                            },
                            data: op.data[3]
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
            setECharts2: function (op) {
                var that=this;
                var myChart = echarts.init(op.dom);
                this.eChart2=myChart;


                var option = {
                    color: ["#c0996c", "#927496", "#609bc5"],
                    legend: {
                        textStyle: {
                            color: "#fff",
                            fontSize:12,
                        },
                        orient: 'horizontal',
                        left: "center",
                        top: 10,
                        itemWidth: 12,
                        itemHeight: 12,
                        itemGap: 30,

                        data: [
                            {
                                name: '发稿总量',
                                icon: 'rect',
                            },
                            {
                                name: '原创总量',
                                icon: 'rect',
                            },
                            {
                                name: '转载总量',
                                icon: 'rect',
                            }
                        ]
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: function (param) {
                            if (param.name) {
                                return param.name + "  " + that.format_number(param.value);
                            }
                        }
                    },
                    series: [
                        {
                            name: '发稿总量',
                            type: 'pie',
                            radius: ['60%', '70%'],
                            center: ['50%', '54%'],
                            clockwise: false,
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: false
                                }
                            },
                            hoverAnimation: false,
                            legendHoverLink: false,
                            animationType:'scale',
                            data: [{
                                name: '发稿总量',
                                value: op.data[0],
                                itemStyle: {
                                    normal: {
                                        color: "#c0996c"
                                    }
                                }
                            }, {
                                value: (op.data[0]*4/3-op.data[0]),
                                itemStyle: {
                                    normal: {
                                        color: "transparent",
                                        opacity: 0
                                    },
                                    emphasis: {
                                        opacity: 0
                                    }
                                }
                            }]

                        },
                        {
                            name: '原创总量',
                            type: 'pie',
                            radius: ['52%', '61%'],
                            center: ['50%', '54%'],
                            clockwise: false,
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: false
                                }
                            },
                            hoverAnimation: false,
                            legendHoverLink: false,
                            data: [{
                                name:'原创总量',
                                value: op.data[1],
                                itemStyle: {
                                    normal: {
                                        color: "#927496"
                                    }
                                }

                            }, {
                                value: (op.data[0]*4/3-op.data[1]),
                                label: {
                                    normal: {
                                        show: false
                                    },
                                    emphasis: {
                                        show: false
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: "transparent",
                                        opacity: 0
                                    },
                                    emphasis: {
                                        opacity: 0
                                    }
                                }
                            }]
                        },
                        {
                            name: '转载总量',
                            type: 'pie',
                            radius: ['47%', '54%'],
                            center: ['50%', '54%'],
                            clockwise: false,
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: false
                                }
                            },
                            hoverAnimation: false,
                            legendHoverLink: false,
                            data: [{
                                name: '转载总量',
                                value: op.data[2],
                                itemStyle: {
                                    normal: {
                                        color: "#609bc5"
                                    }
                                }
                            }, {
                                value: (op.data[0]*4/3-op.data[2]),
                                itemStyle: {
                                    normal: {
                                        color: "transparent",
                                        opacity: 0
                                    },
                                    emphasis: {
                                        opacity: 0
                                    }
                                }
                            }]

                        }
                    ],
                };

                myChart.setOption(option);
                myChart.resize();
                window.addEventListener("resize", function () {

                    var time = null;
                    clearTimeout(time);
                    time = setTimeout(function () {
                        myChart.resize();
                    }, 300);

                });

            },
            format_number: function (n) {
                if (!isNaN(n)) {
                    var b = parseInt(n).toString();
                    var len = b.length;
                    if (n > 0) {
                        if (len <= 3) {
                            return b;
                        }
                        var r = len % 3;
                        return r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") : b.slice(r, len).match(/\d{3}/g).join(",");
                    } else {
                        if (len <= 4) {
                            return b;
                        }
                        var a = len % 3;
                        return a > 0 ? b.slice(0, a) + "," + b.slice(a, len).match(/\d{3}/g).join(",") : b.slice(a, len).match(/\d{3}/g).join(",");
                    }
                } else return 0;
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
                    if(this.eChart1){
                        this.eChart1.clear();
                    }
                    if(this.eChart2){
                        this.eChart2.clear();
                    }
                    this.LL=1;
                    this.NN=0;
                    this.analysis({
                        starttime: val.starttime,
                        endtime: val.endtime,
                        Wid: this.$store.state.obj.wid,
                    });

                },
                deep: true
            },
            objChange:{
                handler: function (val, oldVal) {
                    //清除echarts
                    if(this.eChart1){
                        this.eChart1.clear();
                    }
                    if(this.eChart2){
                        this.eChart2.clear();
                    }
                    this.LL=1;
                    this.NN=0;
                    this.analysis({
                        starttime: this.$store.state.datas.starttime,
                        endtime: this.$store.state.datas.endtime,
                        Wid: val.wid,
                    });

                },
                deep: true
            }


        }

    }


</script>

<style scoped>
    .analysis > div {
        float: left;
    }

    .minbodyRight {
        margin-left: 0.12rem;
    }

    #analysisLeft {
        width: 7.75rem;
        height: 4.4rem;
    }

    #analysisRight {
        width: 3.91rem;
        height: 4.4rem;
    }
</style>