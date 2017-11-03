<template>
    <div class="websBar minbody fl rel">
        <!--加载中-->
        <div class="loading" :class="{block:LL==1}"></div>
        <!--暂无数据-->
        <div class="noData" :class="{block:NN==1}"></div>
        <div class='webBarEchart'></div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import VueResource from 'vue-resource';
    Vue.use(VueResource);
    export default {
        data () {
            return {
                msg: '综合网站TOP10转载媒体',
                LL:1,
                NN:0,
                eChart:'',
            }
        },
        created(){
            this.websBar({
                starttime: this.$store.state.datas.starttime,
                endtime: this.$store.state.datas.endtime,
//                webtype: this.$store.state.obj.InWebType,
                Wid: this.$store.state.obj.wid,
                WebName: this.$store.state.obj.webname,
            });
        },
        methods: {
            websBar: function (options) {
                $.ajax({
                    type: 'GET',
                    url: options.webtype?(this.$store.state.datas.url + 'jusfoun-entmedia/newurlsBtime/top10Republished?starttime=' + options.starttime + '&endtime=' + options.endtime + '&webtype=' + options.webtype + '&Wid=' + options.Wid + '&WebName=' + options.WebName):(this.$store.state.datas.url + 'jusfoun-entmedia/newurlsBtime/top10Republished?starttime=' + options.starttime + '&endtime=' + options.endtime  + '&Wid=' + options.Wid + '&WebName=' + options.WebName),
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: 'json',
                    success: function (data) {
                        if (data.result == 1) {

                            this.LL=0;
                            this.NN=0;
                            var xData = [], datas1 = [];
                            for (var i = 0; i < data.data.length; i++) {
                                xData.push(data.data[i].webname);
                                datas1.push(data.data[i].count);
                            }
//              console.log(xData);
//              console.log(datas1);
                            var op = {
                                dom: $('.webBarEchart'),
                                data: [xData, datas1],
                                lines: [false, 0, 100],
                                color: ['#ff503f']
                            }
                            this.setEchart(op);
                        }else{
                            //清除echarts
                            if(this.eChart){
                                this.eChart.clear();
                            }
                            this.LL=0;
                            this.NN=1;
                        }
                    }.bind(this)
                })
            },
            setEchart: function (op) {
                var mychart = echarts.init(op.dom[0]);
                this.eChart=mychart;

                var option = {
                    title: {
                        top: '-5%',
                        left: '45%',
                        subtext: this.msg,
                        subtextStyle: {
                            textAlign: 'center',
                            color: '#fff'
                        }
                    },
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
                        top: '10%',
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
                                show: true,
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
                                show: false,
                                lineStyle: {
                                    color: 'rgba(171,153,136,0.3)',
                                    type: 'solid',
                                    width: 1
                                }
                            },
                            axisLine: {//Y轴竖线
                                show: true,
                                lineStyle: {
                                    color: 'rgba(192,172,155,0.5)',
                                }
                            },
                            axisTick: {
                                show: false,
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
//          dataZoom: [
//           {
//           show: op.lines[0],
//           height: 12,
//           xAxisIndex: [0],
//           bottom: 0,
//           start: op.lines[1],
//           end: op.lines[2],
//           handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
//           handleSize: '110%',
//           handleStyle: {
//           color: "#6cf",
//           },
//           textStyle: {
//           color: "#fff"
//           },
//           borderColor: "#fff"
//
//           },
//           {
//           type: "inside",
//           show: false,
//           height: 15,
//           start: 1,
//           end: 35
//           }
//           ],

                    series: [
                        {
                            center: ['20%', '0'],
                            name: '被转载量',
                            type: 'bar',
                            stack: 'sum',//柱状图叠加
                            barMaxWidth: 14,

//                                        barGap: "10%",
                            yAxis: 1,
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    borderColor: '#ff7467',
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

                mychart.setOption(option);
                mychart.resize();
                window.addEventListener("resize", function () {
                    var time = null;
                    clearTimeout(time);
                    time = setTimeout(function () {
                        mychart.resize();
                    }, 300);

                });
            }
        },
        computed: {
            datasChange(){
                return this.$store.state.datas
            },
            objChange(){
                return this.$store.state.obj
            },
            InWebTypeChange(){
                return this.$store.state.InWebType
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
                    this.$store.state.InWebType='';
                    this.websBar({
                        starttime: val.starttime,
                        endtime: val.endtime,
                        webtype: '',
                        Wid: this.$store.state.obj.wid,
                        WebName: this.$store.state.obj.webname,
                    })
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
                    this.$store.state.InWebType='';
                    switch (this.$store.state.InWebType){
                        case '':this.msg='综合网站TOP10转载媒体';
                            break;
                        case 1:this.msg='中央网站TOP10转载媒体';
                            break;
                        case 2:this.msg='省级网站TOP10转载媒体';
                            break;
                        case 3:this.msg='城市网站TOP10转载媒体';
                            break;
                        case 4:this.msg='行业网站TOP10转载媒体';
                            break;
                        case 6:this.msg='门户网站转载媒体';
                            break;
                        case 7:this.msg='搜索网站转载媒体';
                            break;
                    }

                    this.websBar({
                        starttime: this.$store.state.datas.starttime,
                        endtime: this.$store.state.datas.endtime,
                        webtype: this.$store.state.InWebType,
                        Wid: val.wid,
                        WebName: val.webname,
                    })
                },
                deep: true
            },
            InWebTypeChange: {
                handler: function (val, oldVal) {
                    switch (this.$store.state.InWebType){
                        case '':this.msg='综合网站TOP10转载媒体';
                            break;
                        case 1:this.msg='中央网站TOP10转载媒体';
                            break;
                        case 2:this.msg='省级网站TOP10转载媒体';
                            break;
                        case 3:this.msg='城市网站TOP10转载媒体';
                            break;
                        case 4:this.msg='行业网站TOP10转载媒体';
                            break;
                        case 6:this.msg='门户网站转载媒体';
                            break;
                        case 7:this.msg='搜索网站转载媒体';
                            break;
                    }
                    this.websBar({
                        starttime: this.$store.state.datas.starttime,
                        endtime: this.$store.state.datas.endtime,
                        webtype: val,
                        Wid: this.$store.state.obj.wid,
                        WebName: this.$store.state.obj.webname,
                    })
                },
                deep: true
            }
        }
    }
</script>


<style scoped>
    .websBar {
        width: 7.79rem;
        height: 4rem;
        margin-left: .12rem;
        padding:0 !important;
    }

    .webBarEchart {
        width: 100%;
        height: 100%;
    }
</style>
