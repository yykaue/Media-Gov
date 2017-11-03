<template>
    <div class="articleReproduceAnalysis clear">
        <h2>文章被转载分析</h2>
        <div class='tops'>
            <div class="fr count">非规范被转载总量：<span>{{tt}}</span></div>
        </div>
        <div class="minbody rel">
            <!--加载中-->
            <div class="loading" :class="{block:LL==1}"></div>
            <!--暂无数据-->
            <div class="noData" :class="{block:NN==1}"></div>
            <div class="kuang" :class="{block:NN==0}"></div>
        </div>
    </div>
</template>

<script>

    import Vue from 'vue'
    import VueResource from 'vue-resource';
    Vue.use(VueResource);

    export default {
        data () {
            return {
                tt: '-',
                data: '',
                height: null,
                width: null,
                bottom: null,
                top: null,
                left: null,
                right: null,
                chart: null,
                XScrollBox: null,
                XscrollDom: null,
                XscrollBoxHeight: null,
                YScrollBox: null,
                YscrollDom: null,
                YscrollBoxWidth: null,
                LL:1,
                NN:0,
                eChart:'',
            }
        },
        created () {
            this.articleReproduceAnalysis({
                id:this.$store.state.obj.nid,
                Wid:this.$store.state.obj.wid,
            })
        }
        ,
        methods: {
            articleReproduceAnalysis: function (options) {
                $.ajax({
                    type: 'GET',
                    url: this.$store.state.datas.url + 'jusfoun-entmedia/newurlsBtimenews/articleReproduceAnalysis?id=' + options.id + '&Wid=' + options.Wid,
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: 'json',
                    success: function (response) {
                        if(response.result==1){
//                            console.log(response)
                            if (response.data.length != 0) {
                                this.LL=0;
                                this.NN=0;
                                //非规范被转载总量
                                var total = response.total;
                                this.tt = total == 0 ? '-' : total;
                                var data = response.data;
                                this.data = data;

                                var op = {
                                    data: data,
                                    _dom: $('.kuang'),
                                };
                                this.init(op);
                                this.setChart(op);
                                var _this = this;
                                $(window).resize(function () {
                                    var time = null;
                                    clearTimeout(time);
                                    time = setTimeout(function () {
                                        $('.kuang').html('');
                                        _this.init(op);
                                        _this.setChart(op)
                                    }, 300);
                                });
                            } else {
                                this.LL=0;
                                this.NN=1;
                            }
                        }else{
                            this.LL=0;
                            this.NN=1;
                        }



                    }.bind(this)
                })
            },
            init: function (op) {
//        var me;
//        me = this;
                var _dom = op._dom;
                _dom.css('position', 'relative');
                this.height = _dom.height();
                this.width = _dom.width();

                //	图形容器
                this.chart = $('<div></div>')
                        .css({
                            position: 'absolute',
                            bottom: '.1rem'
                        });
                //	图形盒子
                var charDom = $('<div class= "chartDom"></div>')
                        .css({
                            width: '11.5rem',
                            height: '4rem',
                            position: 'absolute',
                            left: '.5rem',
                            top: '.7rem',
                            overflow: 'hidden'
                        })
                        .append(this.chart);

                //	X滑动块
                this.XscrollDom = $('<div></div>')
                        .css({
                            width: '.4rem',
                            height: '.15rem',
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            background: '#ac8961',
                            borderRadius: '.06rem',
                            cursor: 'pointer'
                        });

                //	X滑动盒子
                this.XScrollBox = $('<div></div>')
                        .css({
                            width: '10rem',
                            height: '.15rem',
                            background: '#1a150a',
                            position: 'absolute',
                            left: '1.4rem',
//            margin: 'auto',
                            bottom: '.4rem',
                            borderRadius: '.06rem',
                            display: 'none'
                        })
                        .append(this.XscrollDom);

                //	Y滑动块
                this.YscrollDom = $('<div></div>')
                        .css({
                            width: '.15rem',
                            height: '.4rem',
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            background: '#ac8961',
                            borderRadius: '.06rem',
                            cursor: 'pointer'
                        });

                //	Y滑动盒子
                this.YScrollBox = $('<div class="YScrollBox"></div>')
                        .css({
                            width: '.15rem',
                            height: '3.5rem',
                            background: '#1a150a',
                            position: 'absolute',
                            right: '.2rem',
                            bottom: '1.2rem',
                            borderRadius: '.06rem',
                            display: 'none'
                        })
                        .append(this.YscrollDom);

                _dom.append(charDom, this.XScrollBox, this.YScrollBox);
            },


            /*
             X 滑动事件方法
             * */
            domScrollX: function (scrollDom, chartdom, width) {
                var me, move, x, min, max;
                me = this;
                min = 0;
                max = this.XScrollBox.width() - this.XscrollDom.width();
//                console.log(max);
                $(scrollDom).on('mousedown', function (e) {
                    move = true;
                    var domLeft = parseInt($(scrollDom).css('left'));
                    x = e.pageX - domLeft;
                    $(document).on('mousemove', function (e) {
                        if (move) {
                            var moveX = e.pageX - x;
                            if (moveX < min) {
                                moveX = min;
                            } else if (moveX > max) {
                                moveX = max;
                            }
                            var scale = moveX / (max - min);
                            $(scrollDom).css('left', moveX);
                            me.chartScrollX(chartdom, width, scale);
                        }
                    }).on('mouseup', function (e) {
                        move = false;
                    })
                })
            },
            /*
             Y 滑动事件方法
             * */
            domScrollY: function (scrollDom, chartdom, height) {
                var me, move, y, sBottom, sTop;
                me = this;
                sBottom = 0;
                sTop = this.YScrollBox.height() - this.YscrollDom.height();
                var moveY = 0;
                $(scrollDom).on('mousedown', function (e) {
                    move = true;
                    var oldBt = parseInt($(scrollDom).css('bottom'));
                    y = e.pageY;
                    $(document).on('mousemove', function (e) {
                        if (move) {
                            moveY = y - e.pageY + oldBt;
                            if (moveY < sBottom) {
                                moveY = sBottom;
                            } else if (moveY > sTop) {
                                moveY = sTop;
                            }
                            var scale = moveY / (sTop - sBottom);
                            $(scrollDom).css('bottom', moveY);
                            me.chartScrollY(chartdom, height, scale);
                        }
                    }).on('mouseup', function (e) {
                        $(scrollDom).css('bottom', moveY);
                        move = false;
                    })
                })
            },
            /*
             X 滑动变化方法
             * */
            chartScrollX: function (dom, width, scale) {
                if (parseInt(width) * 100 > $('.chartDom').width()) {
                    $(dom).css('left', -((parseInt(width) - $('.chartDom').width() / 100) * scale) + 'rem');
                }
            },
            /*
             Y 滑动变化方法
             * */
            chartScrollY: function (dom, height, scale,) {
                var num = parseInt(height) * 100 - $('.YScrollBox').height();
                if (parseInt(height) * 100 > $('.YScrollBox').height()) {
                    $(dom).css('top', -(num * (1 - scale)) / 100 + 'rem');
                }
            },


            setChart: function (op) {
                var n = 0;
                var count = 0;
                var width = op.data.length * 23 / 10 + 1.5 + 'rem';
                var aPoint = parseInt(width) / 0.1;
                if (aPoint < 115) {
                    aPoint = 115;
                }
                //	X轴线
                var xLine = $('<div></div>')
                        .css({
                            height: '0.01rem',
                            width: width,
                            minWidth: '11.5rem',
                            borderBottom: '.01rem solid #747474',
                            position: 'absolute',
                            left: '0rem',
                            bottom: '.2rem'
                        });

                //	生成刻度
                for (var i = 0; i < aPoint; i++) {
                    var oSpan = $('<span></span>')
                            .css({
                                width: 0,
                                height: '.04rem',
                                position: 'absolute',
                                left: .1 + i * .1 + 'rem',
                                bottom: '0',
                                borderLeft: '.01rem solid #5d5346'  //小刻度
                            });
                    var markSpan = {
                        width: '.05rem',
                        height: '.05rem',
                        borderRadius: '50%',
                        backgroundColor: '#ad9270',
                        marginLeft: '-.03rem',
                        marginBottom: '-.02rem',
                        zIndex: 4
                    };
                    if (i == 6) {
                        oSpan.css(markSpan);
                    }
                    if ((i - 6) % 23 == 0) {
                        oSpan.css(markSpan);
                    }
                    xLine.append(oSpan);
                }
                $(this.chart).append(xLine);

                //	生成Y轴轴线
                for (var i = 0; i < op.data.length; i++) {
                    var oDiv = $('<div class="single-chart-yAxis-js"></div>')
                            .css({
                                position: 'absolute',
                                bottom: '.2rem',
                                left: .7 + i * 2.3 + 'rem',
                                minHeight: '3.5rem',
                                width: 0,
                                borderLeft: '.01rem solid #605749'
                            });
                    var list = op.data[i].list;
                    if (list.length > n) {
                        n = list.length;
                    }
                    //	生成时间标记
                    var timeDiv = $('<div></div>')
                            .css({
                                position: 'absolute',
                                bottom: '-.2rem',
                                left: '-.36rem',
                                width: '1.5rem',
                                height: '.14rem',
                                lineHeight: '.14rem',
                                color: '#fff',     //x轴的下坐标时间轴
                                fontSize: '.12rem',
                                zIndex: 5
                            })
                            .html(op.data[i].time);
                    oDiv.append(timeDiv);
                    //	生成数据
                    for (var j = 0; j < list.length; j++) {
                        var cDiv = $('<div></div>')
                                .css({
                                    position: 'absolute',
                                    left: 0,
                                    bottom: .2 + j * (.5 + .1) + 'rem',
                                    width: '2rem',
                                    height: '.5rem',
                                    borderRadius: '.25rem',
                                    backgroundColor: '#ac8961',
                                    lineHeight: '.5rem',
                                    color: '#000',
                                    fontSize: '.14rem',
                                    textAlign: 'center'
                                });
                        // console.log(list[j].webTime);
                        if (list[j].webTime === '00:00') {
                            cDiv.html(list[j].webName);
                        } else {
                            list[j].webTime = list[j].webTime;
                            cDiv.html(list[j].webName + '(' + list[j].webTime + ')');
                        }

//            cDiv.html(list[j].webName +  list[j].webTime);
//            cDiv.html(list[j].webName +  '(' + list[j].webTime + ')');
                        oDiv.append(cDiv);
                    }
                    $(this.chart).append(oDiv);
                    count = i;
                }

                var height = n * .6 + .4 + 'rem';
//        console.log(width);
//        console.log(height);
                $(this.chart).css({
                    width: width,
                    height: height,
                    top: -(height - 3.5) + 'rem'
                });

//        控制滚动条的显示和隐藏
                $('.single-chart-yAxis-js').css('height', height);
                if (count >= 5) {
                    this.XScrollBox.css('display', 'block');
                    this.domScrollX(this.XscrollDom, this.chart, width);
                }
                if (n >= 6) {
                    this.YScrollBox.css('display', 'block');
                    this.domScrollY(this.YscrollDom, this.chart, height);
                }
            }
        },

    }
</script>

<style scoped>
    .count {
        float: right;
        margin-right: .3rem;
        font-size: .15rem;
        color: #dab782;
    }

    .count span {
        float: right !important;
    }

    .articleReproduceAnalysis .minbody{
        height: 4.9rem;
    }
    .kuang {
        height: 4.9rem;
        display: none;
    }

</style>
