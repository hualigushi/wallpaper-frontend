<template>
    <WallpaperTitle />
    <el-button type="primary" @click="handleAddAuthor">新增作者</el-button>
    <el-divider />
    <h2>作者列表</h2>
    <el-table :data="authorList.tableData" stripe style="width: 100%">
        <el-table-column prop="name" label="作者名称" />
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

    <el-dialog v-model="dialogFormVisible" title="作者信息" width="500">
        <el-form :model="form" ref="formRef">
            <el-form-item v-show="false">
                <el-input v-model="form.id" autocomplete="off" />
            </el-form-item>
            <el-form-item label="作者名称">
                <el-input v-model="form.name" autocomplete="off" :rules="[
        {
            required: true,
            message: '请输入作者名称',
            trigger: 'blur',
        }
    ]" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSaveAuthor(formRef)">
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
import { AuthorProps } from './interface';

let authorList = reactive<{
    tableData: AuthorProps[]
}>({ tableData: [] })

const getAuthorList = async () => {
    const result = await request({
        url: '/getAuthorList',
        method: 'post',
    });
    const formatResultData: AuthorProps[] = result.data.map((item: AuthorProps) => {
        return {
            ...item,
            createdAt: new Date(item.createdAt).toLocaleString(),
            updatedAt: new Date(item.updatedAt).toLocaleString(),
        }
    })
    authorList.tableData = formatResultData
}

getAuthorList()

const formRef = ref<FormInstance>()
const dialogFormVisible = ref(false)
const form = reactive({
    id: '',
    name: '',
})
const dialogVisible = ref(false)
const deleteId = ref('')

const handleAddAuthor = () => {
    form.id = ''
    form.name= ''
    dialogFormVisible.value = true
    deleteId.value = ''
}

const handleSaveAuthor = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            if (form.id) {
                const result = await request({
                    url: '/addOrUpdateAuthor',
                    method: 'post',
                    data: JSON.stringify(form),
                });
                console.log('qly handleSaveAuthor update result', result)
                if (result.data.success) {
                    getAuthorList()
                    ElMessage({
                        message: '更新作者成功',
                        type: 'success',
                    })
                    dialogFormVisible.value = false
                } else {
                    ElMessage.error(result.data.errMsg)
                }
            } else {
                const result = await request({
                    url: '/addOrUpdateAuthor',
                    method: 'post',
                    data: JSON.stringify(form),
                });
                if (result.data.success) {
                    const { id } = result.data.data
                    form.id = id
                    console.log('qly handleSaveAuthor add result', result)
                    console.log('qly collectionFormData', form)
                    getAuthorList()
                    ElMessage({
                        message: '新建作者成功',
                        type: 'success',
                    })
                    dialogFormVisible.value = false
                } else {
                    ElMessage.error(result.data.errMsg)
                }
            }
        } else {
            console.log('error handleSaveAuthor!')
        }
    })
}

const handleEdit = (index: number) => {
    form.id = authorList.tableData[index].id
    form.name= authorList.tableData[index].name
    dialogFormVisible.value = true
}

const handleDelete = (index: number) => {
    deleteId.value = authorList.tableData[index].id
    dialogVisible.value = true
}
const handleConfirmDelete = () => {
    if (deleteId.value) {
        request({
            url: '/deleteAuthor',
            method: 'post',
            data: {
                id: deleteId.value
            }
        }).then(() => {
            getAuthorList()
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