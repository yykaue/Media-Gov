<template>
    <div class='articleRanking clear'>
        <h2>原创文章排行</h2>
        <div class="tops">
            <span @click="say(1)" :class="{current:1==num,current1:1==num}">昨日排行</span>
            <div class="upline"
                 style="height:.2rem;margin:.15rem .29rem .16rem .27rem;border-left: .02rem solid #ebc58c;"></div>
            <span @click="say(7)" :class="{current:7==num,current1:7==num}">周排行</span>
            <div class="upline"
                 style="height:.2rem;margin:.15rem .29rem .16rem .27rem;border-left: .02rem solid #ebc58c;"></div>
            <span @click="say(30)" :class="{current:30==num,current1:30==num}">月排行</span>
        </div>
        <div class="minbody clear" style="padding: .46rem .48rem .52rem .47rem">
            <ul class="ulRank clear">
                <li v-for="(item,index) in list" class="fl">
                    <span class="ranking fl">{{index + 1}}</span>
                    <!--<a class="content fl" href="/articleAnalysis" target="_blank" @click="toRouter({item.nid})">{{item.title}}</a>-->
                    <a class="content fl" @click="toRouter(item.nid)">{{item.title}}</a>
                    <div class="fr">
                        <div class="exp fl" style="">被转载指数: <span>{{item.pcvagility}}</span></div>
                        <div class="amount fl" style="">被转载量: <span>{{item.bzcount}}</span></div>
                        <div class="time fl" style="">发布时间: <span>{{item.pubtimeformat}}</span></div>
                    </div>
                </li>
            </ul>
            <a class="more" :class="{isShow:1==num}" @click="toRouter1(num)">查看更多文章 ></a>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import VueResource from 'vue-resource';
    export default {
        data () {
            return {
                num: 1,
                list: '',
                starttime:'',
                endtime:'',


            }
        },

        created(){
            this.getEndDate();
            this.say(7);

        },
        methods: {
            say: function (date) {
                this.num = date;
                this.getStartDate(date);

                this.minbodylist({
                    Wid: this.$store.state.obj.wid,

                    begintime:this.starttime,
                    endtime:this.endtime,
                    pageIndex: 1,
                    pageSize: 8,
                    order: 1
                })

            },
            //时间转换的方法
            getDateByTime: function (time) {
                var oDate = new Date(time);
                return '' + oDate.getFullYear() + '-' + toTen(oDate.getMonth() + 1) + '-' + toTen(oDate.getDate());
                function toTen(number) {
                    return parseInt(number) < 10 ? '0' + number : '' + number;
                }
            },
            minbodylist: function (options) {

                $.ajax({
                    type: "GET",
                    url: this.$store.state.datas.url + 'newsArticle/signalwebsitearticle?wid=' + options.Wid + '&begintime=' + options.begintime+ '&endtime=' + options.endtime + '&pageIndex=' + options.pageIndex + '&pageSize=' + options.pageSize + '&order=' + options.order,
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: "json",
                    success: function (data) {
                        if (data.result == 1) {

                            var data1 = data.data;
                            for (var i = 0; i < data1.length; i++) {
                                data1[i].pubtimeformat = this.getDateByTime(data1[i].pubtimeformat)
                            }
                            this.list = data1;
                        }
                    }.bind(this)
                })
            },

            //时间设置
            getStartDate(op){
                // var reDate = '';
                var oDate = new Date();
                var currentYear = oDate.getFullYear();
                var currentMonth = oDate.getMonth() + 1;

                    var currentTimer = oDate.getTime();
                    var timer = (op) * 24 * 3600 * 1000;
                    var myDate = new Date(currentTimer - timer);
                    var myDateYear = myDate.getFullYear();
                    var myDateMonth = myDate.getMonth() + 1;
                    var myDateDate = myDate.getDate();
                    this.starttime = (parseInt(myDateYear) < 10 ? '0' + myDateYear : '' + myDateYear) + '-' + (parseInt(myDateMonth) < 10 ? '0' + myDateMonth : '' + myDateMonth) + '-' + (parseInt(myDateDate) < 10 ? '0' + myDateDate : '' + myDateDate);
                    // return reDate;

            },
            getEndDate(op){
                // var reDate = '';
                var oldDate = new Date();
                var time = oldDate.getTime() - 86400000;
                var oDate = new Date(time);
                var year = oDate.getFullYear();
                var month = oDate.getMonth() + 1;
                var date = oDate.getDate();

                    this.endtime = (parseInt(year) < 10 ? '0' + year : '' + year) + '-' + (parseInt(month) < 10 ? '0' + month : '' + month) + '-' + (parseInt(date) < 10 ? '0' + date : '' + date);
                    // return reDate;

            },

            toRouter:function (op) {
//                document.cookie="nid="+op+"; max-age="+3*24*60*60;
                localStorage.setItem('nid',op);
                localStorage.setItem('goTo',1);
                setTimeout(function () {
                    localStorage.removeItem('goTo');
                },10000);
                var dc=this.$store.state.urls;
                window.open(dc);
//                内网
//                window.open("http://192.168.1.68:8080/index.html#/");
//                外网
//                window.open("http://opinion.9cfcf.com/index.html#/");


            },
            toRouter1:function (op) {
//                document.cookie="nid="+op+"; max-age="+3*24*60*60;

                localStorage.setItem('timeType',op);

                localStorage.setItem('goTo',3);
                setTimeout(function () {
                    localStorage.removeItem('goTo');
                },10000);
                var dc=this.$store.state.urls;
                window.open(dc);

            }

        },
        computed: {
            objChange(){
                return this.$store.state.obj
            }
        },
        watch: {
            objChange:{
                handler: function (val, oldVal) {
                    this.num = 7;
                    this.minbodylist({
                        Wid: val.wid,

                        begintime:this.starttime,
                        endtime:this.endtime,
                        pageIndex: 1,
                        pageSize: 8,
                        order: 1
                    })

                },
                deep: true
            }


        }
    }

</script>

<style scoped>
    .current1 {
        color: #fff;
    }

    .current {
        color: #ebc58c;
    }

    .tops span:hover {
        cursor: pointer;
    }

    .content {
        color: #fff;
        width: 7.68rem;
        display: block
    }

    .exp {
        color: #fff;
        width: 1.2rem;
        display: block
    }

    .amount {
        color: #fff;
        width: 1.1rem;
        display: block
    }

    .time {
        color: #fff;
        display: block
    }

    .more {
        width: 100%;
        height: .42rem;
        display: block;
        background-color: #c0996c;
        line-height: .42rem;
        text-align: center;
        cursor: pointer;
    }

    .ulRank li{
        height: .23rem;
        line-height: .23rem;
        font-size: .13rem;
        border-bottom: .01rem solid #60574b;
        position: relative;
        margin-bottom: .3rem;
        margin-left: .43rem;
        cursor: pointer;
    }
    

    .ulRank li:hover {
        border-bottom: .01rem solid #c0975a;
    }

    .ulRank li:nth-child(-n+3) > span:nth-child(1) {
        border: 3px solid #c0996c;
    }

    .ulRank li > div > div:nth-child(-n+2)>span {
        color: #b28e64;
    }

    .ranking {
        position: absolute;
        left: -.35rem;
        top: -.04rem;
        width: .26rem;
        height: .26rem;
        font-size: .15rem;
        border: .01rem solid #c0996c;
        border-radius: 50%;
        text-align: center;
        line-height: .26rem;
        color: #fff;
    }
    .isShow{
        display: none;
    }
</style>
