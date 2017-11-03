<template>
    <div class="areaPie minbody rel fl">
        <ul>
            <li class="province bgc fl" @click="togglee1()">省份</li>
            <li class="city bor fl" @click='togglee2()'>城市</li>
            <!--<li class='fl' v-for="(item,$index) in items" @click="selectStyle(item,$index)" :class="[{'bgc':$index==0?'bgc':'bor'},{bgc:item.active,bor:!item.active}]"> {{item.select}} </li>-->

        </ul>
        <div class="provinceMap"></div>
        <div class="cityMap">
            <div class="cityMap-l"></div>
            <div class="top"></div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    export default {
        data () {
            return {}
        },
        created(){
            this.togglee1();
            this.setprovinceMap({

                starttime: this.$store.state.datas.starttime,
                endtime: this.$store.state.datas.endtime,
                Wid: this.$store.state.obj.wid,
                WebName: this.$store.state.obj.webname,
                flag: 1,    //省会固定值
                type: 1,  //PC固定值

            });
            this.setcityMap({
                starttime: this.$store.state.datas.starttime,
                endtime: this.$store.state.datas.endtime,
                Wid: this.$store.state.obj.wid,
                WebName: this.$store.state.obj.webname,
                type: 1,
                flag: 0,   //城市固定值
            })
        },
        methods: {
            togglee1: function () {
                $('.province').addClass('bgc').removeClass('bor');
                $('.city').addClass('bor').removeClass('bgc');
                $('.cityMap').hide();
                $('.provinceMap').show();
            },
            togglee2: function () {
                $('.city').addClass('bgc').removeClass('bor');
                $('.province').addClass('bor').removeClass('bgc');
                $('.provinceMap').hide();
                $('.cityMap').show();
            },

            //三位数分割符
            format_number: function (n) {
                if (!isNaN(n) && (n != null)) {
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
            //省级地图数据整理
            setprovinceMap: function (options) {
                $.ajax({
                    type: 'GET',
                    url: this.$store.state.datas.url + 'jusfoun-entmedia/newurlsBtimenews/getareaspreadbyproviceandcity?type=' + options.type + '&begintime=' + options.starttime + '&endtime=' + options.endtime + '&flag=' + options.flag + '&Wid=' + options.Wid + '&WebName=' + options.WebName,
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: 'json',
                    success: function (data) {
                        if (data.result == 1) {
                            var data = data.data;
                            var dataProvince = [];
                            var max=0;
                            for (var i = 0; i < data.length; i++) {
                                dataProvince.push({
                                    name: data[i].name,
                                    value: data[i].count
                                });
                                if (data[i].count > max) {
                                    max = data[i].count;
                                }
                            }
                            var op = {
                                dom: $('.provinceMap'),
                                dataProvince: dataProvince,
                                data: data,
                                max: max

                            }
                            this.setprovinceEchart(op);
                        }
                    }.bind(this)
                })
            },
            //省级地图echarts
            setprovinceEchart: function (op) {
                var myChart = echarts.init(op.dom[0]);
//                console.log(op)

                //1
//        var self = this;
//        var option = {
//          tooltip: {
//            trigger: 'item',
//            borderWidth: 1,
//            borderColor: '#b69062',
//            padding: [21,35,21,16],
//            trigger: 'item',
//            formatter: function (p) {
//              for (var i = 0; i < op.dataProvince.length; i++) {
//
//                if (p.name == op.dataProvince[i].name)
//                  return p.name + '<br/>转载量:' + '  ' + self.format_number(p.value)    //悬浮框里面的值
//              }
//            }
//          },
//          visualMap: {
//            min: 0,
//            max: 60000,
//            left: '5%',
//            bottom: '5%',
//            text: ['高', '低'],
//            calculable: true,
//            color: ["#7b5e3d", "#d8ac73"],
//            textStyle: {
//              color: "#fefefe"
//            }
//          },
//          series: [
//            {
//              name: '中国',
//              type: 'map',
//              mapType: 'china',
//              selectedMode: 'multiple',
//              label: {
//                normal: {
//                  show: false
//                },
//                emphasis: {
//                  show: false
//                }
//              },
//              data: op.dataProvince
//            }
//          ]
//        };


                //2
                var self = this;
                var option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: function (p) {
                            for (var i = 0; i < op.dataProvince.length; i++) {

                                if (p.name == op.dataProvince[i].name)
                                    return p.name + '<br/>转载量:' + '  ' + self.format_number(p.value)    //悬浮框里面的值
                            }
                            if (!p) {
                                return '{b} <br/> -'
                            }
                        }

                    },
                    visualMap: {
                        min: 0,
                        max: op.max,
                        left: '10%',
                        bottom: '1%',
                        text: ['高', '低'],
                        calculable: true,
                        color: ["#7b5e3d", "#d8ac73"],
                        textStyle: {
                            color: "#fefefe"
                        }
                    },
                    series: [
                        {
                            name: '地域',
                            type: 'map',
                            mapType: 'china',
                            roam: false,
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: false
                                }
                            },
                            data: op.dataProvince,
                            zoom: 1.2
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
            },
            //城市级地图
            setcityMap: function (options) {
                $.ajax({
                            type: 'GET',
                            url: this.$store.state.datas.url + 'jusfoun-entmedia/newurlsBtimenews/getareaspreadbyproviceandcity?type=' + options.type + '&begintime=' + options.starttime + '&endtime=' + options.endtime + '&flag=' + options.flag + '&Wid=' + options.Wid + '&WebName=' + options.WebName,
                            data: {},
                            xhrFields: {withCredentials: true},
                            crossDomain: true,
                            datatype: 'json',
                            success: function (response) {
                                if (response.result == 1) {
                                    var data = response.data;
                                    var dataCity = [];  //城市和值
                                    var datajwd = {};  //经纬度数据
                                    for (var i = 0; i < data.length; i++) {
                                        dataCity.push({
                                            name: data[i].name,
                                            value: data[i].count
                                        })
                                        var newdata = [];
                                        if (data[i].longitude && data[i].latitude) {
                                            newdata.push(data[i].longitude, data[i].latitude);
                                            datajwd[data[i].name + ''] = newdata;
                                        }
                                    }

                                    //            console.log(datajwd);
                                    var op1 = {
                                        dom: $('.cityMap-l'),
                                        dataCity: dataCity,
                                        datajwd: datajwd,
                                        data: data
                                    }
                                    this.setcityEchart(op1)

                                    //右侧top10数据处理
                                    var xData = [], yData = [];


                                    for (var i = 0; i < (data.length > 10 ? 10 : data.length); i++) {
                                        xData.push(data[i].count);
                                        yData.push(data[i].name);
                                    }
                                    xData = xData.reverse();
                                    yData = yData.reverse();

                                    var op2 = {
                                        dom: $('.top'),
                                        xData: xData,
                                        yData: yData
                                    }
                                    this.settopEchart(op2);
                                }
                            }.bind(this)
                        }
                )
            },
            //城市级地图echarts
            setcityEchart: function (op1) {
                var self = this;
                //城市覆盖
                function convertData(data) {
                    var res = [];
                    for (var i = 0; i < data.length; i++) {
                        var geoCoord = op1.datajwd[data[i].name];
                        if (geoCoord) {
                            res.push({
                                name: data[i].name,
                                value: geoCoord.concat(data[i].value)
                            });
                        }
                    }
                    return res;
                }

                var myChart = echarts.init(op1.dom[0]);
                var option = {
                    scaleLimit: {min: 1.2, max: 1.2},   //控制放大缩小
                    dragable: false,
                    tooltip: {
                        trigger: 'item',
                        formatter: function (p) {
                            return p.name + ' : ' + self.format_number(p.value[2]);
                        }
                    },
                    geo: {
                        map: 'china',
                        label: {
                            emphasis: {
                                show: false
                            }
                        },
                        roam: true,
                        itemStyle: {
                            normal: {
                                areaColor: '#4c3d2a',   //地图本身的颜色
                                borderColor: '#111'
                            },
                            emphasis: {
                                areaColor: '#cad'   //鼠标移动上去显示的颜色
                            }
                        },
                        zoom: 1.2
                    },
                    series: [
                        {
                            name: '城市',
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            data: convertData(op1.dataCity),
                            symbolSize: 8,
//               label: {
//                   normal: {
//                       formatter: function (p) {
//                           return p.name + ' : ' + p.value[2];
//                       },
//                       position: 'right',
//                       show: false
//                   },
//                   emphasis: {
//                       show: true
//                   }
//               },
                            itemStyle: {
                                normal: {
                                    color: '#ffff00',
                                    opacity: 1
                                }
                            }
                        },
                        {
                            name: '城市',
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
                            data: convertData(op1.dataCity.sort(function (a, b) {
                                if (b.value && a.value) {
                                    return b.value - a.value;
                                }
                            }).slice(0, 10)),
                            symbolSize: 15,
                            itemStyle: {
                                normal: {
                                    color: '#ffff00',
                                    opacity: 1
                                }
                            },
                            showEffectOn: 'render',
                            rippleEffect: {
                                brushType: 'stroke'
                            },
                            hoverAnimation: true,
                            zlevel: 1
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
            },
            settopEchart: function (op2) {

                var myChart = echarts.init(op2.dom[0]);
                var option = {
                    title: {
                        text: 'TOP 10：',
                        textStyle: {
                            color: "#ffffff",
                            fontSize: 13,
                            fontWeight: "normal"
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    grid: {
                        left: '1.5%',
                        right: '8%',
                        top: '5%',
                        containLabel: true
                    },
                    xAxis: {
                        show: false,
                        type: 'value',
                        boundaryGap: [0, 0.01],
                        position: "top",
                        scale: true,
                        axisLabel: {
                            textStyle: {
                                color: "#ffca2a",
                                width: 10
                            }
                        },
                        splitNumber: 4,
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: 'category',
                        data: op2.yData,   //name
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            textStyle: {
                                color: "#ffffff",
                                fontSize: 13
                            }
                        }
                    },
                    series: [
                        {

                            name: '城市',
                            type: 'bar',
                            data: op2.xData,
                            barWidth: 10,   //柱子的宽度
                            itemStyle: {
                                normal: {
                                    color: "#ae8961",
                                    fontSize: 13,


                                    barBorderRadius: 5
                                }
                            },

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
            },


        },  //methods
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
                    this.setprovinceMap({

                        starttime: this.$store.state.datas.starttime,
                        endtime: this.$store.state.datas.endtime,
                        Wid: this.$store.state.obj.wid,
                        WebName: this.$store.state.obj.webname,
                        flag: 1,    //省会固定值
                        type: 1,  //PC固定值

                    });
                    this.setcityMap({
                        starttime: this.$store.state.datas.starttime,
                        endtime: this.$store.state.datas.endtime,
                        Wid: this.$store.state.obj.wid,
                        WebName: this.$store.state.obj.webname,
                        type: 1,
                        flag: 0,   //城市固定值
                    })

                },
                deep: true
            },
            objChange: {
                handler: function (val, oldVal) {
                    this.setprovinceMap({

                        starttime: this.$store.state.datas.starttime,
                        endtime: this.$store.state.datas.endtime,
                        Wid: this.$store.state.obj.wid,
                        WebName: this.$store.state.obj.webname,
                        flag: 1,    //省会固定值
                        type: 1,  //PC固定值

                    });
                    this.setcityMap({
                        starttime: this.$store.state.datas.starttime,
                        endtime: this.$store.state.datas.endtime,
                        Wid: this.$store.state.obj.wid,
                        WebName: this.$store.state.obj.webname,
                        type: 1,
                        flag: 0,   //城市固定值
                    })

                },
                deep: true
            },
        }
    }

</script>

<style scoped>


    .areaPie {
        width: 9.06rem;
        height: 5.4rem;
        padding:0 !important;
        margin-left: 0.12rem;
    }

    ul {
        margin-left: .3rem;
        margin-top: .35rem;
    }

    ul > li {
        width: .6rem;
        height: .3rem;
        box-sizing: border-box;
        text-align: center;
        line-height: .3rem;
        cursor: pointer;
    }

    .bgc {
        background-color: #ea3323;
        color: #fff;
    }

    .bor {
        border: 1px solid #d2b07d;
        color: #d2b07d;
    }

    .provinceMap {
        position: absolute;
        top: .7rem;
        width: 9rem;
        height: 4.4rem;
        float: left;
        /*z-index: 2;*/
    }

    .cityMap {
        position: absolute;
        top: .7rem;
        width: 8.8rem;
        height: 4.4rem;
        float: left;
        margin-left: .1rem;
        display: none;
    }

    .cityMap-l {
        width: 6rem;
        height: 4.4rem;
        float: left;
    }

    .top {
        width: 3rem;
        height: 4.4rem;
        position: absolute;
        right: 0;
    }
</style>
