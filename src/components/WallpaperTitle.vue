<template>
  <div v-if="!hideNav">
    <p>
      <router-link to="/">合集列表</router-link>
    </p>
    <p>
      <router-link to="/liveWallpaperList">动态壁纸列表</router-link>
    </p>
    <p>
      <router-link to="/author">作者列表</router-link>
    </p>
    <p>
      <router-link to="/tag">标签</router-link>
    </p>
    <p>
      <router-link to="/protocol">协议</router-link>
    </p>
  </div>
  <h1 class="text-center">壁纸供销社</h1>
</template>
<script setup>
const props = defineProps({ hideNav: Boolean })
</script>
<style scoped>
.text-center {
  text-align: center;
}
</style>