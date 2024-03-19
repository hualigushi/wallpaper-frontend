<template>
    <el-form ref="formRef" :model="collectionForm" label-width="auto" class="form">
        <el-form-item prop="title" label="合集名称" :rules="[
        {
            required: true,
            message: '请输入合集名称',
            trigger: 'blur',
        }
    ]">
            <el-input v-model="collectionForm.title" />
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
        <el-form-item>
            <el-button type="primary" @click="submitTheme(formRef)">保存</el-button>
        </el-form-item>
    </el-form>
    <!-- <el-form-item>
            <el-button @click="addWallpaper">新增壁纸</el-button>
        </el-form-item> -->
        <!-- <div v-for="(wallpaper, index) in collectionForm.wallpapers" :key="wallpaper.key">
            <el-divider />
            <div class="wallpaper-item">
                <div class="wallpaper-item-left">
                    <el-form-item :label="'壁纸' + (index + 1) + '名称'" :prop="'wallpapers.' + index + '.title'">
                        <el-input v-model="wallpaper.title" />
                    </el-form-item>
                    <el-form-item :label="'壁纸' + (index + 1) + '标签'" :prop="'wallpapers.' + index + '.tag'">
                        <el-input v-model="wallpaper.tag" />
                    </el-form-item>
                    <el-form-item :label="'壁纸' + (index + 1) + '封面'" :prop="'wallpapers.' + index + '.coverImage'">
                        <el-upload :file-list="collectionForm.wallpapers[index].coverImg"
                            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                            list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                            <el-icon>
                                <Plus />
                            </el-icon>
                        </el-upload>

                        <el-dialog v-model="dialogVisible">
                            <img w-full :src="dialogImageUrl" alt="Preview Image" />
                        </el-dialog>
                    </el-form-item>
                </div>
                <el-button class="wallpaper-item-right" type="danger"
                    @click.prevent="removeWallpaper(wallpaper)">删除</el-button>
            </div>
        </div> -->
        <!-- <el-form-item v-for="(wallpaper, index) in collectionForm.wallpapers" :key="wallpaper.key" :label="'壁纸' + (index+1) +'名称'"
            :prop="'wallpapers.' + index + '.title'">
            <el-input v-model="wallpaper.title" />
            <el-input v-model="wallpaper.tag" />
            <el-button class="mt-2" @click.prevent="removeWallpaper(wallpaper)">删除</el-button>
        </el-form-item> -->
       
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import request from '@/utils/request';

interface WallpaperItem {
    key: number
    title: string
    tag: string
    coverImg: UploadUserFile[]
    images: UploadUserFile[]
}

interface collectionFormProps {
    // wallpapers: WallpaperItem[]
    title: string
    description: string
}

const formRef = ref<FormInstance>()
const collectionForm = reactive<collectionFormProps>({
    title: '',
    description: '',
    // wallpapers: [
    //     {
    //         key: 1,
    //         title: '',
    //         tag: '',
    //         coverImg:[],
    //         images:[]
    //     },
    // ],
})

const removeWallpaper = (item: WallpaperItem) => {
    const index = collectionForm.wallpapers.indexOf(item)
    if (index !== -1) {
        collectionForm.wallpapers.splice(index, 1)
    }
}

const addWallpaper = () => {
    collectionForm.wallpapers.push({
        key: Date.now(),
        title: '',
        tag: '',
        coverImg:[],
        images:[]
    })
}

const submitTheme = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            console.log('submit!')
            console.log(collectionForm)
            request({
				url: 'http://localhost:3000/addCollection',
				method: 'post',
				data:JSON.stringify(collectionForm),
			});
        } else {
            console.log('error submit!')
            return false
        }
    })
}

const fileList = ref<UploadUserFile[]>([
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'plant-1.png',
    url: '/images/plant-1.png',
  },
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'plant-2.png',
    url: '/images/plant-2.png',
  },
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'figure-1.png',
    url: '/images/figure-1.png',
  },
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'figure-2.png',
    url: '/images/figure-2.png',
  },
])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

</script>
<style scoped>
.form {
    margin-top: 28px;
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