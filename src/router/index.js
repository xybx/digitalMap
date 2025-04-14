/**
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，pro版只支持remixIcon图标，具体配置请查看vip群文档
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/vab/layouts'
import Home from '@/vab/Home/layout'
import Szdp from '@/vab/szdp'
import Leader from '@/vab/leader'
import VabComLayout from '@/vab/layouts/VabLayoutCommon'
import VabRedLayout from '@/vab/layouts/VabLayoutRedHorizontal'
import VabComRedLayout from '@/vab/layouts/VabLayoutRedCommon'
/* 多级路由不需要缓存时可放开注释直接引入 用法component:VabEmptyLayout*/
/*import VabEmptyLayout from '@/vab/layouts/VabEmptyLayout'*/
import { publicPath, routerMode } from '@/config'
import { stringifyQuery, parseQuery } from "@/utils/query";
Vue.use(VueRouter)
export const constantRoutes = [{
        path: '/login',
        name: 'Login',
        component: () => import ('@/views/login/login'),
        hidden: true,
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        hidden: true,
    },
    {
        path: '/403',
        name: '403',
        component: () =>
            import ('@/views/403'),
        hidden: true,
    },
    {
        path: '/404',
        name: '404',
        component: () =>
            import ('@/views/404'),
        hidden: true,
    },
]

export const asyncRoutes = [
        // {
        //     path: '/',
        //     name: 'Root',
        //     component: Layout,
        //     redirect: '/home',
        // },
        // {
        //   path: '/map',
        //   name: 'Map',
        //   component: Layout,
        //   redirect: '/map',
        //   meta: {},
        //   showMenuIndex: 1,
        //   children:[{
        //     path: '/map',
        //     name: 'Map',
        //     component: () => import ('@/views/onemap/index/index'),
        //     meta: {},
        //     hidden: true,
        //     showMenuIndex: 1,
        //   }]
        // },
      // {
      //         path: '/',
      //         name: 'Root',
      //         component: Layout,
      //         redirect: '/home',
      //         meta: {},
      //         showMenuIndex: 1,
      //         children: [{
      //             path: 'map',
      //             name: 'Map',
      //             component: () =>
      //                 import ('@/views/onemap/index/index'),
      //             meta: {},
      //             hidden: true,
      //             showMenuIndex: 1,
      //         }]
      //     },
      //   {
      //       path: '/cindex',
      //       name: 'Cindex',
      //       component: Layout,
      //       redirect: '/cindex',
      //       showMenuIndex: 2,
      //       children: [{
      //           path: '/cindex',
      //           name: 'Cindex',
      //           component: () =>
      //               import ('@/views/conven/cindex'),
      //           meta: { title: '首页', icon: 'icon iconfont icon-index' },
      //           showMenuIndex: 2,
      //       }]
      //   },
      //   {
      //       path: '/conven',
      //       name: 'Conven',
      //       component: Layout,
      //       redirect: '/conven/review',
      //       meta: { title: '随手拍', icon: 'icon iconfont icon-Clapatwill' },
      //       showMenuIndex: 2,
      //       children: [{
      //               path: 'review',
      //               name: 'Review',
      //               component: () =>
      //                   import ('@/views/conven/review'),
      //               meta: { title: '待审核记录' },
      //               showMenuIndex: 2,
      //           },
      //           {
      //               path: 'deview',
      //               name: 'Deview',
      //               component: () =>
      //                   import ('@/views/conven/deview'),
      //               meta: { title: '已办待审核' },
      //               showMenuIndex: 2,
      //           },
      //           {
      //               path: 'dealt',
      //               name: 'Dealt',
      //               component: () =>
      //                   import ('@/views/conven/dealt'),
      //               meta: { title: '待办记录' },
      //               showMenuIndex: 2,
      //           },
      //           {
      //               path: 'done',
      //               name: 'Done',
      //               component: () =>
      //                   import ('@/views/conven/done'),
      //               meta: { title: '已办记录' },
      //               showMenuIndex: 2,
      //           },
      //           {
      //               path: 'record',
      //               name: 'Record',
      //               component: () =>
      //                   import ('@/views/conven/record'),
      //               meta: { title: '区域查询' },
      //               showMenuIndex: 2,
      //           }
      //       ]
      //   },
      //   {
      //       path: '/cuser',
      //       name: 'Cuser',
      //       component: Layout,
      //       redirect: '/user',
      //       showMenuIndex: 2,
      //       children: [{
      //           path: 'cuser',
      //           name: 'Cuser',
      //           component: () =>
      //               import ('@/views/conven/cuser'),
      //           meta: { title: '用户管理', icon: 'icon iconfont icon-yonghuguanli' },
      //           showMenuIndex: 2,
      //       }]
      //   },
      // {
      //   path: '/convenage',
      //   name: 'Convenage',
      //   component:Layout,
      //   redirect: '/convenage',
      //   showMenuIndex: 2,
      //   children: [{
      //     path: '/convenage',
      //     name: 'Convenage',
      //     component: () => import ('@/views/conven/convenage'),
      //     meta: { title: '随手拍类型管理', icon: 'icon iconfont icon-yingxiaoguanli-dingdanguanli'},
      //     showMenuIndex: 2,
      //   }]
      // },
      //   {
      //       path: '/company',
      //       name: 'Company',
      //       component: VabComLayout,
      //       alwaysShow: true,
      //       redirect: '/company/device',
      //       meta: { title: '企业库', icon: 'icon iconfont icon-qiye_mianxing' },
      //       showMenuIndex: 3,
      //       children: [{
      //               path: 'pindex',
      //               name: 'Pindex',
      //               component: () =>
      //                   import ('@/views/safeProduct/company/pindex'),
      //               meta: { title: '企业管理', noClosable: true },
      //               showMenuIndex: 3,
      //           },
      //           {
      //               path: 'comedit',
      //               name: 'Comedit',
      //               hidden: true,
      //               component: () =>
      //                   import ('@/views/safeProduct/company/comedit'),
      //               meta: { title: '企业编辑' },
      //               showMenuIndex: 3,
      //           },
      //           {
      //               path: 'comview',
      //               name: 'Comview',
      //               hidden: true,
      //               component: () =>
      //                   import ('@/views/safeProduct/company/comview'),
      //               meta: { title: '企业查看' },
      //               showMenuIndex: 3,
      //           },
      //           {
      //               path: 'padd',
      //               name: 'Padd',
      //               component: () =>
      //                   import ('@/views/safeProduct/company/padd'),
      //               meta: { title: '企业添加' },
      //               showMenuIndex: 3,
      //           },
      //           {
      //               path: 'info',
      //               name: 'Info',
      //               component: () =>
      //                   import ('@/views/safeProduct/company/infoaudit'),
      //               meta: { title: '企业信息审核' },
      //               showMenuIndex: 3,
      //           },
      //           {
      //               path: 'energy',
      //               name: 'Energy',
      //               component: () =>
      //                   import ('@/views/safeProduct/company/energyaudit'),
      //               meta: { title: '企业能耗审核' },
      //               showMenuIndex: 3,
      //           },
      //           {
      //               path: 'files',
      //               name: 'Files',
      //               component: () =>
      //                   import ('@/views/safeProduct/company/filesaudit'),
      //               meta: { title: '企业文件审核' },
      //               showMenuIndex: 3,
      //           },
      //           {
      //               path: 'device',
      //               name: 'Device',
      //               component: () =>
      //                   import ('@/views/safeProduct/company/deviceaudit'),
      //               meta: { title: '企业设备审核' },
      //               showMenuIndex: 3,
      //           }
      //       ]
      //   },
      //   {
      //       path: '/eindex',
      //       name: 'Eindex',
      //       component: VabComLayout,
      //       redirect: '/eindex',
      //       showMenuIndex: 3,
      //       children: [{
      //           path: '/eindex',
      //           name: 'Eindex',
      //           component: () =>
      //               import ('@/views/safeProduct/comenergy/eindex'),
      //           meta: { title: '企业能耗', icon: 'icon iconfont icon-energy-monitoring' },
      //           showMenuIndex: 3,
      //       }]
      //   },
      //   {
      //       path: '/patrol',
      //       name: 'Patrol',
      //       component: VabComLayout,
      //       alwaysShow: true,
      //       redirect: '/patrol/drecord',
      //       meta: { title: '企业巡查', icon: 'icon iconfont icon-xuncha-shise' },
      //       showMenuIndex: 3,
      //       children: [{
      //               path: 'drecord',
      //               name: 'Drecord',
      //               component: () =>
      //                   import ('@/views/safeProduct/compatrol/drecord'),
      //               meta: { title: '待办记录' },
      //               showMenuIndex: 3,
      //           },
      //           {
      //               path: 'orecord',
      //               name: 'Orecord',
      //               component: () =>
      //                   import ('@/views/safeProduct/compatrol/orecord'),
      //               meta: { title: '已办记录' },
      //               showMenuIndex: 3,
      //           },
      //           {
      //               path: 'mrecord',
      //               name: 'Mrecord',
      //               component: () =>
      //                   import ('@/views/safeProduct/compatrol/mrecord'),
      //               meta: { title: '我的记录' },
      //               showMenuIndex: 3,
      //           },
      //           {
      //               path: 'precord',
      //               name: 'Precord',
      //               component: () =>
      //                   import ('@/views/safeProduct/compatrol/precord'),
      //               meta: { title: '巡查记录' },
      //               showMenuIndex: 3,
      //           },
      //           {
      //               path: 'ptotal',
      //               name: 'Ptotal',
      //               component: () =>
      //                   import ('@/views/safeProduct/compatrol/ptotal'),
      //               meta: { title: '巡查统计' },
      //               showMenuIndex: 3,
      //           },
      //           {
      //               path: 'cordEdit',
      //               name: 'CordEdit',
      //               hidden: true,
      //               component: () =>
      //                   import ('@/views/safeProduct/compatrol/cordEdit'),
      //               meta: { title: '记录详情' },
      //               showMenuIndex: 3,
      //           }
      //       ]
      //   },
      //     {
      //       path: '/patrolage',
      //       name: 'Patrolage',
      //       component:VabComLayout,
      //       redirect: '/patrolage',
      //       showMenuIndex:3,
      //       children: [{
      //         path: '/patrolage',
      //         name: 'Patrolage',
      //         component: () => import ('@/views/safeProduct/manage/patrolage'),
      //         meta: { title: '巡查类型管理', icon: 'icon iconfont icon-yingxiaoguanli-dingdanguanli'},
      //         showMenuIndex: 3,
      //       }]
      //     },
      //     {
      //       path: '/cominfo',
      //       name: 'Cominfo',
      //       component:VabComLayout,
      //       redirect: '/cominfo',
      //       showMenuIndex: 3,
      //       children: [{
      //         path: '/cominfo',
      //         name: 'Cominfo',
      //         component: () => import ('@/views/safeProduct/manage/cominfo'),
      //         meta: { title: '企业信息目录', icon: 'icon iconfont icon-mulu'},
      //         showMenuIndex: 3,
      //       }]
      //     },
      //   {
      //       path: '/exchange',
      //       name: 'Exchange',
      //       component: VabComLayout,
      //       redirect: '/exchange',
      //       showMenuIndex: 4,
      //       children: [{
      //           path: '/exchange',
      //           name: 'Exchange',
      //           component: () =>
      //               import ('@/views/integralMall/exchange'),
      //           meta: { title: '兑换商品管理', icon: 'icon iconfont icon-shangpinguanli' },
      //           showMenuIndex: 4,
      //       }]
      //   },
      //   {
      //       path: '/convert',
      //       name: 'Convert',
      //       component: VabComLayout,
      //       redirect: '/convert',
      //       showMenuIndex: 4,
      //       children: [{
      //           path: '/convert',
      //           name: 'Convert',
      //           component: () =>
      //               import ('@/views/integralMall/convert'),
      //           meta: { title: '待兑换订单管理', icon: 'icon iconfont icon-dingdan' },
      //           showMenuIndex: 4,
      //       }]
      //   },
      //   {
      //       path: '/history',
      //       name: 'History',
      //       component: VabComLayout,
      //       redirect: '/history',
      //       showMenuIndex: 4,
      //       children: [{
      //           path: '/history',
      //           name: 'History',
      //           component: () =>
      //               import ('@/views/integralMall/history'),
      //           meta: { title: '订单记录统计', icon: 'icon iconfont icon-xuncha-shise' },
      //           showMenuIndex: 4,
      //       }]
      //   },
      //   {
      //       path: '/integral',
      //       name: 'Integral',
      //       component: VabComLayout,
      //       redirect: '/integral',
      //       showMenuIndex: 4,
      //       children: [{
      //           path: '/integral',
      //           name: 'Integral',
      //           component: () =>
      //               import ('@/views/integralMall/integral'),
      //           meta: { title: '积分相关设置', icon: 'icon iconfont icon-zijinchiguijishezhi' },
      //           showMenuIndex: 4,
      //       }]
      //   },
      //   {
      //       path: '/lindex',
      //       name: 'Lindex',
      //       component: VabRedLayout,
      //       redirect: '/lindex',
      //       showMenuIndex: 5,
      //       children: [{
      //           path: '/lindex',
      //           name: 'Lindex',
      //           component: () =>
      //               import ('@/views/petition/lindex'),
      //           meta: { title: '首页', icon: 'icon iconfont icon-index' },
      //           showMenuIndex: 5,
      //       }]
      //   },
      //   {
      //       path: '/letter',
      //       name: 'Letter',
      //       component: VabRedLayout,
      //       redirect: '/letter/audit',
      //       meta: { title: '信访记录', icon: 'icon iconfont' },
      //       showMenuIndex: 5,
      //       children: [{
      //               path: 'audit',
      //               name: 'Audit',
      //               component: () =>
      //                   import ('@/views/petition/audit'),
      //               meta: { title: '待审核记录' },
      //               showMenuIndex: 5,
      //           },
      //           {
      //               path: 'remain',
      //               name: 'Remain',
      //               component: () =>
      //                   import ('@/views/petition/remain'),
      //               meta: { title: '待办记录' },
      //               showMenuIndex: 5,
      //           },
      //           {
      //               path: 'trial',
      //               name: 'Trial',
      //               component: () =>
      //                   import ('@/views/petition/trial'),
      //               meta: { title: '已办待审记录' },
      //               showMenuIndex: 5,
      //           },
      //           {
      //               path: 'done',
      //               name: 'Done',
      //               component: () =>
      //                   import ('@/views/petition/done'),
      //               meta: { title: '已办记录' },
      //               showMenuIndex: 5,
      //           },
      //           {
      //               path: 'record',
      //               name: 'Record',
      //               component: () =>
      //                   import ('@/views/petition/record'),
      //               meta: { title: '区域查询' },
      //               showMenuIndex: 5,
      //           },
      //           {
      //             path: 'super',
      //             name: 'Super',
      //             component: () =>
      //                 import ('@/views/petition/super'),
      //             meta: { title: '督办记录' },
      //             showMenuIndex: 5,
      //         }
      //       ]
      //   },
      //   {
      //     path: '/mindex',
      //     name: 'Mindex',
      //     component: Layout,
      //     redirect: '/mindex',
      //     showMenuIndex: 6,
      //     hidden:true,
      //     children: [{
      //         path: '/mindex',
      //         name: 'Mindex',
      //         component: () =>
      //             import ('@/views/resident/mindex'),
      //         meta: {},
      //         showMenuIndex: 6,
      //     },
      //     {
      //         path: 'medit',
      //         name: 'Medit',
      //         component: () =>
      //               import ('@/views/resident/medit'),
      //         meta: {},
      //         hidden:true,
      //         showMenuIndex: 6,
      //      }
      //     ]
      // },
    //     {
    //         path: '/sindex',
    //         name: 'Sindex',
    //         component: Szdp,
    //         redirect: '/sindex',
    //         children: [{
    //             path: '/sindex',
    //             name: 'Sindex',
    //             component: () =>
    //                 import ('@/views/szdp/index')
    //         }],
    //         hidden: true,
    //     },
    //   {
    //     path: '/leader',
    //     name: 'Leader',
    //     component: Leader,
    //     redirect: '/leader',
    //     showMenuIndex: 30,
    //     children: [{
    //       path: '/leader',
    //       name: 'Leader',
    //       component: () => import ('@/views/leader/index'),
    //       showMenuIndex: 30,
    //     }]
    //   },
    //   {
    //     path: '/bleader',
    //     name: 'Bleader',
    //     component: Leader,
    //     redirect: '/leader',
    //     showMenuIndex: 31,
    //     children: [{
    //       path: '/bleader',
    //       name: 'Bleaders',
    //       component: () => import ('@/views/bleader/bindex'),
    //       showMenuIndex: 31
    //     }]
    //   },
    // {
    //   path: '/gleader',
    //   name: 'Gleader',
    //   component: Leader,
    //   redirect: '/gleader',
    //   showMenuIndex: 32,
    //   children: [{
    //     path: '/gleader',
    //     name: 'Gleaders',
    //     component: () => import ('@/views/board/gridIndex'),
    //     showMenuIndex: 32,
    //   }]
    // },
    // {
    //   path: '/envsum',
    //   name: 'Envsum',
    //   component: Leader,
    //   redirect: '/envsum',
    //   showMenuIndex: 33,
    //   children: [{
    //     path: '/envsum',
    //     name: 'Envsums',
    //     component: () => import ('@/views/envsum/envSum'),
    //     showMenuIndex: 33,
    //   }]
    // },
    // {
    //   path: '/ehome',
    //   name: 'Ehome',
    //   component:Layout,
    //   redirect: '/ehome',
    //   showMenuIndex: 21,
    //   children: [{
    //     path: '/ehome',
    //     name: 'Ehome',
    //     component: () => import ('@/views/environment/ehome'),
    //     meta: { title: '首页', icon: 'icon iconfont icon-index' },
    //     showMenuIndex: 21,
    //   }],
    // },
    // {
    //   path: '/emanage',
    //   name: 'Emanage',
    //   component:Layout,
    //   redirect: '/emanage/unover',
    //   meta:{title: '人居环境管理', icon: 'icon iconfont icon-xuncha-shise' },
    //   showMenuIndex: 21,
    //   children: [{
    //       path: 'unover',
    //       name: 'Unover',
    //       component: () => import ('@/views/environment/unover'),
    //       meta: { title: '待办记录' },
    //       showMenuIndex: 21,
    //     },
    //     {
    //       path: 'pend',
    //       name: 'Pend',
    //       component: () => import ('@/views/environment/pend'),
    //       meta: { title: '已办待审' },
    //       showMenuIndex: 21,
    //     },
    //     {
    //         path: 'overed',
    //         name: 'Overed',
    //         component: () => import ('@/views/environment/overed'),
    //         meta: { title: '已办记录' },
    //         showMenuIndex: 21,
    //     },
    //     {
    //         path: 'myself',
    //         name: 'Myself',
    //         component: () => import ('@/views/environment/myself'),
    //         meta: { title: '我的记录' },
    //         showMenuIndex: 21,
    //     },
    //     {
    //       path: 'atotal',
    //       name: 'Atotal',
    //       component: () => import ('@/views/environment/atotal'),
    //       meta: { title: '环境统计' },
    //       showMenuIndex: 21,
    //     }
    //   ]
    // },
    // {
    //   path: '/erule',
    //   name: 'Erule',
    //   component:Layout,
    //   redirect: '/prule',
    //   showMenuIndex: 21,
    //   children: [{
    //     path: '/erule',
    //     name: 'Erule',
    //     component: () => import ('@/views/environment/erule'),
    //     meta: { title: '人居环境类型管理', icon: 'icon iconfont icon-yingxiaoguanli-dingdanguanli' },
    //     showMenuIndex:21,
    //   }]
    // },
    // {
    //   path: '/dmanage',
    //   name: 'Dmanage',
    //   component:Layout,
    //   redirect: '/dmanage',
    //   showMenuIndex: 41,
    //   children: [{
    //       path: '/dmanage',
    //       name: 'Dmanages',
    //       component: () => import ('@/views/dayreport/dmanage'),
    //       meta: { title: '日常上报管理', icon: 'icon iconfont icon-xuncha-shise' },
    //       showMenuIndex: 41,
    //     }]
    // },
  // {
  //     path: '/codeinspect',
  //     name: 'Codeinspect',
  //     component:Layout,
  //     redirect: '/codeinspect',
  //     showMenuIndex: 50,
  //     children: [{
  //         path: '/codeinspect',
  //         name: 'Codeinspect',
  //         component: () => import ('@/views/codeinspect/codeinspect'),
  //         meta: { title: '码上督察', icon: 'icon iconfont icon-xuncha-shise' },
  //         showMenuIndex: 50,
  //       }]
  //   },
  //   {
  //       path: '/rcode',
  //       name: 'Rcode',
  //       component: VabComLayout,
  //       redirect: '/rcode',
  //       showMenuIndex: 60,
  //       children: [{
  //           path: '/rcode',
  //           name: 'Rcode',
  //           component: () => import ('@/views/rashcode/rcode'),
  //           meta: { title: '鲁通码管理', icon: 'icon iconfont icon-xuncha-shise' },
  //           showMenuIndex: 60,
  //       }]
  //   },
    // {
    //   path: '/drule',
    //   name: 'Drule',
    //   component:Layout,
    //   redirect: '/drule',
    //   showMenuIndex: 41,
    //   children: [{
    //     path: '/drule',
    //     name: 'Drules',
    //     component: () => import ('@/views/dayreport/drule'),
    //     meta: { title: '日常上报类型管理', icon: 'icon iconfont icon-yingxiaoguanli-dingdanguanli' },
    //     showMenuIndex:41,
    //   }]
    // },
    //   {
    //       path: '/news',
    //       name: 'News',
    //       component: Layout,
    //       redirect: '/news/cnews',
    //       meta: { title: '资讯管理', icon: 'icon iconfont icon-xinwenguanli' },
    //       showMenuIndex: 22,
    //       children: [{
    //               path: 'cnews',
    //               name: 'Cnews',
    //               component: () =>
    //                   import ('@/views/infomsg/cnews'),
    //               meta: { title: '资讯管理' },
    //               showMenuIndex: 22,
    //           },
    //           {
    //               path: 'knew',
    //               name: 'Knew',
    //               component: () =>
    //                   import ('@/views/infomsg/knew'),
    //               meta: { title: '资讯查看' },
    //               showMenuIndex: 22,
    //           },
    //           {
    //               path: 'cnate',
    //               name: 'Cnate',
    //               component: () =>
    //                   import ('@/views/infomsg/cnate'),
    //               meta: { title: '新闻类别' },
    //               showMenuIndex: 22,
    //           }
    //       ]
    //   },
    // {
    //     path: '/tourism',
    //     name: 'Tourism',
    //     component:Layout,
    //     redirect: '/tourism',
    //     showMenuIndex: 14,
    //     children: [{
    //         path: '/tourism',
    //         name: 'Tourisms',
    //         component: () => import ('@/views/tourism/rural'),
    //         meta: { title: '乡村旅游', icon: 'icon iconfont icon-lvyoufabu'},
    //         showMenuIndex: 14,
    //     }]
    // },
    // {
    //   path: '/tnhome',
    //   name: 'Tnhome',
    //   component:Layout,
    //   redirect: '/tnhome',
    //   showMenuIndex: 16,
    //   children: [{
    //     path: '/tnhome',
    //     name: 'Tnhome',
    //     component: () => import ('@/views/numtask/tnhome'),
    //     meta: { title: '首页', icon: 'icon iconfont icon-index' },
    //     showMenuIndex: 16,
    //   }],
    // },
    //   {
    //       path: '/notice',
    //       name: 'Notice',
    //       component:Layout,
    //       redirect: '/notice',
    //       showMenuIndex: 16,
    //       children: [{
    //           path: '/notice',
    //           name: 'Notice',
    //           component: () => import ('@/views/numtask/notice'),
    //           meta: { title: '通知公告', icon: 'icon iconfont icon-xinwen' },
    //           showMenuIndex: 16,
    //       }]
    //   },
    //   {
    //     path: '/worktask',
    //     name: 'Worktask',
    //     component:Layout,
    //     redirect: '/worktask',
    //     showMenuIndex: 16,
    //     children: [{
    //       path: '/worktask',
    //       name: 'Worktask',
    //       component: () => import ('@/views/numtask/worktask'),
    //       meta: { title: '个人工作任务', icon: 'icon iconfont icon-gongzuorenwu' },
    //       showMenuIndex: 16,
    //     }]
    //   },
    //   {
    //     path: '/spemodule',
    //     name: 'Spemodule',
    //     component:Layout,
    //     redirect: '/spemodule',
    //     showMenuIndex: 16,
    //     children: [{
    //       path: '/spemodule',
    //       name: 'Spemodule',
    //       component: () => import ('@/views/numtask/spemodule'),
    //       meta: { title: '专题专项任务', icon: 'icon iconfont icon-renwuchuli' },
    //       showMenuIndex: 16,
    //     },{
    //       path: '/spetask',
    //       name: 'Spetask',
    //       hidden:true,
    //       component: () => import ('@/views/numtask/spetask'),
    //       meta: { title: '专题专项任务列表'},
    //       showMenuIndex: 16,
    //     },{
    //       path: '/spefill',
    //       name: 'Spefill',
    //       hidden:true,
    //       component: () => import ('@/views/numtask/spefill'),
    //       meta: { title: '填报列表'},
    //       showMenuIndex: 16,
    //     },{
    //         path: '/wspefill',
    //         name: 'Wspefill',
    //         hidden:true,
    //         component: () => import ('@/views/numtask/wspefill'),
    //         meta: { title: '填报列表'},
    //         showMenuIndex: 16,
    //     }]
    //   },
    //   {
    //     path: '/digtask',
    //     name: 'Digtask',
    //     component: Layout,
    //     redirect: '/digtask/announce',
    //     meta: { title: '数字任务管理', icon: 'icon iconfont icon-renwuguanli' },
    //     showMenuIndex: 16,
    //     children: [{
    //       path: 'anmanage',
    //       name: 'Anmanage',
    //       component: () =>
    //         import ('@/views/numtask/anmanage'),
    //       meta: { title: '通知公告管理' },
    //       showMenuIndex: 16,
    //     },
    //       {
    //         path: 'workmanage',
    //         name: 'Workmanage',
    //         component: () =>
    //           import ('@/views/numtask/workmanage'),
    //         meta: { title: '个人工作任务管理' },
    //         showMenuIndex: 16,
    //       },
    //       {
    //         path: 'spemanage',
    //         name: 'Spemanage',
    //         component: () =>
    //           import ('@/views/numtask/spemanage'),
    //         meta: { title: '专题专项任务管理' },
    //         showMenuIndex: 16,
    //       },
    //       {
    //         path: 'spetemplate',
    //         name: 'Spetemplate',
    //         hidden:true,
    //         component: () => import ('@/views/numtask/spetemplate'),
    //         meta: { title: '专题专项任务列表' },
    //         showMenuIndex: 16,
    //       },
    //       {
    //         path: 'permanage',
    //         name: 'Permanage',
    //         component: () =>
    //           import ('@/views/numtask/permanage'),
    //         meta: { title: '人员类别管理' },
    //         showMenuIndex: 16,
    //       }
    //     ]
    //   },
    //   {
    //     path: '/video',
    //     name: 'Video',
    //     component: Layout,
    //     redirect: '/video',
    //     hidden: true,
    //     showMenuIndex: 9,
    //     children: [{
    //       path: '/video',
    //       name: 'Video',
    //       component: () => import ('@/views/video/index'),
    //       showMenuIndex: 9,
    //     }]
    //   },
    // {
    //   path: '/device',
    //   name: 'Device',
    //   component: Layout,
    //   redirect: '/device',
    //   showMenuIndex: 9,
    //   children: [{
    //     path: '/device',
    //     name: 'Device',
    //     component: () => import ('@/views/video/device'),
    //     meta: { title: '设备管理', icon: 'icon iconfont icon-shebeiguanli' },
    //     showMenuIndex: 9,
    //   }]
    // },
    //   {
    //       path: '/rindex',
    //       name: 'Rindex',
    //       component: Layout,
    //       redirect: '/rindex',
    //       showMenuIndex: 11,
    //       children: [{
    //           path: '/rindex',
    //           name: 'Rindex',
    //           component: () => import ('@/views/rural/rindex'),
    //           meta: { title: '首页', icon: 'icon iconfont icon-index' },
    //           showMenuIndex: 11,
    //       }]
    //   },
    //   {
    //     path: '/country',
    //     name: 'Country',
    //     component:Layout,
    //     redirect: '/country',
    //     showMenuIndex: 11,
    //     children: [{
    //       path: '/country',
    //       name: 'Country',
    //       component: () => import ('@/views/rural/country'),
    //       meta: { title: '乡村榜单管理', icon: 'icon iconfont icon-bangdan' },
    //       showMenuIndex: 11,
    //     }]
    //   },
    //   {
    //     path: '/township',
    //     name: 'Township',
    //     component:Layout,
    //     redirect: '/township',
    //     showMenuIndex: 11,
    //     children: [{
    //       path: '/township',
    //       name: 'Township',
    //       component: () => import ('@/views/rural/township'),
    //       meta: { title: '乡情圈管理', icon: 'icon iconfont icon-suoshuxiangcun' },
    //       showMenuIndex: 11,
    //     }]
    //   },
    //   {
    //     path: '/regulation',
    //     name: 'Regulation',
    //     component:Layout,
    //     redirect: '/regulation',
    //     showMenuIndex: 11,
    //     children: [{
    //       path: '/regulation',
    //       name: 'Regulation',
    //       component: () => import ('@/views/rural/regulation'),
    //       meta: { title: '类型规则管理', icon: 'icon iconfont icon-yingxiaoguanli-dingdanguanli' },
    //       showMenuIndex: 11,
    //     }]
    //   },
    //     {
    //         path: '/vindex',
    //         name: 'Vindex',
    //         component: Layout,
    //         redirect: '/vindex',
    //         showMenuIndex: 12,
    //         children: [{
    //             path: '/vindex',
    //             name: 'Vindex',
    //             component: () => import ('@/views/voluntary/vindex'),
    //             meta: { title: '首页', icon: 'icon iconfont icon-index' },
    //             showMenuIndex: 12,
    //         }]
    //     },
    //     {
    //       path: '/practice',
    //       name: 'Practice',
    //       component:Layout,
    //       redirect: '/practice',
    //       showMenuIndex: 12,
    //       children: [{
    //         path: '/practice',
    //         name: 'Practice',
    //         component: () => import ('@/views/voluntary/practice'),
    //         meta: { title: '文明实践活动管理', icon: 'icon iconfont icon-bangdan' },
    //         showMenuIndex: 12,
    //       }]
    //     },
    //     {
    //       path: '/prule',
    //       name: 'Prule',
    //       component:Layout,
    //       redirect: '/prule',
    //       showMenuIndex: 12,
    //       children: [{
    //         path: '/prule',
    //         name: 'Prule',
    //         component: () => import ('@/views/voluntary/prule'),
    //         meta: { title: '类型规则管理', icon: 'icon iconfont icon-yingxiaoguanli-dingdanguanli' },
    //         showMenuIndex: 12,
    //       }]
    //     },
    //   {
    //     path: '/report',
    //     name: 'Report',
    //     component:Layout,
    //     redirect: '/report',
    //     showMenuIndex: 17,
    //     children: [{
    //       path: '/report',
    //       name: 'Reports',
    //       component: () => import ('@/views/intelreport/spemanage'),
    //       meta: { title: '智能填报管理', icon: 'icon iconfont icon-tianbao'},
    //       showMenuIndex: 17,
    //     },
    //     {
    //       path: '/repetemplate',
    //       name: 'Repetemplate',
    //       hidden:true,
    //       component: () => import ('@/views/intelreport/spetemplate'),
    //       meta: { title: '专题专项任务列表' },
    //       showMenuIndex: 17,
    //     },
    //     {
    //       path: '/repefill',
    //       name: 'Repefill',
    //       hidden:true,
    //       component: () => import ('@/views/intelreport/spefill'),
    //       meta: { title: '填报列表'},
    //       showMenuIndex: 17,
    //     },
    //     {
    //       path: '/rewpefill',
    //       name: 'Rewpefill',
    //       hidden:true,
    //       component: () => import ('@/views/intelreport/wspefill'),
    //       meta: { title: '填报列表'},
    //       showMenuIndex: 17,
    //     }]
    //   },
  //   {
  //     path: '/inspecte',
  //     name: 'Inspecte',
  //     component:Leader,
  //     redirect: '/inspecte',
  //     showMenuIndex: 23,
  //     children: [{
  //       path: '/inspecte',
  //       name: 'Inspectes',
  //       component: () => import ('@/views/inspecte/inspecte'),
  //       meta: { title: '纪委监管'},
  //       showMenuIndex: 23,
  //     }]
  //   },
  // {
  //   path: '/pwork',
  //   name: 'Pwork',
  //   component:VabComRedLayout,
  //   redirect: '/pwork',
  //   showMenuIndex: 23,
  //   childMenuIndex:1,
  //   children: [{
  //     path: '/pwork',
  //     name: 'Pworks',
  //     component: () => import ('@/views/inspecte/compublic/pwork'),
  //     meta: {title: '纪委工作简介',icon:'icon iconfont icon-jianjie'},
  //     showMenuIndex: 23,
  //     childMenuIndex:1,
  //   }]
  // },
  // {
  //   path: '/pview',
  //   name: 'Pview',
  //   component:VabComRedLayout,
  //   redirect: '/pview',
  //   showMenuIndex: 23,
  //   childMenuIndex:1,
  //   hidden:true,
  //   children: [ {
  //     path: '/pview',
  //     name: 'Pviews',
  //     component: () => import ('@/views/inspecte/compublic/pview'),
  //     meta: {title: '工作简介详情'},
  //     hidden:true,
  //     showMenuIndex: 23,
  //     childMenuIndex:1,
  //   }]
  // },
  // {
  //   path: '/pteach',
  //   name: 'Pteach',
  //   component:VabComRedLayout,
  //   redirect: '/pteach',
  //   showMenuIndex: 23,
  //   childMenuIndex:1,
  //   children: [{
  //     path: '/pteach',
  //     name: 'Pteachs',
  //     component: () => import ('@/views/inspecte/compublic/pteach'),
  //     meta: {title: '廉洁教育基地',icon:'icon iconfont icon-jiaoyu'},
  //     showMenuIndex: 23,
  //     childMenuIndex:1,
  //   }]
  // },
  // {
  //   path: '/proom',
  //   name: 'Proom',
  //   component:VabComRedLayout,
  //   redirect: '/proom',
  //   showMenuIndex: 23,
  //   childMenuIndex:1,
  //   children: [{
  //     path: '/proom',
  //     name: 'Prooms',
  //     component: () => import ('@/views/inspecte/compublic/proom'),
  //     meta: {title: '清廉微讲堂',icon:'icon iconfont icon-jiangtang'},
  //     showMenuIndex: 23,
  //     childMenuIndex:1,
  //   }]
  // },
  // {
  //   path: '/organage',
  //   name: 'Organage',
  //   component:VabComRedLayout,
  //   redirect: '/organage',
  //   showMenuIndex: 23,
  //   childMenuIndex:2,
  //   children: [{
  //     path: '/organage',
  //     name: 'Organages',
  //     component: () => import ('@/views/inspecte/partyage/organage'),
  //     meta: {title: '党组织管理',icon:'icon iconfont icon-dangjian_banzijianshe'},
  //     showMenuIndex: 23,
  //     childMenuIndex:2,
  //   }]
  // },
  // {
  //   path: '/memberage',
  //   name: 'Memberage',
  //   component:VabComRedLayout,
  //   redirect: '/memberage',
  //   showMenuIndex: 23,
  //   childMenuIndex:2,
  //   children: [{
  //     path: '/memberage',
  //     name: 'Memberages',
  //     component: () => import ('@/views/inspecte/partyage/memberage'),
  //     meta: {title: '成员管理',icon:'icon iconfont icon-jifenguanli'},
  //     showMenuIndex: 23,
  //     childMenuIndex:2,
  //   }]
  // },
  // {
  //   path: '/runage',
  //   name: 'Runage',
  //   component:VabComRedLayout,
  //   redirect: '/runage',
  //   showMenuIndex: 23,
  //   childMenuIndex:2,
  //   children: [{
  //     path: '/runage',
  //     name: 'Runages',
  //     component: () => import ('@/views/inspecte/partyage/runage'),
  //     meta: {title: '党费管理',icon:'icon iconfont icon-icon_home_duesstatistics'},
  //     showMenuIndex: 23,
  //     childMenuIndex:2,
  //   }]
  // },
  // {
  //   path: '/meetage',
  //   name: 'Meetage',
  //   component:VabComRedLayout,
  //   redirect: '/meetage',
  //   showMenuIndex: 23,
  //   childMenuIndex:2,
  //   children: [{
  //     path: '/meetage',
  //     name: 'Meetages',
  //     component: () => import ('@/views/inspecte/partyage/meetage'),
  //     meta: {title:'三会一课管理',icon:'icon iconfont icon-huiyi1'},
  //     showMenuIndex: 23,
  //     childMenuIndex:2,
  //   }]
  // },
  // {
  //   path: '/disclosure',
  //   name: 'Disclosure',
  //   component:VabComRedLayout,
  //   redirect: '/disclosure',
  //   showMenuIndex: 23,
  //   childMenuIndex:3,
  //   children: [{
  //     path: '/disclosure',
  //     name: 'Disclosures',
  //     component: () => import ('@/views/inspecte/thropen/disclosure'),
  //     meta: {title: '三务公开',icon:'icon iconfont icon-erji-zhengwuyun'},
  //     showMenuIndex: 23,
  //     childMenuIndex:3,
  //   }]
  // },
  // {
  //   path: '/disclorule',
  //   name: 'Disclorule',
  //   component:VabComRedLayout,
  //   redirect: '/disclorule',
  //   showMenuIndex: 23,
  //   childMenuIndex:3,
  //   children: [{
  //     path: '/disclorule',
  //     name: 'Disclorules',
  //     component: () => import ('@/views/inspecte/thropen/disclorule'),
  //     meta: {title: '三务公开规则',icon:'icon iconfont icon-zijinchiguijishezhi'},
  //     showMenuIndex: 23,
  //     childMenuIndex:3,
  //   }]
  // },
  // {
  //   path: '/fourdiscuss',
  //   name: 'Fourdiscuss',
  //   component:VabComRedLayout,
  //   redirect: '/fourdiscuss',
  //   showMenuIndex: 23,
  //   childMenuIndex:3,
  //   children: [{
  //     path: '/fourdiscuss',
  //     name: 'Fourdiscuses',
  //     component: () => import ('@/views/inspecte/thropen/fourdiscuss'),
  //     meta: {title: '四议两公开',icon:'icon iconfont icon-huiyi'},
  //     showMenuIndex: 23,
  //     childMenuIndex:3,
  //   }]
  // },
  // {
  //   path: '/sealage',
  //   name: 'Sealage',
  //   component:VabComRedLayout,
  //   redirect: '/sealage',
  //   showMenuIndex: 23,
  //   childMenuIndex:3,
  //   children: [{
  //     path: '/sealage',
  //     name: 'Sealages',
  //     component: () => import ('@/views/inspecte/thropen/sealage'),
  //     meta: {title:'公章用章管理',icon:'icon iconfont icon-gongzhang'},
  //     showMenuIndex: 23,
  //     childMenuIndex:3,
  //   }]
  // },
  // {
  //   path: '/signin',
  //   name: 'Signin',
  //   component:VabComRedLayout,
  //   redirect: '/signin',
  //   showMenuIndex: 23,
  //   childMenuIndex:4,
  //   children: [{
  //     path: '/signin',
  //     name: 'Signins',
  //     component: () => import ('@/views/inspecte/daily/signin'),
  //     meta: {title: '日常签到',icon:'icon iconfont icon-qiandao'},
  //     showMenuIndex: 23,
  //     childMenuIndex:4,
  //   }]
  // },
  // {
  //   path: '/assistage',
  //   name: 'Assistage',
  //   component:VabComRedLayout,
  //   redirect: '/assistage',
  //   showMenuIndex: 23,
  //   childMenuIndex:4,
  //   children: [{
  //     path: '/assistage',
  //     name: 'Assistages',
  //     component: () => import ('@/views/inspecte/daily/assistage'),
  //     meta: {title:'小白帮办监管',icon:'icon iconfont icon-jianguanfengkong1'},
  //     showMenuIndex: 23,
  //     childMenuIndex:4,
  //   }]
  // },
  // {
  //   path: '/clink',
  //   name: 'Clink',
  //   component:VabComRedLayout,
  //   redirect: '/clink',
  //   showMenuIndex: 23,
  //   childMenuIndex:6,
  //   children: [{
  //     path: '/clink',
  //     name: 'Clinks',
  //     component: () => import ('@/views/inspecte/clean/clink'),
  //     meta: {title:'清廉链接',icon:'icon iconfont icon-zijinchiguijishezhi'},
  //     showMenuIndex: 23,
  //     childMenuIndex:6,
  //   }]
  // },
  // {
  //   path: '/total',
  //   name: 'Total',
  //   component:Leader,
  //   redirect: '/total',
  //   showMenuIndex: 23,
  //   childMenuIndex:7,
  //   children: [{
  //     path: '/total',
  //     name: 'Totals',
  //     component: () => import ('@/views/inspecte/total/thome'),
  //     meta: {title:'统计大屏'},
  //     showMenuIndex: 23,
  //     childMenuIndex:7,
  //   }]
  // },
  //   {
  //       path: '/fhome',
  //       name: 'Fhome',
  //       component: Layout,
  //       redirect: '/fhome',
  //       showMenuIndex: 34,
  //       children: [{
  //           path: '/fhome',
  //           name: 'Fhomes',
  //           component: () => import ('@/views/fire/fhome'),
  //           meta: { title: '防火管理', icon: 'iconfont icon-huo' },
  //           showMenuIndex: 34,
  //       }]
  //   },
  //   {
  //       path: '/forest',
  //       name: 'Forest',
  //       component: Layout,
  //       redirect: '/forest',
  //       showMenuIndex: 35,
  //       children: [{
  //           path: '/forest',
  //           name: 'Forests',
  //           component: () => import ('@/views/forest/forest'),
  //           meta: { title: '森林防火', icon: 'iconfont icon-senlinhuozai' },
  //           showMenuIndex: 35,
  //       }]
  //   },
  //   {
  //       path: '/kindern',
  //       name: 'Kindern',
  //       component: Layout,
  //       redirect: '/kindern',
  //       showMenuIndex: 36,
  //       children: [{
  //           path: '/kindern',
  //           name: 'Kinderns',
  //           component: () => import ('@/views/kindern/kindern'),
  //           meta: { title: '幼儿园招生', icon: 'iconfont icon-youeryuan' },
  //           showMenuIndex: 36,
  //       }]
  //   },
  //   {
  //       path: '/levforest',
  //       name: 'Levforest',
  //       component: Layout,
  //       redirect: '/levforest',
  //       showMenuIndex: 36,
  //       children: [{
  //           path: '/levforest',
  //           name: 'Levforests',
  //           component: () => import ('@/views/forest/forest'),
  //           meta: { title: '森林防火', icon: 'iconfont icon-senlinhuozai' },
  //           showMenuIndex: 36,
  //       }]
  //   },
  //   {
  //       path: '/cadre',
  //       name: 'Cadre',
  //       component: VabComLayout,
  //       redirect: '/cadre',
  //       showMenuIndex: 40,
  //       children: [{
  //           path: '/cadre',
  //           name: 'Cadre',
  //           component: () => import ('@/views/cadre/manage'),
  //           meta: { title: '联户统计台账', icon: 'icon iconfont icon-nav_client' },
  //           showMenuIndex: 40,
  //       }]
  //   },
  //   {
  //       path: '/crules',
  //       name: 'Crules',
  //       component: VabComLayout,
  //       redirect: '/crules',
  //       showMenuIndex: 40,
  //       children: [{
  //           path: '/crules',
  //           name: 'Crules',
  //           component: () => import ('@/views/cadre/rules'),
  //           meta: { title: '规则设置', icon: 'icon iconfont icon-zijinchiguijishezhi' },
  //           showMenuIndex: 40,
  //       }]
  //   },
  // {
  //   path: '/levmap',
  //   name: 'Levmap',
  //   component:Layout,
  //   redirect: '/levmap',
  //   showMenuIndex: 28,
  //   hidden:true,
  //   children: [{
  //     path: '/levmap',
  //     name: 'Levmaps',
  //     component: () => import ('@/views/onemap/index/index'),
  //     meta: {},
  //     hidden:true,
  //     showMenuIndex: 28,
  //   }]
  // },
    //  {
    //       path: '/lnews',
    //       name: 'Lnews',
    //       component: Layout,
    //       redirect: '/lnews',
    //       meta: { title: '新闻资讯', icon: 'icon iconfont icon-xinwenguanli' },
    //       showMenuIndex: 24,
    //       children: [{
    //               path: '/lnews',
    //               name: 'Lnewes',
    //               component: () =>
    //                  import ('@/views/levelmsg/cnews'),
    //               meta: { title: '资讯管理' },
    //               showMenuIndex: 24,
    //           },
    //           {
    //               path: 'lnate',
    //               name: 'lnate',
    //               component: () =>
    //                   import ('@/views/levelmsg/cnate'),
    //               meta: { title: '新闻类别' },
    //               showMenuIndex: 24,
    //           }
    //       ]
    //   },
    //   {
    //   path: '/levpeo',
    //   name: 'Levpeo',
    //   component: Layout,
    //   redirect: '/levpeo',
    //   showMenuIndex: 25,
    //   hidden:true,
    //   children: [{
    //       path: '/levpeo',
    //       name: 'Levpeos',
    //       component: () =>
    //           import ('@/views/levelresident/mindex'),
    //       meta: {},
    //       showMenuIndex:25,
    //   },
    //   {
    //       path: 'levedit',
    //       name: 'Levedit',
    //       component: () =>
    //             import ('@/views/levelresident/medit'),
    //       meta: {},
    //       hidden:true,
    //       showMenuIndex:25,
    //     }
    //   ]
    // },
    // {
    //        path: '/levnoice',
    //         name: 'Levnoice',
    //         component:Layout,
    //         redirect: '/levnoice',
    //         showMenuIndex:26,
    //         children: [{
    //             path: '/levnoice',
    //             name: 'Levnoices',
    //             component: () => import ('@/views/leveltask/notice'),
    //             meta: { title: '通知公告', icon: 'icon iconfont icon-xinwen' },
    //             showMenuIndex:26,
    //         }]
    //     },
    //     {
    //       path: '/levwork',
    //       name: 'Levwork',
    //       component:Layout,
    //       redirect: '/levwork',
    //       showMenuIndex: 26,
    //       children: [{
    //         path: '/levwork',
    //         name: 'Levworks',
    //         component: () => import ('@/views/leveltask/worktask'),
    //         meta: { title: '个人工作任务', icon: 'icon iconfont icon-gongzuorenwu' },
    //         showMenuIndex: 26,
    //       }]
    //     },
    //     {
    //       path: '/levmodule',
    //       name: 'Levmodule',
    //       component:Layout,
    //       redirect: '/levmodule',
    //       showMenuIndex:26,
    //       children: [{
    //         path: '/levmodule',
    //         name: 'Levmodules',
    //         component: () => import ('@/views/leveltask/spemodule'),
    //         meta: { title: '专题专项任务', icon: 'icon iconfont icon-renwuchuli' },
    //         showMenuIndex:26,
    //       },{
    //         path: '/levlist',
    //         name: 'Levlist',
    //         hidden:true,
    //         component: () => import ('@/views/leveltask/spetask'),
    //         meta: { title: '专题专项任务列表'},
    //         showMenuIndex:26,
    //       }]
    //     },
    //     {
    //       path: '/levtask',
    //       name: 'Levtask',
    //       component: Layout,
    //       redirect: '/levtask/levmanage',
    //       meta: { title: '数字任务管理', icon: 'icon iconfont icon-renwuguanli' },
    //       showMenuIndex: 26,
    //       children: [{
    //         path: 'levmanage',
    //         name: 'Levmanage',
    //         component: () =>
    //           import ('@/views/leveltask/anmanage'),
    //         meta: { title: '通知公告管理' },
    //         showMenuIndex:26,
    //       },
    //         {
    //           path: 'levworkage',
    //           name: 'Levworkage',
    //           component: () =>
    //             import ('@/views/leveltask/workmanage'),
    //           meta: { title: '个人工作任务管理' },
    //           showMenuIndex: 26,
    //         },
    //         {
    //           path: 'levspeage',
    //           name: 'Levspeage',
    //           component: () =>
    //             import ('@/views/leveltask/spemanage'),
    //           meta: { title: '专题专项任务管理' },
    //           showMenuIndex: 26,
    //         },
    //         {
    //           path: 'levtemplate',
    //           name: 'Levtemplate',
    //           hidden:true,
    //           component: () => import ('@/views/leveltask/spetemplate'),
    //           meta: { title: '专题专项任务列表' },
    //           showMenuIndex: 26,
    //         },
    //             {
    //               path: '/levspefill',
    //               name: 'Levspefill',
    //               hidden:true,
    //               component: () => import ('@/views/leveltask/spefill'),
    //               meta: { title: '填报列表'},
    //               showMenuIndex: 26,
    //             },
    //         {
    //           path: 'levperman',
    //           name: 'Levperman',
    //           component: () =>
    //             import ('@/views/leveltask/permanage'),
    //           meta: { title: '人员类别管理' },
    //           showMenuIndex: 26,
    //         }
    //       ]
    //     },
  // {
  //   path: '/leveader',
  //   name: 'Leveader',
  //   component:Leader,
  //   redirect: '/leveader',
  //   showMenuIndex: 27,
  //   children: [{
  //     path: '/leveader',
  //     name: 'Leveaders',
  //     component: () => import ('@/views/leveader/levhome'),
  //     meta: {title:'区级统计大屏'},
  //     showMenuIndex: 27,
  //   }]
  // },
  //   {
  //     path: '/levreport',
  //     name: 'Levreport',
  //     component:Layout,
  //     redirect: '/levreport',
  //     showMenuIndex: 29,
  //     children: [{
  //       path: '/levreport',
  //       name: 'Levreports',
  //       component: () => import ('@/views/levreport/spemanage'),
  //       meta: { title: '智能填报管理', icon: 'icon iconfont icon-tianbao'},
  //       showMenuIndex: 29,
  //     },
  //     {
  //       path: '/levretemplate',
  //       name: 'Levretemplate',
  //       hidden:true,
  //       component: () => import ('@/views/levreport/spetemplate'),
  //       meta: { title: '专题专项任务列表' },
  //       showMenuIndex: 29,
  //     },
  //     {
  //       path: '/levrepefill',
  //       name: 'Levrepefill',
  //       hidden:true,
  //       component: () => import ('@/views/levreport/spefill'),
  //       meta: { title: '填报列表'},
  //       showMenuIndex: 29,
  //     },
  //     {
  //       path: '/levrewpefill',
  //       name: 'Levrewpefill',
  //       hidden:true,
  //       component: () => import ('@/views/levreport/wspefill'),
  //       meta: { title: '填报列表'},
  //       showMenuIndex: 29,
  //     }]
  //   },
    //     {
    //         path: '*',
    //         redirect: '/404',
    //         hidden: true,
    //     },
]

const router = createRouter()

export function resetRouter(routes = constantRoutes) {
    router.matcher = createRouter(routes).matcher
}

function createRouter(routes = constantRoutes) {
    return new VueRouter({
        base: publicPath,
        mode: routerMode,
        scrollBehavior: () => ({
            y: 0,
        }),
        stringifyQuery: stringifyQuery, // 序列化query参数
        parseQuery: parseQuery, // 反序列化query参数
        routes: routes,
    })
}

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject)
        return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch((err) => err)
}
//动态添加路由警告解决方案
// router.$addRoutes = (params) => {
//   router.matcher = new Router({mode: routerMode}).matcher
//   router.addRoutes(params)
// }

export default router
