import Vue from 'vue'
import Router from 'vue-router'
import indexs from '@/components/contents/index/indexs'
import singleWeb from '@/components/contents/singleWeb/singleWeb'
// import Hello from '@/components/Hello'

Vue.use(Router);


//懒加载路由
const routes = [
    /*{          //当首次进入页面时，页面没有显示任何组件；让页面一加载进来就默认显示first页面
        path:'/',   //重定向，就是给它重新指定一个方向，加载一个组件；
        component:resolve => require(['@/components/contents/index/indexs'],resolve)
    },*/
    {
        path:'/indexs',
        component:resolve => require(['@/components/contents/index/indexs'],resolve)
    },
    {
        path:'/singleWeb',
        component: resolve => require(['@/components/contents/singleWeb/singleWeb'],resolve)
    },
    {
        path:'/articleAnalysis',
        component: resolve => require(['@/components/contents/articleAnalysis/articleAnalysis'],resolve)
    },
    {
        path:'/search',
        component: resolve => require(['@/components/contents/search/search'],resolve)
    },
    {
        path:'/listMore',
        component: resolve => require(['@/components/contents/listMore/listMore'],resolve)
    }
//这里require组件路径根据自己的配置引入
];
//最后创建router 对路由进行管理，它是由构造函数 new vueRouter() 创建，接受routes 参数。

const router = new Router({
    // mode: 'history',
    routes
});

export default router;


/*export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: indexs,
            component: indexs
        },
        {
            path: '/',
            component: indexs,
        },
        {
            path: '/singleWeb',
            name: singleWeb,
            component: singleWeb,
        }
    ]
})*/
