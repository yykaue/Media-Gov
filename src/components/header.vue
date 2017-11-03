<template>
    <div class="head">
        <div class="title">
            <span class="title-1">媒体传播力监测大数据平台</span>
            </br>
            <span class="title-2">USER DASHBOARD</span>
        </div>
        <div class="search">
            <div class="search-l">
                <span>网站</span>
                <i class="top-san" @click="choose(1)"></i>
                <i class="bottom-san" @click="choose(2)"></i>
            </div>
            <div class="search-r">
                <input type="text" placeholder="请输入搜索词">
                <div></div>
                <ul class="ulSearch">
                    <li v-for="li in msg" :title="li.title" @click="toRouter({nid:li.nid,name:li.name,wid:li.wid})">{{li.title}}</li>
                    <li v-for="li in msg1" :title="li.name" @click="toRouter1({name:li.name,wid:li.wid})">{{li.name}}</li>
                </ul>
            </div>
        </div>
        <div class="user">
            <img src="../../static/img/user.png" alt="用户头像">
            <span class="user-name">Raaz Das</span>
            <div class="exit" @click="exit()">退出</div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import VueResource from 'vue-resource';

    export default {
        name: 'head',
        data(){
            return {
                msg:'',
                msg1:'',
            }
        },

        mounted: function () {
            this.jugg();

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
                            if(options.searchType==2){
                                this.msg=data.data;
                                this.msg1='';
                            }else if(options.searchType==1){
                                this.msg1=data.data;
                                this.msg='';
//                                console.log(data)
                            }

                            var ds = $('.head .search-r input')[0];
                            if(ds.value){
                                $('.ulSearch').fadeIn('slow');
                            }

                        }
                    }.bind(this)
                })
            },
            choose: function (n) {
                if (n == 1) {
                    this.$store.state.searchType=1;
                    localStorage.setItem('searchType',1);
                    $('.head .search-l span').html('网站');
                } else if (n == 2) {
                    localStorage.setItem('searchType',2);
                    this.$store.state.searchType=2;
                    $('.head .search-l span').html('文章');
                }
            },
            jugg: function () {
                var ds = $('.head .search-r input')[0];
                var that = this;
                var times = null;
                ds.onkeyup = function () {
                    if (that.strlen(ds.value) > 3) {
                        clearTimeout(times);
                        times = setTimeout(function () {
                            if(that.$store.state.searchType==2){
                                that.searchMediaAndArticle({
                                    begintime: that.$store.state.datas.starttime,
                                    endtime: that.$store.state.datas.endtime,
                                    searchType: 2,
                                    pageIndex: 1,
                                    pageSize: 5,
                                    content: ds.value,
                                    articleType: that.$store.state.searchObj.articleType,
                                    order: that.$store.state.searchObj.order,
                                })
                            }else if(that.$store.state.searchType==1){
                                that.searchMediaAndArticle({
                                    begintime: that.$store.state.datas.starttime,
                                    endtime: that.$store.state.datas.endtime,
                                    searchType: 1,
                                    pageIndex: 1,
                                    pageSize: 410,
                                    content: ds.value,
                                    articleType: that.$store.state.searchObj.articleType,
                                    order: that.$store.state.searchObj.order,
                                })
                            }


                        }, 500)
                    }
                };
                ds.onblur=function () {
                    $('.ulSearch').fadeOut('slow');
                    var values=ds.value;
                    ds.value='';
                    var dk=$('.head .search-r div')[0];
                    //点击搜索
                    if(that.$store.state.searchType==2){
                        dk.onclick=function () {
                            if(values){

                                that.$store.state.content=values;
                                localStorage.setItem('content',values);
                                localStorage.setItem('searchType', 2);
                                that.$router.push({path: '/search'})
                            }
                        };
                    }


                };
                //回车搜索
                document.onkeydown=function (e) {
                    var e=e||window.event;
                    if(e.keyCode==13){
                        if(that.$store.state.searchType==2&&ds.value){
                            that.$store.state.content=ds.value;
                            localStorage.setItem('content',ds.value);
                            localStorage.setItem('searchType', 2);
                            that.$router.push({path: '/search'});
                            ds.blur();
                            ds.value='';
                        }

                    }

                }


            },
            //计算字节
            strlen: function (str) {
                var len = 0;
                for (var i = 0; i < str.length; i++) {
                    var kael = str.charCodeAt(i);
                    //单字节加1
                    if ((kael >= 0x0001 && kael <= 0x007e) || (0xff60 <= kael && kael <= 0xff9f)) {
                        len++;
                    }
                    else {
                        len += 2;
                    }
                }
                return len;
            },
            toRouter: function (op) {
                localStorage.setItem('nid', op.nid);
                localStorage.setItem('webname', op.name);
                localStorage.setItem('wid', op.wid);
                localStorage.setItem('goTo', 1);
                setTimeout(function () {
                    localStorage.removeItem('goTo');
                },10000);
                var dc=this.$store.state.urls;
                window.open(dc);
//                内网
//                window.open("http://192.168.1.68:8080/index.html#/");
//                外网
//                window.open("http://opinion.9cfcf.com/index.html#/");
//                本地
//                window.open("/");
            },
            toRouter1: function (op) {
                this.$store.state.content=op.name;
                localStorage.setItem('webname', op.name);
                localStorage.setItem('wid', op.wid);
                this.$router.push({path: '/singleWeb'});

            },
            //退出
            exit:function () {
                $.ajax({
                    type: "GET",
                    url: this.$store.state.datas.url + 'jusfoun-entmedia/ctLogin/loginOut',
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: "json",
                    success: function (data) {
                        localStorage.clear();
                        var exits=this.$store.state.exitUrl;
                        window.location.href=exits;

                    }.bind(this)
                })
            }
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .head {
        margin: 0;
        padding: 0;
        width: 100%;
        height: .7rem;
        background-color: #504231;
    }

    .head .title {
        text-align: center;
        margin-left: .28rem;
        margin-top: .18rem;
        float: left;
        color: #ebc58c;
    }

    .head .title-1 {
        font-size: .20rem;
    }

    .head .title-2 {
        display: block;
        margin-right: .08rem;
        font-size: .12rem;
    }

    .search {
        width: 3.20rem;
        height: .32rem;
        background: #262524;
        float: left;
        margin-left: 5.15rem;
        margin-top: .19rem;
        border-radius: .16rem;
    }

    .search-l {
        text-align: center;
        width: .84rem;
        float: left;
        font-size: .14rem;
        color: #ebc58c;
        line-height: .32rem;
        border-right: .01rem solid #534635;
        position: relative;
    }

    .top-san {
        width: 0;
        height: 0;
        border: .04rem solid transparent;
        border-bottom: .04rem solid #ebc58c;
        position: absolute;
        top: .07rem;
        right: .1rem;
        cursor: pointer;
    }

    .bottom-san {
        width: 0;
        height: 0;
        border: .04rem solid transparent;
        border-top: .04rem solid #ebc58c;
        position: absolute;
        bottom: .06rem;
        right: .1rem;
        cursor: pointer;
    }

    .search-r {
        float: left;
        position: relative;
    }

    .search-r input {
        margin-top: 0;
        width: 1.9rem;
        height: .32rem;
        outline: none;
        border: none;
        background-color: transparent;
        padding-left: .1rem;
        color: #a3a3a3;
        font-size: .14rem;
        float: left;
    }

    .search-r>div {
        width: .2rem;
        height: .20rem;
        background: url('../../static/img/search.png') no-repeat;
        background-size: .2rem .2rem;
        margin-top: .08rem;
        float: right;
        cursor: pointer;
    }

    .user {
        width: 2.2rem;
        height: .7rem;
        line-height: .7rem;
        float: right;
    }

    .user img {
        display: block;
        float: left;
        width: .4rem;
        height: .4rem;
        margin-top: .15rem;
    }

    .user span {
        float: left;
        font-size: .13rem;
        color: #fff;
        margin-left: .10rem;
    }

    .user ul {
        float: left;
        margin: 0;
        padding: 0;
    }

    .user li {
        list-style: none;
        width: .04rem;
        height: .04rem;
        border-radius: 50%;
        display: block;
        background-color: #fff;
        margin-bottom: .02rem;
        margin-left: .13rem;
    }

    .user li:nth-child(1) {
        margin-top: .28rem;
    }

    .exit {
        float: left;
        margin-left: .13rem;
        font-size: .13rem;
        color: #fff;
        cursor: pointer;
    }

    .ulSearch {
        position: absolute;
        top: 0.32rem;
        left: 0;
        width: 2rem;
        background: #fff;
        display: none;
        max-height: 1.6rem;
        overflow-y:scroll;

    }

    .ulSearch li {
        padding: 0 0.05rem;
        height: 0.32rem;
        line-height: 0.32rem;
        cursor: pointer;
        overflow: hidden;
    }

    .ulSearch li:hover {
        background: #32312F;
        color: #fff;
    }
</style>
