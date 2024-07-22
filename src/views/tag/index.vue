<template>
    <WallpaperTitle />
    <el-button type="primary" @click="handleAddTag">新增标签</el-button>
    <el-divider />
    <h2>标签列表</h2>
    <el-table :data="tagList.tableData" stripe style="width: 100%">
        <el-table-column prop="name" label="标签名称" />
        <el-table-column prop="updatedAt" label="修改时间" width="180" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column fixed="right" label="操作" width="180">
            <template #default="scope">
                <el-button link type="primary" size="small" @click.prevent="handleEdit(scope.$index)">编辑</el-button>
                <el-button link type="primary" size="small" @click.prevent="handleDelete(scope.$index)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
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

    <el-dialog v-model="dialogFormVisible" title="标签信息" width="500">
        <el-form :model="form" ref="formRef">
            <el-form-item v-show="false">
                <el-input v-model="form.id" autocomplete="off" />
            </el-form-item>
            <el-form-item label="标签名称">
                <el-input v-model="form.name" autocomplete="off" :rules="[
        {
            required: true,
            message: '请输入标签名称',
            trigger: 'blur',
        }
    ]" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSaveTag(formRef)">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { WarnTriangleFilled } from '@element-plus/icons-vue'
import WallpaperTitle from '@/components/WallpaperTitle.vue';
import request from '@/utils/request';
import { TagProps } from './interface';

let tagList = reactive<{
    tableData: TagProps[]
}>({ tableData: [] })

const getTagList = async () => {
    const result = await request({
        url: '/getTagList',
        method: 'post',
    });
    const formatResultData: TagProps[] = result.data.map((item: TagProps) => {
        return {
            ...item,
            createdAt: new Date(item.createdAt).toLocaleString(),
            updatedAt: new Date(item.updatedAt).toLocaleString(),
        }
    })
    tagList.tableData = formatResultData
}

getTagList()

const formRef = ref<FormInstance>()
const dialogFormVisible = ref(false)
const form = reactive({
    id: '',
    name: '',
})
const dialogVisible = ref(false)
const deleteId = ref('')

const handleAddTag = () => {
    form.id = ''
    form.name = ''
    dialogFormVisible.value = true
    deleteId.value = ''
}

const handleSaveTag = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            if (form.id) {
                const result = await request({
                    url: '/addOrUpdateTag',
                    method: 'post',
                    data: JSON.stringify(form),
                });
                if (result.data.success) {
                    getTagList()
                    ElMessage({
                        message: '更新标签成功',
                        type: 'success',
                    })
                    dialogFormVisible.value = false
                } else {
                    ElMessage.error(result.data.errMsg)
                }
            } else {
                const result = await request({
                    url: '/addOrUpdateTag',
                    method: 'post',
                    data: JSON.stringify(form),
                });
                if (result.data.success) {
                    const { id } = result.data.data
                    form.id = id
                    getTagList()
                    ElMessage({
                        message: '新建标签成功',
                        type: 'success',
                    })
                    dialogFormVisible.value = false
                } else {
                    ElMessage.error(result.data.errMsg)
                }
            }
        } else {
            console.log('error handleSaveTag!')
        }
    })
}

const handleEdit = (index: number) => {
    form.id = tagList.tableData[index].id
    form.name = tagList.tableData[index].name
    dialogFormVisible.value = true
}

const handleDelete = (index: number) => {
    deleteId.value = tagList.tableData[index].id
    dialogVisible.value = true
}
const handleConfirmDelete = () => {
    if (deleteId.value) {
        request({
            url: '/deleteTag',
            method: 'post',
            data: {
                id: deleteId.value
            }
        }).then(() => {
            getTagList()
            ElMessage({
                message: '删除成功',
                type: 'success',
            })
        })
        dialogVisible.value = false
        deleteId.value = ''
    }
}
</script>
<style scoped>
.dialog-content {
    display: flex;
    align-items: center;
    font-size: 22px;
}
</style>