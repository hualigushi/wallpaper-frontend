<template>
    <WallpaperTitle />
    <el-button type="primary" @click="goToLiveWallpaperForm()">新增动态壁纸</el-button>
    <el-divider />
    <h2>动态壁纸列表</h2>
    <el-tabs v-model="activeName">
        <el-tab-pane label="未发布动态壁纸" name="first">
            <div class="search-wrapper">
                <div>
                    <span class="search-label">动态壁纸名称</span>
                    <el-input v-model="liveWallpaperName" style="width: 240px" placeholder="请输入壁纸动态壁纸名称" />
                </div>
                <el-button type="primary" @click="handleSearch" class="search-btn">查询</el-button>
            </div>
            <el-button type="primary" @click.prevent="handlePublishBatchPublish">发布</el-button>
            <el-table :data="liveWallpaperList.unpublishData" stripe style="width: 100%"
                @selection-change="handleUnpublishSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="title" label="动态壁纸名称" />
                <el-table-column prop="enTitle" label="动态壁纸名称英文" width="180" />
                <!-- <el-table-column prop="tags" label="动态壁纸标签" width="180" /> -->
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
                            @click.prevent="goToLiveWallpaperForm(scope.$index, 'unpublishData')">编辑</el-button>
                        <el-button link type="primary" size="small"
                            @click.prevent="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="已发布动态壁纸" name="second">
            <div class="search-wrapper">
                <div>
                    <span class="search-label">动态壁纸名称</span>
                    <el-input v-model="liveWallpaperName" style="width: 240px" placeholder="请输入壁纸动态壁纸名称" />
                </div>
                <el-button type="primary" @click="handleSearch" class="search-btn">查询</el-button>
            </div>
            <el-button type="primary" @click.prevent="handleUnPublishedBatchPublish">取消发布</el-button>
            <el-table :data="liveWallpaperList.publishedData" stripe style="width: 100%"
                @selection-change="handlePublishedSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="title" label="动态壁纸名称" />
                <el-table-column prop="enTitle" label="动态壁纸名称英文" width="180" />
                <el-table-column prop="description" label="动态壁纸描述" width="180" />
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
                            @click.prevent="goToLiveWallpaperForm(scope.$index, 'publishedData')">查看</el-button>
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
import { LiveWallpaperItemProps } from './interface';
import { deleteImgsWithPrefix, getImgsWithPrefix, WALLPAPER_TYPE } from '@/utils/ossFileName';

const router = useRouter();

const activeName = ref('first')
const liveWallpaperName = ref('')
const unpublishMultipleSelection = ref<LiveWallpaperItemProps[]>([])
const publishedMultipleSelection = ref<LiveWallpaperItemProps[]>([])
let liveWallpaperList = reactive<{
    unpublishData: LiveWallpaperItemProps[],
    publishedData: LiveWallpaperItemProps[],

}>({
    unpublishData: [],
    publishedData: [],
})

const getLiveWallpaperList = async () => {
    const result = await request({
        url: '/getLiveWallpaperList',
        method: 'post',
        data: {
            liveWallpaperName: liveWallpaperName.value
        }
    });
    let unpublishData: LiveWallpaperItemProps[] = []
    let publishedData: LiveWallpaperItemProps[] = []
    result.data.forEach((item: LiveWallpaperItemProps) => {
        if (item.published) {
            publishedData.push({
                ...item,
                publishAt: !item.publishAt ? '' : new Date(item.publishAt!).toLocaleString(),
            })
        } else {
            unpublishData.push({
                ...item,
                publishAt: !item.publishAt ? '' : new Date(item.publishAt!).toLocaleString(),
            })
        }
    })
    liveWallpaperList.unpublishData = unpublishData
    liveWallpaperList.publishedData = publishedData
}

getLiveWallpaperList()

const goToLiveWallpaperForm = (index?: number, type?: string) => {
    if (index !== undefined && type !== undefined) {
        const curData = type === 'unpublishData' ? liveWallpaperList.unpublishData : liveWallpaperList.publishedData
        const { id } = curData[index]
        router.push({ path: '/liveWallpaperForm', query: { id, type } })
    } else {
        router.push('/liveWallpaperForm')
    }
}

const handleSearch = () => {
    getLiveWallpaperList()
}

const dialogVisible = ref(false)
const deleteItem = ref<LiveWallpaperItemProps | null>()
const handleDelete = (liveWallpaperItem: LiveWallpaperItemProps) => {
    deleteItem.value = liveWallpaperItem
    dialogVisible.value = true
}

const handleConfirmDelete = () => {
    if (deleteItem.value) {
        request({
            url: '/deleteLiveWallpaper',
            method: 'post',
            data: {
                id: deleteItem.value.id
            }
        }).then(async () => {
            getLiveWallpaperList()
            const imgsResult = await getImgsWithPrefix(WALLPAPER_TYPE.LIVE_WALLPAPER, deleteItem.value!.enTitle);
            if (imgsResult.length) {
                await deleteImgsWithPrefix(WALLPAPER_TYPE.LIVE_WALLPAPER, deleteItem.value!.enTitle)
            }
            dialogVisible.value = false
            deleteItem.value = null
            ElMessage({
                message: '删除成功',
                type: 'success',
            })
        })

    }
}

const handleUnpublishSelectionChange = (val: LiveWallpaperItemProps[]) => {
    unpublishMultipleSelection.value = val
}

const handlePublishedSelectionChange = (val: LiveWallpaperItemProps[]) => {
    publishedMultipleSelection.value = val
}

const handlePublish = (liveWallpaperItem: LiveWallpaperItemProps) => {
    request({
        url: '/toggleLiveWallpaperPublishStatus',
        method: 'post',
        data: {
            liveWallpaperSelection: [liveWallpaperItem],
            publishedStatus: !liveWallpaperItem.published
        }
    }).then(() => {
        getLiveWallpaperList()
        ElMessage({
            message: `${liveWallpaperItem.published ? '取消' : ''}发布成功`,
            type: 'success',
        })
    })
}

const handleUnPublishedBatchPublish = () => {
    if (!publishedMultipleSelection.value.length) {
        ElMessage({
            message: `请选择要取消发布的动态壁纸`,
            type: 'warning',
        })
        return
    }
    request({
        url: '/toggleLiveWallpaperPublishStatus',
        method: 'post',
        data: {
            liveWallpaperSelection: publishedMultipleSelection.value,
            publishedStatus: false
        }
    }).then(() => {
        getLiveWallpaperList()
        ElMessage({
            message: `批量取消发布成功`,
            type: 'success',
        })
    })
}

const handlePublishBatchPublish = () => {
    if (!unpublishMultipleSelection.value.length) {
        ElMessage({
            message: `请选择要发布的动态壁纸`,
            type: 'warning',
        })
        return
    }
    request({
        url: '/toggleLiveWallpaperPublishStatus',
        method: 'post',
        data: {
            liveWallpaperSelection: unpublishMultipleSelection.value,
            publishedStatus: true
        }
    }).then(() => {
        getLiveWallpaperList()
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