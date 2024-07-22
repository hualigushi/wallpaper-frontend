<template>
    <WallpaperTitle :hideNav="true" />
    <el-form :model="form" class="form" label-width="100">
        <el-form-item label="用户名">
            <el-input v-model="form.data.username" :rules="[
        {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
        }
    ]"/>
        </el-form-item>
        <el-form-item label="密码">
            <el-input v-model="form.data.password" :rules="[
        {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
        }
    ]"/>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">登录</el-button>
        </el-form-item>
    </el-form>

</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { FormInstance } from 'element-plus'
import WallpaperTitle from '@/components/WallpaperTitle.vue';
// import request from '@/utils/request';

const form = reactive({
    data: {
        username: '',
        password: '',
    }
})

const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {

        }
    })
    
        // const result = await request({
        //     url: '/addOrUpdateProtocol',
        //     method: 'post',
        //     data: JSON.stringify(form.data),
        // });
        // if (result.data.success) {
        //     ElMessage({
        //         message: '修改成功',
        //         type: 'success',
        //     })
        // } else {
        //     ElMessage.error(result.data.errMsg)
        // }
}

</script>
<style scoped>
.form {
    width: 400px;
    margin: auto;
    margin-top: 280px;
}

.form /deep/ .el-form-item label {
    font-size: 24px;
}

.form /deep/ .el-form-item .el-input {
    height: 40px;
}

.form /deep/ .el-button {
    width: 100%;
    height: 40px;
}
</style>