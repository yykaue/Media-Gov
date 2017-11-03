<template>
    <div class="areaPies fl minbody rel">
        <!--加载中-->
        <div class="loading" :class="{block:LL==1}"></div>
        <!--暂无数据-->
        <div class="noData" :class="{block:NN==1}"></div>
        <div class="areaPie"></div>
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
            this.areaPie({
                starttime: this.$store.state.datas.starttime,
                endtime: this.$store.state.datas.endtime,
                Wid: this.$store.state.obj.wid,
                WebName: this.$store.state.obj.webname,
                type: 1
            });
        },
        methods: {
            //reScale 方法  返回 n 在 m 中的占比
            reScale: function (n, m) {
                for (var i = 0; i < arguments.length; i++) {
                    var arg = arguments[i];
                    if (arg instanceof Object) throw('arguments 的第' + (i + 1) + '个' + JSON.stringify(arg) + '的格式为Object不正确');
                    if (arg instanceof String) arg = Number(arg);
                    if (isNaN(arg)) throw(arg + '的格式不是Number类型');
                }
                if (m == 0) return 0;
                var scale = (n / m).toFixed(4) + '';
                var tmpArr = scale.split('.');
                if (parseInt(tmpArr[0]) >= 1) return 100;
                if (parseInt(tmpArr[0]) < 1) {
                    return parseInt(tmpArr[1].substring(0, 2)) + '.' + tmpArr[1].substring(2, 4);
                }
            },
            areaPie: function (options) {
                $.ajax({
                    type: 'GET',
                    url: this.$store.state.datas.url + 'jusfoun-entmedia/newurlsBtimenews/getareaspread?type=' + options.type + '&begintime=' + options.starttime + '&endtime=' + options.endtime + '&Wid=' + options.Wid + '&WebName=' + options.WebName,
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: 'json',
                    success: function (data) {
                        if (data.result == 1) {
                            if((data.data.firstcity==null)||(data.data.secondcity==null)||(data.data.other==null)){
                                this.LL=0;
                                this.NN=1;
                            }else{
                                this.LL=0;
                                this.NN=0;
                                //  稳健性代码
                                var total = 0;
                                var one = data.data.firstcity ? data.data.firstcity : 0;
                                var two = data.data.secondcity ? data.data.secondcity : 0;
                                var other = data.data.other ? data.data.other : 0;
                                total = one + two + other;

                                //  核心代码
                                var oneScale, twoScale, otherScale;
                                if (one == 0) {
                                    oneScale = 0;
                                } else {
                                    oneScale = this.reScale(one, total);
                                }
                                if (two == 0) {
                                    twoScale = 0;
                                } else {
                                    twoScale = this.reScale(two, total);
                                }
                                if (other == 0) {
                                    otherScale = 0;
                                } else {
                                    otherScale = (100 - oneScale - twoScale).toFixed(2);
                                }

                                var percent;
                                percent = [
                                    {
                                        name: "一线城市",
                                        value: one,
                                        scale: oneScale
                                    }, {
                                        name: "二线城市",
                                        value: two,
                                        scale: twoScale
                                    }, {
                                        name: "三线城市及其他",
                                        value: other,
                                        scale: otherScale
                                    }];


                                var op = {
                                    dom: $('.areaPie'),
                                    data: [data.data.firstcity, data.data.secondcity, data.data.other],
                                    percent: percent
                                };
                                this.setEchart(op);
                            }

                        }else{
                            this.LL=0;
                            this.NN=1;
                        }
                    }.bind(this)
                });
            },
            setEchart: function (op) {
                var myChart = echarts.init(op.dom[0]);
                this.eChart=myChart;
                var option = {

                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: {c} ({d}%)"
                    },
                    color: ['#ff503f', '#609bc5', '#ebc58c'],  //颜色值
                    legend: {
                        icon: 'rect',
                        orient: 'vertical', //列表的横纵排列样式
                        color: '#fff',
                        inactiveColor: '#fff', //图例关闭时的颜色
                        top: '70%',
                        formatter: function (name) {
                            for (var i = 0; i < op.percent.length; i++) {
                                if (name == op.percent[i].name) {
                                    return name + "   " + op.percent[i].scale + '%';
                                }
                            }
                        },
                        data: ['一线城市', '二线城市', '三线城市及其他'],
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
                            radius: ['55%', '70%'],
                            center: ['50%', '34%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {     //设置中心位子文字的样式
                                        fontSize: '15',
                                        color: '#fff'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: [
                                {value: op.data[0], name: '一线城市'},
                                {value: op.data[1], name: '二线城市'},
                                {value: op.data[2], name: '三线城市及其他'},
                            ]
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
        },   //methods
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
                    this.areaPie({
                        type: 1,
                        starttime: val.starttime,
                        endtime: val.endtime,
                        Wid: this.$store.state.obj.wid,
                        WebName: this.$store.state.obj.webname,
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
                    this.areaPie({
                        type: 1,
                        starttime: this.$store.state.datas.starttime,
                        endtime: this.$store.state.datas.endtime,
                        Wid: val.wid,
                        WebName: val.webname,
                    });

                },
                deep: true
            },
        }
    }

</script>

<style scoped>
    .areaPies {
        width: 3.6rem;
        height: 5.4rem;
        padding:0 !important;
    }
    .areaPie{
        width: 3.6rem;
        height: 5.4rem;
    }
</style>
