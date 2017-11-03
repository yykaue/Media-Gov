<template>
    <div class="topMedia fl">
        <div class="topMedia-title">
            <span>被转载量TOP媒体分析</span>
        </div>
        <div class="minbody rel">
            <!--加载中-->
            <div class="loading" :class="{block:LL==1}"></div>
            <!--暂无数据-->
            <div class="noData" :class="{block:NN==1}"></div>
            <canvas id="canvas1" :class="{block:LL==0}"></canvas>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import VueResource from 'vue-resource';

    Vue.use(VueResource);

    export default {
        data ()
        {
            return {
                msg: [],
                webid: '',
                webname: '',
                arr1: [],
                isSelect: 0,
                color:['#9972b5','#ce5d52','#cba254','#6fbe93','#609bc5'],
                LL:1,
                NN:0,
            }
        },
        /*created(){
         this.beReprintedTop5mediaAnalysis({
         starttime:this.$store.state.datas.starttime,
         endtime:this.$store.state.datas.endtime,
         webid:this.$store.state.datas.starttime,
         webname:this.$store.state.datas.starttime,
         });
         },*/
        //自动加载
        /*mounted: function () {
            this.webid = this.$store.state.reprintObj.webid;
            this.webname = this.$store.state.reprintObj.webname;

            this.beReprintedTop5mediaAnalysis({
                starttime: this.$store.state.datas.starttime,
                endtime: this.$store.state.datas.endtime,
                webid: this.$store.state.reprintObj.webid[0],
                webname: this.$store.state.reprintObj.webname[0],
            });
        },*/

        methods: {
            beReprintedTop5mediaAnalysis: function (option) {

                $.ajax({
                    type: "GET",
                    url: this.$store.state.datas.url + 'webType/beReprintedTop5mediaAnalysis?starttime=' + option.starttime + '&endtime=' + option.endtime + '&webid=' + option.webid + '&webname=' + option.webname,
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: "json",
                    success: function (data) {
                        if (data.result == 1) {
                            this.LL=0;
                            this.NN=0;
//                            console.log(data.data[0]);

//                            console.log(this.webid);
//                            console.log(this.webname);


                            var top5 = [];
                            //format_number
                            for (var i = 0; i < data.data[0].bereprintedTop5list.length; i++) {
                                top5.push(this.format_number(data.data[0].bereprintedTop5list[i].doc_count))
                            }
                            var that = this;
                            var canvas = document.getElementById('canvas1');
                            var ctx = canvas.getContext('2d');
                            var width = document.body.clientWidth;
                            var dat = {
                                webid: this.webid,
                                webname: this.webname,
                                data: data.data[0],
                                top5: top5,
                            };

                            that.setCanvas(canvas, ctx, width, dat);
                            window.addEventListener("resize", function () {
                                var width = document.body.clientWidth;
                                that.setCanvas(canvas, ctx, width, dat)
                            });


                        }else{
                            this.LL=0;
                            this.NN=1;
                        }


                    }.bind(this)
                });


//                var arr = [], arr1 = [], ds = 0;
//                this.setbubbleChart(arr1);

            },

            setCanvas: function (canvas, ctx, widths, dat) {
                var that = this;
                if (widths > 1440) {
                    widths = 1440;
                } else if (widths <= 1000) {
                    widths = 1000;
                }
                var num = widths / 1440;
                canvas.width = 489 * num;
                canvas.height = 440 * num;

                once('', '');
                //监听mousemove,
                canvas.addEventListener("mousemove", detect, false);
                //点击
                var ds = false;
                $('#canvas1')[0].onclick = function (e) {
                    ds = true;
                    detect(e);
                };
                $('#canvas1')[0].onmousemove = function () {
                    ds = false;
                };
                function once(x, y) {
                    //清除画布
                    ctx.clearRect(0, 0, 489 * num, 440 * num);
                    //第一次save
                    ctx.save();
                    //重新定义原点
                    ctx.translate(489 / 2 * num, 440 / 2 * num);

                    //中心圆
                    ctx.beginPath();
                    ctx.arc(0, 0, 100 * num, 0, 2 * Math.PI, false);
                    ctx.fillStyle = '#ac8961';
                    ctx.closePath();
                    ctx.fill();
                    //中心圆网站详细
                    ctx.fillStyle = '#000';
                    ctx.font = 'bold 16px 微软雅黑';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(dat.data.webname, 0, -60 * num);
                    //子数据
                    ctx.font = '12px 微软雅黑';

                    //方案一
                    /*for (var j = 0; j < dat.top5.length; j++) {
                        ctx.textAlign = 'right';
                        ctx.fillText(dat.data.bereprintedTop5list[j].key + ':', 0, -(30 * num - j * 20 * num));
                        ctx.textAlign = 'left';
                        ctx.fillText(dat.top5[j], 0, -(30 * num - j * 20 * num));

                    }*/
                    //方案二
                    for (var j = 0; j < dat.top5.length; j++) {
                        ctx.textAlign = 'center';
                        ctx.fillText(dat.data.bereprintedTop5list[j].key + ':'+dat.top5[j], 0, -(30 * num - j * 20 * num));

                    }


                    //周边的圆矩形
                    var n = dat.webid.length;
                    //对高度平均分配
                    var h = 175 * num * 4 / n;
                    var H;
                    for (var i = 0; i < n; i++) {
                        if (i <= n / 2) {
                            H = -((175 * num) - i * h);
                        } else if (i > n / 2) {
                            H = -(-((175 * num) - i * h) - 2 * 175 * num);
                        }
                        //第二次save
                        ctx.save();
                        //第二次定义原点
                        ctx.translate(175 * num * Math.sin(2 * Math.PI / n * i), H);
                        //作画
                        ctx.beginPath();
                        ctx.arc(-35 * num, 0, 15 * num, Math.PI / 2, 3 / 2 * Math.PI, false);
                        ctx.lineTo(15 * num, -15 * num);
                        ctx.arc(35 * num, 0, 15 * num, 3 / 2 * Math.PI, Math.PI / 2, false);

                        //渐变
                        var g1 = ctx.createRadialGradient(0, 0, 10 * num, 0, 0, 60 * num)

                        //颜色的选取;
                        var col=that.color[i%5];

                        g1.addColorStop(0.1, 'transparent');
//                        g1.addColorStop(0.2, 'transparent');
                        g1.addColorStop(1, col);
                        if (i == that.isSelect) {
                            ctx.fillStyle = col;
                        } else {
                            ctx.fillStyle = g1;
                        }

                        ctx.strokeStyle = col;
                        ctx.closePath();

                        //判断是否在路径内

                        if (ctx.isPointInPath(x, y)) {

                            ctx.fillStyle = col;
                            if (ds) {
                                if (i != that.isSelect) {
                                    that.isSelect=i;
                                    that.beReprintedTop5mediaAnalysis({
                                        starttime: that.$store.state.datas.starttime,
                                        endtime: that.$store.state.datas.endtime,
                                        webid: that.$store.state.reprintObj.webid[i],
                                        webname: that.$store.state.reprintObj.webname[i],
                                    })
                                }

                                ds = false;
                            }
                            //点击调用接口


                        } else {
                            if (i == that.isSelect) {
                                ctx.fillStyle = col;
                            } else {
                                ctx.fillStyle = g1;
                            }
                        }
                        ctx.stroke();
                        ctx.fill();

                        //各网站网站名
                        ctx.fillStyle = '#fff';
                        ctx.font = '12px 微软雅黑';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(dat.webname[i], 0, 0, 70 * num);
                        //画布还原到第二次前
                        ctx.restore();


                    }

                    //画布还原到第一次前
                    ctx.restore();

                }

                function detect(e) {
                    var x = e.clientX - canvas.getBoundingClientRect().left;
                    var y = e.clientY - canvas.getBoundingClientRect().top;
                    once(x, y)
                }


                //清除定时器
               /* var that = this;
                for (var i = 0; i < that.arr1.length; i++) {
                    clearTimeout(that.arr[i]);
                }
                that.arr1 = [];

                for (var i = 0; i <= dat.num; i++) {
//                    setTime(i);
                }

                function setTime(i) {
                    var time1 = setTimeout(function () {
                        //清除画布
                        ctx.clearRect(0, 0, 489 * num, 440 * num);
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
                }*/

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
            reprintObjChange(){
                return this.$store.state.reprintObj
            },
            datasChange(){
                return this.$store.state.datas
            }
        },
        watch: {
            reprintObjChange: {
                handler: function (val, oldVal) {
                    if (val.webid.length) {
//                        给当前组件赋值从vuex上取到的数据

                        this.webid = val.webid;
                        this.webname = val.webname;

                        this.beReprintedTop5mediaAnalysis({
                            starttime: this.$store.state.datas.starttime,
                            endtime: this.$store.state.datas.endtime,
                            webid: val.webid[0],
                            webname: val.webname[0],
                        });
                    }

                },
                deep: true
            },
            datasChange:{
                handler:function(val,oldVal){

                    this.LL=1;
                    this.NN=0;
                    this.isSelect=0;

                },
                deep:true

            },


        }
    }
</script>

<style scoped>
    .topMedia {
        margin-left: .12rem;
    }

    .topMedia-title {
        width: 5.4rem;
        height: .51rem;
        background-color: rgba(67, 61, 54, 0.7);
        line-height: .51rem;
        font-size: .16rem;
        color: #fff;
    }

    .topMedia-title span {
        margin-left: .27rem;
    }

    .topMedia .minbody {
        width: 4.9rem;
        height: 4.4rem;
    }

    #canvas1 {
        width: 4.89rem;
        height: 4.4rem;
        margin: 0 auto;
        display: none;
    }


</style>
