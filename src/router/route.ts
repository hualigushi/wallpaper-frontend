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
]

export default routes;