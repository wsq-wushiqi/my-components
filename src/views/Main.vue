<!--
 * @Author: Wushiqi
 * @Descripttion: 调用组件
 * @Date: 2021-03-02 13:38:01
 * @LastEditor: Wushiqi
 * @LastEditTime: 2021-04-13 10:01:47
-->
<template>
  <div class="components-show">
    <div>快速选择日期：</div>
    <date-select ref="dateSelect" @change="dateChange" />

    <p></p>

    <span>带单选功能的表格：</span>
    <radio-table :columns="tableColumns" :tableData="tableData" :show-radio="true">
      <!-- 使用插槽添加操作按钮 -->
      <template v-slot:edit>
        <el-button @click="$message.warning('点击修改按钮')">修改</el-button>
      </template>
    </radio-table>

    <p></p>
    
    <span>页面遮罩层：</span>
    <el-button @click="handleShwoMask">显示</el-button>
    <page-loading :showModal="showMask" />
    <!-- <div class="modal-example"></div> -->

    <p></p>
    
    <segment-load :data="treeData" class="segment-load-box" />

  </div>
</template>

<script>
import { DateSelect, RadioTable, PageLoading, SegmentLoad } from '@/components/index'
export default {
  components: {
    DateSelect,
    RadioTable,
    PageLoading,
    SegmentLoad
  },
  data() {
    return {
      tableColumns: [{
        prop: 'name',
        label: '名称'
      }, {
        prop: 'type',
        label: '类别'
      }, {
        slot: true,
        prop: 'edit',
        label: '编辑'
      }],
      tableData: [{
        name: '草莓',
        type: '水果'
      }, {
        name: '西瓜',
        type: '水果'
      }],
      showMask: false,
      treeData: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.dateSelect.reset() // 重置日期,默认选中今天
    })
    this.treeData = []
    for (let i = 0; i < 50; i++) {
      let children = []
      for (let j = 0; j < Math.ceil(Math.random()*10000); j++) {
        // children.push(String(j))
        children.push({
          children: [],
          text: `content${i} - ${j}`,
          id: `${i}-${j}`
        })
      }
      this.treeData.push({
        children,
        text: `parent - ${i}`,
        id: `${i}`
      })
    }
    console.log(this.treeData);
  },
  methods: {
    // 日期变化
    dateChange(val) {
      console.log(val)
    },
    // 显示/隐藏遮罩层
    handleShwoMask() {
      this.showMask = true
      setTimeout(() => {
        this.showMask = false
      }, 3000);
    }
  }
}
</script>

<style scoped lang="scss">
.components-show {
  .modal-example {
    width: 100%;
    height: 300px;
    background: transparent url(../components/03-PageLoading/loading.gif) no-repeat center;
  }
  .segment-load-box {
    margin: 0 auto;
    width: 250px;
    height: 300px;
  }
}
</style>
