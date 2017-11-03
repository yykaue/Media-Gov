<template>
    <div class="websPies fl minbody rel">
        <!--加载中-->
        <div class="loading" :class="{block:LL==1}"></div>
        <!--暂无数据-->
        <div class="noData" :class="{block:NN==1}"></div>
        <div class="websPie "></div>
    </div>


</template>

<script>
    import Vue from 'vue'
    import VueResource from 'vue-resource';
    Vue.use(VueResource);
    export default {
        data () {
            return {
                msg: '',
                LL:1,
                NN:0,
                eChart:'',

            }
        },
        created(){

            this.websPie({
                starttime: this.$store.state.datas.starttime,
                endtime: this.$store.state.datas.endtime,
                Wid: this.$store.state.obj.wid,
                WebName: this.$store.state.obj.webname,
            })
        },
        methods: {
            //三位数分割符
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
            websPie: function (options) {
                $.ajax({
                    type: 'GET',
                    url: this.$store.state.datas.url+'jusfoun-entmedia/newurlsBtime/webWasRepublished?starttime=' + options.starttime + '&endtime=' + options.endtime + '&Wid=' + options.Wid + '&WebName=' + options.WebName,
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: 'json',
                    success: function (data) {
                        if (data.result == 1) {
                            this.LL=0;
                            this.NN=0;
                            var color = ['#DC5653', '#F6C042', '#FBFD5C', '#77D4DB', '#469A9E', '#A52D2D'];
                            var seriesData = [
                                [{
                                    'name': data.data[0].webtypename,
                                    'value': data.data[0].wasrepublished
                                }, {
                                    'name': data.data[1].webtypename,
                                    'value': data.data[1].wasrepublished
                                }, {
                                    'name': data.data[2].webtypename,
                                    'value': data.data[2].wasrepublished
                                }, {
                                    'name': data.data[3].webtypename,
                                    'value': data.data[3].wasrepublished
                                }, {
                                    'name': data.data[4].webtypename,
                                    'value': data.data[4].wasrepublished
                                }, {
                                    'name': data.data[5].webtypename,
                                    'value': data.data[5].wasrepublished
                                }]
                            ];
                            var TopName = {
                                webtype1: data.data[0].webtypename,
                                webtype2: data.data[1].webtypename,
                                webtype3: data.data[2].webtypename,
                                webtype4: data.data[3].webtypename,
                                webtype5: data.data[4].webtypename,
                                webtype6: data.data[5].webtypename
                            };

                            var op = {
                                dom: $('.websPie'),
                                color: color,
                                seriesData: seriesData,
                                TopName: TopName
                            }
                            this.setEchart(op);
                        }else{
                            this.LL=0;
                            this.NN=1;
                        }
                    }.bind(this)
                })
            },
            setEchart: function (op) {
                var self = this;
                var myChart = echarts.init(op.dom[0]);
                this.eChart=myChart;

                var option = {
                    toolbox: {
                        show: true,
                        itemSize: 15,
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: function (parma) {
                            return parma.name + ':  ' + self.format_number(parma.value) + ' (' + parma.percent + '%)'  //鼠标悬浮显示的信息
                        }
                    },
                    color: op.color,  //颜色值
                    legend: {
                        icon: 'rect',
                        orient: 'vertical', //列表的横纵排列样式
                        color: '#fff',
                        inactiveColor: '#fff', //图例关闭时的颜色
                        data: op.TopName,
                        itemGap: 12,        //图例之间的距离
                        itemWidth: 17,        //每个图例标识宽度
                        itemHeight: 17,       //图例标识的高度
                        radius: '0',
                        textStyle: {          //图例标识旁边的文字的样式
                            color: '#fff',
                            fontSize: '16',
                        }
                    },
                    series: [
                        {
                            name: '被转载占比分析',
                            type: 'pie',
                            startAngle: 0,
                            radius: ['45%', '55%'],     //大小
//              center: ['50%', '34%'],   //位子
                            avoidLabelOverlap: false,
                            labelLine: {
                                normal: {
                                    smooth: 0,
                                    length: 13,
                                    length2: 8
                                }
                            },
                            label: {
                                normal: {
                                    show: true,
//                  formatter: function (param) {
//                    for (var i = 0; i < percent.length; i++) {
//                      if (param.value == percent[i].value) {
//                        return param.name + "   " + percent[i].scale + '%';
//                      }
//                    }
//                  },
                                    formatter: "{b} {d}%",
                                    position: "outer",
                                    textStyle: {
                                        color: "#fff",
                                        fontSize: 12,
                                        fontFamily: "微软雅黑"
                                    }
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data: op.seriesData[0]
                        }
                    ]
                };
                myChart.setOption(option);
                var oSpan = $("<span class = 'refresh'>刷新</span>");
                op.dom.append(oSpan);
                op.dom.css("position", "relative");
                oSpan.css({
                    position: "absolute",
                    top: ".3rem",
                    right: ".3rem",
                    height: '.23rem',
                    lineHeight: '.23rem',
                    fontSize: ".13rem",
                    fontFamily: "微软雅黑",
                    paddingLeft: ".3rem",
                    color: '#fff',
                    background: "url(../../../../../../static/img/re.png) no-repeat left",
                    backgroundSize: '.23rem .23rem',
                    cursor: "pointer"
                }).click(function () {
                    myChart.clear();
                    myChart.setOption(option);
                    self.$store.state.InWebType = '';
                });


                myChart.resize();
                window.addEventListener("resize", function () {
                    var time = null;
                    clearTimeout(time);
                    time = setTimeout(function () {
                        myChart.resize();
                    }, 300);

                });


                myChart.on("click", function (param) {
                    //me.setData(param);
                    //me._setData_homepage(param);
                    switch (param.dataIndex) {
                        case 0:
                            self.savaData(1);
                            break;
                        case 1:
                            self.savaData(2);
                            break;
                        case 2:
                            self.savaData(3);
                            break;
                        case 3:
                            self.savaData(4);
                            break;
                        case 4:
                            self.savaData(6);
                            break;
                        case 5:
                            self.savaData(7);
                            break;
                    }

                })
            },
//      储存状态
            savaData: function (op1) {
                this.$store.state.InWebType = op1;
            },
            refresh: function (op) {
                this.setEchart(op)
            }
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
                    this.websPie({
                        starttime: val.starttime,
                        endtime: val.endtime,
                        Wid: this.$store.state.obj.wid,
                        WebName: this.$store.state.obj.webname,
                    })
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
                    this.websPie({
                        starttime: this.$store.state.datas.starttime,
                        endtime: this.$store.state.datas.endtime,
                        Wid: val.wid,
                        WebName: val.webname,
                    })

                },
                deep: true
            }

        }
    }
</script>


<style scoped>
    .websPies {
        width: 4.87rem;
        height: 4rem;
        padding: 0 !important;
    }
    .websPie{
        width: 4.87rem;
        height: 4rem;
    }

</style>
