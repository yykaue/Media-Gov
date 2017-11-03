<template>
    <div class="hotwordAnalysiss">
        <h2>热词分析</h2>
        <!--<div id="hotwordAnalysis">-->
        <div id="hotwordAnalysis" >
            <div class="b_10_3">
                <canvas width="800" height="600" id="myCanvas"></canvas>
                <div id="tags"></div>
            </div>
        </div>
        <div class='bg'></div>
    </div>

</template>


<script>
    export default {
        name: 'hotwordAnalysiss',
        data () {
            return {
                msg: ''
            }
        },
        created(){
            this.wordClounds()
        },
        methods: {
            wordClounds: function () {
//                alert(1)

                $.ajax({
                    type: "GET",
                    url: this.$store.state.datas.url + 'webType/PCTopAnalysis?starttime=' + this.$store.state.datas.starttime + '&endtime=' + this.$store.state.datas.endtime + '&webtype=1',
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: "json",
                    success: function (data) {

                        var analogData = ["海洋强国", "文化强国", "美丽中国", "三个自信", "核心价值观新常态", "习大大", "点穴式”外交", "民主生活会", "纪念日", "深改小组", "国安委", "京津冀一体化", "媒体融合", "主体责任", "异地交流任职", "“断崖式”降级", "你懂的。博客,微信", "马航", "网恋", "蓝牙技术", "大数据", "转基因食品", "电子商务", "网购", "数字化战场", "宽带", "高速信息网", "人工智能", "网络犯罪", "申请注册域名", "基因重组", "地球同步卫星", "造血干细胞", "液晶显示", "局域网", "套餐服务", "短信服务", "海洋强国", "文化强国", "美丽中国", "三个自信", "核心价值观新常态", "习大大", "点穴式”外交", "民主生活会", "纪念日", "深改小组", "国安委", "京津冀一体化", "媒体融合", "主体责任", "异地交流任职", "“断崖式”降级", "你懂的。博客,微信", "马航", "网恋", "蓝牙技术", "大数据", "转基因食品", "电子商务", "网购", "数字化战场", "宽带", "高速信息网", "人工智能", "网络犯罪", "申请注册域名", "基因重组", "地球同步卫星", "造血干细胞", "液晶显示", "局域网", "套餐服务", "短信服务"]
                        var as = '';
                        for (var i = 0; i < analogData.length; i++) {
                            as += '<a href="javascript:;">' + analogData[i] + '</a>';
                        }

                        $('#tags').html(as);

                        try {
                            var i, et = document.getElementById('tags').childNodes;
                            for (i in et) {
                                et[i].nodeName == 'A' && et[i].addEventListener('click', function (e) {
                                    e.preventDefault();

                                });
                            }
                            var canvas = document.getElementById('myCanvas');
                            TagCanvas.Start('myCanvas', 'tags', {
                                textColour: '#fff',     //字体颜色
                                outlineColour: '#bd9767',  //边框颜色值
                                reverse: true,          //是否反转
                                depth: 1,                //深度
                                dragControl: true,      //拖拽控制
                                decel: 0.95,
                                maxSpeed: 0.01,          //最大速度
                                initial: [-0.2, 0],
                                freezeActive: true,     //放上去停止
                                zoomMax: 1,              //最大放大
                                zoomMin: 0.5,            //最大缩小
                                outlineOffset: 5,       //字体离边框的距离值
                                wheelZoom: false
                            });
                        } catch (e) {
                            // something went wrong, hide the canvas container
                            //document.getElementById('myCanvasContainer').style.display = 'none';
                        }

                        window.addEventListener("resize",resizeCanvas);

                        function resizeCanvas() {
                            var context = canvas.getContext('2d');
                            var h = $('#hotwordAnalysis').height();
                            $('#myCanvas').height(h);
                            context.fillRect(0, 0, 800, $('#myCanvas').height());

                        }

                        resizeCanvas();


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


                    }.bind(this)
                });


            }
        }
    }
</script>

<style scoped>
    .hotwordAnalysiss {
        margin-top: .37rem;
        position: relative;
    }

    #hotwordAnalysis {
        width: 100%;
        height: 6rem;
        position: relative;
        margin: auto;
        overflow: hidden;
        z-index: 11;
        padding: 0 !important;
        /*background-color: rgba(67, 61, 54, 0.4);*/
    }

    .bg {
        width: 100%;
        height: 6rem;
        position: absolute;
        bottom: 0;
        background: url('../../../../../static/img/hotword.png') no-repeat;
        background-size: 100% 6rem;
        opacity: 1
    }

    #myCanvas {
        margin: 0 auto;
    }

    /*旋转的css*/
    .b_10_3 {
        overflow: hidden;
        text-align: center;
        background: transparent;
    }

    .b_10_3 span {
        float: left;
        font-size: .16rem;
        line-height: 1;
    }

    .b_10_3 span.bold {
        font-weight: bold;
    }

    .b_10_3 span:nth-child(1) {
        width: 35%;
        text-align: center;
    }

    .b_10_3 span:nth-child(2) {
        width: 30%;
        text-align: left;
    }

    .b_10_3 span:nth-child(3) {
        width: 35%;
        text-align: left;
    }

    .b_10_3 span:nth-child(4) {
        width: 35%;
        text-align: right;
    }

    .b_10_3 span:nth-child(5) {
        width: 25%;
        text-align: right;
    }

    .b_10_3 span:nth-child(6) {
        width: 25%;
        text-align: right;
    }

    .b_10_3 span:nth-child(7) {
        width: 50%;
        text-align: center;
    }

    .b_10_3 span:nth-child(8) {
        width: 30%;
        text-align: center;
    }

    .b_10_3 span:nth-child(9) {
        width: 50%;
        text-align: right;
    }

    .b_10_3 span:nth-child(10) {
        width: 40%;
        text-align: right;
    }
</style>

