import Vue from 'vue'
import App from './App'
import router from './router'
import  VueResource  from 'vue-resource'
import Vuex from 'vuex'

Vue.use(Vuex);
Vue.use(VueResource);


const vuex_store = new Vuex.Store({
    state: {
        // 外网
        // urls:"http://opinion.9cfcf.com/index.html#/",
        // 内网
        urls:"http://192.168.1.68:8080/index.html#/",
        //本地
        // urls:"/",

        //退出跳转页面指向
        //内网
        exitUrl:'http://192.168.1.68:8080',
        //外网
        // exitUrl:'http://opinion.9cfcf.com',
        datas: {
            //内网
            url: 'http://192.168.1.68:8080/',
            //外网
            // url: 'http://opinion.9cfcf.com:80/',
            starttime: '',
            endtime: '',
            webtype: 1,
        },
        //单个网站和单篇文章分析用到的参数
        obj:{
            wid: '',
            webname: '',
            nid:'',
        },
        //单个网站分析的联动参数
        InWebType:'',
        //搜索页面用到的参数
        searchObj:{
            articleType:1,
            order:1,
        },
        //搜索页面传入的参数
        content: '',
        searchType:1,
        //更多文章列表的参数&&选择时间，主要是方便listMore传参
        timeType:30,
        listMoreOrder:1,



        isSelect:'',
        //无用
        reprintObj: {
            webid: [],
            webname: [],
        },
    },
    mutations: {
        getStartDate(state, op){
            // var reDate = '';
            var oDate = new Date();
            var currentYear = oDate.getFullYear();
            var currentMonth = oDate.getMonth() + 1;
            if (op.variable == 'date') {
                var currentTimer = oDate.getTime();
                var timer = (op.number) * 24 * 3600 * 1000;
                var myDate = new Date(currentTimer - timer);
                var myDateYear = myDate.getFullYear();
                var myDateMonth = myDate.getMonth() + 1;
                var myDateDate = myDate.getDate();
                state.datas.starttime = (parseInt(myDateYear) < 10 ? '0' + myDateYear : '' + myDateYear) + '-' + (parseInt(myDateMonth) < 10 ? '0' + myDateMonth : '' + myDateMonth) + '-' + (parseInt(myDateDate) < 10 ? '0' + myDateDate : '' + myDateDate);
                // return reDate;
            } else if (op.variable == 'month') {
                var yearNub = parseInt(op.number / 12);
                var mo = op.number % 12;
                var tempMonth, newYear;
                if (op.number <= 12) {
                    newYear = currentYear - 1;
                    tempMonth = currentMonth;
                } else {
                    newYear = currentYear - yearNub - 1;
                    if (mo == 0) {
                        tempMonth = 1;
                        newYear = currentYear - yearNub;
                    } else {
                        newYear = currentYear - yearNub - 1;
                        tempMonth = 11 - mo;
                    }
                }
                state.datas.starttime = (parseInt(newYear) < 10 ? '0' + newYear : '' + newYear) + '-' + (parseInt(tempMonth) < 10 ? '0' + tempMonth : '' + tempMonth);
                // return reDate;
            }
        },
        getEndDate(state, op){
            // var reDate = '';
            var oldDate = new Date();
            var time = oldDate.getTime() - 86400000;
            var oDate = new Date(time);
            var year = oDate.getFullYear();
            var month = oDate.getMonth() + 1;
            var date = oDate.getDate();
            if (op.variable == 'date') {
                state.datas.endtime = (parseInt(year) < 10 ? '0' + year : '' + year) + '-' + (parseInt(month) < 10 ? '0' + month : '' + month) + '-' + (parseInt(date) < 10 ? '0' + date : '' + date);
                // return reDate;
            } else if (op.variable == 'month') {
                state.datas.endtime = (parseInt(year) < 10 ? '0' + year : '' + year) + '-' + (parseInt(month) < 10 ? '0' + month : '' + month);
                // return reDate;
            }
        },


    }
});


Vue.config.productionTip = false;

// const router = new VueRouter({
//     mode: 'history',
//     routes: routers
//     // routes
// });

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store: vuex_store,
    router,
    render: h => h(App)
});
