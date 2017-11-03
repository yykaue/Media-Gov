<template>
    <div class="articleCover minbody fl">
        <div class="exponent">
            <p>{{msg.bereprintedvagility}}</p>
        </div>
        <ul class="ulBottom">
            <li class="clear">
                <div class="left l1">影响媒体</div>
                <div class="right">
                    <p class="p1">
                        {{msg.mediacount}}
                        <span>家</span>
                    </p>
                </div>
            </li>
            <li class="clear">
                <div class="left l2">影响地域</div>
                <div class="right">
                    <p class="p2">
                        {{msg.areacount}}
                        <span>家</span>
                    </p>
                    <span>({{msg.provincecount}}个省份)</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>

    import Vue from 'vue'
    import VueResource from 'vue-resource';

    Vue.use(VueResource);
    export default{

        data(){
            return {
                msg: {
                    bereprintedvagility: '-',
                    mediacount: '-',
                    areacount: '-',
                    provincecount: '-',
                }
            }
        },
        created(){
            this.articleCover({
                id: this.$store.state.obj.nid,
                Wid: this.$store.state.obj.wid,
            })
        },
        methods: {
            //全国网站PCtop10分析
            articleCover: function (options) {
                $.ajax({
                    type: "GET",
                    url: this.$store.state.datas.url + 'jusfoun-entmedia/newurlsBtimenews/articleCover?id=' + options.id + '&Wid=' + options.Wid,
                    data: {},
                    xhrFields: {withCredentials: true},
                    crossDomain: true,
                    datatype: "json",
                    success: function (data) {
                        if (data.result == 1) {
                            this.msg.bereprintedvagility = data.data[0].bereprintedvagility? (this.format_number(data.data[0].bereprintedvagility)):'-';
                            this.msg.mediacount = data.data[0].mediacount? (this.format_number(data.data[0].mediacount)):'-';
                            this.msg.areacount = data.data[0].areacount? (this.format_number(data.data[0].areacount)):'-';
                            this.msg.provincecount = data.data[0].provincecount? (this.format_number(data.data[0].provincecount)):'-';
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
        /*computed: {
            datasChange(){
                return this.$store.state.datas
            }
        },
        watch: {
            datasChange: {
                handler: function (val, oldVal) {

                },
                deep: true

            },
        }*/
    }


</script>


<style scoped>
    .articleCover {
        width: 3.1rem;
        height: 4.19rem;
        padding: 0 !important;
        margin: 0 !important;
    }

    .exponent {
        height: 2.77rem;
        background: url("../../../../../static/img/bg-exponent.png") center center no-repeat;
        background-size: 1.82rem 1.97rem;
    }

    .exponent p {
        padding-top: 1.1rem;
        font-size: 0.2rem;
        color: #ecce7c;
        text-align: center;
    }

    .ulBottom li {
        border-top: 1px solid rgba(203, 182, 164, 0.25);
        /*0.7*/
    }

    .ulBottom li > div {
        float: left;
        height: 0.7rem;
        line-height: 0.7rem;
    }

    .ulBottom li .left {
        width: 0.96rem;
        font-size: 0.14rem;
        color: #fff;
        padding-left: 0.54rem;
        border-right: 1px solid rgba(203, 182, 164, 0.25);
        background: 0.29rem 0.28rem no-repeat;
        background-size: 0.18rem 0.14rem;
    }

    .ulBottom li .l1 {
        background-image: url("../../../../../static/img/icon-veido.png");
    }

    .ulBottom li .l2 {
        background-image: url("../../../../../static/img/icon-landmark.png");
    }

    .ulBottom li .right {
        width: 1.58rem;
        color: #ebc58c;
        text-align: center;
    }

    .ulBottom li .right > p {
        height: 0.22rem;
        line-height: 0.22rem;
        font-size: 0.2rem;
    }

    .ulBottom li .right > p span {
        font-size: 0.13rem;
    }

    .ulBottom li .right > .p1 {
        padding-top: 0.25rem;
    }

    .ulBottom li .right > .p2 {
        padding-top: 0.18rem;
    }

    .ulBottom li .right > span {
        display: block;
        height: 0.14rem;
        font-size: 0.12rem;
        line-height: 0.14rem;
        margin: 0 auto;
    }
</style>