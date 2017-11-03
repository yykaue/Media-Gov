<template>
    <div class="selecttime clear">
        <div class="chooseTime fl">
            <p>时间选择：</p>
            <div class="lastWeek" @click="getTime(7)" :class="{select:7==msg}">近一周</div>
            <div class="lastMouth" @click="getTime(30)" :class="{select:30==msg}">近一月</div>
        </div>
        <div class="customTime fl">
            <p>自定义时间：</p>
            <span class="p1">
                <input type="text" placeholder="开始时间">
            </span>
            <span class="p2">至</span>
            <span class="p3">
                <input type="text" placeholder="结束时间">
            </span>
            <input type="button" value="搜索" class="search">
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'

    export default{
        data(){
          return {
              msg:''
          }
        },
        mounted(){
            //调用时间参数,默认一个月
            var ds;
            if(localStorage.getItem('timeType')){
                ds=parseInt(localStorage.getItem('timeType'));

                this.$store.state.timeType=ds;
                this.msg=ds;
                this.getTime(ds)
            }else{

                ds=this.$store.state.timeType;
                this.msg=ds;
                this.getTime(ds)
            }

        },
        methods: {
            getTime(num){
                this.$store.state.timeType=num;
                this.msg=num;
                this.$store.commit('getStartDate', {variable: 'date', number: num});
                this.$store.commit('getEndDate', {variable: 'date'});
            },
        },
        computed: {
            timeTypeChange(){
                return this.$store.state.timeType
            }
        },
        watch: {
            timeTypeChange:{
                handler: function (val, oldVal) {
                    this.getTime(val);
                },
                deep: true
            }

        }

    }
</script>

<style scoped>
    .selecttime {
        font-size: .16rem;
        color: #fff;
    }
    .chooseTime>p,.chooseTime>div{
        float: left;
        height:0.26rem;
        line-height:0.26rem;
    }
    .chooseTime>div{
        padding-left: 0.23rem;
        background: url("../../../static/img/icon-selected01.png") left center no-repeat;
        background-size:0.16rem 0.16rem;
        cursor: pointer;
    }
    .chooseTime .lastWeek{
        margin-left: 0.15rem;
    }
    .chooseTime .lastMouth{
        margin-left: 0.35rem;
    }
    .customTime{
        margin-left: 0.9rem;
    }
    .customTime>p,.customTime>span,.customTime>input{
        float: left;
        height:0.26rem;
        line-height:0.26rem;
    }
    .customTime .p1,.customTime .p3{
        width:1.6rem;
        padding-left: 0.38rem;
        border-radius: 0.04rem;
        background: #fff url("../../../static/img/icon-date.png") 0.1rem 0.05rem no-repeat;
        background-size: .15rem .17rem;;
    }
    .select{
        background-image: url("../../../static/img/icon-selected02.png") !important;
    }
    .customTime>span>input{
        width:1.1rem;
        border:none;
        color: #7c7c7c;
        outline:none;
    }
    .customTime .p2{
        width:0.32rem;
        text-align: center;
    }
    .customTime .search{
        width: 0.56rem;
        border: 0;
        border-radius: 0.04rem;
        background: #B2885A;
        margin-left: 0.05rem;
        cursor: pointer;
    }
    .customTime input{
        font-size:0.13rem;
    }



</style>


