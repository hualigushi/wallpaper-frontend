<template>
    <WallpaperTitle />
    <el-form :model="form" label-width="auto">
        <p>关于我们</p>
        <el-form-item v-show="false">
            <el-input v-model="form.data.id" />
        </el-form-item>
        <el-form-item label="隐私政策">
            <el-input v-model="form.data.privacyPolicy" />
        </el-form-item>
        <el-form-item label="使用条款">
            <el-input v-model="form.data.termsOfService" />
        </el-form-item>
        <el-form-item label="关于我们">
            <el-input v-model="form.data.aboutUs" />
        </el-form-item>
        <p>关注我们</p>
        <el-form-item label="官方小红书">
            <el-input v-model="form.data.followUs" />
        </el-form-item>
        <el-form-item label="官方即刻">
            <el-input v-model="form.data.followJike" />
        </el-form-item>
        <el-form-item label="官方X">
            <el-input v-model="form.data.followX" />
        </el-form-item>
        <el-form-item label="官方微博">
            <el-input v-model="form.data.followWeibo" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
    </el-form>

</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import WallpaperTitle from '@/components/WallpaperTitle.vue';
import request from '@/utils/request';

const getProtocol = async () => {
    const result = await request({
        url: '/getProtocol',
        method: 'post',
    });
    const protocol = result.data
    if (protocol && protocol.length) {
        form.data = protocol[0]
    }
}

getProtocol()

// const getCollectionList = async () => {
//     const result = await request({
//         url: '/mobile/getCollectionList',
//         method: 'post',
//         data: JSON.stringify({pageNumber:1}),
//     });
    
//     console.log("qly ~ getCollectionList ~ result:", result)
// }

// getCollectionList()

const form = reactive({
    data: {
        id: '',
        privacyPolicy: '',
        termsOfService: '',
        aboutUs: '',
        followUs:'',
        followJike:'',
        followX:'',
        followWeibo:''
    }
})

const onSubmit = async () => {
    if (form.data.id) {
        const result = await request({
            url: '/addOrUpdateProtocol',
            method: 'post',
            data: JSON.stringify(form.data),
        });
        if (result.data.success) {
            ElMessage({
                message: '修改成功',
                type: 'success',
            })
        } else {
            ElMessage.error(result.data.errMsg)
        }
    } else {
        const result = await request({
            url: '/addOrUpdateProtocol',
            method: 'post',
            data: JSON.stringify(form.data),
        });
        if (result.data.success) {
            const { id } = result.data.data
            form.data.id = id
            ElMessage({
                message: '修改成功',
                type: 'success',
            })
        } else {
            ElMessage.error(result.data.errMsg)
        }
    }
}

</script>