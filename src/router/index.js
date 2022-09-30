import { createRouter, createWebHashHistory } from "vue-router"
import store from "@/store"
import { h } from "vue"

const Layout = () => import("@/views/Layout")
const Home = () => import("@/views/home")
const TopCategory = () => import("@/views/category/index.vue")
const SubCategory = () => import("@/views/category/sub.vue")
const Goods = () => import("@/views/goods/index.vue")
const Cart = () => import("@/views/cart")

const Login = () => import("@/views/login")
const LoginCallback = () => import("@/views/login/callback.vue")

const Checkout = () => import("@/views/member/pay/checkout.vue")
const PayIndex = () => import("@/views/member/pay/index")
const Result = () => import("@/views/member/pay/result.vue")

const MemberLayout = () => import("@/views/member/Layout.vue")
const MemberHome = () => import("@/views/member/home")
const MemberOrder = () => import("@/views/member/order")
const MemberOrderDetail = () => import("@/views/member/order/detail")
const routes = [
  // 一级路由
  {
    path: "/",
    component: Layout,
    children: [
      { path: "/", component: Home },
      { path: "/category/:id", component: TopCategory },
      { path: "/category/sub/:id", component: SubCategory },
      { path: "/product/:id", component: Goods },
      { path: "/cart", component: Cart },
      { path: "/member/checkout", component: Checkout },
      { path: "/member/pay", component: PayIndex },
      { path: "/pay/callback", component: Result },
      {
        path: "/member",
        component: MemberLayout,
        children: [
          { path: '/member', component: MemberHome },
          {
            path: '/member/order',
            // 这种写法(路径存在嵌套关系)是为了让子路径使用routerLink active-class属性生效
            component: { render: () => h(<RouterView></RouterView>) },
            children: [
              { path: '', component: MemberOrder },
              { path: ':id', component: MemberOrderDetail },
            ]
          }
        ]
      },
    ],
  },
  { path: "/login", component: Login },
  { path: "/login/callback", component: LoginCallback },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 每次切换路由时，回到顶部
  scrollBehavior() {
    return { left: 0, top: 0 };
  },
});

// 前置导航守卫
router.beforeEach((to, from, next) => {
  const { profile } = store.state.user
  // 已登录的用户不能再访问 /login
  if (profile.token && to.path === "/login") return next(from.path)
  // 将要结算 但未登录的用户 跳转到登录页进行登录，并记录要去往的地址
  if (!profile.token && to.path.startsWith("/member"))
    return next(`/login?redirectUrl=${encodeURIComponent(to.fullPath)}`)
  next()
})

export default router
