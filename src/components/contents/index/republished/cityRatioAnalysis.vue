<template>
    <div class="cityRatioAnalysis fl">
        <div class="tops">
            <span>{{titleName}}网站转载"稿源单位"/"非稿源单位"稿件数量及占比分析</span>
            <p :class="{look:1==isCenter}" @click="view()">查看详情</p>
        </div>
        <div class="minbody rel">
            <!--加载中-->
            <div class="loading" :class="{block:LL==1}"></div>
            <!--暂无数据-->
            <div class="noData" :class="{block:NN==1}"></div>
            <div id="newReprintedAnalysis"></div>
        </div>
        <div class="viewMore">
            <div class="viewMoreInner">
                <div class="viewMoreInner-header">
                    <span>中央网站转载"非稿源单位"稿件数量及占比</span>
                    <div>
                        <span @click="pageSubtract()">【上一页】</span>
                        <span @click="pageAdd()">【下一页】</span>
                        <i @click="closePage()"></i>
                    </div>
                </div>
                <p>
                    <span class="p1">{{this.page}}</span>
                    <span class="p2">/</span>
                    <span class="p3">3</span>
                </p>
                <div class="viewMoreInner-content clear">

                    <ul class="ulView fl" v-for="ul in datas">
                        <li class="title">{{ul.webname}}</li>
                        <li class="clear" v-for="li in ul.listname">
                            <div class="web">{{li.name}}</div>
                            <p :title="li.ReprintCount">
                                <span :style="'width:'+li.width+'rem'"></span>
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
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
                page: 1,
                datas: '',
                msg: '',
                LL:1,
                NN:0,
                eChart:'',
            }
        },
        /*mounted: function () {
         this.view({
         starttime: this.$store.state.datas.starttime,
         endtime: this.$store.state.datas.endtime,
         });
         },*/
        created(){
            this.isCenter = this.$store.state.datas.webtype;
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
            this.newReprintedAnalysis({
                starttime: this.$store.state.datas.starttime,
                endtime: this.$store.state.datas.endtime,
                webtype: this.$store.state.datas.webtype,
            })
        },

        methods: {
            //                转载量分析
            newReprintedAnalysis: function (options) {
                $.ajax({
                    type: "GET",
                    url: this.$store.state.datas.url + 'webType/newReprintedAnalysis?starttime=' + options.starttime + '&endtime=' + options.endtime + '&webtype=' + options.webtype,
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
                                xData.push(data.data[i].webname);
                                datas1.push(data.data[i].sourceReprintCount);
                                datas2.push(data.data[i].unsourceReprintCount);
                                datas3.push(parseFloat(data.data[i].specificationReprintrate.split('%')[0]));
                            }

                            var op = {
                                dom: document.getElementById('newReprintedAnalysis'),
                                data: [xData, datas1, datas2, datas3],
                                lines: [false, 0, 100],
                                color: ['#609bc5', '#927496', '#c59c69']
                            };
                            this.setECharts(op);


                        }else{
                            this.LL=0;
                            this.NN=1;
                        }
                    }.bind(this)
                });
            },
            //点击查看详情
            view: function () {
                $('.viewMore').css('display', 'block');
                var options = {
                    starttime: this.$store.state.datas.starttime,
                    endtime: this.$store.state.datas.endtime,
                };
                $.ajax({
                    type: "GET",
                    url: this.$store.state.datas.url + 'webType/newReprintedDetails?starttime=' + options.starttime + '&endtime=' + options.endtime,
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: "json",
                    success: function (data) {
                        if (data.result == 1) {
                            this.setUl(data.data);
                        }
                    }.bind(this)
                });
            },
            setUl: function (data) {
                this.msg = data;
                var num = (this.page - 1) * 6;
                this.datas = [];
                for (var i = num; i < ((num + 6) < this.msg.length ? (num + 6) : this.msg.length); i++) {
                    for (var j = 0; j < this.msg[i].listname.length; j++) {
                        this.msg[i].listname[j].width = this.msg[i].listname[j].ReprintCount / this.msg[i].listname[0].ReprintCount * 1.65;
                    }
                    this.datas.push(this.msg[i])
                }
//                console.log(this.msg)
            },
            pageAdd: function () {
                this.page++;
                if (this.page >= 3) {
                    this.page = 3;
                }
                this.setUl(this.msg);
            },
            pageSubtract: function () {
                this.page--;
                if (this.page <= 1) {
                    this.page = 1;
                }
                this.setUl(this.msg);
            },
            closePage: function () {
                $('.viewMore').css('display', 'none');
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
                            {
                                name: '非稿源单位',
                                textStyle: {
                                    fontSize: 12,
                                    fontWeight: 'bolder',
                                    color: '#fff'
                                },
                                icon: 'image://../../../../static/img/icon-03-02.png'
                            },
                            {
                                name: '规范转载率(%)',
                                textStyle: {
                                    fontSize: 12,
                                    fontWeight: 'bolder',
                                    color: '#fff'
                                },
                                icon: 'image://../../../../static/img/icon-03-03.png'
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
                                    color: 'rgba(170,152,136,0.3)',
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
                                show: true,
                                lineStyle: {
                                    color: 'rgba(192,172,155,0.5)',
                                }
                            },
                            splitLine: {
                                show: false
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
                            name: '稿源单位',
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
                            name: '非稿源单位',
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
                            name: '规范转载率(%)',
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
                    //titleName
                    this.isCenter = val.webtype;
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

                    this.newReprintedAnalysis({
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
    .cityRatioAnalysis {
        width: 8.25rem;
    }

    #newReprintedAnalysis {
        width: 7.75rem;
        height: 4.4rem;
    }

    .cityRatioAnalysis .tops > p {
        float: right;
        cursor: pointer;
        padding-right: 0.14rem;
        background: url("../../../../../static/img/icon-arrows.png") right center no-repeat;
        background-size: 0.07rem 0.11rem;
        color: #ebc58c;
        text-decoration: underline;
        margin-right: 0.3rem;
        display: none;
    }

    .look {
        display: block !important;
    }

    .viewMore {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10;
        display: none;
    }

    .viewMoreInner {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 10rem;
        height: 6rem;
        border-radius: 0.05rem;
        background: #fff;
    }

    .viewMoreInner-header {
        padding-left: 0.27rem;
        height: 0.4rem;
        line-height: 0.4rem;
        color: #775a39;
        border-bottom: 1px solid #816A4D;
    }

    .viewMoreInner-header > span {
        font-size: 0.2rem;
        font-weight: bold;
    }

    .viewMoreInner-header > div {
        float: right;
    }

    .viewMoreInner-header > div > span {
        cursor: pointer;
    }

    .viewMoreInner-header > div i {
        float: right;
        width: 0.2rem;
        height: 0.2rem;
        background: url("../../../../../static/img/icon-close.png") center center no-repeat;
        background-size: 0.14rem 0.14rem;
        margin: 0.1rem 0.1rem 0 0.25rem;
        cursor: pointer;
    }

    .viewMoreInner > p {
        text-align: right;
        padding-right: 0.2rem;
    }

    .ulView {
        margin-bottom: 0.2rem;
        height:2.5rem;
    }

    .ulView li {
        width: 3rem;
        margin-left: 0.33rem;
    }

    .ulView .title {
        width: 1rem;
        height: 0.3rem;
        line-height: 0.3rem;
        background: #B2885A;
        color: #fff;
        text-align: center;
        margin-bottom: 0.2rem;
    }

    .ulView li div, .ulView li p {
        float: left;
    }

    .ulView li div {
        width: 1rem;
        height: 0.2rem;
        line-height: 0.2rem;
        text-align: right;
    }

    .ulView li p {
        width: 1.65rem;
        height: 0.1rem;
        margin: 0.05rem 0 0 0.15rem;
        border-radius: 0.05rem;
        background: #EDE2D7;
    }

    .ulView li p span {
        float: left;
        /*width:1rem;*/
        height: 0.1rem;
        border-radius: 0.05rem;
        background: #D49300;
    }

</style>
