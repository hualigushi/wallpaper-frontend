<template>
    <WallpaperTitle />
    <el-button type="primary" @click="addCollection">新增合集</el-button>
    <el-divider />
    <h2>壁纸合集列表</h2>
    <div class="search-wrapper">
        <div>
            <span class="search-label">合集名称</span>
            <el-input v-model="collectionName" style="width: 240px" placeholder="请输入壁纸合集名称" />
        </div>
        <el-button type="primary" @click="handleSearch" class="search-btn">查询</el-button>
    </div>
    <el-table :data="collectionList.tableData" stripe style="width: 100%">
        <el-table-column prop="title" label="合集名称" />
        <el-table-column prop="description" label="合集描述" width="180" />
        <el-table-column prop="downloadCount" label="下载量" width="160" />
        <el-table-column prop="updatedAt" label="修改时间" width="180" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column fixed="right" label="操作" width="180">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="handleDetail">详情</el-button>
                <el-button link type="primary" size="small" @click="handleEdit">编辑</el-button>
                <el-button link type="primary" size="small" @click.prevent="handleDelete(scope.$index)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
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
import { ElMessage } from 'element-plus'
import { WarnTriangleFilled } from '@element-plus/icons-vue'
import WallpaperTitle from '@/components/WallpaperTitle.vue';
import request from '@/utils/request';
import { CollectionItemProps } from './interface';

const router = useRouter();
const collectionName = ref('')
let collectionList = reactive<{
    tableData: CollectionItemProps[]
}>({ tableData: [] })

const getCollectionList = async () => {
    const result = await request({
        url: 'http://localhost:3000/getCollectionList',
        method: 'post',
        data: {
            collectionName: collectionName.value
        }
    });
    const formatResultData: CollectionItemProps[] = result.data.map((item: CollectionItemProps) => {
        return {
            ...item,
            createdAt: new Date(item.createdAt).toLocaleString(),
            updatedAt: new Date(item.updatedAt).toLocaleString(),
        }
    })
    collectionList.tableData = formatResultData
}

getCollectionList()

const addCollection = () => {
    router.push('/collectionForm')
}
const handleSearch = () => {
    console.log('submit!', collectionName.value)
    getCollectionList()
}

const handleDetail = () => {
    console.log('click')
}
const handleEdit = () => {
    console.log('click')
}

const dialogVisible = ref(false)
const deleteId = ref('')
const handleDelete = (index: number) => {
    deleteId.value = collectionList.tableData[index].id
    dialogVisible.value = true
}
const handleConfirmDelete = (index: number) => {
    if (deleteId.value) {
        request({
            url: 'http://localhost:3000/deleteCollection',
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