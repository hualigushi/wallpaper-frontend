const routes = [
    {
        path: '/',
        name: '合集列表',
        component: () => import('@/views/collectionList/index.vue'),
    },
    {
        path: '/login',
        name: '登录',
        component: () => import('@/views/login/index.vue'),
    },
    {
        path: '/collectionForm',
        name: '合集详情',
        component: () => import('@/views/collectionForm/index.vue'),
    },
    {
        path: '/liveWallpaperList',
        name: '动态壁纸列表',
        component: () => import('@/views/liveWallpaperList/index.vue'),
    },
    {
        path: '/liveWallpaperForm',
        name: '动态壁纸详情',
        component: () => import('@/views/liveWallpaperForm/index.vue'),
    },
    {
        path: '/author',
        name: '作者',
        component: () => import('@/views/author/index.vue'),
    },
    {
        path: '/tag',
        name: '标签',
        component: () => import('@/views/tag/index.vue'),
    },
    {
        path: '/protocol',
        name: '协议',
        component: () => import('@/views/protocol/index.vue'),
    },
]

export default routes;