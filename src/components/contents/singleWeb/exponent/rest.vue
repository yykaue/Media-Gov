<template>
    <div class="rest fl">
        <div class="overview clear">
            <div class="overviewLeft">
                <div class="tops">
                    <span>信息总览</span>
                </div>
                <div class="minbody">
                    <div class="fir clear">
                        <span class="borR">网站名称</span>
                        <p class="borR">{{overviewMsg.webname}}</p>
                        <span class="borR">网站类型</span>
                        <p>{{overviewMsg.webtype}}</p>
                    </div>
                    <div class="two clear">
                        <span class="borR">日均UV量</span>
                        <p class="borR">{{overviewMsg.uv}}</p>
                        <span class="borR">日均PV量</span>
                        <p>{{overviewMsg.pv}}</p>
                    </div>
                </div>
            </div>

            <div class="overviewRight">
                <div class="tops">
                    <span>PC端传播力排行</span>
                </div>
                <div class="minbody">
                    <div class="fir clear">
                        <span class="borR">全网PC排行</span>
                        <p>{{vagilityExponentRankMsg.rank}}</p>
                    </div>
                    <div class="two clear">
                        <span class="borR">同网站类型排行</span>
                        <p>{{vagilityExponentRankMsg.webtyperank}}</p>
                    </div>
                </div>
            </div>

        </div>
        <div class="totalSequential clear">
            <div class="fir">
                <div class="tops">
                    <span>发稿总量</span>
                </div>
                <div class="minbody clear">
                    <div>
                        <span>总计</span>
                        <p>{{msg[0].count}}</p>
                    </div>
                    <div>
                        <span class="mark">
                            昨日
                            <p class="bg">取值为当前时间的前一天</p>
                        </span>
                        <p>{{msg[0].yescount}}</p>
                    </div>
                    <div>
                        <span>环比</span>
                        <p class="relative" :class="{relativeUp:msg[0].num1>0,relativeDown:msg[0].num1<0}">{{msg[0].rate}}</p>
                    </div>
                    <div>
                        <span>环比</span>
                        <p class="relative"  :class="{relativeUp:msg[0].num2>0,relativeDown:msg[0].num2<0}">{{msg[0].yesrate}}</p>
                    </div>
                </div>
            </div>
            <div class="two">
                <div class="tops">
                    <span>原创总量</span>
                </div>
                <div class="minbody clear">
                    <div>
                        <span>总计</span>
                        <p>{{msg[1].count}}</p>
                    </div>
                    <div>
                        <span class="mark">
                            昨日
                            <p class="bg">取值为当前时间的前一天</p>
                        </span>
                        <p>{{msg[1].yescount}}</p>
                    </div>
                    <div>
                        <span>环比</span>
                        <p class="relative"  :class="{relativeUp:msg[1].num1>0,relativeDown:msg[1].num1<0}">{{msg[1].rate}}</p>
                    </div>
                    <div>
                        <span>环比</span>
                        <p class="relative"  :class="{relativeUp:msg[1].num2>0,relativeDown:msg[1].num2<0}">{{msg[1].yesrate}}</p>
                    </div>
                </div>
            </div>
            <div class="thr">
                <div class="tops">
                    <span>被转载总量</span>
                </div>
                <div class="minbody clear">
                    <div>
                        <span>总计</span>
                        <p>{{msg[2].count}}</p>
                    </div>
                    <div>
                        <span class="mark">
                            昨日
                            <p class="bg">取值为当前时间的前一天</p>
                        </span>
                        <p>{{msg[2].yescount}}</p>
                    </div>
                    <div>
                        <span>环比</span>
                        <p class="relative"  :class="{relativeUp:msg[2].num1>0,relativeDown:msg[2].num1<0}">{{msg[2].rate}}</p>
                    </div>
                    <div>
                        <span>环比</span>
                        <p class="relative"  :class="{relativeUp:msg[2].num2>0,relativeDown:msg[2].num2<0}">{{msg[2].yesrate}}</p>
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
                overviewMsg: '',
                vagilityExponentRankMsg: '',
                //msg为totalSequential接口数据
                msg: [
                    {rate: '-', count: '-', yescount: '-', yesrate: '-',num1:0,num2:0},
                    {rate: '-', count: '-', yescount: '-', yesrate: '-',num1:0,num2:0},
                    {rate: '-', count: '-', yescount: '-', yesrate: '-',num1:0,num2:0},
                ],

            }
        },

        created(){
            this.overview({
                starttime: this.$store.state.datas.starttime,
                endtime: this.$store.state.datas.endtime,
                Wid: this.$store.state.obj.wid,
                WebName: this.$store.state.obj.webname
            });
            this.vagilityExponentRank({
                starttime: this.$store.state.datas.starttime,
                endtime: this.$store.state.datas.endtime,
                Wid: this.$store.state.obj.wid,
            });
            this.totalSequential({
                starttime: this.$store.state.datas.starttime,
                endtime: this.$store.state.datas.endtime,
                Wid: this.$store.state.obj.wid,
                WebName: this.$store.state.obj.webname
            });
        },
        methods: {
            overview: function (options) {
                $.ajax({
                    type: "GET",
                    url: this.$store.state.datas.url + 'jusfoun-entmedia/newurlsBtime/overview?starttime=' + options.starttime + '&endtime=' + options.endtime + '&Wid=' + options.Wid + '&WebName=' + options.WebName,
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: "json",
                    success: function (data) {
                        this.overviewMsg = data.data[0];
                        this.overviewMsg.pv = this.format_number(this.overviewMsg.pv);
                        this.overviewMsg.uv = this.format_number(this.overviewMsg.uv);
                    }.bind(this)
                });
            },

            vagilityExponentRank: function (options) {
                $.ajax({
                    type: "GET",
                    url: this.$store.state.datas.url + 'jusfoun-entmedia/newurlsBtime/vagilityExponentRank?starttime=' + options.starttime + '&endtime=' + options.endtime + '&Wid=' + options.Wid,
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: "json",
                    success: function (data) {
                        this.vagilityExponentRankMsg = data.data[0]

                    }.bind(this)
                });
            },

            totalSequential: function (options) {
                $.ajax({
                    type: "GET",
                    url: this.$store.state.datas.url + 'jusfoun-entmedia/newurlsBtime/totalSequential?starttime=' + options.starttime + '&endtime=' + options.endtime + '&Wid=' + options.Wid + '&WebName=' + options.WebName,
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: "json",
                    success: function (data) {
                        this.totalSequentialMsg = data.data;

                        //三位数分割
                        this.msg[0].count = this.format_number(this.totalSequentialMsg[0].totalcount);
                        this.msg[0].yescount = this.format_number(this.totalSequentialMsg[0].yestertotalcount);
                        this.msg[1].count = this.format_number(this.totalSequentialMsg[1].originalycount);
                        this.msg[1].yescount = this.format_number(this.totalSequentialMsg[1].yesteroriginalycount);
                        this.msg[2].count = this.format_number(this.totalSequentialMsg[2].republishedcount);
                        this.msg[2].yescount = this.format_number(this.totalSequentialMsg[2].yesterrepublishedcount);
                        //去百分号
                        this.msg[0].rate = this.totalSequentialMsg[0].totalrate?(parseFloat(this.totalSequentialMsg[0].totalrate.split('%')[0])):'-';
                        this.msg[0].yesrate = this.totalSequentialMsg[0].yestertotalrate?(parseFloat(this.totalSequentialMsg[0].yestertotalrate.split('%')[0])):'-';
                        this.msg[1].rate = this.totalSequentialMsg[1].originalyrate?(parseFloat(this.totalSequentialMsg[1].originalyrate.split('%')[0])):'-';
                        this.msg[1].yesrate = this.totalSequentialMsg[1].yesteroriginalyrate?(parseFloat(this.totalSequentialMsg[1].yesteroriginalyrate.split('%')[0])):'-';
                        this.msg[2].rate = this.totalSequentialMsg[2].republishedrate?(parseFloat(this.totalSequentialMsg[2].republishedrate.split('%')[0])):'-';
                        this.msg[2].yesrate = this.totalSequentialMsg[2].yesterrepublishedrate?(parseFloat(this.totalSequentialMsg[2].yesterrepublishedrate.split('%')[0])):'-';

                        for(var i=0;i<this.msg.length;i++){
                            if(this.msg[i].rate!='-'){
                                if(this.msg[i].rate>0){
                                    this.msg[i].num1=1;
                                    this.msg[i].rate=this.msg[i].rate+'%';
                                }else {
                                    this.msg[i].num1=-1;
                                    this.msg[i].rate=-this.msg[i].rate+'%';
                                }
                            }
                            if(this.msg[i].yesrate!='-'){
                                if(this.msg[i].yesrate>0){
                                    this.msg[i].num2=1;
                                    this.msg[i].yesrate=this.msg[i].yesrate+'%';
                                }else {
                                    this.msg[i].num2=-1;
                                    this.msg[i].yesrate=-this.msg[i].yesrate+'%';
                                }
                            }

                        }


                    }.bind(this)
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
            //对datas监听
            datasChange: {
                handler: function (val, oldVal) {
                    this.overview({
                        starttime: val.starttime,
                        endtime: val.endtime,
                        Wid: this.$store.state.obj.wid,
                        WebName: this.$store.state.obj.webname
                    });
                    this.vagilityExponentRank({
                        starttime: val.starttime,
                        endtime: val.endtime,
                        Wid: this.$store.state.obj.wid,
                    });
                    this.totalSequential({
                        starttime: val.starttime,
                        endtime: val.endtime,
                        Wid: this.$store.state.obj.wid,
                        WebName: this.$store.state.obj.webname
                    });
                },
                deep: true
            },
            objChange: {
                handler: function (val, oldVal) {
                    this.overview({
                        starttime: this.$store.state.datas.starttime,
                        endtime: this.$store.state.datas.endtime,
                        Wid: val.wid,
                        WebName: val.webname
                    });
                    this.vagilityExponentRank({
                        starttime: this.$store.state.datas.starttime,
                        endtime: this.$store.state.datas.endtime,
                        Wid: val.wid,
                    });
                    this.totalSequential({
                        starttime: this.$store.state.datas.starttime,
                        endtime: this.$store.state.datas.endtime,
                        Wid: val.wid,
                        WebName: val.webname
                    });
                },
                deep: true
            },

        }
    }
</script>


<style scoped>
    .rest {
        width: 8.48rem;
        margin-left: 0.12rem;
    }

    .borR {
        border-right: 1px solid rgba(203, 182, 164, 0.25);
    }

    .overview > div {
        float: left;
    }

    .overviewLeft {
        width: 5.6rem;
    }

    .overviewRight {
        margin-left: 0.12rem;
        width: 2.76rem;
    }

    .rest .minbody {
        padding: 0 !important;
    }

    .overview .minbody span, .overview .minbody p {
        height: 0.75rem;
        line-height: 0.75rem;
        float: left;
        font-size: 0.13rem;
        text-align: center;
    }

    .overviewLeft .minbody span {
        width: 1.19rem;
        color: #fff;
    }

    .overviewLeft .minbody p {
        width: 1.58rem;
        color: #ebc58c;
        font-size: 0.16rem;
    }

    .overviewLeft .minbody .two p {
        font-size: 0.18rem;
    }

    .overview .fir {
        border-bottom: 1px solid rgba(203, 182, 164, 0.25);
    }

    .overviewRight .minbody span {
        width: 1.17rem;
        color: #fff;
        padding-left: 0.75rem;
        text-align: left !important;
        font-size: 0.13rem;
    }

    .overviewRight .minbody p {
        width: 0.42rem;
        padding-right: 0.4rem;
        color: #ebc58c;
        text-align: right !important;
        background: url("../../../../../static/img/icon-wifi.png") 0.5rem 0.3rem no-repeat;
        background-size: 0.11rem 0.13rem;
        font-size: 0.18rem;
    }

    .overviewRight .fir span {
        background: url("../../../../../static/img/icon-globe.png") 0.3rem 0.25rem no-repeat;
        background-size: 0.23rem 0.23rem;
    }

    .overviewRight .two span {
        background: url("../../../../../static/img/icon-book.png") 0.3rem 0.25rem no-repeat;
        background-size: 0.21rem 0.19rem;
    }

    .totalSequential {
        margin-top: 0.16rem;
    }

    .totalSequential > div {
        float: left;
    }

    .totalSequential .fir {
        width: 2.74rem;
    }

    .totalSequential .two {
        width: 2.74rem;
        margin-left: 0.12rem;
    }

    .totalSequential .thr {
        width: 2.76rem;
        margin-left: 0.12rem;
    }

    .totalSequential .minbody > div {
        float: left;
        padding: 0.2rem 0 0 0.32rem;
        width: 1.05rem;
        height: 0.53rem;
    }

    .totalSequential .minbody > div span {
        height: 0.18rem;
        line-height: 0.18rem;
        font-size: 0.13rem;
        color: #fff;
        float: left;
    }

    .totalSequential .minbody > div p {
        font-size: 0.18rem;
        color: #ebc58c;
        clear: both;
    }

    .totalSequential .minbody > div .mark {
        background: url("../../../../../static/img/icon-mark.png") right center no-repeat;
        background-size: 0.16rem 0.16rem;
        padding-right: 0.25rem;
        position: relative;
    }

    .totalSequential .minbody > div .mark .bg{
        width:1rem;
        height:0.34rem;
        padding: 0.05rem;
        /*background: url("../../../../../static/img/bg-border.png") center center no-repeat;*/
        background: rgba(34,30,22,0.9);
        background-size: 1.36rem 0.6rem;
        border:1px solid #c59c69 ;
        border-radius: 0.05rem;
        position: absolute;
        bottom:0.2rem;
        left: -0.1rem;
        font-size:0.13rem;
        text-align: center;
        display: none;

    }

    .totalSequential .minbody > div .mark:hover .bg{
        display: block;
    }

    .totalSequential .minbody > div .relative {
        float: left;
        background: right center no-repeat;
        background-size: 0.11rem 0.15rem;
        padding-right: 0.13rem;
    }

    .relativeUp {
        color: #ff503f !important;
        background-image: url("../../../../../static/img/icon-up.png") !important;
    }

    .relativeDown {
        background-image: url("../../../../../static/img/icon-down.png") !important;
    }

    /*w120*/
    /*height:0.74rem*/
</style>