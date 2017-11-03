<template>
    <div class="trend">
        <div class="tops">
            <span>被转载量走势</span>
        </div>
        <div class="minbody rel">
            <!--加载中-->
            <div class="loading" :class="{block:LL==1}"></div>
            <!--暂无数据-->
            <div class="noData" :class="{block:NN==1}"></div>
            <div id="wasRepublishedAnalysis"></div>
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
            this.wasRepublishedAnalysis({
                starttime: this.$store.state.datas.starttime,
                endtime: this.$store.state.datas.endtime,
                Wid: this.$store.state.obj.wid,
                WebName: this.$store.state.obj.webname,
            })
        },

        methods: {
            // 被转载量走势
            wasRepublishedAnalysis: function (options) {
                $.ajax({
                    type: "GET",
                    url: this.$store.state.datas.url + 'jusfoun-entmedia/newurlsBtime/wasRepublishedAnalysis?starttime=' + options.starttime + '&endtime=' + options.endtime + '&Wid=' + options.Wid+ '&WebName=' + options.WebName,
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: "json",
                    success: function (data) {
                        if (data.result == 1) {

                            this.LL=0;
                            this.NN=0;
                            var xData = [], datas1 = [] ;
                            for (var i = 0; i < data.data.length; i++) {
                                xData.push(data.data[i].time);
                                datas1.push(data.data[i].count);
                            }
                            var op = {
                                dom: document.getElementById('wasRepublishedAnalysis'),
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
                var that = this;
                var myChart1 = echarts.init(op.dom);
                this.eChart=myChart1;

                var option = {
                    tooltip: {
                        borderColor: '#BE915A',
                        borderWidth: 1,
                        padding: [13, 15, 13, 15],
                        trigger: "axis",
                        formatter: function (params, ticket, callback) {
                            var res = '<span style="font-size: 15px;">' + params[0].name + '统计</span><br/>'
                                    + params[0].seriesName + '： ' + that.format_number(params[0].value);
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
                        x: '47%',
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
                                icon: 'image://../../../../../static/img/icon-05-01.png'
                            },
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
                            show: false,
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


                    series: [
                        {
                            name: '被转载量',
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
                    if(this.eChart){
                        this.eChart.clear();
                    }
                    this.LL=1;
                    this.NN=0;
                    this.wasRepublishedAnalysis({
                        starttime: val.starttime,
                        endtime: val.endtime,
                        Wid: this.$store.state.obj.wid,
                        WebName: this.$store.state.obj.webname,
                    });

                },
                deep: true
            },
            objChange:{
                handler: function (val, oldVal) {
                    //清除echarts
                    if(this.eChart){
                        this.eChart.clear();
                    }
                    this.LL=1;
                    this.NN=0;
                    this.wasRepublishedAnalysis({
                        starttime: this.$store.state.datas.starttime,
                        endtime: this.$store.state.datas.endtime,
                        Wid: val.wid,
                        WebName: val.webname,
                    });

                },
                deep: true
            }

        }

    }


</script>

<style scoped>
    .trend .minbody{
        margin-top: 0.4rem;
    }
    #wasRepublishedAnalysis{
        width: 12.28rem;
        height:3.9rem;
    }
</style>