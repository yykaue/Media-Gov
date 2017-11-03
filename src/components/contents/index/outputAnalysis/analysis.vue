<template>
    <div class="analysis">
        <div class="tops">
            <span>{{titleName}}网站全网发稿量分析</span>
            <div class="upline"></div>
            <div class="iconPc">PC</div>
            <div class="iconSina">微博</div>
            <div class="iconWeChat">微信</div>
        </div>
        <div class="minbody left fl">
            <div class="pc">PC发稿量占比：<span>47.95%</span></div>
            <ul class="ulDispatches clear">
                <li>
                    <p class="l1">累计发稿量</p>
                    <div class="l2">{{left.presscount}}</div>
                    <div class="l3 clear">
                        <p>原创量：</p>
                        <div>{{left.originalCount}}</div>
                        <p>转载量：</p>
                        <div>{{left.reprintCount}}</div>
                    </div>
                </li>
                <li>
                    <p class="l1">昨日发稿量</p>
                    <div class="l2">{{left.yPresscount}}</div>
                    <div class="l3">
                        <p>原创量：</p>
                        <div>{{left.yOriginalCount}}</div>
                        <p>转载量：</p>
                        <div>{{left.yReprintCount}}</div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="minbody right fl rel">
            <!--加载中-->
            <div class="loading" :class="{block:LL==1}"></div>
            <!--暂无数据-->
            <div class="noData" :class="{block:NN==1}"></div>

            <div id="originalCountAndRate"></div>
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
                left: {
                    presscount: '-',
                    originalCount: '-',
                    reprintCount: '-',
                    yPresscount: '-',
                    yOriginalCount: '-',
                    yReprintCount: '-',
                },
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
            this.contributionsAnalysis({
                starttime: this.$store.state.datas.starttime,
                endtime: this.$store.state.datas.endtime,
                webtype: this.$store.state.datas.webtype,
            });
            this.originalCountAndRate({
                starttime: this.$store.state.datas.starttime,
                endtime: this.$store.state.datas.endtime,
                webtype: this.$store.state.datas.webtype,
            })
        },
        methods: {
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
//            发稿量分析（左图）
            contributionsAnalysis: function (option) {
                $.ajax({
                    type: "GET",
                    url: this.$store.state.datas.url + 'webType/contributionsAnalysis?starttime=' + option.starttime + '&endtime=' + option.endtime + '&webtype=' + option.webtype,
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: "json",
                    success: function (data) {
                        if (data.result == 1) {

                            var data = data.data[0];
                            data.presscount = this.format_number(data.presscount);
                            data.originalCount = this.format_number(data.originalCount);
                            data.reprintCount = this.format_number(data.reprintCount);
                            data.yPresscount = this.format_number(data.yPresscount);
                            data.yOriginalCount = this.format_number(data.yOriginalCount);
                            data.yReprintCount = this.format_number(data.yReprintCount);
                            this.left = data;

                        }
                    }.bind(this)
                });
            },
//            发稿量分析（右图）
            originalCountAndRate: function (options) {
                $.ajax({
                    type: "GET",
                    url: this.$store.state.datas.url + 'webType/originalCountAndRate?starttime=' + options.starttime + '&endtime=' + options.endtime + '&webtype=' + options.webtype,
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: "json",
                    success: function (data) {
                        if (data.result == 1) {
                            this.LL=0;
                            this.NN=0;
                            var xData = [], datas1 = [], datas2 = [], datas3 = [];
                            for (var i = 0; i < data.data.length; i++) {
                                xData.push(data.data[i].cdate.slice(-5));
                                datas1.push(data.data[i].ReprintCount);
                                datas2.push(data.data[i].OriginalCount);
                                datas3.push(parseFloat(data.data[i].originalrate.split('%')[0]));
                            }

                            var op = {
                                dom: document.getElementById('originalCountAndRate'),
                                data: [xData, datas1, datas2, datas3],
                                lines: [true, 50, 100],
                                color: ['#BF9463', '#ff503f', '#66b7f0']
                            };

                            this.setECharts(op);
                        }else{
                            this.LL=0;
                            this.NN=1;
                        }
                    }.bind(this)
                });
            },

            //                全国网站PCtop10分析
            setECharts: function (op) {
                var myChart = echarts.init(op.dom)
                //加入至data
                this.eChart=myChart;
                var option = {
//                                color: ['#fff'],
//                                backgroundColor: "#344b58",
//                                title: {
//                                    text: "16年1月-16年11月消费客单分析",
//                                    subtext: "BY MICVS",
//                                    x: "4%",
//                                    textStyle: {
//                                        color: '#fff',
//                                        fontSize: '22'
//                                    },
//                                    subtextStyle: {
//                                        color: '#90979c',
//                                        fontSize: '16',
//                                    },
//                                },
                    tooltip: {
                        borderColor: '#BE915A',
                        borderWidth: 1,
                        trigger: "axis",
//                        formatter: function(params) {
//                            console.log(params);
//                            var res = params;
//                            var dc;
//                            dc = res[0].axisValue+'统计</br>'+
//                            return dc;
//                        },
                        axisPointer: {
                            type: "shadow",
                            textStyle: {
                                color: "#fff"
                            }
                        },
                    },
                    legend: {
                        x: '30%',
                        top: '0%',
                        textStyle: {
                            color: '#fff',
                        },
                        data: [
                            {
                                name: '转载量',
                                textStyle: {
                                    fontSize: 12,
                                    fontWeight: 'bolder',
                                    color: '#fff'
                                },
                                icon: 'image://../../../../static/img/icon-01-01.png'
                            },
                            {
                                name: '原创量',
                                textStyle: {
                                    fontSize: 12,
                                    fontWeight: 'bolder',
                                    color: '#fff'
                                },
                                icon: 'image://../../../../static/img/icon-01-02.png'
                            },
                            {
                                name: '原创率(%)',
                                textStyle: {
                                    fontSize: 12,
                                    fontWeight: 'bolder',
                                    color: '#fff'
                                },
                                icon: 'image://../../../../static/img/icon-01-03.png'
                            },
                        ]
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
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
//                                            show: false,
                                alignWithLabel: true
                            },
                            axisLine: {
                                show: false,
                                lineStyle: {
                                    color: '#fff'
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
                                    color: '#D8B58A',
                                    type: 'solid',
                                    width: 1
                                }
                            },
                            splitArea: {
                                "show": false
                            },
                        },
                        {
                            type: 'value',
//                            name: '原创率(%)',
                            position: 'right',
                            axisLabel: {
                                formatter: '{value}',
                                textStyle: {
                                    color: '#fff'
                                }
                            },
                            axisLine: {//Y轴竖线
                                show: false,
                            },
                            splitLine: {
                                show: false
                            },
                            axisTick: {
                                show: true,
                                length: 5,
                                lineStyle: {
                                    color: '#D8B58A',
                                    type: 'solid',
                                    width: 1
                                }
                            },
//                                        min: 0,
//                                        max: 100,
                        },
                    ],

                    //下面移动条
                    dataZoom: [
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
                    ],

                    series: [
                        {
                            name: '转载量',
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
                        {
                            name: '原创量',
                            type: 'bar',
                            stack: 'sum',//柱状图叠加
                            barMaxWidth: 14,
                            yAxis: 1,
                            itemStyle: {
                                normal: {
                                    color: op.color[1],
                                    barBorderRadius: 7,
                                    label: {
                                        show: false,
                                        textStyle: {
                                            color: "#fff"
                                        },
                                        position: "top",
                                        formatter: function (p) {
                                            return p.value > 0 ? (p.value) : '';
                                        }
                                    }
                                }
                            },
                            data: op.data[2]
                        },
                        {
                            name: '原创率(%)',
                            type: 'line',
                            yAxisIndex: 1,
                            symbolSize: 6,//柔和圆缓
                            symbol: 'circle',//柔和圆缓
                            smooth: true,//柔和圆缓
                            itemStyle: {
                                normal: {
                                    color: op.color[2],
                                    barBorderRadius: 0,
                                    label: {
                                        show: false,
                                        position: "top",
                                        formatter: function (p) {
                                            return p.value > 0 ? (p.value) : '';
                                        }
                                    }
                                }
                            },
                            data: op.data[3]
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
            datasChange: {
                handler: function (val, oldVal) {
                    //清除echarts
                    if(this.eChart){
                        this.eChart.clear();
                    }
                    this.LL=1;
                    this.NN=0;

                    //更改titleName
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
                    //左图
                    this.contributionsAnalysis({
                        starttime: val.starttime,
                        endtime: val.endtime,
                        webtype: val.webtype,
                    });

                    //右图
                    this.originalCountAndRate({
                        starttime: val.starttime,
                        endtime: val.endtime,
                        webtype: val.webtype,
                    });
                },
                deep: true
            },

        }
//        components:{asides,mainbody}
    }

</script>

<style scoped>
    .outputAnalysis .left {
        width: 3.8rem;
        height: 3.8rem;
    }

    .outputAnalysis .right {
        margin-left: 0.02rem;
        width: 7.96rem;
        height: 3.8rem;
    }

    .left .pc {
        margin-top: 0.45rem;
        font-size: 0.15rem;
        font-weight: bold;
        color: #fff;
        text-align: center;
    }

    .left .pc span {
        font-size: 0.38rem;
        font-weight: normal;
        color: #ebc58c;
    }

    .ulDispatches {
        margin-top: 0.55rem;
    }

    .ulDispatches li {
        float: left;
        width: 50%;
    }

    .ulDispatches .l1 {
        font-size: 0.15rem;
        font-weight: bold;
        text-align: center;
        color: #fff;
    }

    .ulDispatches .l2 {
        width: 1.49rem;
        height: 0.25rem;
        border: 1px solid #b49063;
        border-radius: 0.05rem;
        margin: 0 auto;
        margin-top: 0.05rem;
        font-size: 0.18rem;
        color: #ebc58c;
        text-align: center;
    }

    .ulDispatches .l3 {
        margin-top: 0.4rem;
    }

    .ulDispatches .l3 p {
        float: left;
        color: #fff;
        font-size: 0.15rem;
        margin-top: 0.16rem;
    }

    .ulDispatches .l3 div {
        float: left;
        color: #0a0b0d;
        font-size: 0.18rem;
        background: #b9956a;
        border-radius: 0.04rem;
        border: 1px solid #dfb279;
        width: 1.13rem;
        height: 0.24rem;
        line-height: 0.24rem;
        text-align: center;
        margin-top: 0.16rem;
    }

    #originalCountAndRate {
        width: 7.96rem;
        height: 3.8rem;
    }
</style>