<template>
    <div>
        <div class="tops tops2">
            <span>{{titleName}}网站PC及两微分析</span>
            <div class="upline"></div>
            <div class="iconPc">PC</div>
            <div class="iconSina">微博</div>
            <div class="iconWeChat">微信</div>
        </div>
        <div class="minbody tops2minbody rel" :class="{minbodyL:1!=isCenter}">
            <!--加载中-->
            <div class="loading" :class="{block:LL==1}"></div>
            <!--暂无数据-->
            <div class="noData" :class="{block:NN==1}"></div>
            <div id="PCTopAnalysis"></div>
        </div>
        <div class="minbody tops2minbody minbodyR rel" :class="{minbodyRs:1!=isCenter}">
            <p>TOP10网站发稿量总占比</p>
            <!--加载中-->
            <div class="loading" :class="{block:LL==1}"></div>
            <!--暂无数据-->
            <div class="noData" :class="{block:NN==1}"></div>
            <canvas id="canvas" :class="{block:LL==0}"></canvas>
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
                isCenter: 1,
                arr:[],
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
            this.PCTopAnalysis({
                starttime: this.$store.state.datas.starttime,
                endtime: this.$store.state.datas.endtime,
                webtype: this.$store.state.datas.webtype,
            })
        },
        methods: {
            //                全国网站PCtop10分析
            PCTopAnalysis: function (options) {
                $.ajax({
                    type: "GET",
                    url: this.$store.state.datas.url + 'webType/PCTopAnalysis?starttime=' + options.starttime + '&endtime=' + options.endtime + '&webtype=' + options.webtype,
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: "json",
                    success: function (data) {
                        if (data.result == 1) {
                            this.LL=0;
                            this.NN=0;
                            //左图
                            var xData=[],datas1=[],datas2=[],datas3=[];
                            for (var i = 0; i < data.data[0].PCPressCountWeb.length; i++) {
                                xData.push(data.data[0].PCPressCountWeb[i].WebName);
                                datas1.push(data.data[0].PCPressCountWeb[i].ReprintCount);
                                datas2.push(data.data[0].PCPressCountWeb[i].OriginalCount);
                                datas3.push(parseFloat(data.data[0].PCPressCountWeb[i].originalrate.split('%')[0]));
                            }

                            var op = {
                                dom: document.getElementById('PCTopAnalysis'),
                                data: [xData, datas1, datas2, datas3],
                                lines: [false, 0, 100],
                                color: ['#dfb279', '#ff503f', '#66b7f0']
                            };
                            this.setECharts(op);


                            //右图
                            if (data.data[0].top10totalrate) {

                                var that = this;
                                var canvas = document.getElementById('canvas');
                                var ctx = canvas.getContext('2d');
                                var width = document.body.clientWidth;
                                var dat = {
                                    text: data.data[0].top10totalrate,
                                    num: parseInt(data.data[0].top10totalrate)
                                };
                                that.setCanvas(canvas, ctx, width, dat);

                                window.addEventListener("resize", function () {
                                    var width = document.body.clientWidth;
                                    that.setCanvas(canvas, ctx, width, dat)
                                });
                            }


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
                        x: '40%',
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
                                icon: 'image://../../../../static/img/icon-02-01.png'
                            },
                            {
                                name:'原创量',
                                textStyle:{
                                    fontSize:12,
                                    fontWeight:'bolder',
                                    color:'#fff'
                                },
                                icon:'image://../../../../static/img/icon-02-02.png'
                            },
                            {
                                name:'原创率(%)',
                                textStyle:{
                                    fontSize:12,
                                    fontWeight:'bolder',
                                    color:'#fff'
                                },
                                icon:'image://../../../../static/img/icon-02-03.png'
                            },
                        ]
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '15%',
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
            setCanvas: function (canvas, ctx, widths, dat) {
                if (widths > 1440) {
                    widths = 1440;
                } else if (widths <= 1000) {
                    widths = 1000;
                }
                var num = widths / 1440;
                canvas.width = 391 * num;
                canvas.height = 380 * num;
                var that = this;
                for (var i = 0; i < that.arr.length; i++) {
                    clearTimeout(that.arr[i]);
                }
                that.arr = [];

                for (var i = 0; i <= dat.num; i++) {
                    setTime(i);
                }

                function setTime(i) {
                    var time1=setTimeout(function () {
                        //清除画布
                        ctx.clearRect(0, 0, 391 * num, 380 * num);
                        ctx.save();
                        //重新定义原点
                        ctx.translate(391 / 2 * num, 380 / 2 * num);
                        //内环
                        ctx.beginPath();
                        ctx.lineWidth = 14 * num;
                        ctx.arc(0, 0, 125 * num, 0, 2 * Math.PI, false);
                        ctx.strokeStyle = '#3b352c';
                        ctx.closePath();
                        ctx.stroke();
                        //外环
                        ctx.beginPath();
                        ctx.lineWidth = 27 * num;
                        if (i >= Math.floor(dat.num)) {
                            ctx.arc(0, 0, 125 * num, -Math.PI / 2, 2 * Math.PI / 100 * dat.num - Math.PI / 2, false);
                        } else {
                            ctx.arc(0, 0, 125 * num, -Math.PI / 2, 2 * Math.PI / 100 * i - Math.PI / 2, false);
                        }
                        ctx.strokeStyle = '#ff503f';
                        ctx.stroke();
                        //文字
                        ctx.beginPath();
                        ctx.font = 36 * num + 'px Microsoft YaHei';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = '#ff503f';
                        if (i >= Math.floor(dat.num)) {
                            ctx.fillText(dat.text, 0, 0);
                        } else {
                            ctx.fillText(i + '%', 0, 0);
                        }
                        ctx.restore();
                    }, 20 * i);
                    that.arr.push(time1);
                }

            }

        },
        computed:{
            datasChange(){
                return this.$store.state.datas
            }
        },
        watch: {
            datasChange:{
                handler:function(val,oldVal){
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
                    //pcTop10
                    this.isCenter=val.webtype;
                    this.PCTopAnalysis({
                        starttime: val.starttime,
                        endtime: val.endtime,
                        webtype: val.webtype,
                    });
                },
                deep:true

            },
        }
//        components:{asides,mainbody}
    }


</script>

<style scoped>
    .tops2 {
        margin-top: 0.4rem;
        float: left;
        width: 12.52rem;
    }

    .tops2minbody {
        float: left;
        width: 12.28rem;
        height: 3.8rem;
    }

    #PCTopAnalysis {
        width: 12.28rem;
        height: 3.8rem;
    }

    .minbodyL {
        width: 7.75rem !important;
    }

    .minbodyL > div {
        width: 7.75rem !important;
    }

    .minbodyR {
        display: none;
        margin-left: 0.12rem;
        width: 3.91rem;
        height: 3.8rem;
    }

    .minbodyRs {
        display: block !important;
    }

    .minbodyR p {
        font-size: 0.15rem;
        color: #fff;
    }

    #canvas{
        display: none;
    }
</style>