<template>
    <WallpaperTitle />
    <el-button type="primary" @click="goToCollectionList">返回合集列表</el-button>
    <el-divider />
    <el-form ref="collectionFormRef" :model="collectionForm" label-width="auto" class="form">
        <el-form-item prop="id" v-show="false">
            <el-input v-model="collectionForm.id" />
        </el-form-item>
        <el-form-item prop="title" label="合集名称" :rules="[
        {
            required: true,
            message: '请输入合集名称',
            trigger: 'blur',
        }
    ]">
            <el-input v-model="collectionForm.title" />
        </el-form-item>
        <el-form-item prop="enTitle" label="合集名称英文名" :rules="[
        {
            required: true,
            message: '请输入合集名称英文名',
            trigger: 'blur',
        }
    ]">
            <el-input v-model="collectionForm.enTitle" />
        </el-form-item>
        <el-form-item prop="description" label="合集描述" :rules="[
        {
            required: true,
            message: '请输入合集描述',
            trigger: 'blur',
        }
    ]">
            <el-input v-model="collectionForm.description" />
        </el-form-item>
        <el-form-item v-if="!isView">
            <el-button type="primary" @click="handleSaveCollection(collectionFormRef)">保存</el-button>
            <div class="save-tip" v-show="!!collectionForm.id">当前合集已存在，点击保存为修改该合集数据</div>
        </el-form-item>
    </el-form>
    <div v-show="!!collectionForm.id">
        <el-divider />
        <el-button v-if="!isView" type="primary" @click="handleAddWallpaper">新增壁纸</el-button>
        <h3>壁纸列表</h3>
        <el-table :data="wallpaperList.tableData" stripe style="width: 100%">
            <el-table-column prop="title" label="壁纸名称" />
            <el-table-column prop="enTitle" label="壁纸名称英文名" width="180" />
            <el-table-column prop="tags" label="壁纸标签" width="180" />
            <el-table-column prop="downloadCount" label="下载量" width="140" />
            <el-table-column prop="updatedAt" label="修改时间" width="180" />
            <el-table-column prop="createdAt" label="创建时间" width="180" />
            <el-table-column fixed="right" label="操作" width="180">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click.prevent="handleEditWallpaper(scope.$index)">{{
        isView ? '查看' : '编辑' }}</el-button>
                    <el-button link type="primary" size="small"
                        @click.prevent="handleDeleteWallpaper(scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <el-dialog v-model="dialogFormVisible" title="壁纸" width="800">
        <el-form ref="wallpaperFormRef" :model="wallpaperForm">
            <el-form-item v-show="false">
                <el-input v-model="wallpaperForm.id" />
            </el-form-item>
            <el-form-item label="壁纸名称" label-width="140px">
                <el-input v-model="wallpaperForm.title" autocomplete="off" :rules="[
        {
            required: true,
            message: '请输入壁纸名称',
            trigger: 'blur',
        }
    ]
        " />
            </el-form-item>
            <el-form-item label="壁纸名称英文名" label-width="140px">
                <el-input v-model="wallpaperForm.enTitle" autocomplete="off" :rules="[
        {
            required: true,
            message: '请输入壁纸名称英文名',
            trigger: 'blur',
        }
    ]
        " />
            </el-form-item>
            <el-form-item label="壁纸标签" label-width="140px">
                <el-input v-model="wallpaperForm.tags" placeholder="多个标签以空格分割" autocomplete="off" :rules="[
        {
            required: true,
            message: '请输入壁纸标签',
            trigger: 'blur',
        }
    ]
        " />
            </el-form-item>
            <el-form-item label="作者" label-width="140px">
                <el-select v-model="wallpaperForm.authorId" :disabled="!authorList.length">
                    <el-option v-for="item in authorList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <span v-if="!authorList.length">作者列表为空，请先新增作者</span>
            </el-form-item>
            <el-form-item v-if="!isView">
                <el-button type="primary" @click="handleSaveWallpaper(wallpaperFormRef)">保存</el-button>
                <div class="save-tip" v-show="!!wallpaperForm.id">当前合集已存在，点击保存为修改该合集数据</div>
            </el-form-item>
        </el-form>
        <div v-show="!!wallpaperForm.id">
            <el-divider />
            <div style="color:red">注意：壁纸名称不能含有 / & .</div>
            <h3>壁纸封面(只能上传一张图片)</h3>
            <el-upload v-model:file-list="wallpaperCoverImg" action="" :http-request="uploadCoverImgRequest"
                list-type="picture-card" :on-success="handleSuccess" :on-remove="handleRemoveImg" :limit="1"
                :disabled="isView">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
            <el-divider />
            <h3>壁纸</h3>
            <el-upload ref="wallpaperImgUpload" v-model:file-list="wallpaperImg" action=""
                :http-request="uploadImgRequest" list-type="picture-card" :on-success="handleSuccess"
                :on-remove="handleRemoveImg" :disabled="isView" :multiple="true" :before-upload="beforeUpload">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
        </div>
    </el-dialog>

    <el-dialog v-model="dialogDeleteVisible" title="提示" width="500">
        <span class="dialog-content">
            <el-icon color="#ff0000" size="28">
                <WarnTriangleFilled />
            </el-icon>
            是否确认删除？
        </span>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogDeleteVisible = false">取消</el-button>
                <el-button type="primary" @click="handleConfirmDeleteWallpaper">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElLoading } from 'element-plus'
import type { FormInstance, UploadProps, UploadUserFile, UploadRequestOptions } from 'element-plus'
import { Plus, WarnTriangleFilled } from '@element-plus/icons-vue'
import Sortable, { SortableEvent } from 'sortablejs';
import WallpaperTitle from '@/components/WallpaperTitle.vue';
import request from '@/utils/request';
import { isCredentialsExpired } from '@/utils/upload'
import { CollectionFormProps, WallpaperItemProps, WallpaperFormProps } from './interface'
import { AuthorProps } from '../author/interface';

const IMG_SPLIT = '&'
const router = useRouter();
const route = useRoute()
const isView = route.query.type === 'publishedData'
const wallpaperImgUpload = ref()
const loadingInstance = ref() // loading

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

const goToCollectionList = () => {
    router.push('/')
}

const authorList = ref<AuthorProps[]>([])

const getAuthorList = async () => {
    const result = await request({
        url: '/getAuthorList',
        method: 'post',
    });
    authorList.value = result.data
    if (result.data.length) {
        wallpaperForm.authorId = result.data[result.data.length - 1].id
    }
}

getAuthorList()

const getCollectionItem = async () => {
    if (route.query.id) {
        const collectionId = route.query.id as string
        const result = await request({
            url: '/getCollectionItem',
            method: 'post',
            data: {
                id: collectionId
            }
        });
        collectionForm.id = result.data.id
        collectionForm.title = result.data.title
        collectionForm.enTitle = result.data.enTitle
        collectionForm.description = result.data.description
        getWallpaperList(collectionId)
    }
}
getCollectionItem()

const collectionFormRef = ref<FormInstance>()
const collectionForm = reactive<CollectionFormProps>({
    id: '',
    title: '',
    enTitle: '',
    description: '',
})

const handleSaveCollection = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            if (collectionForm.id) {
                const result = await request({
                    url: '/addOrUpdateCollection',
                    method: 'post',
                    data: JSON.stringify(collectionForm),
                });
                if (result.data.success) {
                    ElMessage({
                        message: '更新合集成功',
                        type: 'success',
                    })
                } else {
                    ElMessage.error(result.data.errMsg)
                }
            } else {
                const result = await request({
                    url: '/addOrUpdateCollection',
                    method: 'post',
                    data: JSON.stringify(collectionForm),
                });
                if (result.data.success) {
                    const { id } = result.data.data
                    collectionForm.id = id
                    ElMessage({
                        message: '新建合集成功',
                        type: 'success',
                    })
                } else {
                    ElMessage.error(result.data.errMsg)
                }
            }
        } else {
            console.log('error handleSaveCollection!')
        }
    })
}

let wallpaperList = reactive<{
    tableData: WallpaperItemProps[]
}>({ tableData: [] })

const getWallpaperList = async (collectionId: string) => {
    const result = await request({
        url: '/getWallpaperList',
        method: 'post',
        data: {
            collectionId
        }
    });
    const formatResultData: WallpaperItemProps[] = result.data.map((item: WallpaperItemProps) => {
        return {
            ...item,
            createdAt: new Date(item.createdAt).toLocaleString(),
            updatedAt: new Date(item.updatedAt).toLocaleString(),
        }
    })
    wallpaperList.tableData = formatResultData
}

const getImgs = async (collectionEnTitle: string, wallpaperEnTitle: string) => {
    const result = await request({
        url: '/getImgsWithPrefix',
        method: 'post',
        data: {
            collectionEnTitle,
            wallpaperEnTitle
        }
    });
    wallpaperCoverImg.value = result.data.filter((item: UploadUserFile) => item.name.includes('cover'))
    wallpaperImg.value = result.data.filter((item: UploadUserFile) => !item.name.includes('cover'))
}

const dialogFormVisible = ref(false)
const wallpaperFormRef = ref<FormInstance>()
const wallpaperForm = reactive<WallpaperFormProps>({
    id: '',
    title: '',
    enTitle: '',
    tags: '',
    collectionId: '',
    authorId: ''
})

const handleAddWallpaper = () => {
    wallpaperForm.id = ''
    wallpaperForm.title = ''
    wallpaperForm.enTitle = ''
    wallpaperForm.tags = ''
    wallpaperCoverImg.value = []
    wallpaperImg.value = []
    if (authorList.value.length) {
        wallpaperForm.authorId = authorList.value[authorList.value.length - 1].id
    }
    dialogFormVisible.value = true
}

const handleSaveWallpaper = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid) => {
        if (valid) {
            if (wallpaperForm.id) {
                const result = await request({
                    url: '/addOrUpdateWallpaper',
                    method: 'post',
                    data: JSON.stringify(wallpaperForm),
                });
                if (result.data.success) {
                    ElMessage({
                        message: '更新壁纸成功',
                        type: 'success',
                    })
                    getWallpaperList(collectionForm.id)
                } else {
                    ElMessage.error(result.data.errMsg)
                }
            } else {
                wallpaperForm.collectionId = collectionForm.id
                const result = await request({
                    url: '/addOrUpdateWallpaper',
                    method: 'post',
                    data: JSON.stringify(wallpaperForm),
                });
                if (result.data.success) {
                    const { id } = result.data.data
                    wallpaperForm.id = id
                    ElMessage({
                        message: '新建壁纸成功',
                        type: 'success',
                    })
                    getWallpaperList(collectionForm.id)
                } else {
                    ElMessage.error(result.data.errMsg)
                }
            }
        } else {
            console.log('error handleSaveWallpaper!')
        }
    })
}

const dialogDeleteVisible = ref(false)
const deleteId = ref('')

const handleEditWallpaper = async (index: number) => {
    wallpaperForm.id = wallpaperList.tableData[index].id
    wallpaperForm.title = wallpaperList.tableData[index].title
    wallpaperForm.enTitle = wallpaperList.tableData[index].enTitle
    wallpaperForm.tags = wallpaperList.tableData[index].tags
    wallpaperForm.authorId = wallpaperList.tableData[index].authorId
    getImgs(collectionForm.enTitle, wallpaperForm.enTitle)
    dialogFormVisible.value = true
    await nextTick()
    wallpaperSort()
}
const handleDeleteWallpaper = (index: number) => {
    deleteId.value = wallpaperList.tableData[index].id
    dialogDeleteVisible.value = true
}

const handleConfirmDeleteWallpaper = async () => {
    if (deleteId.value) {
        const result = await request({
            url: '/deleteWallpaper',
            method: 'post',
            data: {
                id: deleteId.value
            }
        })
        getWallpaperList(collectionForm.id)
        const imgsResult = await request({
            url: '/getImgsWithPrefix',
            method: 'post',
            data: {
                collectionEnTitle: collectionForm.enTitle,
                wallpaperEnTitle: result.data.enTitle
            }
        });
        if (imgsResult.data.length) {
            await request({
                url: '/deleteImgsWithPrefix',
                method: 'post',
                data: {
                    collectionEnTitle: collectionForm.enTitle,
                    wallpaperEnTitle: result.data.enTitle
                }
            });
        }

        ElMessage({
            message: '删除成功',
            type: 'success',
        })
        dialogDeleteVisible.value = false
        deleteId.value = ''
    }
}

const wallpaperCoverImg = ref<UploadUserFile[]>([])
const wallpaperImg = ref<UploadUserFile[]>([])
let credentials = ref(null);

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
    const wLength = wallpaperImg.value.length
    uploadHttpRequest(option, `${wLength}${IMG_SPLIT}${option.file.name}`)
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
        const fileNamePrefix = `${collectionForm.enTitle}/${wallpaperForm.enTitle}`
        const clientResult = await client.put(`${fileNamePrefix}/${fileName}`, option.file);
        console.log('qly clientResult', clientResult);
        getImgs(collectionForm.enTitle, wallpaperForm.enTitle)
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

const handleRemoveImg: UploadProps['onRemove'] = async (uploadFile, uploadFiles) => {
    try {
        await request({
            url: '/deleteImg',
            method: 'post',
            data: {
                name: uploadFile.name
            }
        });
        if (uploadFiles.length) {
            for (let i = 0; i < uploadFiles.length; i++) {
                const oldname = uploadFiles[i].name
                const oldFileName = oldname.split(IMG_SPLIT)[1]
                const newFileName = `${i + 1}${IMG_SPLIT}${oldFileName}`
                const fileNamePrefix = `${collectionForm.enTitle}/${wallpaperForm.enTitle}`
                const newname = `${fileNamePrefix}/${newFileName}`
                if (oldname !== newname) {
                    await handleRenameImg(oldname, newname)
                }
            }
        }
        ElMessage({
            message: '删除成功 handleRemoveImg',
            type: 'success',
        })
    } catch (e) {
        console.log("qly ~ handleRemoveImg ~ e:", e)
    }
}

const handleRenameImg = async (oldname: string, newname: string) => {
    try {
        await request({
            url: '/renameImg',
            method: 'post',
            data: {
                oldname,
                newname
            }
        });
    } catch (e) {
        console.log("qly ~ handleRenameImg ~ e:", e)
    }
}
const handleSwapImg = async (oldname: string, newname: string) => {
    try {
        await request({
            url: '/swapImg',
            method: 'post',
            data: {
                oldname,
                newname
            }
        });
    } catch (e) {
        console.log("qly ~ handleRenameImg ~ e:", e)
    }
}

const wallpaperSort = () => {
    if (wallpaperImgUpload.value) {
        const el = wallpaperImgUpload.value.$el.querySelectorAll('.el-upload-list')[0];
        Sortable.create(el, {
            onEnd: async ({ oldIndex, newIndex }: SortableEvent) => {
                if (oldIndex !== undefined && newIndex !== undefined) {
                    const oldImgName = wallpaperImg.value[oldIndex].name
                    const newImgName = wallpaperImg.value[newIndex].name

                    openLoading()
                    await handleSwapImg(oldImgName, newImgName)
                    getImgs(collectionForm.enTitle, wallpaperForm.enTitle)
                    closeLoading()
                }
            }
        });
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