<template>
  <p>
    <router-link to="/">合集列表</router-link>
  </p>
  <p>
    <router-link to="/author">作者列表</router-link>
  </p>
  <p>
    <router-link to="/protocol">协议</router-link>
  </p>
  <router-view />
  <footer>浙ICP备2024090465号-1</footer>
</template>
<style scoped>
footer {
    position: fixed;
    bottom: 0;
    left:0;
    right:0;
    color:#bbb;
    font-size: 12px;
    height: 48px;
    text-align: center;
}
</style>