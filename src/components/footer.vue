<template>
    <div class="footer clear">
        <div class="footerLeft fl">
            <div class="footerLeft01 fl">
                <p class="p1">媒体大数据平台</p>
                <p class="p2">USER DASHBOARD</p>
            </div>
            <div class="footerLeft02 fl">
                <p class="p1">覆盖3000家媒体</p>
                <p class="p2">媒体大数据实践者、创新者、推动者</p>
            </div>
            <div class="footerLeft03 fl">
                <p>服务电话：400-819-0919</p>
                <p>邮箱：999@jusfoun.com</p>
                <p>地址：北京市海淀区王庄路1号清华同方科技广场D座西楼16层</p>
            </div>
        </div>
        <div class="footerRight fr">
            <div class="code01">官方微信</div>
            <div class="code02">数据之王公众号</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'footer'
    }
</script>

<style scoped>
    .footer {
        height: 1.71rem;
        background-color: #383838;
        border-top: 1px solid #ccba93;
        border-bottom: 1px solid #ccba93;
        color: #d4c198;
    }

    .footerLeft {
        padding-top: 0.46rem;
    }

    .footerLeft01, .footerLeft02 {
        background: url("../../static/img/bg-line.jpg") right center no-repeat;
        background-size: 0.01rem 0.76rem;
    }

    .footerLeft01 {
        width: 2.54rem;
        height: 0.58rem;
        margin-left: 0.14rem;
        padding-top: 0.18rem;
        text-align: center;
    }

    .footerLeft01 .p1 {
        font-size: 0.18rem;
    }

    .footerLeft01 .p2 {
        font-size: 0.12rem;
    }

    .footerLeft02 {
        width: 3.39rem;
    }

    .footerLeft02 p {
        height: 0.34rem;
        line-height: 0.34rem;
        margin-left: 0.8rem;
    }

    .footerLeft02 .p2 {
        margin-top: 0.12rem;
    }

    .footerLeft03 {
        padding-top: 0.03rem;
    }

    .footerLeft03 p {
        margin-left: 0.57rem;
        height: 0.24rem;
        line-height: 0.24rem;
    }

    .footerRight {
        margin-right: 0.6rem;
    }

    .footerRight .code01 {
        background: url("./../../static/img/icon-code01.jpg") 0.11rem 0.35rem no-repeat;

    }

    .footerRight .code02 {
        background: url("./../../static/img/icon-code02.jpg") 0.11rem 0.35rem no-repeat;

    }

    .footerRight > div {
        padding-top: 1.3rem;
        width: 1rem;
        float: left;
        background-size: 0.78rem 0.78rem !important;
        font-size: 0.13rem;
        text-align: center;
    }
</style>