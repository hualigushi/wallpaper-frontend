const routes = [
    {
        path: '/',
        name: '合集列表',
        component: () => import('@/views/collectionList/index.vue'),
    },
    {
        path: '/collectionForm',
        name: '合集详情',
        component: () => import('@/views/collectionForm/index.vue'),
    },
    {
        path: '/author',
        name: '作者',
        component: () => import('@/views/author/index.vue'),
    },
    {
        path: '/protocol',
        name: '协议',
        component: () => import('@/views/protocol/index.vue'),
    },
]

export default routes;