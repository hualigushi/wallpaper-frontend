<template>
    <WallpaperTitle />
    <el-button type="primary" @click="goToCollectionForm()">新增合集</el-button>
    <el-divider />
    <h2>壁纸合集列表</h2>
    <el-tabs v-model="activeName">
        <el-tab-pane label="未发布合集" name="first">
            <div class="search-wrapper">
                <div>
                    <span class="search-label">合集名称</span>
                    <el-input v-model="collectionName" style="width: 240px" placeholder="请输入壁纸合集名称" />
                </div>
                <el-button type="primary" @click="handleSearch" class="search-btn">查询</el-button>
            </div>
            <el-button type="primary" @click.prevent="handlePublishBatchPublish">发布</el-button>
            <el-table :data="collectionList.unpublishData" stripe style="width: 100%"
                @selection-change="handleUnpublishSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="title" label="合集名称" />
                <el-table-column prop="enTitle" label="合集名称英文" width="180" />
                <el-table-column prop="description" label="合集描述" width="180" />
                <el-table-column prop="downloadCount" label="下载量" width="120" />
                <el-table-column prop="published" label="发布状态" width="120">
                    <template #default="scope">
                        <el-tag type="success" v-if="scope.row.published">已发布</el-tag>
                        <el-tag type="danger" v-if="!scope.row.published">未发布</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="publishAt" label="首次发布时间" width="180" />
                <el-table-column fixed="right" label="操作" width="180">
                    <template #default="scope">
                        <el-button link type="primary" size="small"
                            @click.prevent="handlePublish(scope.row)">发布</el-button>
                        <el-button link type="primary" size="small"
                            @click.prevent="goToCollectionForm(scope.$index, 'unpublishData')">编辑</el-button>
                        <el-button link type="primary" size="small"
                            @click.prevent="handleDelete(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="已发布合集" name="second">
            <div class="search-wrapper">
                <div>
                    <span class="search-label">合集名称</span>
                    <el-input v-model="collectionName" style="width: 240px" placeholder="请输入壁纸合集名称" />
                </div>
                <el-button type="primary" @click="handleSearch" class="search-btn">查询</el-button>
            </div>
            <el-button type="primary" @click.prevent="handleUnPublishedBatchPublish">取消发布</el-button>
            <el-table :data="collectionList.publishedData" stripe style="width: 100%"
                @selection-change="handlePublishedSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="title" label="合集名称" />
                <el-table-column prop="enTitle" label="合集名称英文" width="180" />
                <el-table-column prop="description" label="合集描述" width="180" />
                <el-table-column prop="downloadCount" label="下载量" width="120" />
                <el-table-column prop="published" label="发布状态" width="120">
                    <template #default="scope">
                        <el-tag type="success" v-if="scope.row.published">已发布</el-tag>
                        <el-tag type="danger" v-if="!scope.row.published">未发布</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="publishAt" label="首次发布时间" width="180" />
                <el-table-column fixed="right" label="操作" width="180">
                    <template #default="scope">
                        <el-button link type="primary" size="small"
                            @click.prevent="handlePublish(scope.row)">取消发布</el-button>
                        <el-button link type="primary" size="small"
                            @click.prevent="goToCollectionForm(scope.$index, 'publishedData')">查看</el-button>
                        <!-- <el-button link type="primary" size="small"
                            @click.prevent="handleDelete(scope.$index)">删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
    </el-tabs>
    <!-- TODO: 分页功能暂时不做 -->
    <!-- <el-pagination class="pagination" v-model:current-page="currentPage" v-model:page-size="pageSize"
        layout="prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" /> -->
    <el-dialog v-model="dialogVisible" title="提示" width="500">
        <span class="dialog-content">
            <el-icon color="#ff0000" size="28">
                <WarnTriangleFilled />
            </el-icon>
            是否确认删除？
        </span>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleConfirmDelete">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router';
import { ElMessage, ElTable } from 'element-plus'
import { WarnTriangleFilled } from '@element-plus/icons-vue'
import WallpaperTitle from '@/components/WallpaperTitle.vue';
import request from '@/utils/request';
import { CollectionItemProps } from './interface';

const router = useRouter();

const activeName = ref('first')
const collectionName = ref('')
const unpublishMultipleSelection = ref<CollectionItemProps[]>([])
const publishedMultipleSelection = ref<CollectionItemProps[]>([])
let collectionList = reactive<{
    unpublishData: CollectionItemProps[],
    publishedData: CollectionItemProps[],

}>({
    unpublishData: [],
    publishedData: [],
})

const getCollectionList = async () => {
    const result = await request({
        url: '/getCollectionList',
        method: 'post',
        data: {
            collectionName: collectionName.value
        }
    });
    let unpublishData: CollectionItemProps[] = []
    let publishedData: CollectionItemProps[] = []
    result.data.forEach((item: CollectionItemProps) => {
        if (item.published) {
            publishedData.push({
                ...item,
                publishAt: !item.publishAt ? '':new Date(item.publishAt!).toLocaleString(),
            })
        } else {
            unpublishData.push({
                ...item,
                publishAt: !item.publishAt ? '':new Date(item.publishAt!).toLocaleString(),
            })
        }
    })
    collectionList.unpublishData = unpublishData
    collectionList.publishedData = publishedData
}

getCollectionList()

const goToCollectionForm = (index?: number, type?: string) => {
    if (index !== undefined && type !== undefined) {
        const curData = type === 'unpublishData' ? collectionList.unpublishData : collectionList.publishedData
        const { id } = curData[index]
        router.push({ path: '/collectionForm', query: { id,type } })
    } else {
        router.push('/collectionForm')
    }
}

const handleSearch = () => {
    console.log('handleSearch', collectionName.value)
    getCollectionList()
}

const dialogVisible = ref(false)
const deleteId = ref('')
const handleDelete = (id: string) => {
    deleteId.value = id
    dialogVisible.value = true
}

const handleConfirmDelete = () => {
    if (deleteId.value) {
        request({
            url: '/deleteCollection',
            method: 'post',
            data: {
                id: deleteId.value
            }
        }).then(() => {
            getCollectionList()
            ElMessage({
                message: '删除成功',
                type: 'success',
            })
        })
        dialogVisible.value = false
        deleteId.value = ''
    }
}

const handleUnpublishSelectionChange = (val: CollectionItemProps[]) => {
    unpublishMultipleSelection.value = val
}

const handlePublishedSelectionChange = (val: CollectionItemProps[]) => {
    publishedMultipleSelection.value = val
}

const handlePublish = (collection: CollectionItemProps) => {
    request({
        url: '/toggleCollectionPublishStatus',
        method: 'post',
        data: {
            collections:[collection],
            publishedStatus: !collection.published
        }
    }).then(() => {
        getCollectionList()
        ElMessage({
            message: `${collection.published ? '取消' : ''}发布成功`,
            type: 'success',
        })
    })
}

const handleUnPublishedBatchPublish = () => {
    request({
        url: '/toggleCollectionPublishStatus',
        method: 'post',
        data: {
            collections: publishedMultipleSelection.value,
            publishedStatus: false
        }
    }).then(() => {
        getCollectionList()
        ElMessage({
            message: `批量取消发布成功`,
            type: 'success',
        })
    })
}
const handlePublishBatchPublish = () => {
    request({
        url: '/toggleCollectionPublishStatus',
        method: 'post',
        data: {
            collections:unpublishMultipleSelection.value,
            publishedStatus:true
        }
    }).then(() => {
        getCollectionList()
        ElMessage({
            message: `批量发布成功`,
            type: 'success',
        })
    })
}

// const currentPage = ref(1)
// const pageSize = ref(20)
// const total = ref(1000)

// const handleSizeChange = (val: number) => {
//     console.log(`${val} items per page`)
// }
// const handleCurrentChange = (val: number) => {
//     console.log(`current page: ${val}`)
// }
</script>
<style scoped>
.search-wrapper {
    display: flex;
    margin-bottom: 28px;
}

.search-label {
    display: inline-flex;
    margin-right: 12px;
}

.search-btn {
    margin-left: 24px;
}

.pagination {
    margin-top: 28px;
    display: flex;
    flex-direction: row-reverse;
}

.dialog-content {
    display: flex;
    align-items: center;
    font-size: 22px;
}
</style>