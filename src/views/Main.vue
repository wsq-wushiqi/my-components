<!--
 * @Author: Wushiqi
 * @Descripttion: 调用组件
 * @Date: 2021-03-02 13:38:01
 * @LastEditor: Wushiqi
 * @LastEditTime: 2021-03-02 14:45:26
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
    <div class="modal-example"></div>
    <p></p>
    
  </div>
</template>

<script>
import { DateSelect, RadioTable, PageLoading } from '@/components/index'
export default {
  components: {
    DateSelect,
    RadioTable,
    PageLoading
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
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.dateSelect.reset() // 重置日期,默认选中今天
    })
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
      }, 5000);
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
}
</style>
