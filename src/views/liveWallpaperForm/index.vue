<template>
    <WallpaperTitle />
    <el-button type="primary" @click="goToLiveWallpaperList">返回动态壁纸列表</el-button>
    <el-divider />
    <el-form ref="liveWallpaperFormRef" :model="liveWallpaperForm" label-width="auto" class="form">
        <el-form-item prop="id" v-show="false">
            <el-input v-model="liveWallpaperForm.id" />
        </el-form-item>
        <el-form-item prop="title" label="动态壁纸名称" :rules="[
        {
            required: true,
            message: '请输入动态壁纸名称',
            trigger: 'blur',
        }
    ]">
            <el-input v-model="liveWallpaperForm.title" />
        </el-form-item>
        <el-form-item prop="enTitle" label="动态壁纸名称英文名" :rules="[
        {
            required: true,
            message: '请输入动态壁纸名称英文名',
            trigger: 'blur',
        }
    ]">
            <el-input v-model="liveWallpaperForm.enTitle" />
        </el-form-item>
        <el-form-item prop="tags" label="动态壁纸标签" :rules="[
        {
            required: true,
            message: '请选择动态壁纸标签',
            trigger: 'blur',
        }
    ]">
            <el-select v-model="liveWallpaperForm.tags" multiple filterable default-first-option :reserve-keyword="false"
                placeholder="请输入动态壁纸标签">
                <el-option v-for="item in tagList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item label="作者" label-width="140px">
            <el-select v-model="liveWallpaperForm.authorId" :disabled="!authorList.length">
                <el-option v-for="item in authorList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <span v-if="!authorList.length">作者列表为空，请先新增作者</span>
        </el-form-item>
        <el-form-item v-if="!isView">
            <el-button type="primary" @click="handleSaveLiveWallpaper(liveWallpaperFormRef)">保存</el-button>
            <div class="save-tip" v-show="!!liveWallpaperForm.id">当前动态壁纸已存在，点击保存为修改该动态壁纸数据</div>
        </el-form-item>
    </el-form>
    <div v-show="!!liveWallpaperForm.id">
        <el-divider />
        <div style="color:red">注意：动态壁纸名称不能含有 / & .</div>
        <h3>动态壁纸封面(只能上传一张图片)</h3>
        <el-upload v-model:file-list="liveWallpaperCoverImg" action="" :http-request="uploadCoverImgRequest"
            list-type="picture-card" :on-success="handleSuccess" :on-remove="handleRemoveImg" :limit="1"
            :disabled="isView">
            <el-icon>
                <Plus />
            </el-icon>
        </el-upload>
        <el-divider />
        <h3>动态壁纸</h3>
        <el-upload v-model:file-list="liveWallpaperImg" action="" :http-request="uploadImgRequest"
            list-type="picture-card" :on-success="handleSuccess" :on-remove="handleRemoveImg" :disabled="isView"
            :multiple="true" :before-upload="beforeUpload">
            <el-icon>
                <Plus />
            </el-icon>
        </el-upload>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElLoading } from 'element-plus'
import type { FormInstance, UploadProps, UploadUserFile, UploadRequestOptions } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import WallpaperTitle from '@/components/WallpaperTitle.vue';
import request from '@/utils/request';
import { isCredentialsExpired } from '@/utils/upload'
import { LiveWallpaperFormProps } from './interface'
import { AuthorProps } from '../author/interface';
import { TagProps } from '../tag/interface';
import { WALLPAPER_TYPE, ossFullName, getImgsWithPrefix } from '@/utils/ossFileName';

const router = useRouter();
const route = useRoute()
const isView = route.query.type === 'publishedData'
const loadingInstance = ref() // loading
const authorList = ref<AuthorProps[]>([])
const tagList = ref<TagProps[]>([])
const liveWallpaperFormRef = ref<FormInstance>()
const liveWallpaperForm = reactive<LiveWallpaperFormProps>({
    id: '',
    title: '',
    enTitle: '',
    tags: '',
    authorId: ''
})
const liveWallpaperCoverImg = ref<UploadUserFile[]>([])
const liveWallpaperImg = ref<UploadUserFile[]>([])
let credentials = ref(null);

const openLoading = () => {
    loadingInstance.value = ElLoading.service({
        lock: true,
        text: '上传壁纸',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}

const closeLoading = () => {
    loadingInstance.value.close()
}

const goToLiveWallpaperList = () => {
    router.push('/liveWallpaperList')
}

const getAuthorList = async () => {
    const result = await request({
        url: '/getAuthorList',
        method: 'post',
    });
    authorList.value = result.data
    if (result.data.length) {
        liveWallpaperForm.authorId = result.data[0].id
    }
}

getAuthorList()

const getTagList = async () => {
    const result = await request({
        url: '/getTagList',
        method: 'post',
    });
    tagList.value = result.data
}

getTagList()

const getLiveWallpaperItem = async () => {
    if (route.query.id) {
        const liveWallpaperId = route.query.id as string
        const result = await request({
            url: '/getLiveWallpaperItem',
            method: 'post',
            data: {
                id: liveWallpaperId
            }
        });
        liveWallpaperForm.id = result.data.id
        liveWallpaperForm.title = result.data.title
        liveWallpaperForm.enTitle = result.data.enTitle
        liveWallpaperForm.tags = result.data.tags
        liveWallpaperForm.authorId = result.data.authorId
        getImgs()
    }
}
getLiveWallpaperItem()

const handleSaveLiveWallpaper = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            if (liveWallpaperForm.id) {
                const result = await request({
                    url: '/addOrUpdateLiveWallpaper',
                    method: 'post',
                    data: JSON.stringify(liveWallpaperForm),
                });
                if (result.data.success) {
                    ElMessage({
                        message: '更新动态壁纸成功',
                        type: 'success',
                    })
                } else {
                    ElMessage.error(result.data.errMsg)
                }
            } else {
                const result = await request({
                    url: '/addOrUpdateLiveWallpaper',
                    method: 'post',
                    data: JSON.stringify(liveWallpaperForm),
                });
                if (result.data.success) {
                    const { id } = result.data.data
                    liveWallpaperForm.id = id
                    ElMessage({
                        message: '新建动态壁纸成功',
                        type: 'success',
                    })
                } else {
                    ElMessage.error(result.data.errMsg)
                }
            }
        } else {
            console.log('error handleSaveLiveWallpaper!')
        }
    })
}

const getImgs = async () => {
    const imgsResult = await  getImgsWithPrefix(WALLPAPER_TYPE.LIVE_WALLPAPER, liveWallpaperForm.enTitle);
    liveWallpaperCoverImg.value = imgsResult.filter((item: UploadUserFile) => item.name.includes('cover'))
    liveWallpaperImg.value = imgsResult.filter((item: UploadUserFile) => !item.name.includes('cover'))
}

const beforeUpload = (file: File) => {
    const rawName = file.name.split('.')[0]
    const nameTestRes = /^[^/\\&.]+$/.test(rawName)
    openLoading()
    return nameTestRes;
}

const uploadCoverImgRequest = async (option: UploadRequestOptions) => {
    uploadHttpRequest(option, `cover-${option.file.name}`)
}
const uploadImgRequest = async (option: UploadRequestOptions) => {
    uploadHttpRequest(option, `${option.file.name}`)
}

const uploadHttpRequest = async (option: UploadRequestOptions, fileName: string) => {
    if (isCredentialsExpired(credentials.value)) {
        const result = await request({
            url: "/get_sts_token_for_oss_upload",
            method: "get",
        });
        credentials.value = result.data;
    }
    // @ts-ignore
    const client = new OSS({
        // 将<YOUR_BUCKET>设置为OSS Bucket名称。
        bucket: import.meta.env.VITE_OSS_BUCKET,
        // 将<YOUR_REGION>设置为OSS Bucket所在地域，例如region: 'oss-cn-hangzhou'。
        region: import.meta.env.VITE_OSS_REGION,
        // @ts-ignore
        accessKeyId: credentials.value.AccessKeyId,
        // @ts-ignore
        accessKeySecret: credentials.value.AccessKeySecret,
        // @ts-ignore
        stsToken: credentials.value.SecurityToken,
    });

    try {
        const ossFileName = ossFullName(WALLPAPER_TYPE.LIVE_WALLPAPER, liveWallpaperForm.enTitle, fileName)
        await client.put(ossFileName, option.file);
        getImgs()
        setTimeout(() => {
            closeLoading()
        }, 500)
    } catch (e) {
        console.log("qly ~ uploadHttpRequest ~ e:", e)
    }
}

const handleSuccess = () => {
    ElMessage({
        message: '上传成功',
        type: 'success',
    })
}

const handleRemoveImg: UploadProps['onRemove'] = async (uploadFile) => {
    try {
        await request({
            url: '/deleteImg',
            method: 'post',
            data: {
                name: uploadFile.name
            }
        });
        ElMessage({
            message: '删除成功 handleRemoveImg',
            type: 'success',
        })
    } catch (e) {
        console.log("qly ~ handleRemoveImg ~ e:", e)
    }
}

</script>
<style scoped>
.form {
    margin-top: 28px;
}

.save-tip {
    margin-left: 24px;
    color: #aaa;
}

.wallpaper-item {
    display: flex;
}

.wallpaper-item-left {
    flex: 2;
}

.wallpaper-item-right {
    width: 150px;
    margin-left: 48px;
}
</style>