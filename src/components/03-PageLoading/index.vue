<!--
 * @Author: Wushiqi
 * @Descripttion: 加载遮罩层
 * @Date: 2020-08-26 15:50:35
 * @LastEditor: Wushiqi
 * @LastEditTime: 2021-03-02 14:34:08
-->
<template>
  <div v-if="showModal" class="mask">
    <el-image fit="cover" style="height:70px" :src="require('./loading.gif')" alt="正在处理，请等待。。。" />
    <span class="loading-text">正在处理，请等待。。。</span>
  </div>
</template>

<script>
export default {
  props: {
    showModal: {
      default: false,
      type: Boolean
    }
  }
}
</script>

<style lang="scss" scoped>
.mask {
  background-color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.3;
  position: fixed;
  flex-direction: column;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  .loading-text {
    color: rgba(190, 209, 229, 0.815);
  }
}
</style>
