const routes = [
    {
        path: '/',
        name: '主题列表',
        component: () => import('@/views/theme/index.vue'),
    },
    {
        path: '/themeForm',
        name: '新增主题',
        component: () => import('@/views/themeForm/index.vue'),
    },
]

export default routes;