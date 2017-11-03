<template>
    <div class="aside">
        <!--<router-link to="/">-->
            <ul class="ulAside">

                <li class="center" @click="say(1)" :class="{center_:1==num,select:1==num}" >
                    <div>中央</div>
                </li>


                <li class="trade" @click="say(4)" :class="{trade_:4==num,select:4==num}" >
                    <div>行业</div>
                </li>


                <li class="place" @click="say(2)" :class="{place_:2==num,select:2==num}">
                    <div>地方</div>
                </li>


                <li class="city" @click="say(3)" :class="{city_:3==num,select:3==num}">
                    <div>城市</div>
                </li>


            </ul>
        <!--</router-link>-->
    </div>
</template>

<script>
    import Vue from 'vue'
    export default {
        name: 'aside',
        data () {
            return {
                num: 1,
            }
        },
        methods: {
            say: function (data) {
                localStorage.setItem('goTo',0);
                this.$store.state.isSelect = data;
//                console.log(1)
                this.$router.push({ path: '/indexs'});
                this.$store.state.datas.webtype = data;
            }
        },
        computed: {
            isSelectChange(){
                return this.$store.state.isSelect
            }
        },
        watch: {
            isSelectChange(val,oldVal){
                this.num=val;
            }

        }
    }
</script>

<style scoped>


    .ulAside li {
        padding: 0 .05rem;
        height: 1.1rem;
        position: relative;
        cursor: pointer;

    }

    .ulAside li > div {
        padding-top: 0.65rem;
        width: 1.06rem;
        height: 0.43rem;
        border-bottom: 0.02rem solid rgba(31, 25, 25, 0.3);
        font-size: 0.15rem;
        text-align: center;
        color: #fff;
        position: absolute;
    }

    .center div {
        background: url(../../../static/img/icon-star01.png) 0.4rem 0.3rem no-repeat;
        background-size: .28rem .25rem;
    }

    .trade div {
        background: url(../../../static/img/icon-industry01.png) 0.42rem 0.29rem no-repeat;
        background-size: .24rem .22rem;
    }

    .place div {
        background: url(../../../static/img/icon-place01.png) 0.43rem 0.26rem no-repeat;
        background-size: .19rem .27rem;
    }

    .city div {
        background: url(../../../static/img/icon-city01.png) 0.38rem 0.26rem no-repeat;
        background-size: .33rem .3rem;
    }

    /*共同的*/
    .select div {
        background-color: rgba(242, 196, 131, 0.1);
        color: #ebc58c !important;
        width: 1.11rem !important;
        border-left: 0.05rem solid #b9956a;
        border-bottom: 0 !important;
        left: 0;
    }

    .center_ div {
        background-image: url(../../../static/img/icon-star02.png);
    }

    .trade_ div {
        background-image: url(../../../static/img/icon-industry02.png);
    }

    .place_ div {
        background-image: url(../../../static/img/icon-place02.png);
    }

    .city_ div {
        background-image: url(../../../static/img/icon-city02.png);
    }

</style>
