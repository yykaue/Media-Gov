<template>
    <div class="searchs clear">
        <div class="textType clear">
            <div class="type clear">
                <p>文章类型：</p>
                <div class="original" @click="articleTypeChange(1)" :class="{select1:num1==1}">原创</div>
                <div class="reprint" @click="articleTypeChange(2)" :class="{select1:num1==2}">转载</div>
            </div>
            <div class="sort clear">
                <p>文章排序：</p>
                <div class="hottest" @click="orderChange(1)" :class="{select2:num2==1}">最热</div>
                <div class="newest" @click="orderChange(2)" :class="{select2:num2==2}">最新</div>
            </div>
        </div>
        <ul class="searchBody">
            <li v-for="(item,index) in msg" :class="{fire:page.index==1&&index<3&&num2==1,new:page.index==1&&index<3&&num2==2}">
                <p v-html="item.title"></p>
                <div class="clear">
                    <p class="fl">
                        <span class="sp1">{{item.pubtimeformat}}</span>
                        <span class="sp2">类型：{{item.articletype}}</span>
                        <a class="sp3 fl" :href="item.url" target="_blank">原文链接</a>
                        <span class="sp4">来源：{{item.source}}</span>
                    </p>
                    <p class="fr">
                        <span class="sp5">被转载指数：{{item.pcvagility}}</span>
                        <span class="sp6">被转载量：{{item.bzcount}}</span>
                        <span class="sp7" @click="toRouter({nid:item.nid,name:item.name,wid:item.wid})">查看传播效果</span>
                    </p>
                </div>

            </li>
        </ul>
        <div class="page">
            <div class="index" @click="pageNum(1)">首页</div>
            <ul class="ulPage">
                <!--<li v-for="li in pageLi" :class="{rel:li==page}" @click="pageNum(li)">{{li}}</li>-->
                <li v-for="li in list" @click="pageNum(li)" :class="{select3:page.index==li}">{{li}}</li>
            </ul>
            <div class="last" @click="pageNum(page.num)">尾页</div>
            <div>跳转至</div>
            <input type="text">
            <div>页</div>
            <div class="go">确定</div>
            <div class="pageNum">
                共 {{page.total}} 条记录
                <span>{{page.index}}</span>
                /{{page.num}}页
            </div>
        </div>
    </div>
</template>

<script>

    import Vue from 'vue'
    import VueResource from 'vue-resource';
    export default {
        data () {
            return {
                msg: '',
                list: '',
                page:{
                    total:'',
                    num:'',
                    index:'',
                },
                num1:this.$store.state.searchObj.articleType,
                num2:this.$store.state.searchObj.order,
            }
        },

        created(){
            this.$store.state.content=localStorage.getItem('content');
            this.$store.state.searchType=localStorage.getItem('searchType');
            this.searchMediaAndArticle({
                begintime: this.$store.state.datas.starttime,
                endtime: this.$store.state.datas.endtime,
                searchType: 2,
                pageIndex: 1,
                pageSize: 13,
                content: this.$store.state.content,
                articleType: this.$store.state.searchObj.articleType,
                order: this.$store.state.searchObj.order,
            })
        },
        methods: {

            searchMediaAndArticle: function (options) {
                $.ajax({
                    type: "GET",
                    url: options.searchType == 2 ? (this.$store.state.datas.url + 'newsArticle/searchMediaAndArticle?searchType=' + options.searchType + '&begintime=' + options.begintime + '&endtime=' + options.endtime + '&pageIndex=' + options.pageIndex + '&pageSize=' + options.pageSize + '&content=' + options.content + '&articleType=' + options.articleType + '&order=' + options.order) : (this.$store.state.datas.url + 'newsArticle/searchMediaAndArticle?searchType=' + options.searchType + '&begintime=' + options.begintime + '&endtime=' + options.endtime + '&pageIndex=' + options.pageIndex + '&pageSize=' + options.pageSize + '&content=' + options.content),
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: "json",
                    success: function (data) {
                        if (data.result == 1) {
                            var param = options.content;
                            var reg = new RegExp(param,"g");

                            for (var i = 0; i < data.data.length; i++) {
                                data.data[i].pubtimeformat = this.getDateByTime(data.data[i].pubtimeformat);
                                data.data[i].pcvagility = data.data[i].pcvagility?(this.format_number(data.data[i].pcvagility)):'-' ;
                                data.data[i].bzcount = data.data[i].bzcount? (this.format_number(data.data[i].bzcount)):'-';
                                data.data[i].title = data.data[i].title.replace(reg, '<span style="color:#ff503f">'+options.content+'</span>')
                            }
                            this.msg = data.data;

                            this.page.total=data.total;
                            this.page.num=Math.ceil(data.total/options.pageSize);
                            this.page.index=options.pageIndex;
                            //页码数据绑定到this.page上
                            var arr=[];
                            var ds = data.total > 9 ? 9 : data.total;
                            var ind=parseInt(options.pageIndex);
                            var total=Math.ceil(data.total/options.pageSize);
                            if (ind <= 5) {
                                for (var i = 1; i <= ds; i++) {
                                    arr.push(i);
                                }
                            } else if (ind > total - 5) {
                                for (var i = total - (ds - 1); i <= total; i++) {
                                    arr.push(i);
                                }
                            } else {
                                for (var i = ind - 4; i < ind + 5; i++) {
                                    arr.push(i);
                                }
                            }

                            this.list=arr;
                            this.pageGo();

                        }
                    }.bind(this)
                })
            },

            getDateByTime: function (time) {
                var oDate = new Date(time);
                return '' + oDate.getFullYear() + '-' + toTen(oDate.getMonth() + 1) + '-' + toTen(oDate.getDate()) + ' ' + toTen(oDate.getHours()) + ':' + toTen(oDate.getMinutes());
                function toTen(number) {
                    return parseInt(number) < 10 ? '0' + number : '' + number;
                }
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

            toRouter: function (op) {
//                console.log(op)
                localStorage.setItem('nid', op.nid);
                localStorage.setItem('webname', op.name);
                localStorage.setItem('wid', op.wid);
                localStorage.setItem('goTo', 1);
                var dc=this.$store.state.urls;
                window.open(dc);
//                内网
//                window.open("http://192.168.1.68:8080/index.html#/");
//                外网
//                window.open("http://opinion.9cfcf.com/index.html#/");
//                本地
//                window.open("/");
            },

            pageNum: function (n) {
                this.searchMediaAndArticle({
                    begintime: this.$store.state.datas.starttime,
                    endtime: this.$store.state.datas.endtime,
                    searchType: 2,
                    pageIndex: n,
                    pageSize: 13,
                    content: this.$store.state.content,
                    articleType: this.$store.state.searchObj.articleType,
                    order: this.$store.state.searchObj.order,
                })
            },
            pageGo: function () {
                var inp = $('.searchs .page input')[0];
                var reg = /\D|\d{6}/g;
                inp.onkeyup = function () {
                    inp.value = inp.value.replace(reg, '');
                };
                var gos = $('.searchs .page .go')[0];
                var that = this;
                gos.onclick = function () {
                    if (inp.value <= that.page.num && inp.value > 0) {
                        that.pageNum(inp.value);
                    }

                }
            },
            articleTypeChange:function (n) {
                this.num1=n;
                this.$store.state.searchObj.articleType=n;
            },
            orderChange:function (n) {
                this.num2=n;
                this.$store.state.searchObj.order=n;
            },
            /*fontSizeChange:function () {
                var docEl = window.document.documentElement;
                var width = docEl.getBoundingClientRect().width;
                if (width > 1440) {
                    width = 1440;
                } else if (width <= 1000) {
                    width = 1000;
                }
                var rem = width / 14.4;
                docEl.style.fontSize = rem + 'px';
                console.log(width);
                console.log(docEl.style.fontSize)

            }*/

        },

        computed: {
            searchObjChange(){
                return this.$store.state.searchObj
            },
            contentChange(){
                return this.$store.state.content
            },
            datasChange(){
                return this.$store.state.datas
            }
        },
        watch: {
            searchObjChange: {
                handler: function (val, oldVal) {
                    this.searchMediaAndArticle({
                        begintime: this.$store.state.datas.starttime,
                        endtime: this.$store.state.datas.endtime,
                        searchType: 2,
                        pageIndex: 1,
                        pageSize: 13,
                        content: this.$store.state.content,
                        articleType: val.articleType,
                        order: val.order,
                    })
                },
                deep: true
            },
            datasChange: {
                handler: function (val, oldVal) {
                    this.searchMediaAndArticle({
                        begintime: val.starttime,
                        endtime: val.endtime,
                        searchType: 2,
                        pageIndex: 1,
                        pageSize: 13,
                        content: this.$store.state.content,
                        articleType: this.$store.state.searchObj.articleType,
                        order: this.$store.state.searchObj.order,
                    })
                },
                deep: true
            },
            contentChange: {
                handler: function (val, oldVal) {

                    this.num1=this.$store.state.searchObj.articleType;
                    this.num2=this.$store.state.searchObj.order;

                    this.searchMediaAndArticle({
                        begintime: this.$store.state.datas.starttime,
                        endtime: this.$store.state.datas.endtime,
                        searchType: 2,
                        pageIndex: 1,
                        pageSize: 13,
                        content: val.content,
                        articleType: this.$store.state.searchObj.articleType,
                        order: this.$store.state.searchObj.order,
                    })
                },
                deep: true
            },

        }
    }

</script>

<style scoped>

    .searchs {
        padding-top: 0.3rem;
    }

    .textType {
        font-size: 0.16rem;
        color: #fff;
    }

    .textType > div {
        float: left;
    }

    .textType > div > p, .textType > div > div {
        float: left;
        height: 0.26rem;
        line-height: 0.26rem;
    }

    .type > div {
        padding-left: 0.23rem;
        background: url("../../../../static/img/icon-selected01.png") left center no-repeat;
        background-size: 0.16rem 0.16rem;
        cursor: pointer;
    }

    .type .original {
        margin-left: 0.15rem;
    }

    .type .reprint {
        margin-left: 0.4rem;
    }

    .sort {
        margin-left: 0.9rem;
    }

    .sort > div {
        width: 0.56rem;
        height: 0.26rem;
        text-align: center;
        font-size: 0.14rem;
        color: #000;
        background: #fff;
        border-radius: 0.05rem;
        cursor: pointer;
    }

    .sort .newest {
        margin-left: 0.1rem;
    }

    .select1 {
        background-image: url("../../../../static/img/icon-selected02.png") !important;
    }

    .select2 {
        background: #ff503f !important;
        color: #fff !important;
    }

    .searchBody {
        background: rgba(67, 61, 54, 0.4);
        border-radius: 0.03rem;
        padding: 0 0.3rem;
        margin-top: 0.3rem;
        min-height: 2rem;
    }

    .searchBody li {
        /*height:0.5rem;*/
        border-top: 1px solid rgba(203, 182, 164, 0.2);
        padding: 0.2rem 0.1rem 0.18rem 0.48rem;
    }

    .searchBody li:nth-child(1) {
        border: 0 !important;
    }

    .new {
        background: url("../../../../static/img/icon-new.png") 0.12rem 0.15rem no-repeat;
        background-size: 0.28rem 0.28rem;
    }
    .fire {
        background: url("../../../../static/img/icon-fire.png") 0.12rem 0.15rem no-repeat;
        background-size: 0.28rem 0.28rem;
    }

    .searchBody li:nth-child(2n-1) {
        background-color: rgba(255, 255, 255, 0.02);
    }

    .searchBody li > p {
        font-size: 0.15rem;
        color: #ebc58c;
    }

    .searchBody li > div {
        font-size: 0.12rem;
        color: #fff;
        margin-top: 0.2rem;
    }

    .searchBody li > div > p > span {
        float: left;
    }

    .searchBody .sp2 {
        margin-left: 0.35rem;
    }

    .searchBody .sp3 {
        margin-left: 0.35rem;
        color: #ebc58c;
        background: url("../../../../static/img/icon-clip.png") left center no-repeat;
        background-size: 0.12rem 0.12rem;
        padding-left: 0.14rem;
    }

    .searchBody .sp4 {
        margin-left: 0.35rem;
    }

    .searchBody .sp5 {
        width: 1.5rem;
        padding-left: 0.15rem;
        background: url("../../../../static/img/icon-link.png") left center no-repeat;
        background-size: 0.1rem 0.12rem;
    }

    .searchBody .sp6 {
        width: 1.5rem;
        padding-left: 0.15rem;
        background: url("../../../../static/img/icon-back.png") left center no-repeat;
        background-size: 0.12rem 0.12rem;

    }

    .searchBody .sp7 {
        margin-left: 0.65rem;
        padding-right: 0.15rem;
        font-weight: bold;
        color: #ebc58c;
        background: url("../../../../static/img/icon-arrows.png") right center no-repeat;
        background-size: 0.07rem 0.11rem;
        cursor: pointer;
    }

    .page {
        margin-top: 0.7rem;
        float: right;
    }

    .page > div, .page > ul {
        float: left;
        font-size: 0.16rem;
        height: 0.27rem;
        line-height: 0.27rem;
        color: #fff;
    }

    .page .index, .page .last, .page .go, .page .ulPage li {
        cursor: pointer;
    }

    .page .index, .page .last, .page .go {
        width: 0.7rem;
        text-align: center;
        border-radius: 0.01rem;
        color: #000;
        margin: 0 0.2rem;
    }

    .page .index, .page .go {
        background: #b9956a;
    }

    .page .last {
        background: #fff;
    }

    .page .ulPage li {
        float: left;
        margin: 0 0.01rem;
        width: 0.5rem;
        height: 0.26rem;
        text-align: center;
    }

    .select3 {
        background: #b9956a;
        border-radius: 0.13rem;
        color: #000 !important;
    }

    .page > input {
        float: left;
        background: transparent;
        outline: none;
        height: 0.25rem;
        border: 1px solid rgba(255, 255, 255, 0.6);
        padding: 0 0.1rem;
        margin:0 0.1rem;
        width: 0.42rem;
        text-align: center;
        color: #fff;
    }
    .page .pageNum>span{
        color: #ebc58c;
    }
</style>