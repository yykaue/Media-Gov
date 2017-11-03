<template>
    <div class="transmissibility clear">
        <h2>传播力指数分析</h2>
        <div class="tops">
            <span>传播力排行榜</span>
            <div class="upline"></div>
            <div class="iconPc">PC传播排行</div>
            <div class="iconSina">微博传播排行</div>
            <div class="iconWeChat">微信传播排行</div>
        </div>
        <div class="minbody clear">
            <ul class="ulTrs">
                <li class="fir">
                    <span class="ranking">排名</span>
                    <span class="webName">网站名称</span>
                    <span class="exponent">传播力指数</span>
                    <span class="issued ">发稿量</span>
                    <span class="original">原创量</span>
                    <span class="reprint">被转载量</span>
                    <span class="percentage">原创率</span>
                    <span class="Uv">UV量</span>
                    <span class="Pv">PV量</span>
                    <span class="browse">平均浏览页面数</span>
                    <span class="webType">网站类型</span>
                </li>

                <li v-for="item in list" @click="toRouter({webname:item.webname,wid:item.wid})">
                    <span class="ranking">{{item.number}}</span>
                    <span class="webName">{{item.webname}}</span>
                    <span class="exponent">{{item.pcvagility}}</span>
                    <span class="issued ">{{item.totalcount}}</span>
                    <span class="original">{{item.originalycount}}</span>
                    <span class="reprint">{{item.bzcount}}</span>
                    <span class="percentage">{{item.rate}}</span>
                    <span class="Uv">{{item.uv}}</span>
                    <span class="Pv">{{item.pv}}</span>
                    <span class="browse">{{item.at}}</span>
                    <span class="webType">{{item.typename}}</span>
                </li>

            </ul>
            <div class="page">
                <div class="index" @click="pageNum(1)">首页</div>
                <div class="iconLeft" @click="pagePrep"></div>
                <ul class="ulPage">
                    <li v-for="li in pageLi" :class="{rel:li==page}" @click="pageNum(li)">{{li}}</li>
                </ul>
                <div class="iconRight" @click="pageAdd()"></div>
                <div class="last" @click="pageNum(totalPages)">尾页</div>
                <div class="pageNum"><span>{{page}}</span>/{{totalPages}}</div>
                <div class="goTo">跳转至</div>
                <input type="text">
                <div class="go">GO</div>
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
                list: '',
                pageLi: 1,
                page: 1,
                totalPages: 1,
            }
        },

//        已有监听，不需要默认加载，浪费资源
//        mounted: function () {
//            alert(this.$route);
//            console.log(this.$route);
//        },
        created(){
            this.vagilityRankList({
                starttime: this.$store.state.datas.starttime,
                endtime: this.$store.state.datas.endtime,
                webtype: this.$store.state.datas.webtype,
                type: 2,
                page: 1,
                rows: 10
            })
        },
        methods: {
            vagilityRankList: function (option) {
                $.ajax({
                    type: "GET",
                    url: this.$store.state.datas.url + 'index/vagilityRankList?starttime=' + option.starttime + '&endtime=' + option.endtime + '&webtype=' + option.webtype + '&type=' + option.type + '&page=' + option.page + '&rows=' + option.rows,
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: "json",
                    success: function (data) {
                        var data1 = data.content;
                        if (data.totalRows > 0) {
                            //页码展示
                            var arr = [];
                            var ds = data.totalPages < 9 ? data.totalPages : 9;
                            if (option.page <= 5) {
                                for (var i = 1; i <= ds; i++) {
                                    arr.push(i);
                                }
                            } else if (option.page > data.totalPages - 5) {
                                for (var i = data.totalPages - (ds - 1); i <= data.totalPages; i++) {
                                    arr.push(i);
                                }
                            } else {
                                for (var i = option.page - 4; i < option.page + 5; i++) {
                                    arr.push(i);
                                }
                            }
                            this.pageLi = arr;
                            this.page = option.page;

//                            data.totalPages
//                            if(option.page<data.totalPages)
//                            this.pageLi=arr;

                            //数据展示
                            this.totalPages = data.totalPages;
                            for (var i = 0; i < data1.length; i++) {
                                //发稿量
                                if (data1[i].totalcount >= 10000) {
                                    var num = parseInt(data1[i].totalcount / 10000);
                                    if (data1[i].totalcount % 10000 == 0) {
                                        data1[i].totalcount = num + 'W';
                                    } else if (data1[i].totalcount % 10000 >= 5000) {
                                        data1[i].totalcount = num + 'W+';
                                    } else if (data1[i].totalcount % 10000 < 5000) {
                                        data1[i].totalcount = num + 'W-';
                                    }
                                }
                                //原创量
                                if (data1[i].originalycount >= 1000) {
                                    var num = parseInt(data1[i].originalycount / 1000);
                                    if (data1[i].originalycount % 1000 == 0) {
                                        data1[i].originalycount = num + 'K';
                                    } else if (data1[i].originalycount % 1000 >= 500) {
                                        data1[i].originalycount = num + 'K+';
                                    } else if (data1[i].originalycount % 1000 < 500) {
                                        data1[i].originalycount = num + 'K-';
                                    }
                                }
                                //被转载量
                                if (data1[i].bzcount >= 10000) {
                                    var num = parseInt(data1[i].bzcount / 10000);
                                    if (data1[i].bzcount % 10000 == 0) {
                                        data1[i].bzcount = num + 'W';
                                    } else if (data1[i].bzcount % 10000 >= 5000) {
                                        data1[i].bzcount = num + 'W+';
                                    } else if (data1[i].bzcount % 10000 < 5000) {
                                        data1[i].bzcount = num + 'W-';
                                    }
                                }
                                //原创率
                                data1[i].rate = data1[i].rate + '%';
                                //UV
                                if (data1[i].uv >= 10000) {
                                    var num = parseInt(data1[i].uv / 10000);
                                    if (data1[i].uv % 10000 == 0) {
                                        data1[i].uv = num + 'W';
                                    } else if (data1[i].uv % 10000 >= 5000) {
                                        data1[i].uv = num + 'W+';
                                    } else if (data1[i].uv % 10000 < 5000) {
                                        data1[i].uv = num + 'W-';
                                    }
                                }
                                //PV
                                if (data1[i].pv >= 10000) {
                                    var num = parseInt(data1[i].pv / 10000);
                                    if (data1[i].pv % 10000 == 0) {
                                        data1[i].pv = num + 'W';
                                    } else if (data1[i].pv % 10000 >= 5000) {
                                        data1[i].pv = num + 'W+';
                                    } else if (data1[i].pv % 10000 < 5000) {
                                        data1[i].pv = num + 'W-';
                                    }
                                }

                            }
                            this.list = data.content;
//                            console.log(this.list)
                            this.pageGo();
                        }
                    }.bind(this)
                });
            },
            pageNum: function (n) {
                this.vagilityRankList({
                    starttime: this.$store.state.datas.starttime,
                    endtime: this.$store.state.datas.endtime,
                    webtype: this.$store.state.datas.webtype,
                    type: 2,
                    page: n,
                    rows: 10
                })
            },
            pageAdd: function () {
                this.page++;
                if (this.page >= this.totalPages) {
                    this.page = this.totalPages;
                }
                this.vagilityRankList({
                    starttime: this.$store.state.datas.starttime,
                    endtime: this.$store.state.datas.endtime,
                    webtype: this.$store.state.datas.webtype,
                    type: 2,
                    page: this.page,
                    rows: 10
                })
            },
            pagePrep: function () {
                this.page--;
                if (this.page <= 1) {
                    this.page = 1;
                }
                this.vagilityRankList({
                    starttime: this.$store.state.datas.starttime,
                    endtime: this.$store.state.datas.endtime,
                    webtype: this.$store.state.datas.webtype,
                    type: 2,
                    page: this.page,
                    rows: 10
                })
            },
            pageGo: function () {
                var inp = $('.transmissibility .page input')[0];
                var reg = /\D|\d{3}/g;
                inp.onkeyup = function () {
                    inp.value = inp.value.replace(reg, '');
                };
                var gos = $('.transmissibility .page .go')[0];
                var that = this;
                gos.onclick = function () {
                    if (inp.value <= that.totalPages && inp.value > 0) {
                        that.pageNum(inp.value);
                    }

                }
            },
            toRouter: function (op) {
                localStorage.setItem('webname', op.webname);
                localStorage.setItem('wid', op.wid);

                this.$store.state.isSelect = '-1';
                this.$router.push({path: '/singleWeb'})
            }
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
                    this.vagilityRankList({
                        starttime: val.starttime,
                        endtime: val.endtime,
                        webtype: val.webtype,
                        type: 2,
                        page: 1,
                        rows: 10
                    })
                },
                deep: true
            },

        }
//        components:{asides,mainbody}
    }


</script>

<style scoped>
    .transmissibility .ulTrs > li {
        border-bottom: 1px solid rgba(200, 183, 166, 0.25);
        height: 0.39rem;
        line-height: 0.39rem;
        color: #fff;
        font-size: 0.12rem;
        cursor: pointer;
    }

    .transmissibility .ulTrs > li:nth-child(odd) {
        background: rgba(255, 255, 255, 0.02);
    }

    .transmissibility .ulTrs .fir {
        height: 0.43rem;
        line-height: 0.43rem;
        background: rgba(191, 148, 99, 0.15) !important;
        border-top-left-radius: 0.05rem;
        border-top-right-radius: 0.05rem;
        cursor: default;
    }

    .transmissibility .ulTrs .fir span {
        color: #fff;
    }

    .transmissibility .ulTrs > li span {
        float: left;
        text-align: center;
        color: #fff;
        height: 0.39rem;
        line-height: 0.39rem;
    }

    .transmissibility .ulTrs .ranking {
        width: 0.7rem;
    }

    .transmissibility .ulTrs .webName {
        width: 1.75rem;
        color: #ebc58c;
        height: 0.39rem;
    }

    .transmissibility .ulTrs .exponent {
        width: 1rem;
        color: #ebc58c;
    }

    .transmissibility .ulTrs .issued {
        width: 0.9rem;
    }

    .transmissibility .ulTrs .original {
        width: 1.2rem;
    }

    .transmissibility .ulTrs .reprint {
        width: 0.85rem;
    }

    .transmissibility .ulTrs .percentage {
        width: 1.15rem;
    }

    .transmissibility .ulTrs .Uv {
        width: 0.8rem;
    }

    .transmissibility .ulTrs .Pv {
        width: 1.3rem;
    }

    .transmissibility .ulTrs .browse {
        width: 1rem;
    }

    .transmissibility .ulTrs .webType {
        width: 1.48rem;
    }

    .page {
        float: right;
        height: 0.24rem;
        line-height: 0.24rem;
        margin: 0.36rem 0 0.05rem;
    }

    .page > div, .page ul, .page input {
        float: left;
        font-size: 0.14rem;
        color: #fff;
        margin: 0 0.03rem;
    }

    .page .index, .page .iconLeft, .page .iconRight, .page .last, .page .go, .page .ulPage li {
        cursor: pointer;
    }

    .page .iconLeft {
        background: url("../../../../../static/img/icon-left.png") center center no-repeat;
    }

    .page .iconRight {
        background: url("../../../../../static/img/icon-right.png") center center no-repeat;
    }

    .page .iconLeft, .page .iconRight {
        width: 0.28rem;
        height: 0.24rem;
        background-size: 0.08rem 0.12rem;
    }

    .page input {
        width: 0.18rem;
        padding: 0 0.1rem;
        height: 0.2rem;
        margin: 0.01rem 0.03rem;
        color: #fff;
        border: 1px solid white;
        border-radius: 0.05rem;
        background: transparent;
        outline: none;
    }

    .page .go {
        width: 0.48rem;
        height: 0.24rem;
        background: #b9956a;
        color: #000;
        text-align: center;
        border-radius: 0.03rem;
        margin-left: 0.25rem;
    }

    .page .ulPage li {
        width: 0.22rem;
        height: 0.22rem;
        margin: 0.01rem 0.02rem;
        text-align: center;
        float: left;
    }

    .page .pageNum > span {
        color: #b9956a;
    }

    .rel {
        background: #b9956a;
        border-radius: 0.03rem;
        color: #202020 !important;
    }
</style>
