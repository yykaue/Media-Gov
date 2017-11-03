<template>
    <div class="instrment minbody">
        <canvas id="vagilityExponent"></canvas>
        <div class="bgInstrment">
            <div class="title">PC传播力指数</div>
            <p>{{msg}}</p>
            <div class="more" @click='open()'>查看详情</div>
        </div>
        <div class="etailsd">
            <div class="maskIn">
                <p class="chart_title">PC端传播力指数分析</p>
                <img class="shut" src="../../../../../static/img/icon-close.png" alt="" @click='close()'>
                <div class="chart_line">
                    <div id="chart_echart"></div>
                    <div class="chart_instructions">
                        <span class="table-title">各指标最大值</span>
                        <table>
                            <tr>
                                <td></td>
                                <td class="web-name">网站名称</td>
                                <td class="stats" id="www">统计值</td>
                            </tr>
                            <tr>
                                <td>发稿量</td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>原创量</td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>原创率</td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>日均UV</td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>日均PV</td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>平均浏览页面数</td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>被门户网站转载量</td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>被新闻网站转载量</td>
                                <td></td>
                                <td></td>
                            </tr>

                        </table>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data(){
            return {
                screenWidth: document.body.clientWidth,
                msg: '',
                arr: [],

            }
        },
        /*mounted: function () {
         this.vagilityExponent({
         starttime: this.$store.state.datas.starttime,
         endtime: this.$store.state.datas.endtime,
         Wid: 1,
         max: 1000
         })
         },*/
        created(){
            this.vagilityExponent({
                starttime: this.$store.state.datas.starttime,
                endtime: this.$store.state.datas.endtime,
                Wid: this.$store.state.obj.wid,
                max: 1000
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
            vagilityExponent: function (options) {
                $.ajax({
                    type: "GET",
                    url: this.$store.state.datas.url + 'jusfoun-entmedia/newurlsBtime/vagilityExponent?starttime=' + options.starttime + '&endtime=' + options.endtime + '&Wid=' + options.Wid,
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: "json",
                    success: function (data) {
                        if (data.result == 1) {
                            this.msg = data.data[0].vagilitycount;
                            var that = this;
                            var canvas = document.getElementById('vagilityExponent');
                            var ctx = canvas.getContext('2d');
                            var width = document.body.clientWidth;
                            var dat = {
                                nn: data.data[0].vagilitycount,
                                max: options.max
                            };
//                            console.log(dat);
                            that.setCanvas(canvas, ctx, width, dat);
//
                            window.addEventListener("resize", function () {
                                var width = document.body.clientWidth;
                                that.setCanvas(canvas, ctx, width, dat)
                            });

                        }
                    }.bind(this)
                });
            },
            setCanvas: function (canvas, ctx, widths, dat) {
                if (widths > 1440) {
                    widths = 1440;
                } else if (widths <= 1000) {
                    widths = 1000;
                }
                var num = widths / 1440;
                canvas.width = 368 * num;
                canvas.height = 369 * num;
                var that = this;
                for (var i = 0; i < that.arr.length; i++) {
                    clearTimeout(that.arr[i]);
                }
                that.arr = [];
                //储存当前传播力指数
                var aa = dat.nn;
                for (var i = 0; i <= parseInt(aa / 10); i++) {
                    setTime(i);
                }
                function setTime(i) {
                    var time1 = setTimeout(function () {
                        //清除画布
                        ctx.clearRect(0, 0, 368 * num, 369 * num);
                        ctx.save();
                        //重新定义原点
                        ctx.translate(367 / 2 * num, 203.5 * num);
                        //定义开始度数DS,MAX=1.51057
                        var ds = 0.2447 + (dat.nn * i / parseInt(aa / 10)) / dat.max * 1.51057;
                        ctx.beginPath();
                        ctx.moveTo(3 * num * Math.cos(Math.PI * ds), 3 * num * Math.sin(Math.PI * ds));
                        ctx.lineTo(-132 * num * Math.sin(Math.PI * ds), 132 * num * Math.cos(Math.PI * ds));
                        ctx.lineTo(-3 * num * Math.cos(Math.PI * ds), -3 * num * Math.sin(Math.PI * ds));
                        ctx.fillStyle = '#F2C483';
                        ctx.closePath();
                        ctx.fill();
                        ctx.restore();
                    }, 20 * i);
                    that.arr.push(time1);

                }

            },
            open: function () {
                $('.etailsd').fadeIn(500)
                var options = {
                    starttime: this.$store.state.datas.starttime,
                    endtime: this.$store.state.datas.endtime,
                    wid: this.$store.state.obj.wid,
                    webname: this.$store.state.obj.webname,
                };
                $.ajax({
                    type: "GET",
                    url: this.$store.state.datas.url + 'jusfoun-entmedia/newurlsBtime/vagilityExponentInfo?starttime=' + options.starttime + '&endtime=' + options.endtime + '&Wid=' + options.wid + '&WebName=' + options.webname,
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: "json",
                    success: function (data) {
                        if (data.result == 1) {
//              console.log(data.data);
                            var data = data.data[0];
                            //边界最大值对应的标题
                            var radarDataMax = [
                                {
                                    name: '发稿量',
                                    max: data.max_totalcount
                                },
                                {
                                    name: '原创量',
                                    max: data.max_originalycount
                                },
                                {
                                    name: '原创率',
                                    max: data.max_originalyrate
                                },
                                {
                                    name: '日均UV量',
                                    max: data.max_uv
                                },
                                {
                                    name: '日均PV量',
                                    max: data.max_pv
                                },
                                {
                                    name: '平均浏览页面',
                                    max: data.max_at
                                },
                                {
                                    name: '被门户网站转载量',
                                    max: data.max_portalcount
                                },
                                {
                                    name: '被新闻网站转载量',
                                    max: data.max_newscount
                                },

                            ];

                            //最大值对应的网站
                            var tableData = [
                                {
                                    name: '发稿量',
                                    webname: data.max_totalcount_webname
                                },
                                {
                                    name: '原创量',
                                    webname: data.max_originalycount_webname
                                },
                                {
                                    name: '原创率',
                                    webname: data.max_originalyrate_webname
                                },
                                {
                                    name: '日均UV量',
                                    webname: data.max_uv_webname
                                },
                                {
                                    name: '日均PV量',
                                    webname: data.max_pv_webname
                                },
                                {
                                    name: '平均浏览页面',
                                    webname: data.max_at_webname
                                },
                                {
                                    name: '被门户网站转载量',
                                    webname: data.max_portalcount_webname
                                },
                                {
                                    name: '被新闻网站转载量',
                                    webname: data.max_newscount_webname
                                },

                            ]

                            var radarData = [
                                {        //依次为  发稿量，原创量，原创率，日均uv，日均pv，平均浏览页面数, 被门户网站转载量，被新闻网站转载量，
                                    value: [data.totalcount, data.originalycount, data.originalyrate, data.uv, data.pv, data.at, data.portalcount, data.newscount]
                                }
                            ]

                            var op = {
                                dom: $('#chart_echart'),
                                radarDataMax: radarDataMax,
                                radarData: radarData,
                                tableData: tableData
                            }


                            this.setEchart(op)
                            this.setTable(op)
                        }
                    }.bind(this)
                });
            },
            close: function () {
                $('.etailsd').css('display', 'none')
            },
            setEchart: function (op) {
                var _this = this;

                var mychart = echarts.init(op.dom[0]);
                var option = {
                    tooltip: {
                        formatter: function () {
                            return op.radarDataMax[0].name + "：" + _this.format_number(op.radarData[0].value[0]) + "<br>" +
                                    op.radarDataMax[1].name + "：" + _this.format_number(op.radarData[0].value[1]) + "<br>" +
                                    op.radarDataMax[2].name + "：" + op.radarData[0].value[2] + "%<br>" +
                                    op.radarDataMax[3].name + "：" + _this.format_number(op.radarData[0].value[3]) + "<br>" +
                                    op.radarDataMax[4].name + "：" + _this.format_number(op.radarData[0].value[4]) + "<br>" +
                                    op.radarDataMax[5].name + "：" + _this.format_number(op.radarData[0].value[5]) + "<br>" +
                                    op.radarDataMax[6].name + "：" + _this.format_number(op.radarData[0].value[6]) + "<br>" +
                                    op.radarDataMax[7].name + "：" + _this.format_number(op.radarData[0].value[7]) + "<br>"
                        }
                    },
                    radar: {
                        // shape: 'circle',
                        indicator: op.radarDataMax,
                        name: {
                            textStyle: {
                                color:'#000'
                            }
                        },
                    },
                    series: [{
                        name: 'PC端传播指数分析',
                        type: 'radar',
                        lineStyle: '#fe1b0e',
                        areaStyle: {
                            normal: {
                                opacity: 0.9,
                                color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                                    {
                                        color: 'rgba(255,0,0,0.1)',
                                        offset: 0
                                    },
                                    {
                                        color: 'rgba(255,0,0,0.6)',
                                        offset: 1
                                    }
                                ])
                            }
                        },

                        data: op.radarData
                    }]
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


            },
            setTable: function (op) {
                var trs = document.querySelectorAll('.chart_instructions tr');
                for (var i = 1; i < trs.length; i++) {
                    for (var j = 0; j < trs[i].cells.length; j++) {
//            trs[i].cells[0].innerHTML = self.data.data[i - 1].name
                        trs[i].cells[1].innerHTML = op.tableData[i - 1].webname != '' ? op.tableData[i - 1].webname : '-';
                        trs[i].cells[2].innerHTML = op.radarDataMax[i - 1].max != '0' ? this.format_number(op.radarDataMax[i - 1].max) : '-';
                    }
                }
                trs[3].cells[2].innerHTML = op.radarDataMax[2].max + '%';
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
            //对datas监听
            datasChange: {
                handler: function (val, oldVal) {
                    this.vagilityExponent({
                        starttime: val.starttime,
                        endtime: val.endtime,
                        Wid: this.$store.state.obj.wid,
                        max: 1000
                    })
                },
                deep: true
            },
            objChange:{
                handler: function (val, oldVal) {
                    this.vagilityExponent({
                        starttime: this.$store.state.datas.starttime,
                        endtime: this.$store.state.datas.endtime,
                        Wid: val.wid,
                        max: 1000
                    })

                },
                deep: true
            }

        }
    }
</script>

<style scoped>
    .instrment {
        position: relative;
        float: left;
        width: 3.68rem;
        height: 3.69rem;
        margin: 0 !important;
    }

    #vagilityExponent {
        width: 3.68rem;
        height: 3.69rem;
    }

    .bgInstrment {
        position: absolute;
        top: 0;
        left: 0;
        width: 4.18rem;
        height: 4.19rem;
        background: url("../../../../../static/img/bg-instrment.png") center center no-repeat;
        background-size: 3.14rem 2.73rem;
    }

    .title, .more, .bgInstrment p {
        margin: 0 auto;
        text-align: center;
    }

    .title {
        margin-top: 0.34rem;
        font-size: 0.16rem;
        color: #fff;
    }

    .bgInstrment p {
        font-size: 0.3rem;
        color: #fccd85;
        margin-top: 2.3rem;
    }

    .more {
        text-decoration: underline;
        cursor: pointer;
        font-size: 0.12rem;
        padding-right: 0.1rem;
        background: url("../../../../../static/img/icon-jt.png") right center no-repeat;
        background-size: 0.05rem 0.09rem;
        color: #fff;
        width: 0.55rem;
        margin-top: 0.4rem;
    }

    /*弹窗*/
    .etailsd{
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        z-index: 101;
        width:100%;
        height:100%;
        background: rgba(0,0,0,0.5);
        display: none;
    }
    .etailsd .maskIn{
        width: 9.8rem;
        height: 4.8rem;
        background-color: #fff;
        border-radius: .15rem;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;

    }

    .chart_line {
        border-top: .01rem solid #7e6b51;
    }

    .chart_title {
        color: #7e6b51;
        font-size: .18rem;
        height: .49rem;
        line-height: .49rem;
        padding-left: .28rem;
        font-weight: 9rem;
    }

    #chart_echart {
        margin-top: .5rem;
        width: 4.8rem;
        height: 3.33rem;
        float: left;
    }

    .etailsd img {
        float: right;
        margin-top: -.3rem;
        margin-right: .3rem;
        cursor: pointer;
    }

    .chart_instructions {
        /*width: 208px;*/
        margin-top: .50rem;
        width: 5rem;
        /*height: 383px;*/
        height: 3.8rem;
        float: left;
    }

    .chart_instructions span {
        margin-right: 1.75rem;
        float: right;
        font-size: .18rem;
        color: #7e6b51;
    }

    .table-title {
        color: #7e6b51;
    }

    .chart_instructions table {
        width: 3.70rem;
        height: 2.90rem;
        float: right;
        margin-right: .6rem;
        margin-top: .16rem;
        border-collapse: separate;
        border-spacing: 0;
        border-radius: .1rem .1rem 0 0;
    }

    .chart_instructions td {
        height: .32rem;
        font-size: .12rem;
        border-right: .01rem solid #d8e6f1;
        border-bottom: .01rem solid #d8e6f1;
        text-align: center;
        color: #000;
    }

    .chart_instructions tr td:nth-child(1) {
        width: 1.26rem;
        border-left: .01rem solid #d8e6f1;
    }

    .chart_instructions tr td:nth-child(2) {
        width: 1.54rem;
    }

    .chart_instructions tr td:nth-child(3) {
        width: .9rem;
    }

    .chart_instructions tr:nth-child(odd) {
        background-color: #f4f9fc;
    }

    .chart_instructions tr:nth-child(1) {
        background-color: #7e6b51;
        border-radius: .1rem .1rem 0 0;
    }

    .chart_instructions tr:nth-child(1) td {
        border-color: #7e6b51;
    }

    .chart_instructions tr:nth-child(1) td:nth-child(1) {
        border-radius: .1rem 0 0 0;
        border-top: none;
        border-left: none;
    }

    .chart_instructions tr:nth-child(1) td:nth-child(3) {
        border-radius: 0 .1rem 0 0;
        border-top: none;
        border-right: none;
    }

    .chart_instructions tr:nth-child(n+2) td:nth-child(n+2) {
        color: #7e6b51;
    }

    .chart_instructions tr:nth-child(1) td:nth-child(n+2) {
        color: #fff;
    }
</style>
